import { COLLISION_FILTER, Matter } from "../utils/definitions";
import { findAllPairs, polarToVector } from "../utils/utils";

const DEFAULT_W = 15;
const DEFAULT_H = 60;
const DEFAULT_ANGLE = 0;

/**
 * 一通パネル
 */
export class Oneway extends Phaser.Physics.Matter.Image {
    public declare body: MatterJS.BodyType;

    // originからのずれ。パネル自体が振動して見えるようにするためのギミック
    private originOffset = 0;

    constructor({
        scene,
        x,
        y,
        w = DEFAULT_W,
        h = DEFAULT_H,
        angle = DEFAULT_ANGLE,
    }: {
        scene: Phaser.Scene;
        x: number;
        y: number;
        w?: number;
        h?: number;
        // 0度は右向き
        angle?: number;
    }) {
        super(scene.matter.world, x, y, "oneway", undefined, {
            isStatic: true,
            isSensor: true,
            collisionFilter: COLLISION_FILTER.WALL,
        });

        // オブジェクトのサイズとスケールを設定
        this.setDisplaySize(DEFAULT_W, DEFAULT_H);
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
            delay: 33,
            loop: true,
            callback: () => this.loop(),
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
            .forEach((ball) => {
                const vector = new Phaser.Math.Vector2(ball.velocity);
                const ballAngle = vector.angle() * Phaser.Math.RAD_TO_DEG;
                const wallAngle = this.angle;
                const delta = Phaser.Math.Angle.WrapDegrees(
                    wallAngle - ballAngle
                );

                // 条件を満たしたら反射させる
                if (Math.abs(delta) > 90) {
                    const mirror = Phaser.Math.Angle.WrapDegrees(
                        wallAngle + 180 - ballAngle
                    );
                    this.scene.matter.body.setVelocity(
                        ball,
                        polarToVector(wallAngle + mirror, ball.speed)
                    );

                    // 位置をずらす
                    this.originOffset = 10;
                }
            });
    }

    // 毎フレームの処理
    private loop() {
        // 衝突でずれていたら中央に移動するようにする
        if (this.originOffset > 0) {
            this.setOrigin(
                0.5 - polarToVector(0, -this.originOffset).x / 50,
                0.5 - polarToVector(0, -this.originOffset).y / 50
            );
            this.originOffset *= 0.5;
            if (this.originOffset <= 0.1) {
                this.originOffset = 0;
                this.setOrigin(0.5);
            }
        }
    }
}

