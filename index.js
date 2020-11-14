// import * as Tone from 'tone'

var Tone = require("tone");

var soundPlayerFallPiece = new Tone.Player("sounds/fall.wav").toDestination();
var soundPlayerLineClear = new Tone.Player("sounds/clear.wav").toDestination();
// soundPlayerLineClear.autostart = true;
soundPlayerLineClear.playbackRate = 0.55;

//create a synth and connect it to the main output (your speakers)

const synth = new Tone.Synth().toDestination();
synth.oscillator.type = "square";
// synth.volume()

//play a middle 'C' for the duration of an 8th note
synth.triggerAttackRelease("C1", "32n");
synth.volume.value = -35;


console.log("sdf");

var tetrominoSBlock = [0,1,0,
                        0,1,1,
                        0,0,1];

var tetrominoJBlock = [0,2,0,
                        0,2,0,
                        2,2,0];

var tetrominoTBlock = [0,3,0,
                        3,3,0,
                        0,3,0];

// var tetrominoIBlock = [0,0,3,0,
//                         0,0,3,0,
//                         0,0,3,0,
//                         0,0,3,0];


function tetromino1dArrToString(arr1d){
    var str = ""
    for (var x = 0; x < 9; x++){
       str += arr1d[x].toString();
       if((x+1) % 3 == 0)
           str += "\n";
    }
    // str += "\n";
    return str;
}

// mapping of tetromino original shape to new degrees of shape via callback
// maybe rename this function to something including word 'map' rename from 1d to 2d
function tetromino2dArrayIteratorCallback(origTetrominoShape, fn){
    var newShape = new Array(16);
    for (var y = 0; y < 3; y++){
        for (var x = 0; x < 3; x++){
            // i = index
            var i = fn(x, y);
            newShape[(y * 3) + x] = origTetrominoShape[i];
        }
    }
    return newShape;
}

function tetromino2dArrayIteratorForEach(tetrominoShape, fn){
    for (var y = 0; y < 3; y++){
        for (var x = 0; x < 3; x++){
            var symbolAtIndex = tetrominoShape[(y * 3) + x];
            fn(x, y, symbolAtIndex);
        }
    }
}


function rotateTetromino(nOfRotatationsNumber, currentTetromino){
    var rotatedTetrominoShape;
    switch (nOfRotatationsNumber % 4){
        case 0:
            return currentTetromino;
        // 90 degrees
        case 1:
            rotatedTetrominoShape = tetromino2dArrayIteratorCallback(currentTetromino, function(x, y){
                return (6 + y) - (x * 3);
            });
            break;
        // 180 degrees
        case 2:
            rotatedTetrominoShape = tetromino2dArrayIteratorCallback(currentTetromino, function(x, y){
                return (8 - x) - (y * 3);
            });
            break;
        // 270 degree
        case 3:
            rotatedTetrominoShape = tetromino2dArrayIteratorCallback(currentTetromino, function(x, y){
                return (2 - y) + (x * 3);
            });
            break;
    }

    return rotatedTetrominoShape;
}

var lightYellow = "#ffffcc";
var lilac = "#cc00ff";
var red = "#fF0000";
var limeGreen = "#00cc00";
var grey = "#aaaaaa"

function colourTetrominoBlock(x, y, canvasCtx, colour, gameGridArrWidth, screenWidth){
    var blockSize = screenWidth / gameGridArrWidth;
    canvasCtx.fillStyle = colour;
    canvasCtx.fillRect((x % gameGridArrWidth) * blockSize, y * blockSize, blockSize, blockSize);
    canvasCtx.fillStyle = pSBC(0.20, colour);
    canvasCtx.fillRect((x % gameGridArrWidth) * blockSize, y * blockSize, blockSize, (blockSize / 5));
    canvasCtx.fillRect((x % gameGridArrWidth) * blockSize, y * blockSize, (blockSize / 5), blockSize);
    canvasCtx.fillStyle = pSBC(-0.20, colour);
    canvasCtx.fillRect((x % gameGridArrWidth) * blockSize, (y * blockSize) + (blockSize - (blockSize / 5)), blockSize, (blockSize / 5));
    canvasCtx.fillRect(((x % gameGridArrWidth) * blockSize) + blockSize - (blockSize / 5), y * blockSize, (blockSize / 5), blockSize);
}

