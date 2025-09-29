import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import { Marble } from "../object/Marble";
import { Booster } from "../object/Booster";
import { Oneway } from "../object/Oneway";
import { Particles } from "../particles/particle";
import { Gear } from "../object/Gear";
import { MovingBooster } from "../object/MovingBooster";
import { BalloonLauncher } from "../object/BalloonLauncher";
import { RotateBar } from "../object/RotateBar";
import { RotateBoosters } from "../object/RotateBoosters";
import { Goal } from "../object/Goal";
import { Bubble } from "../object/Bubble";
import { Warper } from "../object/Warper";
import { Walls } from "../object/Walls";

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameText: Phaser.GameObjects.Text;

    constructor() {
        super("Game");
    }

    preload(): void {
        this.load.image("back", "assets/back.svg");
        this.load.image("front", "assets/front.svg");
        this.load.xml("walls", "assets/front.svg");

        this.load.svg("star", "assets/star.svg");
        this.load.svg("first", "assets/first.svg");
        this.load.svg("second", "assets/second.svg");
        this.load.svg("third", "assets/third.svg");
        this.load.svg("goaled", "assets/goaled.svg");

        [
            "normal",
            "suit",
            "cook",
            "fight",
            "reading",
            "fishing",
            "driving",
            "doctor",
        ].forEach((v) => {
            this.load.image(v, `assets/marbles/${v}.svg`);
            this.load.xml(v, `assets/marbles/${v}.svg`);
        });

        // parts
        this.load.svg("gear", "assets/gear.svg");
        this.load.svg("oneway", "assets/oneway.svg");
        this.load.svg("balloon", "assets/balloon.svg");
        this.load.svg("booster", "assets/booster.svg");
    }

    create() {
        Particles.initialize(this);

        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0xeeeeee);

        // 壁と背景設定
        new Walls(this);

        // マーブル
        [
            "normal",
            "suit",
            "cook",
            "fight",
            "reading",
            "fishing",
            "driving",
            "doctor",
        ].forEach((key, i) => {
            new Marble({
                scene: this,
                key,
                intro: { x: 100 + i * 150, y: 300, delay: i * 100 + 500 },
                run: { x: 100 + i * 20, y: 50 },
                outro: {},
            });
        });

        new Oneway({ scene: this, x: 330, y: 50, angle: -180 });

        new Warper({
            scene: this,
            x: 25,
            y: 500,
            w: 10,
            h: 400,
            to: { x: 60, y: 60 },
            velocity: { x: 7, y: -5 },
        });

        // 左端の蓋
        new Oneway({
            scene: this,
            x: 55,
            y: 65,
            h: 40,
            w: 10,
            angle: -45,
        });

        // Gearブロック

        new Gear({ scene: this, x: 288, y: 500, r: 50, speed: -11 });
        new Gear({ scene: this, x: 195, y: 550, r: 50, speed: -11 });
        new Gear({ scene: this, x: 100, y: 600, r: 50, speed: -11 });

        new Gear({ scene: this, x: 90, y: 700, r: 40, speed: 5 });
        new Gear({ scene: this, x: 120, y: 700, r: 40, speed: 5 });
        new Gear({ scene: this, x: 150, y: 700, r: 40, speed: 5 });
        new Gear({ scene: this, x: 180, y: 700, r: 40, speed: 5 });
        new Gear({ scene: this, x: 210, y: 700, r: 40, speed: 5 });
        new Gear({ scene: this, x: 240, y: 700, r: 40, speed: 5 });
        new Gear({ scene: this, x: 270, y: 700, r: 40, speed: 5 });
        new Gear({ scene: this, x: 300, y: 700, r: 40, speed: 5 });

        // 列2から戻るところ
        new Oneway({ scene: this, x: 330, y: 440, angle: 180 });

        //列2に進むところ
        new Oneway({ scene: this, x: 320, y: 575, angle: 0 });
        new Oneway({ scene: this, x: 320, y: 640, angle: 0 });

        // 2列目最下段
        // 下で首振りするやつ
        new Booster({ x: 360, y: 680, angle: -60, power: 10, scene: this });
        [410, 460, 510, 560, 610].forEach((v, i) => {
            new MovingBooster({
                x: v,
                y: 680,
                angle: -60 + (i % 2) * -60,
                power: 10,
                scene: this,
                rotate: {
                    angle: -60 + ((i + 1) % 2) * -60,
                    duration: 2000,
                },
            });
        });

        // 交差するやつ
        new MovingBooster({
            x: 360,
            y: 500,
            angle: -120,
            power: 10,
            scene: this,
            rotate: {
                duration: 1000,
            },
            move: {
                x: 600,
                duration: 2000,
            },
        });
        new MovingBooster({
            x: 600,
            y: 500,
            angle: -60,
            power: 14,
            scene: this,
            rotate: {
                // angle: -120,
                duration: 1100,
            },
            move: {
                x: 360,
                duration: 2000,
            },
        });

        new MovingBooster({
            x: 480,
            y: 40,
            angle: 0,
            power: 14,
            scene: this,
            rotate: {
                angle: 180,
                duration: 100,
                interval: 1000,
            },
        });

        new BalloonLauncher({
            scene: this,
            x: 640,
            y: 370,
            interval: 500,
            balloon: {
                timeout: 3300,
                angle: -120,
                power: 12,
                rotate: {
                    angle: -60,
                    duration: 400,
                },
                vx: -1.5,
                vy: -0.75,
            },
        });

        // 列3から戻るところ

        new Oneway({ scene: this, x: 645, y: 245, h: 70, w: 10, angle: 180 });
        new Oneway({ scene: this, x: 645, y: 550, h: 60, w: 10, angle: 180 });
        new Oneway({ scene: this, x: 950, y: 50, h: 70, w: 10, angle: 180 });
        new Oneway({ scene: this, x: 640, y: 50, h: 70, w: 10 });

        new Gear({ scene: this, x: 798, y: 240, r: 80, speed: 8 });

        new Gear({ scene: this, x: 690, y: 160, r: 80, speed: -10 });
        new Gear({ scene: this, x: 690, y: 340, r: 80, speed: -10 });
        new Gear({ scene: this, x: 910, y: 160, r: 80, speed: 10 });
        new Gear({ scene: this, x: 910, y: 340, r: 80, speed: 10 });

        new Booster({ x: 1240, y: 380, angle: -90, power: 16, scene: this });
        new RotateBar({ scene: this, x: 1050, y: 100, angle: -90 });

        new RotateBoosters({
            scene: this,
            x: 800,
            y: 545,
            booster: { power: 12 },
            count: 3,
            r: 110,
        });

        new Goal({ scene: this, x: 1150, y: 580, w: 300, h: 300 });

        new Array(20).fill(0).forEach((_, i) => {
            new Bubble({ scene: this, x: 1070 + i * 4, y: 550, r: 10 });
        });
        new Array(20).fill(0).forEach((_, i) => {
            new Bubble({ scene: this, x: 1070 + i * 4, y: 570, r: 6 });
        });
        new Array(20).fill(0).forEach((_, i) => {
            new Bubble({ scene: this, x: 1070 + i * 4, y: 530, r: 8 });
        });

        EventBus.emit("current-scene-ready", this);
    }

    // changeScene() {
    //     this.scene.start("GameOver");
    // }
}

