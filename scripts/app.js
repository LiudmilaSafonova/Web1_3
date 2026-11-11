function createAppLayout() {
    const main = document.createElement('main');
    main.className = 'todo-app';

    const header = document.createElement('header');
    header.className = 'todo-app__header';

    const title = document.createElement('h1');
    title.textContent = '2048';

    const score = document.createElement('div');

    const scoreLabel = document.createElement('span');
    scoreLabel.textContent = 'score';

    const scoreValue = document.createElement('output');
    scoreValue.id = 'score';
    scoreValue.textContent = '0';

    score.append(scoreLabel, scoreValue);

    header.append(title, score);
    main.append(header);

    const board = document.createElement('div');
    board.className = 'game-board';

    for (let i = 0; i < 16; i++) {
        const cell = document.createElement('div');
        cell.className = 'game-board__cell';
        board.append(cell);
    }

    main.append(board);
    document.body.append(main);

}

function createInitialBoardValues() {
    const values = Array(16).fill(0);
    const tileCount = Math.floor(Math.random() * 3) + 1;

    for (let i = 0; i < tileCount; i++) {
        let cellIndex;

        do {
            cellIndex = Math.floor(Math.random() * values.length);
        } while (values[cellIndex] !== 0);

        values[cellIndex] = Math.random() < 0.5 ? 2 : 4;
    }

    return values;
}

createAppLayout();
const boardValues = createInitialBoardValues();