// add grid w and h params to this draw function
function drawGame(tetrominoShapeArr1d, gameGridStateArr1d, gameGridWidth, xOffSet, yOffSet, canvasCtx,
                  yRowNumbersThatNeedClearing1dArr, lightUpYRowThatNeedsClearing){
    canvasCtx.fillStyle = "#000000";

    var screenWidth = 300;
    // var blockSize = 200 / 10;
    canvasCtx.fillRect(0,0, screenWidth, (screenWidth / gameGridWidth) * 16);
    var y = 0;

    for (var x = 0; x < 16 * gameGridWidth; x++){

        if(gameGridStateArr1d[x] == 1){
            colourTetrominoBlock(x, y, canvasCtx, red, gameGridWidth, screenWidth);
        }else if(gameGridStateArr1d[x] == 2){
            colourTetrominoBlock(x, y, canvasCtx, lilac, gameGridWidth, screenWidth);
        }else if(gameGridStateArr1d[x] == 3){
            colourTetrominoBlock(x, y, canvasCtx, limeGreen, gameGridWidth, screenWidth);
        }else if(gameGridStateArr1d[x] == " "){
            // not needed currently with way of colour'd whole grid
        }else if(gameGridStateArr1d[x] == "#"){
            colourTetrominoBlock(x, y, canvasCtx, grey, gameGridWidth, screenWidth);
        }

        if(yRowNumbersThatNeedClearing1dArr){ // if array exists as argument in this function
            if(yRowNumbersThatNeedClearing1dArr.includes(y) ) {
                if (lightUpYRowThatNeedsClearing && ((x) % gameGridWidth != 0 && (x) % gameGridWidth != (gameGridWidth - 1))) {
                    colourTetrominoBlock(x, y, canvasCtx, lightYellow, gameGridWidth, screenWidth);
                    // continue;
                } else if (!lightUpYRowThatNeedsClearing) {
                    // colourTetrominoBlock(x, y, canvasCtx, red);
                }
            }
        }

        if((x+1) % gameGridWidth == 0)
            y++;
    }

    if(tetrominoShapeArr1d == null)
        return;

    // very ineficiient way of doing this: must refactor this
    tetromino2dArrayIteratorForEach(tetrominoShapeArr1d, function(xFromCallBack, yFromCallBack, symbol) {
        // let i = gameGridWidth * (yOffSet + xFromCallBack) + xOffSet + yFromCallBack;
        // if(i == x){
            if(symbol == 1){
                colourTetrominoBlock(xOffSet + xFromCallBack, yOffSetState + yFromCallBack, canvasCtx, red, gameGridWidth, screenWidth);
            }else if(symbol == 2){
                colourTetrominoBlock(xOffSet + xFromCallBack, yOffSetState + yFromCallBack, canvasCtx, lilac, gameGridWidth, screenWidth);
            }else if(symbol == 3) {
                colourTetrominoBlock(xOffSet + xFromCallBack, yOffSetState + yFromCallBack, canvasCtx, limeGreen, gameGridWidth, screenWidth);
            }
        // }
    });
}


var container = document.getElementById("container");
var canvas = document.getElementById("tetris");
var ctx = canvas.getContext("2d");
// var tetrominoBlocks = [tetrominoIBlock, tetrominoSBlock, tetrominoJBlock];
//
// canvasesForBlocks = tetrominoBlocks.map(function(tetrominoBlock){
//     // var blockContainer = document.createElement("div");
//
//     var canvas = document.createElement("canvas");
//     var ctx = canvas.getContext("2d");
//     canvas.className = "tetromino-block";
//     canvas.width = 100;
//     canvas.height = 100;
//     canvas.style.marginRight = "5px";
//
//     var referencesObj = {ctx: ctx, canvas: canvas};
//     return referencesObj;
// });
// var canvas = document.getElementById("tetromino-block");
// var ctx = canvas.getContext("2d");
var tetrominoBlocks = [tetrominoSBlock, tetrominoJBlock, tetrominoTBlock];

// canvasesForBlocks.forEach(function(canvasObjRef){
//     container.append(canvasObjRef.canvas);
// });


