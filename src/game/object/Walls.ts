import { COLLISION_FILTER, SCREEN_H, SCREEN_W } from "../utils/definitions";
import { findAllPairs, svgPathToVertices } from "../utils/utils";

/**
 * 壁を一括定義する
 */
export class Walls extends Phaser.GameObjects.Container {
    public declare body: MatterJS.BodyType;

    constructor(scene: Phaser.Scene) {
        super(scene, 0, 0);

        // 背景設定
        scene.add.image(1280 / 2, 720 / 2, "back").setDepth(-100);
        scene.add.image(1280 / 2, 720 / 2, "front").setDepth(100);

        // 固定壁 判定だけ
        const svgData = scene.cache.xml.get("walls");
        const vertices = svgPathToVertices(svgData);
        vertices.forEach((v) => {
            const center = scene.matter.vertices.centre(v);
            scene.matter.add.fromVertices(
                center.x,
                center.y,
                v,
                {
                    isStatic: true,
                    friction: 0,
                    label: "wall",
                    collisionFilter: COLLISION_FILTER.WALL,
                },
                true
            ); // trueで自動センタリング
        });

        // シーンに追加
        scene.add.existing(this);
    }
}

