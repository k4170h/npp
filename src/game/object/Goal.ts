import { Particles } from "../particles/particle";
import {
    COLLISION_FILTER,
    CollisionPair,
    COLORFUL,
    SCREEN_H,
    SCREEN_W,
} from "../utils/definitions";
import { findAllPairs } from "../utils/utils";

/**
 * ゴールの領域
 */
export class Goal extends Phaser.Physics.Matter.Sprite {
    public declare body: MatterJS.BodyType;
    private overlay: Phaser.GameObjects.Image;

    constructor({
        scene,
        x,
        y,
        w,
        h,
    }: {
        scene: Phaser.Scene;
        x: number;
        y: number;
        w: number;
        h: number;
    }) {
        super(scene.matter.world, x, y, "__WHITE");
        this.setRectangle(w, h, {
            label: "goal",
        });
        this.setSensor(true);
        this.setStatic(true);
        this.setCollisionCategory(COLLISION_FILTER.BOOSTER.category);
        this.setAlpha(0);

        // オーバーレイ
        this.overlay = scene.add
            .image(0, 0, getOverlayTexture(scene))
            .setAlpha(0)
            .setDepth(200)
            .setX(SCREEN_W / 2)
            .setY(SCREEN_H / 2);

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

        // シーンに追加
        scene.add.existing(this);
    }

    // 衝突時の処理
    private onCollision(pairs: CollisionPair[]): void {
        // ゴール時
        if (pairs.some(({ bodyB }) => bodyB.label.includes("marble"))) {
            // 花火を一定間隔で実施
            this.scene.time.addEvent({
                delay: 200,
                // loop: true, // イベントを繰り返す
                repeat: 5,
                callback: () => {
                    const [x, y] = [Math.random() * 1280, Math.random() * 720];

                    // 現在のブロックの角度を取得
                    // 90度ずつ回転させるTweenを作成
                    Particles.firework.setDepth(20001);
                    Particles.firework.explode(100, x, y);
                    Particles.firework.setParticleTint(
                        COLORFUL[Math.floor(Math.random() * 6)]
                    );
                    Particles.firework.explode(100, x, y);
                },
            });

            // 一時的に暗くする
            this.scene.tweens.add({
                targets: [this.overlay],
                duration: 200,
                alpha: 0.7,
            });
            this.scene.tweens.add({
                targets: this.overlay,
                duration: 200,
                delay: 1500,
                alpha: 0,
            });
        }
    }
}

// オーバーレイのテクスチャーを作る
function getOverlayTexture(scene: Phaser.Scene) {
    const name = `overlay`;
    if (scene.textures.exists(name)) {
        return name;
    }
    const g = scene.add.graphics();

    g.fillStyle(0x000000);
    g.fillRect(0, 0, 1280, 720);

    const mg = scene.add
        .graphics()
        .fillStyle(0x000000)
        .fillCircle(1110, 550, 170);
    const mask = mg.createGeometryMask().setInvertAlpha(true);
    g.setMask(mask);

    const rt = scene.add.renderTexture(0, 0, 1280, 720);
    rt.draw(g, 0, 0);
    rt.saveTexture(name);
    rt.destroy();
    g.destroy();
    mg.destroy();
    return name;
}