// var rotation = 0;
// var currentStateOfRotatedTetrominoBlockArr;
// var tid = window.setInterval(function (){
//     canvasesForBlocks.forEach(function(canvasObjRef, i){
//         var currentTetrominoBlockArr = tetrominoBlocks[i];
//         // console.log(currentTetrominoBlockArr);
//         var currentStateOfRotatedTetrominoBlockArr = rotateTetromino(rotation, currentTetrominoBlockArr);
//         drawTetrominoBlockToCanvas(currentStateOfRotatedTetrominoBlockArr, canvasObjRef.ctx);
//     });
//     // container.innerText = tetromino1dArrToString(currentStateOfRotatedTetrominoBlockArr);
//     rotation++;
// }, 500 / 2);

function printGridAsStr(gridArr1d, w){
    var str = ""
    for (var i = 0; i < gridArr1d.length; i++){
        str += gridArr1d[i];
        if((i+1) % (w) == 0)
            str += "\n";
    }
    return str;
}


// below function is pure without side-effects
// take current tetromino 1d arr and put on grid, return grid state with tetromino super imposed on it
function updateAndGetGrid(tetrominoShapeArr1d, gameGridStateArr1d, gameGridWidth, xOffSet, yOffSet){
    var gameGridStateArr1dCopy = gameGridStateArr1d.slice();
    tetromino2dArrayIteratorForEach(tetrominoShapeArr1d, function(x, y, symbol){
        let i = gameGridWidth * (yOffSet + y) + xOffSet + x;
        if(symbol > 0)
            gameGridStateArr1dCopy[i] = symbol;
    });
    // return new game grid state 1d arr
    return gameGridStateArr1dCopy;
}


// boundary and wall mean same thing = "#" symbol on grid
function isShapeBottomCollidingWithAnotherSymbol(tetrominoShapeArr1d, gameGridStateArr1d, gameGridWidth, xOffSet, yOffSet){
    var isBlockCollidingWithAnotherSymbol = false;
    tetromino2dArrayIteratorForEach(tetrominoShapeArr1d, function(x, y, symbol){
        let i = gameGridWidth * (yOffSet + y) + xOffSet + x;
        // console.log(i);
        // if(y == 1){
        //     console.log("pos: " + (y * 4 + x));
        //     console.log(gameGridStateArr1d[i])
        //     console.log(symbol);
        // }

        if((gameGridStateArr1d[i] === "#" || gameGridStateArr1d[i] > 0) && symbol > 0){
            // console.log("match");
            isBlockCollidingWithAnotherSymbol = true;
            // note: an optimisation would be finding a way to exit this looped forEach type callback -
            // as soon as this enclosing if statement is true
        }
    });
    return isBlockCollidingWithAnotherSymbol;
};

// function isShapeSidesCollidingWithAnotherSymbol(tetrominoShapeArr1d, gameGridStateArr1d, gameGridWidth, xOffSet, yOffSet){
//     var isBlockCollidingWithAnotherSymbol = false;
//     tetromino2dArrayIteratorForEach(tetrominoShapeArr1d, function(x, y, symbol){
//         let i = gameGridWidth * (yOffSet + y) + xOffSet + x;
//         // console.log(i);
//         // if(y == 1){
//         //     console.log("pos: " + (y * 4 + x));
//         //     console.log(gameGridStateArr1d[i])
//         //     console.log(symbol);
//         // }
//
//         if((gameGridStateArr1d[i] === "#" && (x == 0 || y == 9) || gameGridStateArr1d[i] > 0) && symbol > 0){
//             // console.log("match");
//             isBlockCollidingWithAnotherSymbol = true;
//             // note: an optimisation would be finding a way to exit this looped forEach type callback -
//             // as soon as this enclosing if statement is true
//         }
//     });
//     return isBlockCollidingWithAnotherSymbol;
// };

// var newGridState = updateAndGetGrid(currentTetrominoBlock, grid, width, xOffSet, yOffSet);
// console.log(printGridAsStr(newGridState, width));

function getYRowNumbersThatNeedClearing(gridStateArr1d, gridWidth, gridHeight){
    var arrayOfYLineIndicies = [];
    var nOfSymbolsOnLine = 0;
    for(var y = gridHeight - 2; y >= 0; y--){ // account for wall sides
        for(var x = gridWidth - 2; x > 0; x--){ // account for wall sides
            // console.log(y + x)
            var currentSymbol = gridStateArr1d[y * gridWidth + x];
            // if(y === 14){
            //     console.log(gridStateArr1d[y * gridWidth + x]);
            // }
            if (typeof currentSymbol !== "string" && currentSymbol > 0){
                nOfSymbolsOnLine++;
                // console.log(gridStateArr1d[y  x]);
                if(nOfSymbolsOnLine == gridWidth - 2)
                    arrayOfYLineIndicies.push(y);
            }
        }
        nOfSymbolsOnLine = 0;
    }
    return arrayOfYLineIndicies;
}

