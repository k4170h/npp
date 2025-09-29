import { COLLISION_FILTER } from "../utils/definitions";
import { Balloon } from "./Balloon";

/**
 * 使い捨てブースターパネル 通称バルーン を定期的に生成する
 */
export class BalloonLauncher {
    public declare body: MatterJS.BodyType;

    constructor({
        scene,
        x,
        y,
        interval,
        balloon,
    }: {
        scene: Phaser.Scene;
        x: number;
        y: number;
        interval: number;
        balloon: {
            vx?: number;
            vy?: number;
            power?: number;
            angle?: number;
            rotate?: {
                angle: number;
                duration: number;
            };
            timeout: number;
        };
    }) {
        scene.time.addEvent({
            loop: true,
            delay: interval,
            callback: () => {
                new Balloon({
                    scene,
                    x,
                    y,
                    ...balloon,
                });
            },
        });
    }
}

