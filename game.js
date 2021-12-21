
const btnContainerEl = document.getElementById('buttons');
const tilesContainerEl = document.getElementById('tiles');

const dicePanel = document.querySelector('.last-dice-result');
const notificationPanel = document.querySelector('.notifications');

const player1PointsEl = document.querySelector('.player-1-points');
const player2PointsEl = document.querySelector('.player-2-points');

const moveNumberEl = document.querySelector('.move-number-container');

const newGameEl = document.querySelector('.start-again');

newGameEl.addEventListener('click', (e) => {
    if (e.target.id === "new-game-btn") {
        resetWholeGame();
        newGameEl.classList.remove('activate');
    }
});

let isBtnFirstClick = true;
let playerTurn = 1;
console.log("player: " + playerTurn);

const player1Moves = [];
const player2Moves = [];

const movePoint = 7;
const comboMovePoint = 12;
const deletePoint = 7;

let clickAnywhere = true;
let numOfMadeMoves = 0;
let canMakeMove = true;
let typeOfMove;
let player1Points = 0;
let player2Points = 0;
let enoughPoints = false;
let moveNum = 1;

const winArr = [
    // 1,2,3,4,5
    ['tile-1', 'tile-2', 'tile-3', 'tile-4', 'tile-5'],
    // 6,7,8,9,10
    ['tile-6', 'tile-7', 'tile-8', 'tile-9', 'tile-10'],
    // 11,12,13,14,15,
    ['tile-11', 'tile-12', 'tile-13', 'tile-14', 'tile-15'],
    // 16,17,18,19,20
    ['tile-16', 'tile-17', 'tile-18', 'tile-19', 'tile-20'],
    // 21,22,23,24,25
    ['tile-21', 'tile-22', 'tile-23', 'tile-24', 'tile-25'],

    // 1,6,11,16,21
    ['tile-1', 'tile-6', 'tile-11', 'tile-16', 'tile-21'],
    // 2,7,12,17,22
    ['tile-2', 'tile-7', 'tile-12', 'tile-17', 'tile-22'],
    // 3,8,13,18,23
    ['tile-3', 'tile-8', 'tile-13', 'tile-18', 'tile-23'],
    // 4,9,14,19,24
    ['tile-4', 'tile-9', 'tile-14', 'tile-19', 'tile-24'],
    // 5,10,15,20,25
    ['tile-5', 'tile-10', 'tile-15', 'tile-20', 'tile-25'],

    // 1,7,13,19,25
    ['tile-1', 'tile-7', 'tile-13', 'tile-19', 'tile-25'],
    // 5,9,13,17,21
    ['tile-5', 'tile-9', 'tile-13', 'tile-17', 'tile-21']
]
// const winArr = [
//     // 1,2,3,4
//     ['tile-1', 'tile-2', 'tile-3', 'tile-4'],
//     // 5,6,7,8
//     ['tile-5', 'tile-6', 'tile-7', 'tile-8'],
//     // 9,10,11,12
//     ['tile-9', 'tile-10', 'tile-11', 'tile-12'],
//     // 13,14,15,16
//     ['tile-13', 'tile-14', 'tile-15', 'tile-16'],

//     // 1,5,9,13
//     ['tile-1', 'tile-5', 'tile-9', 'tile-13'],
//     // 2,6,10,14
//     ['tile-2', 'tile-6', 'tile-10', 'tile-14'],
//     // 3,7,11,15
//     ['tile-3', 'tile-7', 'tile-11', 'tile-15'],
//     // 4,8,12,16
//     ['tile-4', 'tile-8', 'tile-12', 'tile-16'],

//     // 1,6,11,16
//     ['tile-1', 'tile-6', 'tile-11', 'tile-16'],
//     // 4,7,10,13
//     ['tile-4', 'tile-7', 'tile-10', 'tile-13'],
// ]
let isWin = false;
let isDraw = false;

player1PointsEl.innerText = `${player1Points} Points`;
player2PointsEl.innerText = `${player2Points} Points`;