function clearRowsOnGridArr1dByYNumbers(arrOfYNumbers, gridStateArr1d, gridWidth){
    var gridStateArdd1dCopy = gridStateArr1d.slice();
    console.log(gridStateArdd1dCopy);
    arrOfYNumbers.forEach((yNumber)=>{
        console.log("spliced");
        console.log(gridStateArdd1dCopy.splice(yNumber * gridWidth, gridWidth));


        console.log(gridStateArdd1dCopy);
    });

    var newEmptyRow = []
    for(var j = 0; j < arrOfYNumbers.length; j++)
        for(var i = 0; i < gridWidth; i++){
            if(i == 0 || i == gridWidth - 1){
                newEmptyRow.push("#");
            }else{
                newEmptyRow.push("");
            }

        }
    console.log(newEmptyRow);
    gridStateArdd1dCopy = newEmptyRow.concat(gridStateArdd1dCopy);

    return gridStateArdd1dCopy;
}






// init game state vars
// grid height and width
var height = 16;
var width = 12;
var gridState = [];
{
    for(let y = 0; y < height; y++){
        for(let x = 0; x < width; x++){
            // inset outside wall cells
            if(x == 0 || x == width - 1 || y == height - 1){
                gridState.push("#");
                // fill empty cells
            }else{
                // console.log("#");
                gridState.push(" ");
            }
        }
    }
}

var rotationNumberState = 0;
var currentTetrominoBlockState = tetrominoSBlock;
var xOffSetState = (width / 2) - 2;
var yOffSetState = 0;
var gameStartState = false;

var currentTetrominoBlockWhenRotated;
// var currentTetrominoBlock = tetrominoIBlock;
var gridStateForClearingRowsAnimation;
var clearingRowsAnimation = false;

var yRowsThatNeedClearingArrState; // held in global state so can be accessed by clearingRowsAnimation, to know which rows to flash
var gameLoopTimerId;
var flashRowsThatNeedToClearAnimationTimerId;

function gameLoop(){
    // read in from player input (maybe a buffer?)
    // update offset x and y with player input

    // if(!clearingRowsAnimation) {
        currentTetrominoBlockWhenRotated = rotateTetromino(rotationNumberState, currentTetrominoBlockState);

        yOffSetState++;
        // rotationNumberState++;
        if (isShapeBottomCollidingWithAnotherSymbol(currentTetrominoBlockWhenRotated, gridState, width, xOffSetState, yOffSetState)) {
            // newGridState = prevGridState;
            yOffSetState--;
            // rotationNumberState--;
            var newGridState =
                updateAndGetGrid(currentTetrominoBlockWhenRotated, gridState, width, xOffSetState, yOffSetState);
            gridState = newGridState

            console.log("check lines");
            yRowsThatNeedClearingArrState = getYRowNumbersThatNeedClearing(gridState, width, height);
            if (yRowsThatNeedClearingArrState.length > 0) { // if condition pass we have rows that need clearing
                // alert("match");
                console.log(yRowsThatNeedClearingArrState);

                clearingRowsAnimation = true;
                gridStateForClearingRowsAnimation = gridState;
                gridState = clearRowsOnGridArr1dByYNumbers(yRowsThatNeedClearingArrState, gridState, width);
                soundPlayerLineClear.start(0, 0.15);

                // y row index number
            }

            // assign new random tetromino block
            currentTetrominoBlockState = [tetrominoTBlock, tetrominoSBlock, tetrominoJBlock][Math.floor(Math.random() * 3)];
            // reset y offset position
            yOffSetState = 0;
            xOffSetState = (width / 2) - 2;
            currentTetrominoBlockWhenRotated = rotateTetromino(rotationNumberState, currentTetrominoBlockState);

            // if(row of blocks)
            // eleminate row of blocks on that row

            // rotationNumberState = 0;
            // Tone.loaded().then(() => {
            if(!clearingRowsAnimation)
                soundPlayerFallPiece.start(0, 0.11);
            // });
        }else{
            // synth.triggerAttackRelease("C5", "64n");
        }

        // console.log(tetromino1dArrToString(currentTetrominoBlockWhenRotated));
    // }

    if(!clearingRowsAnimation){
        drawGame(currentTetrominoBlockWhenRotated, gridState, width, xOffSetState, yOffSetState, ctx);
    }else{
        // draw animation to remove rows
        window.clearInterval(gameLoopTimerId);
        drawGame(null, gridStateForClearingRowsAnimation, width, xOffSetState, yOffSetState, ctx, yRowsThatNeedClearingArrState, true);
        flashRowsThatNeedToClearAnimationTimerId = window.setInterval(drawRowsThatNeedClearingAsFlash, 1000 / 8)
    }
}

