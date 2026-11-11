function createAppLayout() {
    const main = document.createElement('main');
    main.className = 'todo-app';

    const header = document.createElement('header');
    header.className = 'game-header';

    const title = document.createElement('h1');
    title.textContent = '2048';

    const score = document.createElement('div');
    score.className = 'game-score';

    const scoreLabel = document.createElement('span');
    scoreLabel.textContent = 'score';

    const scoreValue = document.createElement('output');
    scoreValue.id = 'score';
    scoreValue.textContent = '0';

    score.append(scoreLabel, scoreValue);

    header.append(title, score);

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
    boardColumn.append(header, board);

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

    const leaderboardButton = document.createElement('button');
    leaderboardButton.className = 'leaderboard-open';
    leaderboardButton.type = 'button';
    leaderboardButton.textContent = 'Leaderboard';

    const leaderboardDialog = document.createElement('dialog');
    leaderboardDialog.className = 'leaderboard-dialog';
    leaderboardDialog.setAttribute('aria-labelledby', 'leaderboard-title');

    leaderboardTitle.id = 'leaderboard-title';

    const closeButton = document.createElement('button');
    closeButton.className = 'leaderboard-close';
    closeButton.type = 'button';
    closeButton.textContent = 'Close';

    const leaderboardHeader = document.createElement('div');
    leaderboardHeader.className = 'leaderboard-dialog__header';
    leaderboardHeader.append(leaderboardTitle, closeButton);

    const leaderboardColumns = document.createElement('div');
    leaderboardColumns.className = 'leaderboard-columns';
    leaderboardColumns.append('Name', 'Score', 'Date');

    const leaderboardList = document.createElement('ol');
    leaderboardList.className = 'leaderboard-list';

    leaderboardEntry.append(leaderboardText, nameInput);

    leaderboardDialog.append(leaderboardHeader, leaderboardColumns, leaderboardList);
    leaderboardButton.addEventListener('click', () => leaderboardDialog.showModal());
    closeButton.addEventListener('click', () => leaderboardDialog.close());

    const sidebar = document.createElement('div');
    sidebar.className = 'game-area__sidebar';
    sidebar.append(leaderboardEntry, leaderboardButton);

    gameArea.append(boardColumn, sidebar);
    main.append(gameArea);
    document.body.append(main, leaderboardDialog);

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

        const date = document.createElement('time');
        date.dateTime = entry.date;
        date.textContent = entry.date.split('-').reverse().join('.');

        row.append(name, score, date);
        list.append(row);
    });
}

createAppLayout();
const boardValues = createInitialBoardValues();
renderBoard(boardValues);

const leaderboardEntries = [
    { name: 'player1', score: 2048, date: '2026-11-11' },
    { name: 'player2', score: 1024, date: '2026-11-10' },
    { name: 'player3', score: 512, date: '2026-11-09' },
];
renderLeaderboard(leaderboardEntries);



