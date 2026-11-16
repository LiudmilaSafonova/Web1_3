function mergeRowLeft(row) {
    const tiles = row.map((value, index) => ({ value, sources: [index] }))
        .filter((tile) => tile.value !== 0);
    let score = 0;
    let merged = true;

    while (merged) {
        merged = false;

        for (let i = 0; i < tiles.length - 1; i++) {
            if (tiles[i].value === tiles[i + 1].value) {
                tiles[i].value *= 2;
                tiles[i].sources.push(...tiles[i + 1].sources);
                score += tiles[i].value;
                tiles.splice(i + 1, 1);
                merged = true;
                break;
            }
        }
    }

    const sources = tiles.map((tile) => tile.sources);
    const values = tiles.map((tile) => tile.value);

    while (values.length < row.length) {
        values.push(0);
    }

    return { values, score, sources };
}

function moveBoard(values, direction) {
    const directions = ['left', 'right', 'up', 'down'];

    if (!directions.includes(direction)) {
        throw new Error('Unknown move direction');
    }

    const size = 4;
    const nextValues = Array(values.length).fill(0);
    const horizontal = direction === 'left' || direction === 'right';
    const reverse = direction === 'right' || direction === 'down';
    let score = 0;
    const movements = [];
    const mergedPositions = [];

    for (let line = 0; line < size; line++) {
        const positions = [];

        for (let offset = 0; offset < size; offset++) {
            positions.push(horizontal ? line * size + offset : offset * size + line);
        }

        const orientedPositions = reverse ? positions.reverse() : positions;
        const currentLine = orientedPositions.map((position) => values[position]);
        const result = mergeRowLeft(currentLine);

        orientedPositions.forEach((position, index) => {
            nextValues[position] = result.values[index];
        });

        result.sources.forEach((sources, index) => {
            const destination = orientedPositions[index];

            if (sources.length > 1) {
                mergedPositions.push(destination);
            }

            sources.forEach((source) => {
                movements.push({ from: orientedPositions[source], to: destination });
            });
        });

        score += result.score;
    }

    const changed = values.some((value, index) => value !== nextValues[index]);
    return { values: nextValues, score, changed, movements, mergedPositions };
}

function addRandomTiles(values, minCount = 1, maxCount = 2) {
    const nextValues = values.slice();
    const emptyPositions = [];

    nextValues.forEach((value, index) => {
        if (value === 0) {
            emptyPositions.push(index);
        }
    });

    const randomCount = Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;
    const count = Math.min(randomCount, emptyPositions.length);

    for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * emptyPositions.length);
        const position = emptyPositions.splice(randomIndex, 1)[0];
        nextValues[position] = Math.random() < 0.5 ? 2 : 4;
    }

    return nextValues;
}

function isGameOver(values) {
    const size = 4;

    for (let index = 0; index < values.length; index++) {
        if (values[index] === 0) {
            return false;
        }

        const row = Math.floor(index / size);
        const column = index % size;

        if (column < size - 1 && values[index] === values[index + 1]) {
            return false;
        }

        if (row < size - 1 && values[index] === values[index + size]) {
            return false;
        }
    }

    return true;
}
