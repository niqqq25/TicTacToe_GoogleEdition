
function victoryScreen(symbol) {

    const circle =
        '<circle class="circle" cx=50 cy=50 r=30 style="animation: none;"/>';
    const cross =
        '<path class="cross" d="M20 20 l60 60 M80 20 l-60 60" style="animation: none;"/>';

    const victoryScreenTop = `<svg id="victory-screen-top" viewBox="0 0 100 100">${
        symbol === "x" ? cross : circle
    }</svg>`;
    const victoryScreenBottom = `<div id="victory-screen-bottom">WINNER!<div />`;

    const victoryScreen = `<div id="victory-screen">${victoryScreenTop +
        victoryScreenBottom}<div />`;

    return victoryScreen;

    // updateTurnBox();
    // createVictoryOrDrawField();
    // //update upper box
    // const $victoryOrDrawFieldsUpperBox = d3
    //     .select(document.getElementById("victory-or-draw-field"))
    //     .append("svg")
    //     .attr("class", "victory-or-draw-field-upper-box")
    //     .attr("viewBox", "0 0 100 100");
    // if (symbol == "x") {
    //     $victoryOrDrawFieldsUpperBox
    //         .append("path")
    //         .attr("class", "x")
    //         .attr("d", "M20 20 l60 60 M80 20 l-60 60")
    //         .style("animation", "none");
    // } else {
    //     $victoryOrDrawFieldsUpperBox
    //         .append("circle")
    //         .attr("class", "o")
    //         .attr("cx", 50)
    //         .attr("cy", 50)
    //         .attr("r", 30)
    //         .style("animation", "none");
    // }
    // //update lower box
    // const $victoryOrDrawFieldsLowerBox = $("<div/>").attr(
    //     "id",
    //     "victory-or-draw-field-lower-box"
    // );
    // $("#victory-or-draw-field").append($victoryOrDrawFieldsLowerBox);
    // $victoryOrDrawFieldsLowerBox.text("WINNER!");
}

export default victoryScreen;
