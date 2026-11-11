function mergeRowLeft(row) {
    const tiles = row.filter((value) => value !== 0);
    let score = 0;
    let merged = true;

    while (merged) {
        merged = false;

        for (let i = 0; i < tiles.length - 1; i++) {
            if (tiles[i] === tiles[i + 1]) {
                tiles[i] *= 2;
                score += tiles[i];
                tiles.splice(i + 1, 1);
                merged = true;
                break;
            }
        }
    }

    while (tiles.length < row.length) {
        tiles.push(0);
    }

    return { values: tiles, score };
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

    for (let line = 0; line < size; line++) {
        const positions = [];

        for (let offset = 0; offset < size; offset++) {
            positions.push(horizontal ? line * size + offset : offset * size + line);
        }

        const currentLine = positions.map((position) => values[position]);
        const lineToMerge = reverse ? currentLine.reverse() : currentLine;
        const result = mergeRowLeft(lineToMerge);
        const mergedLine = reverse ? result.values.reverse() : result.values;

        positions.forEach((position, index) => {
            nextValues[position] = mergedLine[index];
        });

        score += result.score;
    }

    const changed = values.some((value, index) => value !== nextValues[index]);
    return { values: nextValues, score, changed };
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
