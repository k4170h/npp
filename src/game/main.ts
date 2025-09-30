import { Game as MainGame } from "./scenes/Game";
import { Game } from "phaser";

const config: Phaser.Types.Core.GameConfig = {
    width: 1280,
    height: 720,
    parent: "game-container",
    scale: {
        mode: Phaser.Scale.FIT,
        parent: "game-container",
        width: 1280,
        height: 720,
    },

    backgroundColor: "#028af8",
    scene: [MainGame],
    physics: {
        default: "matter",
        matter: {
            gravity: { x: 0, y: 0.7 },
            // debug: true,
        },
    },
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
};

export default StartGame;
