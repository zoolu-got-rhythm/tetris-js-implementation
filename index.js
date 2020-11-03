

var tetrominoSBlock = [0,1,0,0,
                        0,1,1,0,
                        0,0,1,0,
                        0,0,0,0];

var tetrominoJBlock = [0,0,2,0,
                        0,0,2,0,
                        0,2,2,0,
                        0,0,0,0];

var tetrominoIBlock = [0,0,3,0,
                        0,0,3,0,
                        0,0,3,0,
                        0,0,3,0];


function tetromino1dArrToString(arr1d){
    var str = ""
    for (var x = 0; x < 16; x++){
       str += arr1d[x].toString();
       if((x+1) % 4 == 0 && x+1 != 16)
           str += "\n";
    }
    // str += "\n";
    return str;
}

// mapping of tetromino original shape to new degrees of shape via callback
// maybe rename this function to something including word 'map' rename from 1d to 2d
function tetromino2dArrayIteratorCallback(origTetrominoShape, fn){
    var newShape = new Array(16);
    for (var y = 0; y < 4; y++){
        for (var x = 0; x < 4; x++){
            // i = index
            var i = fn(x, y);
            newShape[(y * 4) + x] = origTetrominoShape[i];
        }
    }
    return newShape;
}

function tetromino2dArrayIteratorForEach(tetrominoShape, fn){
    for (var y = 0; y < 4; y++){
        for (var x = 0; x < 4; x++){
            var symbolAtIndex = tetrominoShape[(y * 4) + x];
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
                return (12 + y) - (x * 4);
            });
            break;
        // 180 degrees
        case 2:
            rotatedTetrominoShape = tetromino2dArrayIteratorCallback(currentTetromino, function(x, y){
                return (15 - x) - (y * 4);
            });
            break;
        // 270 degree
        case 3:
            rotatedTetrominoShape = tetromino2dArrayIteratorCallback(currentTetromino, function(x, y){
                return (3 - y) + (x * 4);
            });
            break;
    }

    return rotatedTetrominoShape;
}
var lilac = "#cc00ff";
var red = "#fF0000";
var limeGreen = "#00cc00";

function colourTetrominoBlock(x, y, canvasCtx, colour){
    var blockSize = 20;
    canvasCtx.fillStyle = colour;
    canvasCtx.fillRect((x % 10) * blockSize, y * blockSize, blockSize, blockSize);
    canvasCtx.fillStyle = pSBC(0.10, colour);
    canvasCtx.fillRect((x % 10) * blockSize, y * blockSize, blockSize, 4);
    canvasCtx.fillRect((x % 10) * blockSize, y * blockSize, 4, blockSize);
    canvasCtx.fillStyle = pSBC(-0.20, colour);
    canvasCtx.fillRect((x % 10) * blockSize, (y * blockSize) + (blockSize - 4), blockSize, 4);
    canvasCtx.fillRect(((x % 10) * blockSize) + blockSize - 4, y * blockSize, 4, blockSize);
}

// add grid w and h params to this draw function
function drawGame(tetrominoShapeArr1d, gameGridStateArr1d, gameGridWidth, xOffSet, yOffSet, canvasCtx){




    canvasCtx.fillStyle = "#000000";

    var blockSize = 20;
    canvasCtx.fillRect(0,0, 200, 320);
    var y = 0;
    for (var x = 0; x < 10 * 16; x++){
        if(gameGridStateArr1d[x] == 1){
            colourTetrominoBlock(x, y, canvasCtx, red);
        }else if(gameGridStateArr1d[x] == 2){
            colourTetrominoBlock(x, y, canvasCtx, lilac);
        }else if(gameGridStateArr1d[x] == 3){
            colourTetrominoBlock(x, y, canvasCtx, limeGreen);
        }else if(gameGridStateArr1d[x] == " "){
            // not needed currently with way of colour'd whole grid
        }else if(gameGridStateArr1d[x] == "#"){
            canvasCtx.fillStyle = "#1238ee";
            canvasCtx.fillRect((x % 10) * blockSize, y * blockSize, 20, 20);
        }



        if((x+1) % 10 == 0)
            y++;
    }

    // very ineficiient way of doing this: must refactor this
    tetromino2dArrayIteratorForEach(tetrominoShapeArr1d, function(xFromCallBack, yFromCallBack, symbol) {
        let i = gameGridWidth * (yOffSet + xFromCallBack) + xOffSet + yFromCallBack;
        if(i = x){
            if(symbol == 1){
                colourTetrominoBlock(xOffSet + xFromCallBack, yOffSetState + yFromCallBack, canvasCtx, red);
            }else if(symbol == 2){
                colourTetrominoBlock(xOffSet + xFromCallBack, yOffSetState + yFromCallBack, canvasCtx, lilac);
            }else if(symbol == 3) {
                colourTetrominoBlock(xOffSet + xFromCallBack, yOffSetState + yFromCallBack, canvasCtx, limeGreen);
            }
        }
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
            console.log("match");
            isBlockCollidingWithAnotherSymbol = true;
            // note: an optimisation would be finding a way to exit this looped forEach type callback -
            // as soon as this enclosing if statement is true
        }
    });
    return isBlockCollidingWithAnotherSymbol;
};

// var newGridState = updateAndGetGrid(currentTetrominoBlock, grid, width, xOffSet, yOffSet);
// console.log(printGridAsStr(newGridState, width));







// init game state vars
// grid height and width
height = 16;
width = 10;
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
// var currentTetrominoBlock = tetrominoIBlock;

function gameLoop(){
    // read in from player input (maybe a buffer?)
    // update offset x and y with player input


    var currentTetrominoBlockWhenRotated = rotateTetromino(rotationNumberState, currentTetrominoBlockState);
    console.log(tetromino1dArrToString(currentTetrominoBlockWhenRotated));

    yOffSetState++;
    // rotationNumberState++;
    if(isShapeBottomCollidingWithAnotherSymbol(currentTetrominoBlockWhenRotated, gridState, width, xOffSetState, yOffSetState)){
        // newGridState = prevGridState;
        yOffSetState--;
        rotationNumberState--;
        var newGridState =
            updateAndGetGrid(currentTetrominoBlockWhenRotated, gridState, width, xOffSetState, yOffSetState);
        gridState = newGridState

        // assign new random tetromino block
        currentTetrominoBlockState = [tetrominoIBlock, tetrominoSBlock, tetrominoJBlock][Math.floor(Math.random() * 3)];
        // reset y offset position
        yOffSetState = 0;
        rotationNumberState = 0;
    }

    drawGame(currentTetrominoBlockWhenRotated, gridState, width, xOffSetState, yOffSetState, ctx);
    // rotationNumberState++;






    // var rotatadTetrominoGrid = rotateTetromino(rotationNumberState, currentTetrominoBlockState);
    //repeat
}

gameLoop();

window.setInterval(gameLoop, 1000 / 2);


// var newGridState =
//     updateAndGetGrid(currentTetrominoBlockState, grid, width, xOffSetState, yOffSetState);
//
// isShapeBottomCollidingWithAnotherSymbol()


// console.log(printGridAsStr(newGridState, width));
// drawGridToCanvas(newGridState, ctx);





