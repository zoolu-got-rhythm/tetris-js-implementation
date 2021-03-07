// import * as Tone from 'tone'

var Tone = require("tone");

// import tetrominoObjectFactory from "./tetrominoShapes";
// tetrominoObjectFactory("")

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

function tetromino2dArrayIteratorForEach(tetrominoShape, fn){
    if(tetrominoShape.length === 9){
        for (var y = 0; y < 3; y++){
            for (var x = 0; x < 3; x++){
                var symbolAtIndex = tetrominoShape[(y * 3) + x];
                fn(x, y, symbolAtIndex);
            }
        }
    }else if(tetrominoShape.length === 12){
        // console.log("square shape");
        for (let y = 0; y < 3; y++){
            for (let x = 0; x < 4; x++){
                let symbolAtIndex = tetrominoShape[(y * 4) + x];
                // console.log("index:")
                // console.log(x + y);
                // console.log("symbol at index:")
                // console.log(symbolAtIndex);
                fn(x, y, symbolAtIndex);
            }
        }
    }else if(tetrominoShape.length === 16){
        // console.log("square shape");
        for (let y = 0; y < 4; y++){
            for (let x = 0; x < 4; x++){
                let symbolAtIndex = tetrominoShape[(y * 4) + x];
                // console.log("index:")
                // console.log(x + y);
                // console.log("symbol at index:")
                // console.log(symbolAtIndex);
                fn(x, y, symbolAtIndex);
            }
        }
    }
}

var availableBlockShapeLetters = ["t", "s", "j", "z", "l", "o", "i"];


var white = "#ffffff";
var lilac = "#cc00ff";
var red = "#fF0000";
// l is orange
var orange = "#ff6600";
// j is blue
var blue = "#0000ff";
// o is yellow
var yellow = "#e6e600";
// i is cyan
var cyan = "#00ffff";



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