// --------------------------------- START Game Launch Functionality --------------------- //
let notificationInterval = setInterval(() => {
    notificationPanel.innerText = '';
    setTimeout(() => {
        notificationPanel.innerText = 'Click Anywhere to start';
    }, 100);
}, 500);

document.addEventListener('click', gameStart);

function gameStart() {
    moveNumberEl.firstElementChild.innerText = "Move: " + moveNum;
    // console.log(moveNumberEl.firstElementChild)
    moveNumberEl.classList.add('display');
    window.clearInterval(notificationInterval);
    notificationPanel.innerText = `Player: ${playerTurn}`;
    diceRoll();
    clickAnywhere = false;
    clickAnywhere === false ? document.removeEventListener('click', gameStart) : null;
    let btns = btnContainerEl.querySelectorAll('.button');
    for (let btn of btns) {
        btn.classList.add('started');
        btn.classList.remove('blurr');
    }
}
// ------------------------------- END Game Launch Functionality ---------------------------- //


// --------------------------
function resetWholeGame() {

    isBtnFirstClick = true;
    playerTurn = 1;
    console.log("player: " + playerTurn);
    player1Moves.length = 0;
    player2Moves.length = 0;
    clickAnywhere = true;
    numOfMadeMoves = 0;
    canMakeMove = true;
    typeOfMove;

    player1Points = 0;
    player2Points = 0;
    player1PointsEl.innerText = `${player1Points} Points`;
    player2PointsEl.innerText = `${player2Points} Points`;

    enoughPoints = false;
    isWin = false;
    isDraw = false;

    document.addEventListener('click', gameStart);

    let btns = btnContainerEl.querySelectorAll('.button');
    for (let btn of btns) {
        btn.classList.remove('started');
        btn.classList.add('blurr');
    }
    btnContainerEl.style.display = 'block';
    for (let tile of tilesContainerEl.querySelectorAll('.tile')) {
        tile.innerText = '';
        tile.style.backgroundColor = 'darkgreen'
    }
    moveNumberEl.classList.remove('display');
    moveNum = 1;
}
// --------------------------





// ------------------------------- START Event Listener For Tiles ----------------------------- //
//  at first clicks on tile are prevented
tilesContainerEl.style.pointerEvents = 'none';


/*
- event listener itself for tiles
- tiles are not clickable until btnHandler() permits it
- tileHandler() func inside will check if player have remaining moves to make
- only after then tile event listener will make adjustments to tiles
*/
tilesContainerEl.addEventListener('click', (e) => {
    tileHandler();
    if (canMakeMove) {
        if (typeOfMove !== 'delete') {
            console.log('tile name: ' + e.target.id);
            if (playerTurn === 1) {
                if (player2Moves.indexOf(e.target.id) === -1 && player1Moves.indexOf(e.target.id) === -1) {
                    player1Moves.push(e.target.id);
                    console.log('player 1 moves: ' + player1Moves)
                    e.target.innerText = 'X';
                } else {
                    numOfMadeMoves--;
                }
            } else {
                if (player2Moves.indexOf(e.target.id) === -1 && player1Moves.indexOf(e.target.id) === -1) {
                    player2Moves.push(e.target.id);
                    console.log('player 2 moves: ' + player2Moves)
                    e.target.innerText = 'O';
                } else {
                    numOfMadeMoves--;
                }
            }
        } else {
            if (playerTurn === 1) {
                let toBeDeleted = player2Moves.indexOf(e.target.id);
                if (toBeDeleted >= 0) {
                    console.log('player 1 deletes: ' + e.target.id);
                    player2Moves.splice(toBeDeleted, 1);
                    console.log("player 2 remaining tiles: " + player2Moves);
                    e.target.innerText = '';
                } else {
                    numOfMadeMoves--;
                }
            } else {
                let toBeDeleted = player1Moves.indexOf(e.target.id);
                if (toBeDeleted >= 0) {
                    console.log('player 2 deletes: ' + e.target.id);
                    player1Moves.splice(toBeDeleted, 1);
                    console.log("player 2 remaining tiles: " + player1Moves);
                    e.target.innerText = '';
                } else {
                    numOfMadeMoves--;
                }
            }
        }
    } else {
        tilesContainerEl.style.pointerEvents = 'none';
    }
});
// ------------------------------- END Event Listener For Tiles ---------------------------- //