var shouldFlash = false;
var nOfFlashOnAndOffTicks = 0;
function drawRowsThatNeedClearingAsFlash(){
    if(nOfFlashOnAndOffTicks == 10){
        window.clearInterval(flashRowsThatNeedToClearAnimationTimerId);
        shouldFlash = false;
        nOfFlashOnAndOffTicks = 0;
        clearingRowsAnimation = false;
        drawGame(currentTetrominoBlockWhenRotated, gridState, width, xOffSetState, yOffSetState, ctx);
        gameLoopTimerId = window.setInterval(gameLoop, 1000 / 2);
    }else{
        drawGame(null, gridStateForClearingRowsAnimation, width, xOffSetState, yOffSetState, ctx,
            yRowsThatNeedClearingArrState, shouldFlash);
    }
    shouldFlash = !shouldFlash;
    nOfFlashOnAndOffTicks++;
}

function startGame(){
    // do 1 initial draw of game in init state
    currentTetrominoBlockWhenRotated = rotateTetromino(rotationNumberState, currentTetrominoBlockState);
    drawGame(currentTetrominoBlockWhenRotated, gridState, width, xOffSetState, yOffSetState, ctx);
// then start game loop after timeout arg duration
    gameLoopTimerId = window.setInterval(gameLoop, 1000 / 2);
}



// var newGridState =
//     updateAndGetGrid(currentTetrominoBlockState, grid, width, xOffSetState, yOffSetState);
//
// isShapeBottomCollidingWithAnotherSymbol()



// console.log(printGridAsStr(newGridState, width));
// drawGridToCanvas(newGridState, ctx);

window.addEventListener("keydown", async function(e){

    if(clearingRowsAnimation)
        return;

    var keyString = e.code;
    console.log(keyString);

    if(!gameStartState){
        // Tone.start() has be called from within a user event listener callback
        await Tone.start();
        console.log('audio is ready');

        gameStartState = true;
        startGame();
        return;
    }

    switch (keyString) {
        case "ArrowLeft" :
            xOffSetState--;
            if(isShapeBottomCollidingWithAnotherSymbol(
                currentTetrominoBlockWhenRotated, gridState, width, xOffSetState, yOffSetState)){
                xOffSetState++;
            }
            var time = Tone.now();
            synth.triggerAttack("C6", time);
            synth.triggerRelease(time + 0.2);
            break;
        case "ArrowRight" :
            xOffSetState++;
            if(isShapeBottomCollidingWithAnotherSymbol(
                currentTetrominoBlockWhenRotated, gridState, width, xOffSetState, yOffSetState)){
                xOffSetState--;
            }
            var time = Tone.now();
            synth.triggerAttack("C6", time);
            synth.triggerRelease(time + 0.2);
            break;
        case "ArrowUp" :
            rotationNumberState++;
            currentTetrominoBlockWhenRotated = rotateTetromino(rotationNumberState, currentTetrominoBlockState);
            if(isShapeBottomCollidingWithAnotherSymbol(
                currentTetrominoBlockWhenRotated, gridState, width, xOffSetState, yOffSetState)){
                rotationNumberState--;
            }
            var time = Tone.now();
            synth.triggerAttack("A5", time);
            synth.triggerRelease(time + 0.2);
            break;
    }
    currentTetrominoBlockWhenRotated = rotateTetromino(rotationNumberState, currentTetrominoBlockState);
    drawGame(currentTetrominoBlockWhenRotated, gridState, width, xOffSetState, yOffSetState, ctx);
})