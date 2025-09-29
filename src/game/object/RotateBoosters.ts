import { FPS30, FPS60, Matter } from "../utils/definitions";
import { polarToVector } from "../utils/utils";
import { Booster } from "./Booster";

export class RotateBoosters {
    private counter = 0;

    constructor({
        scene,
        x,
        y,
        r,
        booster,
        count,
    }: {
        scene: Phaser.Scene;
        x: number;
        y: number;
        r: number;
        booster: {
            power: number;
        };
        count: number;
    }) {
        const composite = Matter.Composite.create();

        new Array(count).fill(0).forEach((_, i) => {
            const angle = (360 / count) * i;
            const vector = polarToVector(angle, r);
            const booster_ = new Booster({
                scene,
                x: x + vector.x,
                y: y + vector.y,
                angle: angle + 180,
                power: booster.power,
            });
            Matter.Composite.add(composite, booster_.body);
        });

        scene.time.addEvent({
            delay: FPS60,
            loop: true,
            callback: () => {
                const angle = Phaser.Math.DegToRad(2);
                const centerPoint = new Phaser.Math.Vector2(x, y); // 回転の中心

                // 💡 コンポジット全体を回転
                Matter.Composite.rotate(composite, angle, centerPoint);
            },
        });
    }
}