// --------------------------- START Event Listener For Buttons ----------------------------- //

btnContainerEl.addEventListener('click', (e) => {
    let clickedBtn = e.target;
    switch (clickedBtn.id) {
        case 'move':
            btnHandler('move');
            break;
        case 'combo-move':
            btnHandler('combo-move');
            break;
        case 'delete':
            btnHandler('delete');
            break;
        case 'next':
            btnHandler('next');
            break;
    }
});
// ----------------------------- END Event Listener For Buttons ----------------------------- //

// -------------------------------- START Utility Functions -------------------------- //

/*
- this function will check if move type button was clicked for the first time
- after first click on particular move type it will open tiles for click
- after second click it will close tiles for input again
- after first click move has to be finished with click on the same button
*/
function btnHandler(btnName) {
    if (isBtnFirstClick) {
        typeOfMove = btnName;
        let sufficentPoints = hasEnoughPoints(btnName);
        if (sufficentPoints) {
            if (btnName === "next") {
                resetCounters();
                return;
            }
            btnContainerEl.querySelectorAll('.button').forEach(function (button) {
                if (button.id !== btnName) {
                    button.classList.add('blurr');
                }
            });
            console.log('first ' + btnName);
            tilesContainerEl.style.pointerEvents = 'auto';
            isBtnFirstClick = false;
        } else {
            document.getElementById(btnName).classList.add('denied');
            setTimeout(() => {
                document.getElementById(btnName).classList.remove('denied');
            }, 400);
        }
    } else {
        if (typeOfMove === btnName) {
            btnContainerEl.querySelectorAll('.button').forEach(function (button) {
                if (button.id !== btnName) {
                    button.classList.remove('blurr');
                }
            });
            console.log('second ' + btnName);
            tilesContainerEl.style.pointerEvents = 'none';


            if (didWin()) {
                newGameEl.classList.add('activate');
                btnContainerEl.style.display = 'none';
                newGameEl.querySelector('h1').innerText = `Player ${playerTurn} won !`
            } else if (isItDraw()) {
                newGameEl.classList.add('activate');
                btnContainerEl.style.display = 'none';
                newGameEl.querySelector('h1').innerText = `It is a Draw !`;
            } else {
                resetCounters();
            }
        }
    }
}

// this function checks number of inputs per turn based on move type
function tileHandler() {
    let n;
    switch (typeOfMove) {
        case 'move':
            n = 1;
            break;
        case 'combo-move':
            n = 2;
            break;
        case 'delete':
            n = 1;
            break;
        case 'next':
            n = 1;
            break;
    }
    numOfMadeMoves++;
    console.log("moves made: " + numOfMadeMoves);
    if (numOfMadeMoves > n) {
        console.log("move : " + numOfMadeMoves + " not registered");
        canMakeMove = false;
    }
}


/*
- checks if player has enough points for move
-  adjusts variable enoughPoints
- if player has enough points for move removes move points from player`s active
- returns true/false
*/
function hasEnoughPoints(clickedBtn) {
    if (playerTurn === 1) {
        switch (clickedBtn) {
            case 'move':
                (player1Points - movePoint) >= 0 ? enoughPoints = true : enoughPoints = false;
                enoughPoints === true ? player1Points -= movePoint : null;
                break;
            case 'combo-move':
                (player1Points - comboMovePoint) >= 0 ? enoughPoints = true : enoughPoints = false;
                enoughPoints === true ? player1Points -= comboMovePoint : null;
                break;
            case 'delete':
                (player1Points - deletePoint) >= 0 ? enoughPoints = true : enoughPoints = false;
                enoughPoints === true ? player1Points -= deletePoint : null;
                break;
            case 'next':
                enoughPoints = true
                break;
        }
        player1PointsEl.innerText = `${player1Points} Points`
    } else {
        switch (clickedBtn) {
            case 'move':
                (player2Points - movePoint) >= 0 ? enoughPoints = true : enoughPoints = false;
                enoughPoints === true ? player2Points -= movePoint : null;
                break;
            case 'combo-move':
                (player2Points - comboMovePoint) >= 0 ? enoughPoints = true : enoughPoints = false;
                enoughPoints === true ? player2Points -= comboMovePoint : null;
                break;
            case 'delete':
                (player2Points - deletePoint) >= 0 ? enoughPoints = true : enoughPoints = false;
                enoughPoints === true ? player2Points -= deletePoint : null;
                break;
            case 'next':
                enoughPoints = true
                break;
        }
        player2PointsEl.innerText = `${player2Points} Points`
    }
    return enoughPoints;
}
// -------------------------------- END Utility Functions -------------------------- //

