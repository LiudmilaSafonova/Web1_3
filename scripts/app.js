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
    backButton.id = 'back-button';
    backButton.textContent = 'back';
    backButton.disabled = true;
    backButton.addEventListener('click', undoLastMove);

    const startOverButton = document.createElement('button');
    startOverButton.type = 'button';
    startOverButton.textContent = 'start over';
    startOverButton.addEventListener('click', startNewGame);

    controls.append(backButton, startOverButton);
    boardColumn.append(controls);

    const leaderboardEntry = document.createElement('section');
    leaderboardEntry.className = 'leaderboard-entry';
    leaderboardEntry.id = 'leaderboard-entry';
    leaderboardEntry.hidden = true;

    const leaderboardText = document.createElement('p');
    leaderboardText.className = 'leaderboard-entry__prompt';
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

    const savedMessage = document.createElement('p');
    savedMessage.className = 'leaderboard-entry__saved';
    savedMessage.textContent = 'Your score is saved';
    savedMessage.hidden = true;

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

    leaderboardEntry.append(leaderboardText, nameInput, saveScoreButton, savedMessage);

    leaderboardDialog.append(leaderboardHeader, leaderboardColumns, leaderboardList);
    leaderboardButton.addEventListener('click', () => leaderboardDialog.showModal());
    closeButton.addEventListener('click', () => leaderboardDialog.close());
    saveScoreButton.addEventListener('click', () => {
        if (!gameIsOver || resultSaved) {
            return;
        }

        const name = nameInput.value.trim();

        if (!name) {
            nameInput.value = '';
            nameInput.reportValidity();
            return;
        }

        addScoreToLeaderboard(name, Number(scoreValue.textContent));
        nameInput.value = '';
        resultSaved = true;
        saveGameState();
        updateLeaderboardEntry();
        leaderboardDialog.showModal();
    });

    boardColumn.append(leaderboardEntry, leaderboardButton);

    gameArea.append(boardColumn);
    main.append(gameArea);

    const gameOverDialog = document.createElement('dialog');
    gameOverDialog.className = 'game-over-dialog';
    gameOverDialog.setAttribute('aria-labelledby', 'game-over-title');

    const gameOverTitle = document.createElement('h2');
    gameOverTitle.id = 'game-over-title';
    gameOverTitle.textContent = 'Game over';

    const finalScoreText = document.createElement('p');
    finalScoreText.append('Final score: ');

    const finalScore = document.createElement('output');
    finalScore.id = 'final-score';
    finalScoreText.append(finalScore);

    const addResultButton = document.createElement('button');
    addResultButton.id = 'game-over-add-result';
    addResultButton.type = 'button';
    addResultButton.textContent = 'Add result to leaderboard';
    addResultButton.addEventListener('click', () => {
        gameOverDialog.close();
        nameInput.focus();
    });

    const gameOverClose = document.createElement('button');
    gameOverClose.type = 'button';
    gameOverClose.textContent = 'Close';
    gameOverClose.addEventListener('click', () => gameOverDialog.close());

    const gameOverRestart = document.createElement('button');
    gameOverRestart.type = 'button';
    gameOverRestart.textContent = 'Start over';
    gameOverRestart.addEventListener('click', startNewGame);

    const gameOverActions = document.createElement('div');
    gameOverActions.className = 'game-over-dialog__actions';
    gameOverActions.append(addResultButton, gameOverClose, gameOverRestart);

    gameOverDialog.append(gameOverTitle, finalScoreText, gameOverActions);
    document.body.append(main, leaderboardDialog, gameOverDialog);

}

function createInitialBoardValues() {
    return addRandomTiles(Array(16).fill(0), 1, 3);
}

function renderBoard(values) {
    const cells = document.querySelectorAll('.game-board__cell');

    cells.forEach((cell, index) => {
        const value = values[index];
        cell.textContent = value === 0 ? '' : String(value);

        if (value === 0) {
            delete cell.dataset.value;
        } else {
            cell.dataset.value = String(value);
        }
    });
}

function animateBoardMove(result, spawnedPositions, speed = 1) {
    const board = document.querySelector('.game-board');
    const cells = Array.from(board.querySelectorAll('.game-board__cell'));

    if (speed <= 1 / 290 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        renderBoard(boardValues);
        return Promise.resolve();
    }

    const rectangles = cells.map((cell) => cell.getBoundingClientRect());
    const ghosts = result.movements.map(({ from, to }) => {
        const originalCell = cells[from];
        const originalStyle = window.getComputedStyle(originalCell);
        const ghost = document.createElement('div');
        const source = rectangles[from];
        const target = rectangles[to];
        ghost.className = 'moving-tile';
        ghost.textContent = originalCell.textContent;
        ghost.style.backgroundColor = originalStyle.backgroundColor;
        ghost.style.color = originalStyle.color;
        ghost.style.fontSize = originalStyle.fontSize;
        ghost.style.fontWeight = originalStyle.fontWeight;
        ghost.style.left = `${source.left}px`;
        ghost.style.top = `${source.top}px`;
        ghost.style.width = `${source.width}px`;
        ghost.style.height = `${source.height}px`;
        document.body.append(ghost);

        return {
            element: ghost,
            deltaX: target.left - source.left,
            deltaY: target.top - source.top,
        };
    });

    board.classList.add('game-board--animating');
    renderBoard(boardValues);

    const movements = ghosts.map(({ element, deltaX, deltaY }) => element.animate([
        { transform: 'translate(0, 0)' },
        { transform: `translate(${deltaX}px, ${deltaY}px)` },
    ], { duration: 160 * speed, easing: 'ease-in-out', fill: 'forwards' }));

    return Promise.all(movements.map((animation) => animation.finished)).then(() => {
        ghosts.forEach(({ element }) => element.remove());
        board.classList.remove('game-board--animating');

        const pulses = [];
        result.mergedPositions.forEach((index) => {
            pulses.push(cells[index].animate([
                { transform: 'scale(1.15)' },
                { transform: 'scale(1)' },
            ], { duration: 130 * speed, easing: 'ease-out' }));
        });

        spawnedPositions.forEach((index) => {
            pulses.push(cells[index].animate([
                { transform: 'scale(0.65)', opacity: 0 },
                { transform: 'scale(1)', opacity: 1 },
            ], { duration: 130 * speed, easing: 'ease-out' }));
        });

        return Promise.all(pulses.map((animation) => animation.finished));
    });
}

