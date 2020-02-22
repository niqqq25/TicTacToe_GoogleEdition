import getEmptyIndexes from '../shared/getEmptyIndexes';

function randomAlgorithm(board) {
    const emptyIndexes = getEmptyIndexes(board);

    const randomIndex = Math.round(Math.random() * (emptyIndexes.length - 1));
    return emptyIndexes[randomIndex];
}

export default randomAlgorithm;