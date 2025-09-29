import { Vector } from "matter";
import {
    COLLISION_FILTER,
    CollisionPair,
    FPS60,
    Matter,
    RANKED_EMBLEM,
    SCREEN_H,
    SCREEN_W,
} from "../utils/definitions";
import { Particles } from "../particles/particle";
import { findAllPairs, svgPathToVertices } from "../utils/utils";
import { GoalManager } from "../utils/GoalManager";

/**
 * ビー玉クラス ニャンプ本体
 */
export class Marble extends Phaser.Physics.Matter.Image {
    public declare body: MatterJS.BodyType;
    // マーブル開始位置
    private readonly startPos: Vector;

    // 軌跡の記録、描画用
    private trailPoints: Vector[] = [];
    private trailGraphics: Phaser.GameObjects.Graphics;

    private readonly marbleScale = 0.25;

    // 表示用マーブル
    private face: Phaser.GameObjects.Image;

    // 順位を示すアイコン
    private emblem: Phaser.GameObjects.Image | null;

    // マーブル識別用キー
    private key: string;

    // 静止チェック
    private stillCounter = 0;

    constructor({
        scene,
        key, // 画像(svg)のキー。Textureとして使うほか、SVG内のid="path"から頂点も取得する
        intro,
        run,
    }: {
        scene: Phaser.Scene;
        key: string;
        intro: {
            x: number;
            y: number;
            delay: number;
        };
        run: {
            x: number;
            y: number;
        };
        outro: {};
    }) {
        super(scene.matter.world, intro.x, intro.y, key);

        // SVG内に頂点情報も入っている。そこからBodyを生成する
        const svgData = scene.cache.xml.get(key);
        const vertices = svgPathToVertices(svgData);
        // const customBody = Matter.Bodies.fromVertices(
        const customBody = scene.matter.add.fromVertices(
            intro.x,
            intro.y,
            vertices,
            {
                label: `marble_${key}`,
                friction: 0.0001,
                frictionAir: 0.001,
                restitution: 0.6,
                collisionFilter: {
                    ...COLLISION_FILTER.MARBLE,
                    mask: 0x0000,
                },
                // 初期表示時は 障害物無視で中央に表示
                ignoreGravity: true,
            },
            true
        );
        this.setExistingBody(customBody);
        this.setScale(this.marbleScale, this.marbleScale);
        this.startPos = run;
        this.emblem = null;
        this.key = key;

        // テクスチャーの重心ではなく中央をoriginとする設定
        const centre = Matter.Vertices.centre(vertices[0]);
        this.setOrigin(centre.x / this.width, centre.y / this.height);
        console.log(centre, this.width, this.height);

        // マーブルの見た目部分。loop()で追従させる。
        this.face = scene.add
            .image(0, 0, key)
            .setScale(this.marbleScale)
            .setOrigin(0.5, 0.5)
            .setAlpha(0)
            .setDepth(1000);
        // そのため本体は透明に
        this.setAlpha(0);

        // 開始時の登場処理
        scene.time.addEvent({
            delay: intro.delay,
            loop: false,
            callback: () => {
                this.face.setAlpha(1);
                Particles.bigStar.explode(10, this.x, this.y);
                scene.tweens.add({
                    targets: this.face,
                    scaleX: 1.1,
                    scaleY: 1.1,
                    duration: 100,
                });
                scene.tweens.add({
                    targets: this.face,
                    scaleX: 1,
                    scaleY: 1,
                    duration: 100,
                    delay: 100,
                });
                scene.time.addEvent({
                    delay: 2000,
                    loop: false,
                    callback: () => {
                        // マーブル開始の準備
                        this.setX(run.x);
                        this.setY(run.y);
                        Particles.star.explode(5, run.x, run.y);
                        this.face.setScale(this.marbleScale);
                        this.face.setDepth(100);
                        // this.face.setAlpha(0);
                        this.setIgnoreGravity(false);
                        this.body.collisionFilter = COLLISION_FILTER.MARBLE;
                    },
                });
            },
        });

        // 軌跡描画用
        this.trailGraphics = scene.add.graphics({
            lineStyle: { width: 20, color: 0xffcc00, alpha: 0.8 },
        });

        //接触時の処理定義
        this.scene.matter.world.on(
            "collisionstart",
            (event: Phaser.Physics.Matter.Events.CollisionStartEvent) => {
                const pairs = findAllPairs(event.pairs, this.body);
                if (pairs.length > 0) {
                    this.onCollision(pairs);
                }
            }
        );

        // ループ処理定義
        scene.time.addEvent({
            delay: FPS60,
            loop: true,
            callback: () => this.loop(),
        });

        scene.time.addEvent({
            delay: FPS60,
            loop: true,
            callback: () => this.loop(),
        });

        // シーンに追加
        scene.add.existing(this);
    }

