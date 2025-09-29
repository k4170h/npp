import { Textures } from "phaser";
import { BoosterCircle } from "../objects_old/BoosterCircle";
import { COLORFUL } from "../utils/definitions";

export class Particles {
    static star: Phaser.GameObjects.Particles.ParticleEmitter;
    static balloon: Phaser.GameObjects.Particles.ParticleEmitter;
    static explode: Phaser.GameObjects.Particles.ParticleEmitter;
    static bigStar: Phaser.GameObjects.Particles.ParticleEmitter;
    static firework: Phaser.GameObjects.Particles.ParticleEmitter;
    static initialize(scene: Phaser.Scene) {
        createTextures(scene);

        Particles.star = scene.add.particles(0, 0, "star", {
            lifespan: { min: 100, max: 200 },
            speed: { min: 400, max: 600 },
            angle: { min: 180, max: 360 },
            scale: { start: 0.1, end: 0 },
            quantity: 1,
            accelerationY: 800,
            frequency: -1,
            tint: COLORFUL,
        });
        // バルーン破裂時の紙吹雪的なもの
        Particles.balloon = scene.add.particles(0, 0, "star", {
            quantity: 4,

            tint: COLORFUL,
            scale: { start: 0.1, end: 0 },
            speed: { min: 100, max: 200 },
            alpha: { start: 1, end: 0 },
            angle: { min: 0, max: 360 },
            rotate: { start: 0, end: 360 },
            frequency: -1,
            accelerationY: 400,
            lifespan: { min: 500, max: 1000 },
        });

        // 爆発
        Particles.explode = scene.add.particles(0, 0, "p_circle", {
            speed: { min: 50, max: 100 },
            angle: { min: 250, max: 290 },
            lifespan: { min: 10, max: 800 },
            scale: { start: 2, end: 0.1 },
            frequency: -1,
            color: [0xffff00, 0xff3333, 0x333333, 0x111111],
            quantity: 12,
        });

        // でかい星
        Particles.bigStar = scene.add.particles(0, 0, "star", {
            accelerationY: 2400,
            lifespan: { min: 1000, max: 2000 },
            speed: { min: 1000, max: 1200 },
            scale: { start: 0.2, end: 0.1 },
            frequency: -1,
            tint: COLORFUL,
            quantity: 12,
        });

        // 花火
        Particles.firework = scene.add.particles(0, 0, "p_circle", {
            speed: { min: 50, max: 200 },
            lifespan: 1500,
            gravityY: 300,
            scale: { start: 0.5, end: 0 },
            alpha: { start: 1, end: 0 },
            quantity: 3,
            frequency: -1,
            tint: 0xff0000,
            blendMode: Phaser.BlendModes.ADD,
        });
    }
}

function createTextures(scene: Phaser.Scene) {
    // 紙吹雪
    const g = scene.add.graphics();
    g.fillStyle(0xffffff);
    g.fillRect(0, 0, 20, 10);
    scene.add.renderTexture(0, 0, 20, 10).draw(g).saveTexture("p_paper");
    g.destroy();

    g.fillStyle(0xffffff);
    g.fillCircle(10, 10, 10);
    scene.add.renderTexture(0, 0, 20, 20).draw(g).saveTexture("p_circle");
    g.destroy();
}