function renderScore(score) {
    document.getElementById('score').textContent = String(score);
    document.getElementById('leaderboard-score').textContent = String(score);
}

function updateLeaderboardEntry() {
    const entry = document.getElementById('leaderboard-entry');
    entry.hidden = !gameIsOver;
    entry.querySelector('.leaderboard-entry__prompt').hidden = resultSaved;
    entry.querySelector('input').hidden = resultSaved;
    entry.querySelector('.leaderboard-save').hidden = resultSaved;
    entry.querySelector('.leaderboard-entry__saved').hidden = !resultSaved;
    document.getElementById('game-over-add-result').disabled = resultSaved;
}

function startNewGame() {
    if (isAnimating) {
        return;
    }

    boardValues = createInitialBoardValues();
    currentScore = 0;
    gameIsOver = false;
    resultSaved = false;
    previousState = null;
    saveGameState();
    document.getElementById('back-button').disabled = true;
    renderBoard(boardValues);
    renderScore(currentScore);
    updateLeaderboardEntry();

    const gameOverDialog = document.querySelector('.game-over-dialog');
    if (gameOverDialog.open) {
        gameOverDialog.close();
    }
}

function undoLastMove() {
    if (isAnimating || gameIsOver || previousState === null) {
        return;
    }

    boardValues = previousState.values;
    currentScore = previousState.score;
    previousState = null;
    saveGameState();
    document.getElementById('back-button').disabled = true;
    renderBoard(boardValues);
    renderScore(currentScore);
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
        return Array.isArray(saved)
            ? saved.sort((a, b) => b.score - a.score).slice(0, 10)
            : [];
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

function loadGameState() {
    const saved = localStorage.getItem('2048-game');
    return saved ? JSON.parse(saved) : null;
}

function saveGameState() {
    localStorage.setItem('2048-game', JSON.stringify({
        values: boardValues,
        score: currentScore,
        gameIsOver,
        resultSaved,
        previousState,
    }));
}

let leaderboardEntries = loadLeaderboard();
localStorage.setItem('2048-leaderboard', JSON.stringify(leaderboardEntries));
createAppLayout();
const savedGame = loadGameState();
let boardValues = savedGame?.values ?? createInitialBoardValues();
let currentScore = savedGame?.score ?? 0;
let gameIsOver = savedGame?.gameIsOver ?? false;
let resultSaved = savedGame?.resultSaved ?? false;
let previousState = savedGame?.previousState ?? null;
let isAnimating = false;
renderBoard(boardValues);
renderScore(currentScore);
renderLeaderboard(leaderboardEntries);
updateLeaderboardEntry();
document.getElementById('back-button').disabled = gameIsOver || previousState === null;
saveGameState();

if (gameIsOver) {
    document.getElementById('final-score').textContent = String(currentScore);
    document.querySelector('.game-over-dialog').showModal();
}

function handleMove(direction, speed = 1) {
    if (isAnimating || gameIsOver || document.querySelector('dialog[open]')) {
        return;
    }

    const result = moveBoard(boardValues, direction);

    if (!result.changed) {
        return;
    }

    previousState = { values: boardValues.slice(), score: currentScore };
    document.getElementById('back-button').disabled = false;
    boardValues = addRandomTiles(result.values);
    const spawnedPositions = boardValues.flatMap((value, index) =>
        result.values[index] === 0 && value !== 0 ? [index] : []);
    currentScore += result.score;
    renderScore(currentScore);

    if (isGameOver(boardValues)) {
        gameIsOver = true;
        updateLeaderboardEntry();
        document.getElementById('back-button').disabled = true;
        document.getElementById('final-score').textContent = String(currentScore);
    }

    saveGameState();
    isAnimating = true;
    animateBoardMove(result, spawnedPositions, speed).then(() => {
        isAnimating = false;

        if (gameIsOver) {
            document.querySelector('.game-over-dialog').showModal();
        }
    });
}

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

    if (!direction || gameIsOver || event.target.tagName === 'INPUT' || document.querySelector('dialog[open]')) {
        return;
    }

    event.preventDefault();
    handleMove(direction, 0.4);
});

const board = document.querySelector('.game-board');
let touchStart = null;

board.addEventListener('touchstart', (event) => {
    if (event.touches.length !== 1) {
        touchStart = null;
        return;
    }

    touchStart = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
    };
}, { passive: true });

board.addEventListener('touchend', (event) => {
    if (touchStart === null || event.changedTouches.length !== 1) {
        return;
    }

    const deltaX = event.changedTouches[0].clientX - touchStart.x;
    const deltaY = event.changedTouches[0].clientY - touchStart.y;
    touchStart = null;

    if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < 30) {
        return;
    }

    const direction = Math.abs(deltaX) > Math.abs(deltaY)
        ? (deltaX > 0 ? 'right' : 'left')
        : (deltaY > 0 ? 'down' : 'up');

    handleMove(direction, 0.4);
});

board.addEventListener('touchcancel', () => {
    touchStart = null;
});



