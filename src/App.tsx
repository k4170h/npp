import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import GameWrapper from "./GameWrapper";

function App() {
    return (
        <BrowserRouter>
            <div id="app">
                <Routes>
                    <Route path="*" element={<GameWrapper />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
