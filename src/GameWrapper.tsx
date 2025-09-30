import { useRef } from "react";
import { IRefPhaserGame, PhaserGame } from "./PhaserGame";

function GameWrapper() {
    const phaserRef = useRef<IRefPhaserGame | null>(null);
    return (
        <div style={{ width: "100%" }} id="app">
            <PhaserGame ref={phaserRef} />
        </div>
    );
}

export default GameWrapper;
