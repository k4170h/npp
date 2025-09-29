import { svgPathProperties } from "svg-path-properties";
import { CollisionPair } from "./definitions";

export const prefs = [
    "01_hokkaido",
    "02_aomori",
    "03_iwate",
    "04_miyagi",
    "05_akita",
    "06_yamagata",
    "07_fukushima",
    "08_ibaraki",
    "09_tochigi",
    "10_gunma",
    "11_saitama",
    "12_chiba",
    "13_tokyo",
    "14_kanagawa",
    "15_niigata",
    "16_toyama",
    "17_ishikawa",
    "18_fukui",
    "19_yamanashi",
    "20_nagano",
    "21_gifu",
    "22_shizuoka",
    "23_aichi",
    "24_mie",
    "25_shiga",
    "26_kyoto",
    "27_osaka",
    "28_hyogo",
    "29_nara",
    "30_wakayama",
    "31_tottori",
    "32_shimane",
    "33_okayama",
    "34_hiroshima",
    "35_yamaguchi",
    "36_tokushima",
    "37_kagawa",
    "38_ehime",
    "39_kochi",
    "40_fukuoka",
    "41_saga",
    "42_nagasaki",
    "43_kumamoto",
    "44_oita",
    "45_miyazaki",
    "46_kagoshima",
    "47_okinawa",
] as const;

export type PrefCode = (typeof prefs)[number];

export const prefData: {
    [K in PrefCode]: { color: number; origin?: [number, number] };
} = {
    "01_hokkaido": { color: 0x8191ff, origin: [0.47, 0.57] },
    "02_aomori": { color: 0x02ff6a, origin: [0.55, 0.55] },
    "03_iwate": { color: 0x00d6ff, origin: [0.5, 0.5] },
    "04_miyagi": { color: 0x00ffda, origin: [0.5, 0.45] },
    "05_akita": { color: 0xc83837, origin: [0.5, 0.45] },
    "06_yamagata": { color: 0x0089ff, origin: [0.5, 0.5] },
    "07_fukushima": { color: 0xdb4c24, origin: [0.55, 0.5] },
    "08_ibaraki": { color: 0x586eff, origin: [0.57, 0.52] },
    "09_tochigi": { color: 0x008433, origin: [0.5, 0.5] },
    "10_gunma": { color: 0xf572ff, origin: [0.45, 0.5] },
    "11_saitama": { color: 0xff0005, origin: [0.53, 0.52] },
    "12_chiba": { color: 0x2921ff, origin: [0.39, 0.44] },
    "13_tokyo": { color: 0xc18aff, origin: [0.52, 0.5] },
    "14_kanagawa": { color: 0xff0000, origin: [0.5, 0.48] },
    "15_niigata": { color: 0xfb8a04, origin: [0.62, 0.57] },
    "16_toyama": { color: 0x26d948, origin: [0.5, 0.48] },
    "17_ishikawa": { color: 0x00c7ff, origin: [0.5, 0.49] },
    "18_fukui": { color: 0x7076ff, origin: [0.57, 0.47] },
    "19_yamanashi": { color: 0xc385ff, origin: [0.43, 0.47] },
    "20_nagano": { color: 0xfc4603, origin: [0.5, 0.5] },
    "21_gifu": { color: 0x006b00, origin: [0.52, 0.53] },
    "22_shizuoka": { color: 0xb3b9ff, origin: [0.5, 0.6] },
    "23_aichi": { color: 0xbc4350, origin: [0.48, 0.43] },
    "24_mie": { color: 0x00ff7c, origin: [0.48, 0.48] },
    "25_shiga": { color: 0x0088ff, origin: [0.55, 0.5] },
    "26_kyoto": { color: 0xf046ff, origin: [0.46, 0.45] },
    "27_osaka": { color: 0x546cff, origin: [0.65, 0.53] },
    "28_hyogo": { color: 0x01cdff, origin: [0.47, 0.57] },
    "29_nara": { color: 0xc33b42, origin: [0.48, 0.53] },
    "30_wakayama": { color: 0x4261bd, origin: [0.46, 0.5] },
    "31_tottori": { color: 0x545bff, origin: [0.54, 0.47] },
    "32_shimane": { color: 0xf58f0a, origin: [0.52, 0.45] },
    "33_okayama": { color: 0xffcdfb, origin: [0.5, 0.5] },
    "34_hiroshima": { color: 0xc23d4f, origin: [0.52, 0.54] },
    "35_yamaguchi": { color: 0xac6452, origin: [0.52, 0.53] },
    "36_tokushima": { color: 0x4a99ff, origin: [0.54, 0.48] },
    "37_kagawa": { color: 0x00ff49, origin: [0.45, 0.48] },
    "38_ehime": { color: 0xf9f400, origin: [0.5, 0.45] },
    "39_kochi": { color: 0xfe0002, origin: [0.45, 0.4] },
    "40_fukuoka": { color: 0x0095ff, origin: [0.55, 0.45] },
    "41_saga": { color: 0x39edff, origin: [0.45, 0.45] },
    "42_nagasaki": { color: 0x00b2ff, origin: [0.45, 0.55] },
    "43_kumamoto": { color: 0xff0000, origin: [0.5, 0.5] },
    "44_oita": { color: 0xfb0434, origin: [0.48, 0.5] },
    "45_miyazaki": { color: 0xffff01, origin: [0.5, 0.44] },
    "46_kagoshima": { color: 0xe22236, origin: [0.48, 0.47] },
    "47_okinawa": { color: 0xff0053, origin: [0.45, 0.5] },
};

