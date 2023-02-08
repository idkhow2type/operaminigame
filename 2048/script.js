function decodeStorage(gridData) {
    const grid = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ];
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            const tile =
                gridData[i * grid.length * 2 + j * 2] +
                gridData[i * grid.length * 2 + j * 2 + 1];
            grid[i][j] = parseInt(tile, 16);
        }
    }
    return grid;
}

function encodeStorage(grid) {
    let data = '';
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            data += (grid[i][j] === 0 ? 0 : Math.log2(grid[i][j]))
                .toString(16)
                .padStart(2, '0');
        }
    }
    return data;
}

function clearGrid(grid) {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            grid[i][j] = 0;
        }
    }
}

function newTile(grid) {
    const empty = [];
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j] === 0) empty.push({ i: i, j: j });
        }
    }
    if (empty.length === 0) return;
    const cell = empty[Math.floor(Math.random() * empty.length)];
    grid[cell.i][cell.j] = Math.random() < 0.1 ? 4 : 2;
}

// literal fucking magic
// this is confusing af, avoid touching
function slideTile(grid, dir) {
    const localDir = Math.floor(dir / 2);
    const jStart = -localDir + 2;
    const localDirBalance = 2 * localDir - 1;

    for (let i = 0; i < 4; i++) {
        for (let j = jStart; localDir ? j < 4 : j > -1; j += localDirBalance) {
            if (dir % 2) {
                if (grid[j - localDirBalance][i] === 0) {
                    grid[j - localDirBalance][i] = grid[j][i];
                    grid[j][i] = 0;
                }
            } else {
                if (grid[i][j - localDirBalance] === 0) {
                    grid[i][j - localDirBalance] = grid[i][j];
                    grid[i][j] = 0;
                }
            }
        }
    }
}

function tick(action) {
    const grid = decodeStorage(window.localStorage.getItem('grid'));
    switch (action) {
        case 'continue':
            if (grid.flat().every(tile === 1)) {
                tick('new');
                return;
            }
            break;
        case 'new':
            clearGrid(grid);
            newTile();
            newTile();
            break;
        case 'up':
            newTile();
            break;
        case 'down':
            newTile();
            break;
        case 'left':
            newTile();
            break;
        case 'right':
            newTile();
            break;
        default:
            break;
    }
    render(grid);
}
