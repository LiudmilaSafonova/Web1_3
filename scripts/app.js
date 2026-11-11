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

    const gameArea = document.createElement('div');
    gameArea.className = 'game-area';

    const boardColumn = document.createElement('div');
    boardColumn.className = 'game-area__board-column';
    boardColumn.append(board);

    const controls = document.createElement('div');
    controls.className = 'game-controls';

    const backButton = document.createElement('button');
    backButton.type = 'button';
    backButton.textContent = 'back';

    const startOverButton = document.createElement('button');
    startOverButton.type = 'button';
    startOverButton.textContent = 'start over';

    controls.append(backButton, startOverButton);
    boardColumn.append(controls);

    const leaderboardEntry = document.createElement('section');
    leaderboardEntry.className = 'leaderboard-entry';

    const leaderboardText = document.createElement('p');
    leaderboardText.append('add score ');

    const leaderboardScore = document.createElement('output');
    leaderboardScore.id = 'leaderboard-score';
    leaderboardScore.textContent = scoreValue.textContent;
    leaderboardText.append(leaderboardScore, ' to leaderboard');

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.placeholder = 'enter name';
    nameInput.setAttribute('aria-label', 'enter name');

    const leaderboardTitle = document.createElement('h2');
    leaderboardTitle.textContent = 'Leaderboard';

    const leaderboardList = document.createElement('ol');
    leaderboardList.className = 'leaderboard-list';

    leaderboardEntry.append(leaderboardText, nameInput);

    const leaderboard = document.createElement('section');
    leaderboard.className = 'leaderboard';
    leaderboard.append(leaderboardTitle, leaderboardList);

    const sidebar = document.createElement('div');
    sidebar.className = 'game-area__sidebar';
    sidebar.append(leaderboardEntry, leaderboard);

    gameArea.append(boardColumn, sidebar);
    main.append(gameArea);
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

function renderBoard(values) {
    const cells = document.querySelectorAll('.game-board__cell');

    cells.forEach((cell, index) => {
        cell.textContent = values[index] === 0 ? '' : String(values[index]);
    });
}

function renderLeaderboard(entries) {
    const list = document.querySelector('.leaderboard-list');
    list.replaceChildren();

    entries.forEach((entry) => {
        const row = document.createElement('li');
        row.className = 'leaderboard-list__row';

        const name = document.createElement('span');
        name.textContent = entry.name;

        const score = document.createElement('span');
        score.textContent = String(entry.score);

        row.append(name, score);
        list.append(row);
    });
}

createAppLayout();
const boardValues = createInitialBoardValues();
renderBoard(boardValues);

const leaderboardEntries = [
    { name: 'player1', score: 2048 },
    { name: 'player2', score: 1024 },
    { name: 'player3', score: 512 },
];
renderLeaderboard(leaderboardEntries);