export function polarToVector(angleDeg: number, length: number) {
    const angleRad = Phaser.Math.DegToRad(angleDeg);
    return new Phaser.Math.Vector2(
        Math.cos(angleRad) * length,
        Math.sin(angleRad) * length
    );
}

export function vectorToPolar(x: number, y: number) {
    const length = Math.sqrt(x * x + y * y);
    const angleRad = Math.atan2(y, x);
    const angle = angleRad * (180 / Math.PI);

    return {
        length,
        angleRad,
        angle,
    };
}

/**
 * SVGエレメントの<path /> からポリゴン情報を吸い出す
 * @param elm
 * @returns
 */
export function svgPathToVertex(elm: SVGPathElement) {
    const d = elm.getAttribute("d");
    if (!d) {
        throw new Error();
    }
    const properties = new svgPathProperties(d);
    return properties.getParts().map(({ start: { x, y } }) => ({
        x: Math.round(x * 10) / 10,
        y: Math.round(y * 10) / 10,
    }));

    /*

    return elms.map((v) => {
        const d = v.getAttribute("d");
        if (!d) {
            throw new Error();
        }
        const properties = new svgPathProperties(d);
        return properties.getParts().map(({ start: { x, y } }) => ({
            x: Math.round(x * 10) / 10,
            y: Math.round(y * 10) / 10,
        }));
    });
*/
}
/**
 * SVGをXMLで読み込んだデータから頂点情報を吸い出す。
 * verticesというレイヤー(<g>)に入れておくこと
 * @param elms
 * @returns
 */
export function svgPathToVertices(svgData: any) {
    const group = svgData.getElementById("vertices");
    return new Array(group.children.length)
        .fill(0)
        .map((_, i): SVGElement => group.children[i])
        .filter((v) => v.tagName === "path")
        .map((elm) => {
            const d = elm.getAttribute("d");
            if (!d) {
                throw new Error();
            }
            const properties = new svgPathProperties(d);
            return properties.getParts().map(({ start: { x, y } }) => ({
                x: Math.round(x * 10) / 10,
                y: Math.round(y * 10) / 10,
            }));
        });
}

/**
 * event.pairs から引数の body に関連するpairsを返す.
 * bodyAが引数のBodyになるようにする
 */
export function findAllPairs(
    pairs: Phaser.Types.Physics.Matter.MatterCollisionPair[],
    body: Phaser.GameObjects.GameObject["body"]
): CollisionPair[] {
    return pairs
        .filter(
            ({ bodyA, bodyB }) => bodyA.parent === body || bodyB.parent === body
        )
        .map(({ bodyA, bodyB }) => ({
            bodyA: bodyA.parent === body ? bodyA.parent : bodyB.parent,
            bodyB: bodyA.parent === body ? bodyB.parent : bodyA.parent,
        }));
}

/**
 * event.pairs から引数の body に関連するpairを返す
 * bodyAが引数のBodyになるようにする
 */
export function findPair(
    pairs: Phaser.Types.Physics.Matter.MatterCollisionPair[],
    body: Phaser.GameObjects.GameObject["body"]
): CollisionPair | null {
    const matched = findAllPairs(pairs, body);
    return matched.length > 0 ? matched[0] : null;
}

