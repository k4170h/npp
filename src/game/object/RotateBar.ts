import {
    COLLISION_CATEGORY,
    COLLISION_FILTER,
    FPS30,
    Matter,
} from "../utils/definitions";
import { Particles } from "../particles/particle";
import { findAllPairs, polarToVector } from "../utils/utils";

const DEFAULT_W = 20;
const DEFAULT_H = 160;
const DEFAULT_ANGLE = 0;

/**
 * 90度ずつ回転する棒
 */
export class RotateBar extends Phaser.Physics.Matter.Image {
    public declare body: MatterJS.BodyType;

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
        const texture = getBoosterTexture(scene, w, h);
        super(scene.matter.world, x, y, texture, undefined, {
            isStatic: true,
            friction: 0,
            restitution: 0.01,
            label: "wall",
            collisionFilter: COLLISION_FILTER.WALL,
        });

        // オブジェクトのサイズとスケールを設定
        this.setDisplaySize(w, h);
        this.setScale(this.scaleX, this.scaleY);
        this.setOrigin(0.5);
        this.setAngle(angle);

        // GameScene.ts の create() メソッド内
        scene.time.addEvent({
            delay: 1000, // 1000ミリ秒（1秒）ごとにイベントを実行
            loop: true, // イベントを繰り返す
            callback: () => {
                // 現在のブロックの角度を取得
                // 90度ずつ回転させるTweenを作成
                scene.tweens.add({
                    targets: this,
                    angle: this.angle - 90, // 現在の角度から90度加算
                    duration: 200, // 500ミリ秒かけて回転
                    ease: "Sine.easeInOut", // 滑らかな動き
                });
            },
        });

        // シーンに追加
        scene.add.existing(this);
    }
}

function getBoosterTexture(scene: Phaser.Scene, w: number, h: number) {
    const name = `bar_${w}_${h}`;
    if (scene.textures.exists(name)) {
        return name;
    }
    const g = scene.add.graphics();
    const lw = 1;

    g.fillStyle(0xffffff, 1);
    g.fillRect(0, 0, w, h);
    g.lineStyle(lw, 0x999999, 1);
    g.strokeRect(0, 0, w, h);

    const rt = scene.add
        .renderTexture(0, 0, w + lw * 2, h + lw * 2)
        .draw(g, lw, lw);

    rt.saveTexture(name);
    g.destroy();
    rt.destroy();

    return name;
}

