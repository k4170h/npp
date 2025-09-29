import { COLLISION_FILTER, FPS30, Matter } from "../utils/definitions";
import { findAllPairs, polarToVector } from "../utils/utils";

const DEFAULT_W = 10;
const DEFAULT_H = 50;
const DEFAULT_ANGLE = 0;
const DEFAULT_LIFE = 5;

/**
 * 壊せるブロック
 */
export class BreakableBlock extends Phaser.Physics.Matter.Image {
    public declare body: MatterJS.BodyType;

    // originからのずれ。パネル自体が振動して見えるようにするためのギミック
    private originOffset = 0;

    private life: number;
    private currentLife: number;
    private invincible = false;

    constructor({
        scene,
        x,
        y,
        w = DEFAULT_W,
        h = DEFAULT_H,
        angle = DEFAULT_ANGLE,
        life = DEFAULT_LIFE,
    }: {
        scene: Phaser.Scene;
        x: number;
        y: number;
        w?: number;
        h?: number;
        // 0度は右向き
        angle?: number;
        life?: number;
    }) {
        const texture = getBBlockTexture(scene, w, h);
        super(scene.matter.world, x, y, texture, undefined, {
            isStatic: true,
            collisionFilter: COLLISION_FILTER.WALL,
        });

        // オブジェクトのサイズとスケールを設定
        this.setDisplaySize(w, h);
        this.setScale(this.scaleX, this.scaleY);
        this.setOrigin(0.5);
        this.setAngle(angle);

        this.life = life;
        this.currentLife = life;

        // 衝突時の設定
        this.scene.matter.world.on(
            "collisionstart",
            (e: Phaser.Physics.Matter.Events.CollisionStartEvent) =>
                this.onCollision(e)
        );

        // ループの処理
        scene.time.addEvent({
            delay: FPS30,
            loop: true,
            callback: () => this.loop(),
        });

        // シーンに追加
        scene.add.existing(this);
    }

    // 衝突時の処理
    private onCollision(
        event: Phaser.Physics.Matter.Events.CollisionStartEvent
    ) {
        const pairs = findAllPairs(event.pairs, this.body);
        pairs
            .map((v) => v.bodyB)
            .forEach((ball) => {
                if (ball.parent.speed > 3) {
                    this.scene.matter.body.setVelocity(ball, {
                        x: ball.parent.velocity.x * 2,
                        y: ball.parent.velocity.y * 2,
                    });

                    // 無敵状態ではなかった
                    if (!this.invincible) {
                        this.invincible = true;
                        this.scene.time.delayedCall(500, () => {
                            this.invincible = false;
                        });
                        this.currentLife--;
                        if (this.currentLife < 0) {
                            // explodeEmitter.explode();
                            // explodePartEmitter.explode();
                            this.destroy();
                        }
                        this.setTint(this.getColor());
                        // sparkEmitter.setParticleTint([this.getColor(), 0x000000]);
                        // sparkEmitter.explode(4);
                    }
                }
            });
    }

    // 毎フレームの処理
    private loop() {
        // 衝突でずれていたら中央に移動するようにする
        if (this.originOffset > 0) {
            this.setOrigin(
                0.5 - polarToVector(0, -this.originOffset).x / 50,
                0.5 - polarToVector(0, -this.originOffset).y / 50
            );
            this.originOffset *= 0.5;
            if (this.originOffset <= 0.1) {
                this.originOffset = 0;
                this.setOrigin(0.5);
            }
        }
    }

    private getColor() {
        return Phaser.Display.Color.HSLToColor(
            (this.currentLife / this.life) * 0.3,
            1,
            0.5
        ).color;
    }
}

// テクスチャーが無かったら作る
function getBBlockTexture(scene: Phaser.Scene, w: number, h: number) {
    const name = `BBlock_${w}_${h}`;
    if (scene.textures.exists(name)) {
        return name;
    }
    const g = scene.add.graphics();
    const gs = 1;
    const [gh, gw, gl] = [h * gs, w * gs, 3 * gs];

    g.fillStyle(0xffffff, 1);
    g.fillRect(0, 0, gw, gh);
    g.lineStyle(gl, 0x000000, 1);
    g.strokeRect(0, 0, gw, gh);

    const rt = scene.add
        .renderTexture(0, 0, gw + gl * 2, gh + gl * 2)
        .draw(g, gl, gl)
        .setScale(1 / gs);

    rt.saveTexture(name);
    g.destroy();

    return name;
}

