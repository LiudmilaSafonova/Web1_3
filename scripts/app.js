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
    nameInput.required = true;
    nameInput.maxLength = 30;

    const saveScoreButton = document.createElement('button');
    saveScoreButton.className = 'leaderboard-save';
    saveScoreButton.type = 'button';
    saveScoreButton.textContent = 'Add score';

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

    leaderboardEntry.append(leaderboardText, nameInput, saveScoreButton);

    leaderboardDialog.append(leaderboardHeader, leaderboardColumns, leaderboardList);
    leaderboardButton.addEventListener('click', () => leaderboardDialog.showModal());
    closeButton.addEventListener('click', () => leaderboardDialog.close());
    saveScoreButton.addEventListener('click', () => {
        const name = nameInput.value.trim();

        if (!name) {
            nameInput.value = '';
            nameInput.reportValidity();
            return;
        }

        addScoreToLeaderboard(name, Number(scoreValue.textContent));
        nameInput.value = '';
        leaderboardDialog.showModal();
    });

    boardColumn.append(leaderboardEntry, leaderboardButton);

    gameArea.append(boardColumn);
    main.append(gameArea);
    document.body.append(main, leaderboardDialog);

}

function createInitialBoardValues() {
    return addRandomTiles(Array(16).fill(0), 1, 3);
}

function renderBoard(values) {
    const cells = document.querySelectorAll('.game-board__cell');

    cells.forEach((cell, index) => {
        cell.textContent = values[index] === 0 ? '' : String(values[index]);
    });
}

function renderScore(score) {
    document.getElementById('score').textContent = String(score);
    document.getElementById('leaderboard-score').textContent = String(score);
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

function loadLeaderboard() {
    try {
        const saved = JSON.parse(localStorage.getItem('2048-leaderboard') || '[]');
        return Array.isArray(saved) ? saved : [];
    } catch {
        return [];
    }
}

function addScoreToLeaderboard(name, score) {
    const now = new Date();
    const date = [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, '0'),
        String(now.getDate()).padStart(2, '0'),
    ].join('-');

    leaderboardEntries.push({ name, score, date });
    leaderboardEntries.sort((a, b) => b.score - a.score);
    leaderboardEntries = leaderboardEntries.slice(0, 10);
    localStorage.setItem('2048-leaderboard', JSON.stringify(leaderboardEntries));
    renderLeaderboard(leaderboardEntries);
}

let leaderboardEntries = loadLeaderboard();
createAppLayout();
let boardValues = createInitialBoardValues();
let currentScore = 0;
renderBoard(boardValues);
renderScore(currentScore);
renderLeaderboard(leaderboardEntries);

document.addEventListener('keydown', (event) => {
    const directions = {
        ArrowLeft: 'left',
        ArrowRight: 'right',
        ArrowUp: 'up',
        ArrowDown: 'down',
        KeyA: 'left',
        KeyD: 'right',
        KeyW: 'up',
        KeyS: 'down',
    };
    const direction = directions[event.code] ?? directions[event.key.toLowerCase()];

    if (!direction || event.target.tagName === 'INPUT' || document.querySelector('.leaderboard-dialog').open) {
        return;
    }

    event.preventDefault();
    const result = moveBoard(boardValues, direction);

    if (!result.changed) {
        return;
    }

    boardValues = addRandomTiles(result.values);
    currentScore += result.score;
    renderBoard(boardValues);
    renderScore(currentScore);
});



