import {
    Widget
} from "@phosphor/widgets";

import {
    Shogi
} from "../src";

function is_document_ready(): boolean {
    return (document.readyState === "complete" ||
            document.readyState !== "loading");
}

function initialize_shogi_ui(): void {
    const main: HTMLElement = document.querySelector("main");
    // const model = (window as any).model = new Life.Model({
    //     initial: Life.Model.random(50, 100),
    //     interval: 50
    // });
    // const grid = Life.create(model, { size: 10 });

    // main.style.height = `${grid.bodyHeight}px`;
    // main.style.width = `${grid.bodyWidth}px`;
    // main.style.display = "block";
    // Widget.attach(grid, main);
    // model.start();
}

if (is_document_ready()) {
    initialize_shogi_ui();
} else {
    document.addEventListener("DOMContentLoaded", initialize_shogi_ui);
}