var screenWidth = 200;
// add grid w and h params to this draw function
function drawGame(tetrominoShapeArr1d, gameGridStateArr1d, gameGridWidth, xOffSet, yOffSet, canvasCtx,
                  yRowNumbersThatNeedClearing1dArr, lightUpYRowThatNeedsClearing){
    canvasCtx.fillStyle = "#000000";

    // var screenWidth = 280;
    // var blockSize = 200 / 10;
    canvasCtx.fillRect(0,0, screenWidth, (screenWidth / gameGridWidth) * 16);
    var y = 0;

    for (var x = 0; x < 16 * gameGridWidth; x++){

        if(gameGridStateArr1d[x] === "z"){
            colourTetrominoBlock(x, y, canvasCtx, red, gameGridWidth, screenWidth);
        }else if(gameGridStateArr1d[x] === "t"){
            colourTetrominoBlock(x, y, canvasCtx, lilac, gameGridWidth, screenWidth);
        }else if(gameGridStateArr1d[x] === "s") {
            colourTetrominoBlock(x, y, canvasCtx, limeGreen, gameGridWidth, screenWidth);
        }else if(gameGridStateArr1d[x] === "j") {
            colourTetrominoBlock(x, y, canvasCtx, blue, gameGridWidth, screenWidth);
        }else if(gameGridStateArr1d[x] === "l"){
            colourTetrominoBlock(x, y, canvasCtx, orange, gameGridWidth, screenWidth);
        }else if(gameGridStateArr1d[x] === "o"){
            colourTetrominoBlock(x, y, canvasCtx, yellow, gameGridWidth, screenWidth);
        }else if(gameGridStateArr1d[x] === "i"){
            colourTetrominoBlock(x, y, canvasCtx, cyan, gameGridWidth, screenWidth);
        }else if(gameGridStateArr1d[x] === " "){
            // not needed currently with way of colour'd whole grid
        }else if(gameGridStateArr1d[x] === "#"){
            colourTetrominoBlock(x, y, canvasCtx, grey, gameGridWidth, screenWidth);
        }

        if(yRowNumbersThatNeedClearing1dArr){ // if array exists as argument in this function
            if(yRowNumbersThatNeedClearing1dArr.includes(y) ) {
                if (lightUpYRowThatNeedsClearing && ((x) % gameGridWidth != 0 && (x) % gameGridWidth != (gameGridWidth - 1))) {
                    colourTetrominoBlock(x, y, canvasCtx, white, gameGridWidth, screenWidth);
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
            if(symbol === "z"){
                colourTetrominoBlock(xOffSet + xFromCallBack, yOffSetState + yFromCallBack, canvasCtx, red, gameGridWidth, screenWidth);
            }else if(symbol === "t"){
                colourTetrominoBlock(xOffSet + xFromCallBack, yOffSetState + yFromCallBack, canvasCtx, lilac, gameGridWidth, screenWidth);
            }else if(symbol === "s") {
                colourTetrominoBlock(xOffSet + xFromCallBack, yOffSetState + yFromCallBack, canvasCtx, limeGreen, gameGridWidth, screenWidth);
            }else if(symbol === "j") {
                colourTetrominoBlock(xOffSet + xFromCallBack, yOffSetState + yFromCallBack, canvasCtx, blue, gameGridWidth, screenWidth);
            }else if(symbol === "l") {
                colourTetrominoBlock(xOffSet + xFromCallBack, yOffSetState + yFromCallBack, canvasCtx, orange, gameGridWidth, screenWidth);
            }else if(symbol === "o") {
                colourTetrominoBlock(xOffSet + xFromCallBack, yOffSetState + yFromCallBack, canvasCtx, yellow, gameGridWidth, screenWidth);
            }else if(symbol === "i") {
                colourTetrominoBlock(xOffSet + xFromCallBack, yOffSetState + yFromCallBack, canvasCtx, cyan, gameGridWidth, screenWidth);
            }
        // }
    });
}


var container = document.getElementById("container");
var canvas = document.getElementById("tetris");
var ctx = canvas.getContext("2d");

var h2NextPieceElementRef = document.getElementById("next-piece");


// function printGridAsStr(gridArr1d, w){
//     var str = ""
//     for (var i = 0; i < gridArr1d.length; i++){
//         str += gridArr1d[i];
//         if((i+1) % (w) == 0)
//             str += "\n";
//     }
//     return str;
// }


// below function is pure without side-effects
// take current tetromino 1d arr and put on grid, return grid state with tetromino super imposed on it
function updateAndGetGrid(tetrominoShapeArr1d, gameGridStateArr1d, gameGridWidth, xOffSet, yOffSet){
    var gameGridStateArr1dCopy = gameGridStateArr1d.slice();
    tetromino2dArrayIteratorForEach(tetrominoShapeArr1d, function(x, y, symbol){
        let i = gameGridWidth * (yOffSet + y) + xOffSet + x;
        if(availableBlockShapeLetters.includes(symbol))
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

        if((gameGridStateArr1d[i] === "#" || availableBlockShapeLetters.includes(gameGridStateArr1d[i]))
            && availableBlockShapeLetters.includes(symbol)){
            // console.log("match");
            isBlockCollidingWithAnotherSymbol = true;
            // note: an optimisation would be finding a way to exit this looped forEach type callback -
            // as soon as this enclosing if statement is true
        }
    });
    return isBlockCollidingWithAnotherSymbol;
};

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
            if (availableBlockShapeLetters.includes(currentSymbol)){
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


// declare game state vars
var height;
var width;
var gridState;

let tetrominoBlockLettersBuffer;

var rotationNumberState;
var currentTetrominoBlockState;
var xOffSetState;
var yOffSetState;
var gameStartState;

var currentTetrominoBlockWhenRotated;
// var currentTetrominoBlock = tetrominoIBlock;
var gridStateForClearingRowsAnimation;
var clearingRowsAnimation;

var yRowsThatNeedClearingArrState; // held in global state so can be accessed by clearingRowsAnimation, to know which rows to flash
var gameLoopTimerId;
var flashRowsThatNeedToClearAnimationTimerId;


// initialize game state vars
function init(){

    // grid height and width (n of rows and columns squares)
    height = 16;
    width = 12;
    gridState = [];

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

    tetrominoBlockLettersBuffer = new BlockLettersBufferController(availableBlockShapeLetters, 4);
    rotationNumberState = 0;
    currentTetrominoBlockState = tetrominoObjectFactory(tetrominoBlockLettersBuffer.getNextLetter());
    xOffSetState = (width / 2) - 2;
    yOffSetState = 0;
    gameStartState = false;
    clearingRowsAnimation = false;
}

function gameLoop(){
    // read in from player input (maybe a buffer?)
    // update offset x and y with player input

    // if(!clearingRowsAnimation) {
        currentTetrominoBlockWhenRotated = currentTetrominoBlockState.rotate(rotationNumberState);

        yOffSetState++;
        // rotationNumberState++;
        if (isShapeBottomCollidingWithAnotherSymbol(currentTetrominoBlockWhenRotated, gridState, width, xOffSetState, yOffSetState)) {
            // newGridState = prevGridState;

            // gameover
            if(yOffSetState == 1){
                window.clearInterval(gameLoopTimerId);
                drawGameOver();
                init(); // reset game state to initial game state
                return;
            }

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
            currentTetrominoBlockState = tetrominoObjectFactory(tetrominoBlockLettersBuffer.getNextLetter());
            h2NextPieceElementRef.innerText = "next letter = " + tetrominoBlockLettersBuffer.whatsNext().toUpperCase();
            // reset y offset position
            yOffSetState = 0;
            rotationNumberState = 0;
            xOffSetState = (width / 2) - 2;
            // the bottom line isn't needed nessasarily
            currentTetrominoBlockWhenRotated = currentTetrominoBlockState.rotate(rotationNumberState);

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
        gameLoopTimerId = window.setInterval(gameLoop, 1000 / 4);
    }else{
        drawGame(null, gridStateForClearingRowsAnimation, width, xOffSetState, yOffSetState, ctx,
            yRowsThatNeedClearingArrState, shouldFlash);
    }
    shouldFlash = !shouldFlash;
    nOfFlashOnAndOffTicks++;
}


function drawGameOver(){
    ctx.strokeStyle= "white"; //set the color of the stroke line
    ctx.lineWidth = 4;  //define the width of the stroke line
    ctx.fillStyle = "red";
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.strokeText("Game Over", screenWidth/2, ((screenWidth / width) * 16) / 2);
    ctx.fillText("Game Over", screenWidth/2, ((screenWidth / width) * 16) / 2);

    ctx.font = "10px Arial";
    ctx.strokeText("press any key to play again", screenWidth/2, 30 + ((screenWidth / width) * 16) / 2);
    ctx.fillText("press any key to play again", screenWidth/2, 30 + ((screenWidth / width) * 16) / 2);
}

function startGame(){
    // do 1 initial draw of game in init state
    h2NextPieceElementRef.innerText = "next letter = " + tetrominoBlockLettersBuffer.whatsNext().toUpperCase();
    currentTetrominoBlockWhenRotated = currentTetrominoBlockState.rotate(rotationNumberState);
    drawGame(currentTetrominoBlockWhenRotated, gridState, width, xOffSetState, yOffSetState, ctx);
// then start game loop after timeout arg duration
    gameLoopTimerId = window.setInterval(gameLoop, 1000 / 4);
}


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
            currentTetrominoBlockWhenRotated = currentTetrominoBlockState.rotate(rotationNumberState);
            if(isShapeBottomCollidingWithAnotherSymbol(
                currentTetrominoBlockWhenRotated, gridState, width, xOffSetState, yOffSetState)){
                rotationNumberState--;
            }
            var time = Tone.now();
            synth.triggerAttack("A5", time);
            synth.triggerRelease(time + 0.2);
            break;
    }
    currentTetrominoBlockWhenRotated = currentTetrominoBlockWhenRotated = currentTetrominoBlockState.rotate(rotationNumberState);
    drawGame(currentTetrominoBlockWhenRotated, gridState, width, xOffSetState, yOffSetState, ctx);
})


init();
drawGame(null, gridState, width, xOffSetState, yOffSetState, ctx);
