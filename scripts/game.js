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
