function getEmptyIndexes(board) {
    const emptyIndexes = [];
    board.forEach((symbol, index) => {
        if (!symbol) {
            emptyIndexes.push(index);
        }
    });

    return emptyIndexes;
}

export default getEmptyIndexes;