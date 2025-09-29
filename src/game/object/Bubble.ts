import { COLLISION_FILTER, FPS60, Matter } from "../utils/definitions";

/**
 * 緩衝材
 */
export class Bubble extends Phaser.Physics.Matter.Image {
    public declare body: MatterJS.BodyType;

    constructor({
        scene,
        x,
        y,
        r,
    }: {
        scene: Phaser.Scene;
        x: number;
        y: number;
        r: number;
    }) {
        const texture = getBubbleTexture(scene, r);
        super(scene.matter.world, x, y, texture, undefined, {
            collisionFilter: COLLISION_FILTER.MARBLE,
            mass: 0.1,
            angle: Math.floor(Math.random() * 90),
        });

        // シーンに追加
        scene.add.existing(this);
    }
}

function getBubbleTexture(scene: Phaser.Scene, r: number) {
    const name = `bubble_${r}`;
    if (scene.textures.exists(name)) {
        return name;
    }
    const g = scene.add.graphics();
    const [w, h] = [r * 2, r * 2];
    g.fillStyle(0xffffff);
    g.fillRect(0, 0, w, h);
    g.lineStyle(1, 0x999999);
    g.strokeRect(0, 0, w, h);
    const rt = scene.add.renderTexture(-1, -1, w + 2, h + 2).draw(g, 1, 1);

    rt.saveTexture(name);
    g.destroy();
    rt.destroy();

    return name;
}

