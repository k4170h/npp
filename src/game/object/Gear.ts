import { Vector } from "matter";
import { COLLISION_FILTER, FPS30, Matter } from "../utils/definitions";

const DEFAULT_R = 10;
const DEFAULT_SPEED = 10;

/**
 * 回転ブロック
 */
export class Gear extends Phaser.Physics.Matter.Image {
    public declare body: MatterJS.BodyType;

    private initialPos: Vector = {
        x: 0,
        y: 0,
    };

    constructor({
        scene,
        x,
        y,
        r = DEFAULT_R,
        speed = DEFAULT_SPEED,
    }: {
        scene: Phaser.Scene;
        x: number;
        y: number;
        r?: number;
        speed: number;
    }) {
        super(scene.matter.world, x, y, "gear", undefined);

        this.initialPos = { x, y };

        const customBody = Matter.Bodies.fromVertices(
            x,
            y,
            vertices,
            {
                label: `gear`,
                isStatic: false,
                friction: 0,
                frictionAir: 0,
                frictionStatic: 0,
                collisionFilter: COLLISION_FILTER.GEAR,
            },
            true
        );
        this.setExistingBody(customBody);

        // オブジェクトのサイズとスケールを設定
        this.setDisplaySize(r, r);
        this.setScale(this.scaleX, this.scaleY);
        this.setOrigin(0.5);
        this.setAngularSpeed(Phaser.Math.DegToRad(speed));
        this.setIgnoreGravity(true);
        this.setMass(99999);

        // ループの処理
        scene.time.addEvent({
            delay: FPS30,
            loop: true,
            callback: () => this.loop(),
        });

        // シーンに追加
        scene.add.existing(this);
    }

    // 毎フレームの処理
    private loop() {
        // 衝突でずれていたら中央に移動するようにする
        // if (this.x !== this.initialPos.x || this.y !== this.initialPos.y) {
        const speed = 0.5; // 補間係数（0に近いほどゆっくり）
        this.setPosition(
            this.x + (this.initialPos.x - this.x) * speed,
            this.y + (this.initialPos.y - this.y) * speed
        );
        // }
    }
}

const vertices = [
    [
        { x: 91.545, y: 57.787 },
        { x: 80.148, y: 69.178 },
        { x: 64.031, y: 69.178 },
        { x: 64.031, y: 85.288 },
        { x: 52.634, y: 96.68 },
        { x: 64.031, y: 108.072 },
        { x: 64.031, y: 124.182 },
        { x: 80.149, y: 124.182 },
        { x: 91.545, y: 135.573 },
        { x: 102.941, y: 124.182 },
        { x: 119.058, y: 124.182 },
        { x: 119.058, y: 108.072 },
        { x: 130.454, y: 96.68 },
        { x: 119.058, y: 85.289 },
        { x: 119.058, y: 69.178 },
        { x: 102.941, y: 69.178 },
    ],
];