// -------------------------------- START Resetting Turn -------------------------- //
function resetCounters() {
    isBtnFirstClick = true;
    numOfMadeMoves = 0;
    canMakeMove = true;
    typeOfMove = "";
    switchPlayer();
    enoughPoints = false;
    diceRoll();
}

function switchPlayer() {
    playerTurn === 1 ? playerTurn = 2 : playerTurn = 1;
    console.log("player: " + playerTurn);
    notificationPanel.innerText = `Player: ${playerTurn}`;
    moveNum ++;
    moveNumberEl.firstElementChild.innerText = "Move: " + moveNum;
}

// dice roll function
function diceRoll() {
    let dice1 = Math.floor(Math.random() * 6) + 1;
    let dice2 = Math.floor(Math.random() * 6) + 1;

    let diceSum = 0;
    dice1 === dice2 ? diceSum = 0 : diceSum = dice1 + dice2;

    dicePanel.innerText = `${dice1} : ${dice2}`;

    playerTurn === 1 ? player1Points += diceSum : player2Points += diceSum;
    player1PointsEl.innerText = `${player1Points} Points`;
    player2PointsEl.innerText = `${player2Points} Points`;
}

function didWin() {
    console.log('checking winner');
    for (let i = 0; i < winArr.length; i++) {
        let winCondition = [];
        let playersActiveTiles = [];
        for (let k = 0; k < winArr[i].length; k++) {
            if (playerTurn === 1) {
                if (player1Moves.includes(winArr[i][k])) {
                    console.log(`player 1 has ${winArr[i][k]}: ${player1Moves.includes(winArr[i][k])}`);
                    let isWin = true;
                    winCondition.push(isWin);
                    playersActiveTiles.push(winArr[i][k]);
                } else {
                    let isWin = false;
                    winCondition.push(isWin);
                    playersActiveTiles.length = 0;;
                    break;
                }
            } else {
                if (player2Moves.includes(winArr[i][k])) {
                    console.log(`player 2 has ${winArr[i][k]}: ${player2Moves.includes(winArr[i][k])}`);
                    let isWin = true;
                    winCondition.push(isWin);
                    playersActiveTiles.push(winArr[i][k]);
                } else {
                    let isWin = false;
                    winCondition.push(isWin);
                    playersActiveTiles.length = 0;;
                    break;
                }
            }
        }
        if (winCondition.every((x) => x === true)) {
            console.log(`player ${playerTurn} wins !!!`);
            console.log(playersActiveTiles);

            for (let i = 0; i < playersActiveTiles.length; i++) {
                console.log(playersActiveTiles[i]);
                document.querySelector(`#${playersActiveTiles[i]}`).style.backgroundColor = 'yellowgreen';
            }
            isWin = true;
            break;
        }
    }
    console.log(`did win ? ${isWin}`);
    return isWin;
}

function isItDraw() {
    let allTiles = [...tilesContainerEl.querySelectorAll('.tile')];
    let result = allTiles.every(tile => tile.innerText !== '');
    console.log("is draw: " + result)
    if (result) {
        isDraw = true;
        console.log("is draw: " + result);
    }
    return isDraw;
}
// ------------------------------------- END Resetting Turn ----------------------------- //

// FOR TOMORROW !!!

// - update game navbar style

// - remove any functionality if win/draw notification is up !!