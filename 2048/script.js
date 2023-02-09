function getCookie(cookie, key) {
    let index = cookie.indexOf(key);
    if (index === -1) return undefined;
    while (cookie[index] !== '=') {
        index++;
    }
    index++;
    let value = '';
    while (cookie[index] !== ';' && cookie[index] !== undefined) {
        value += cookie[index];
        index++;
    }
    return value;
}

function decodeStorage(gridData) {
    const grid = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ];
    if (!gridData) return grid;
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            const tile =
                gridData[i * grid.length * 2 + j * 2] +
                gridData[i * grid.length * 2 + j * 2 + 1];
            grid[i][j] = 2 ** parseInt(tile, 16);
            grid[i][j] = grid[i][j] === 1 ? 0 : grid[i][j];
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
    if (empty.length === 0) return false;
    const cell = empty[Math.floor(Math.random() * empty.length)];
    grid[cell.i][cell.j] = Math.random() < 0.1 ? 4 : 2;
    return true;
}

// literal fucking magic
// this is confusing af, avoid touching
function slideTiles(grid, dir) {
    const localDir = Math.floor(dir / 2);
    const jStart = -localDir + 2;
    const localDirBalance = 2 * localDir - 1;

    for (let i = 0; i < 4; i++) {
        for (let j = jStart; localDir ? j < 4 : j > -1; j += localDirBalance) {
            for (
                let swap = jStart - localDirBalance;
                localDir ? swap < j : swap > j;
                swap += localDirBalance
            ) {
                if (dir % 2) {
                    if (grid[swap][i] === 0) {
                        grid[swap][i] = grid[j][i];
                        grid[j][i] = 0;
                        break;
                    }
                } else {
                    if (grid[i][swap] === 0) {
                        grid[i][swap] = grid[i][j];
                        grid[i][j] = 0;
                        break;
                    }
                }
            }
        }
    }
}

function mergeTiles(grid, dir) {
    const localDir = Math.floor(dir / 2);
    const jStart = -localDir + 2;
    const localDirBalance = 2 * localDir - 1;

    for (let i = 0; i < 4; i++) {
        for (let j = jStart; localDir ? j < 4 : j > -1; j += localDirBalance) {
            if (dir % 2) {
                if (grid[j - localDirBalance][i] === grid[j][i]) {
                    grid[j - localDirBalance][i] *= 2;
                    grid[j][i] = 0;
                }
            } else {
                if (grid[i][j - localDirBalance] === grid[i][j]) {
                    grid[i][j - localDirBalance] *= 2;
                    grid[i][j] = 0;
                }
            }
        }
    }
}

function render(grid) {
    let txt = '';
    for (let i = 0; i < grid.length; i++) {
        txt += '<div class="row">';
        for (let j = 0; j < grid[i].length; j++) {
            txt += `<div class="cell n${
                grid[i][j] > 2048 ? 'super' : grid[i][j]
            }">${grid[i][j] || ''}</div>`;
        }
        txt += '</div>';
    }
    document.querySelector('#grid').innerHTML = 'hellp world'
}

function tick(action) {
    // const grid = decodeStorage(
    //     getCookie(decodeURIComponent(document.cookie), 'grid')
    // );
    // switch (action) {
    //     case 'continue':
    //         if (grid.flat().every(tile === 1)) {
    //             tick('new');
    //             return;
    //         }
    //         break;
    //     case 'new':
    //         clearGrid(grid);
    //         newTile(grid);
    //         newTile(grid);
    //         break;
    //     case 'right':
    //         slideTiles(grid, 0);
    //         mergeTiles(grid, 0);
    //         slideTiles(grid, 0);
    //         break;
    //     case 'down':
    //         slideTiles(grid, 1);
    //         mergeTiles(grid, 1);
    //         slideTiles(grid, 1);
    //         break;
    //     case 'left':
    //         slideTiles(grid, 2);
    //         mergeTiles(grid, 2);
    //         slideTiles(grid, 2);
    //         break;
    //     case 'up':
    //         slideTiles(grid, 3);
    //         mergeTiles(grid, 3);
    //         slideTiles(grid, 3);
    //         break;
    //     default:
    //         break;
    // }
    // if (['up', 'down', 'left', 'right'].includes(action)) newTile(grid);
    // document.cookie = `grid=${encodeStorage(grid)};expires=${
    //     Date.now() + 24 * 60 * 60 * 1000
    // }`;
    render(grid);
}
