var textItems = [
    [null, null, null],
    [null, null, null],
    [null, null, null]
]

function drawMenu() {
    if (!textItems[0][0]) {
        fillTextItems();
    }
    if (menuEnabled) {
        lights();
        for (var y = 0; y < 3; y++) {
            for (var x = 0; x < 3; x++) {
                this.drawMenuItem(x, y);
            }
        }
    }
}

function drawMenuItem(x, y, txt) {
    let gx = gridSize * 0.85;
    let gy = gridSize * 0.85;

    translate(-gx + gx * x, -gy + gy * y, gridSize / 2);
    texture(textItems[x][y]);
    plane(gx, gy);
    translate(gx - gx * x, gy - gy * y, -gridSize / 2);
}

function fillTextItems() {
    const players = ['Human', 'Random', 'MiniMax'];
    for (var y = 0; y < 3; y++) {
        for (var x = 0; x < 3; x++) {
            textItems[x][y] = createGraphics(width, height);
            textItems[x][y].textAlign(CENTER);
            textItems[x][y].textSize(64);
            textItems[x][y].textStyle(BOLD);
            textItems[x][y].background(0, 0, 0, 0);
            textItems[x][y].fill(200, 200, 255, 200);
            textItems[x][y].text(players[x] + '\nvs\n' + players[y], width / 2, height / 3);
        }
    }
}