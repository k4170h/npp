import {
    COLLISION_CATEGORY,
    COLLISION_FILTER,
    FPS30,
    Matter,
} from "../utils/definitions";
import { Particles } from "../particles/particle";
import { findAllPairs, polarToVector } from "../utils/utils";

const DEFAULT_W = 40;
const DEFAULT_H = 40;
const DEFAULT_ANGLE = 0;
const DEFAULT_POWER = 5;

/**
 * ブースターパネル
 */
export class Booster extends Phaser.Physics.Matter.Image {
    public declare body: MatterJS.BodyType;

    // ブースト量
    private power: number;

    // originからのずれ。パネル自体が振動して見えるようにするためのギミック
    private shake = 0;

    constructor({
        scene,
        x,
        y,
        w = DEFAULT_W,
        h = DEFAULT_H,
        angle = DEFAULT_ANGLE,
        power = DEFAULT_POWER,
    }: {
        scene: Phaser.Scene;
        x: number;
        y: number;
        w?: number;
        h?: number;
        // 0度は右向き
        angle?: number;
        power?: number;
    }) {
        super(scene.matter.world, x, y, "booster", undefined);

        // テクスチャより一回り小さい判定領域を作る
        this.setExistingBody(
            Matter.Bodies.rectangle(x, y, w / 1.5, h / 1.5, {
                isSensor: true,
                isStatic: true,
                friction: 0,
                restitution: 1,
                label: "booster",
                collisionFilter: COLLISION_FILTER.BOOSTER,
            })
        );

        this.power = power;

        // オブジェクトのサイズとスケールを設定
        this.setDisplaySize(w, h);
        this.setScale(this.scaleX, this.scaleY);
        this.setOrigin(0.5);
        this.setAngle(angle);

        // 衝突時の設定
        this.scene.matter.world.on(
            "collisionstart",
            (e: Phaser.Physics.Matter.Events.CollisionStartEvent) =>
                this.onCollision(e)
        );

        // ループの処理
        scene.time.addEvent({
            delay: FPS30,
            loop: true,
            callback: () => this.shaking(),
        });

        // シーンに追加
        scene.add.existing(this);
    }

    // 衝突時の処理
    private onCollision(
        event: Phaser.Physics.Matter.Events.CollisionStartEvent
    ) {
        const pairs = findAllPairs(event.pairs, this.body);
        pairs
            .map((v) => v.bodyB)
            .forEach((v) => {
                this.scene.matter.body.setVelocity(
                    v.parent,
                    polarToVector(this.angle, this.power)
                );
            });

        if (pairs.length > 0) {
            this.shake = 10;
            Particles.star.explode(1, this.x, this.y);
        }
    }

    // Shakeが0より大きかったら振動中とみる
    private shaking() {
        if (this.shake > 0) {
            this.setOrigin(
                0.5 - polarToVector(0, -this.shake).x / 50,
                0.5 - polarToVector(0, -this.shake).y / 50
            );
            this.shake *= 0.5;
            if (this.shake <= 0.1) {
                this.shake = 0;
                this.setOrigin(0.5);
            }
        }
    }
}

