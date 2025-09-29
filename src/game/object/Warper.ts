import { COLLISION_FILTER } from "../utils/definitions";
import { findAllPairs } from "../utils/utils";

/**
 * 左端のワープ
 */
export class Warper extends Phaser.Physics.Matter.Sprite {
    public declare body: MatterJS.BodyType;

    constructor({
        scene,
        x,
        y,
        w,
        h,
        to,
        velocity,
    }: {
        scene: Phaser.Scene;
        x: number;
        y: number;
        w: number;
        h: number;
        to: {
            x: number;
            y: number;
        };
        velocity: {
            x: number;
            y: number;
        };
    }) {
        super(scene.matter.world, x, y, "__WHITE");
        this.setAlpha(0);
        this.setRectangle(w, h);
        this.setSensor(true);
        this.setStatic(true);
        this.setCollisionCategory(COLLISION_FILTER.BOOSTER.category);

        //接触時の処理定義
        this.scene.matter.world.on(
            "collisionstart",
            (event: Phaser.Physics.Matter.Events.CollisionStartEvent) => {
                const pairs = findAllPairs(event.pairs, this.body);
                pairs
                    .filter(({ bodyB }) => bodyB.label.includes("marble"))
                    .forEach(({ bodyB }) => {
                        this.scene.matter.body.setVelocity(
                            bodyB.parent,
                            velocity
                        );
                        this.scene.matter.body.setPosition(bodyB.parent, to);
                    });
            }
        );

        scene.add.particles(0, 0, "p_circle", {
            lifespan: 1500,
            speed: { min: 300, max: 400 },
            angle: -90,
            // scale: { start: 0.1, end: 0 },
            scale: 0.2,
            quantity: 5,
            // accelerationY: 800,
            frequency: 50,
            tint: [0x00ffff, 0x00ccff, 0x00ffcc, 0xffffff],
            x: () => 20 + Math.floor(Math.random() * 60),
            y: 700,
            // color: [0xffff00, 0xff3333, 0x111111, 0x111111],
        });

        // シーンに追加
        scene.add.existing(this);
    }
}