    // 衝突時の処理
    private onCollision(pairs: CollisionPair[]): void {
        // 見た目だけ変形させる
        if (this.body.speed > 3 && !this.scene.tweens.isTweening(this.face)) {
            // 移動量に比例させる
            const coe = Math.round(Math.sqrt(this.body.speed) - 1) * 0.1;
            this.scene.tweens.killTweensOf(this.face);
            this.face.setScale(
                this.marbleScale * (1 + coe),
                this.marbleScale * (1 - coe)
            );
            this.scene.tweens.add({
                targets: this.face,
                yoyo: true,
                ease: "Quad.easeInOut",
                repeat: 0,
                scaleX: this.scaleX * (1 - coe),
                scaleY: this.scaleY * (1 + coe),
                duration: 100,
                onComplete: () => {
                    this.face.setScale(this.marbleScale, this.marbleScale);
                },
            });
        }
        // 衝突時の火花
        if (this.body.speed > 10) {
            Particles.star.explode(1, this.x, this.y);
        }

        pairs.forEach(({ bodyB }) => {
            // ゴール時
            if (bodyB.label === "goal") {
                // 王冠得る
                if (this.emblem == null) {
                    const rank = GoalManager.goal(this.key);
                    this.emblem = this.scene.add.image(
                        0,
                        0,
                        rank <= RANKED_EMBLEM.length
                            ? RANKED_EMBLEM[rank - 1]
                            : "goaled"
                    );
                    this.emblem.setScale(0.3);
                    this.emblem.setDepth(101);
                }

                // 数秒後にスタート地点へ
                this.scene.time.addEvent({
                    loop: false,
                    delay: 2000,
                    callback: () => {
                        this.x = this.startPos.x;
                        this.y = this.startPos.y;
                        Particles.star.explode(5, this.x, this.y);
                    },
                });
            }
        });
    }

    private loop() {
        // faceを本体に追従させる
        this.face.setX(this.x);
        this.face.setY(this.y);
        this.face.setAngle(this.angle);

        // 王冠を本体に追従させる
        if (this.emblem != null) {
            this.emblem.setX(this.x);
            this.emblem.setY(this.y - 40);
        }

        // 軌跡の記録、描画
        const pos = this.body.position;
        this.trailPoints.push({ ...pos });
        if (this.trailPoints.length > 6) {
            this.trailPoints.shift();
        }
        this.trailGraphics.clear();
        this.trailGraphics.beginPath();
        this.trailPoints.forEach((p, i) => {
            if (i === 0) this.trailGraphics.moveTo(p.x, p.y);
            else this.trailGraphics.lineTo(p.x, p.y);
        });
        this.trailGraphics.strokePath();

        // 静止チェック
        if (
            Phaser.Math.Distance.BetweenPoints(
                this.trailPoints[0],
                this.trailPoints[this.trailPoints.length - 1]
            ) > 1
        ) {
            this.stillCounter = 0;
        }
        this.stillCounter++;
        if (this.stillCounter > 2000) {
            this.setPosition(this.startPos.x, this.startPos.y);
        }

        // 画面外チェック
        if (
            this.x < 0 ||
            this.x > SCREEN_W ||
            this.y < 0 ||
            this.y > SCREEN_H
        ) {
            this.setPosition(this.startPos.x, this.startPos.y);
        }
    }

    /**
     * 登場をトリガーする
     * @param x 表示位置
     * @param y 表示位置
     * @param deray ms後に登場する
     */
    public intoScreen(x: number, y: number, delay = 0) {
        this.setSensor(true);
        this.setScale(1);
        this.x = x;
        this.y = y;
        this.scene.time.addEvent({
            loop: false,
            delay: delay,
        });
    }
}

