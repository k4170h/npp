import {
    COLLISION_FILTER,
    CollisionPair,
    FPS30,
    Matter,
} from "../utils/definitions";
import { Particles } from "../particles/particle";
import { findAllPairs, polarToVector } from "../utils/utils";

const DEFAULT_POWER = 5;
const DEFAULT_ANGLE = -90;
const DEFAULT_TIMEOUT = -1;

/**
 * 使い捨てブースターパネル 通称バルーン
 */
export class Balloon extends Phaser.Physics.Matter.Image {
    public declare body: MatterJS.BodyType;

    private rotateTween: Phaser.Tweens.Tween;
    private power: number;

    constructor({
        scene,
        x,
        y,
        vx = 0,
        vy = 0,
        power = DEFAULT_POWER,
        angle = DEFAULT_ANGLE,
        rotate,
        timeout = DEFAULT_TIMEOUT,
    }: {
        scene: Phaser.Scene;
        x: number;
        y: number;
        vx?: number;
        vy?: number;
        power?: number;
        angle?: number;
        rotate?: {
            angle: number;
            duration: number;
        };
        timeout: number;
    }) {
        super(scene.matter.world, x, y, "balloon", undefined, {
            ignoreGravity: true,
            isSensor: true,
            friction: 0,
            frictionAir: 0,
            restitution: 1,
            collisionFilter: COLLISION_FILTER.BOOSTER,
        });

        Matter.Body.scale(this.body, 0.8, 0.8);

        // 移動量設定
        this.setVelocity(vx, vy);
        this.setAngle(angle);

        this.power = power;

        // 回転処理
        if (rotate) {
            this.rotateTween = scene.tweens.add({
                targets: this,
                angle: rotate.angle,
                yoyo: true,
                ease: "Quad.easeInOut",
                repeat: -1,
                duration: rotate.duration,
            });
        }

        this.scene.matter.world.on(
            "collisionstart",
            (event: Phaser.Physics.Matter.Events.CollisionStartEvent) => {
                const pairs = findAllPairs(event.pairs, this.body);
                if (pairs.length > 0) {
                    this.onCollision(pairs);
                }
            }
        );

        // 寿命があったら設定
        if (timeout >= 0) {
            scene.time.addEvent({
                delay: timeout,
                loop: false,
                callback: () => this.selfDestruct(),
            });
        }

        // シーンに追加
        scene.add.existing(this);
    }

    // 衝突時のスケール変更メソッド
    private onCollision(pairs: CollisionPair[]): void {
        // 衝突したものを加速させる
        pairs.forEach(({ bodyB }) => {
            this.scene.matter.body.setVelocity(
                bodyB.parent,
                polarToVector(this.angle, this.power)
            );
            // ディレイ後自己破壊
            this.scene.time.addEvent({
                delay: 10,
                loop: false,
                callback: () => this.selfDestruct(),
            });
        });
    }

    // 自分を消滅させる
    private selfDestruct() {
        if (!this.active) {
            return;
        }

        Particles.balloon.explode(2, this.x, this.y);
        Particles.explode.explode(4, this.x, this.y);

        if (this.rotateTween != null) {
            this.rotateTween.destroy();
        }
        this.destroy();
    }
}

