import { Booster } from "./Booster";

/**
 * ブースターパネル 動く版
 *
 */
export class MovingBooster extends Booster {
    public declare body: MatterJS.BodyType;

    constructor({
        scene,
        x,
        y,
        h,
        angle,
        w,
        power,
        rotate,
        move,
    }: {
        scene: Phaser.Scene;
        x: number;
        y: number;
        w?: number;
        h?: number;
        // 0度は右向き
        angle?: number;
        power?: number;

        rotate?: {
            angle?: number;
            duration: number;
            interval?: number;
        };
        move?: {
            x?: number;
            y?: number;
            duration: number;
        };
    }) {
        super({ scene, x, y, w, h, angle, power });

        // 回転設定
        if (rotate) {
            if (rotate.interval != null) {
                scene.time.addEvent({
                    delay: rotate.interval ?? 10,
                    loop: true,
                    callback: () => {
                        scene.tweens.add({
                            targets: this,
                            angle: this.angle + rotate.angle!,
                            ease: "Quad.easeInOut",
                            duration: rotate.duration,
                        });
                    },
                });
            } else if (rotate.angle != null) {
                scene.tweens.add({
                    targets: this,
                    angle: rotate.angle,
                    yoyo: true,
                    ease: "Quad.easeInOut",
                    repeat: -1,
                    duration: rotate.duration,
                });
            } else {
                scene.time.addEvent({
                    delay: 10,
                    repeat: -1,
                    callback: () => {
                        this.setAngle(
                            this.angle + (360 / rotate.duration) * 10
                        );
                    },
                });
            }
        }

        // 移動設定
        if (move) {
            scene.tweens.add({
                targets: this,
                yoyo: true,
                ease: "Quad.easeInOut",
                repeat: -1,
                duration: move.duration,
                x: move.x ?? x,
                y: move.y ?? y,
            });
        }
    }
}

