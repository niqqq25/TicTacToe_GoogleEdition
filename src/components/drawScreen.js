function drawScreen() {
    const circle =
        '<circle class="circle" cx=50 cy=50 r=30 style="animation: none;"/>';
    const cross =
        '<path class="cross" d="M20 20 l60 60 M80 20 l-60 60" style="animation: none;"/>';

    const drawScreenTopRight = `<svg id="draw-screen-top" viewBox="0 0 100 100" style="display:inline-block;">${circle}</svg>`;
    const drawScreenTopLeft = `<svg id="draw-screen-top" viewBox="0 0 100 100" style="display:inline-block;">${cross}</svg>`;
    const drawScreenBottom = `<div id="draw-screen-bottom">DRAW!<div />`;

    const drawScreen = `<div id="draw-screen">${drawScreenTopRight +
        drawScreenTopLeft +
        drawScreenBottom}<div />`;

    return drawScreen;
}

export default drawScreen;
