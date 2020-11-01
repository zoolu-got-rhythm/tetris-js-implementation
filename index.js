

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

var currentTetrominoBlock = tetrominoJBlock;

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
    var blockSize = 25;
    canvasCtx.fillStyle = colour;
    canvasCtx.fillRect((x % 4) * blockSize, y * blockSize, blockSize, blockSize);
    canvasCtx.fillStyle = pSBC(0.20, colour);
    canvasCtx.fillRect((x % 4) * blockSize, y * blockSize, blockSize, 4);
    canvasCtx.fillRect((x % 4) * blockSize, y * blockSize, 4, blockSize);
    canvasCtx.fillStyle = pSBC(-0.20, colour);
    canvasCtx.fillRect((x % 4) * blockSize, (y * blockSize) + (blockSize - 4), blockSize, 4);
    canvasCtx.fillRect(((x % 4) * blockSize) + blockSize - 4, y * blockSize, 4, blockSize);
}

function drawTetrominoBlockToCanvas(arr1d, canvasCtx){
    canvasCtx.fillStyle = "#000000";
    canvasCtx.fillRect(0,0, 100, 100);
    var y = 0;
    for (var x = 0; x < 16; x++){
        if(arr1d[x] == 1){
            colourTetrominoBlock(x, y, canvasCtx, red);
        }else if(arr1d[x] == 2){
            colourTetrominoBlock(x, y, canvasCtx, lilac);
        }else if(arr1d[x] == 3){
            colourTetrominoBlock(x, y, canvasCtx, limeGreen);
        }

        if((x+1) % 4 == 0 && x+1 != 16)
            y++;
    }
}


var container = document.getElementById("container");
// var canvas = document.getElementById("tetromino-block");
// var ctx = canvas.getContext("2d");
var tetrominoBlocks = [tetrominoIBlock, tetrominoSBlock, tetrominoJBlock];

canvasesForBlocks = tetrominoBlocks.map(function(tetrominoBlock){
    // var blockContainer = document.createElement("div");

    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    canvas.className = "tetromino-block";
    canvas.width = 100;
    canvas.height = 100;
    canvas.style.marginRight = "5px";

    var referencesObj = {ctx: ctx, canvas: canvas};
    return referencesObj;
});

canvasesForBlocks.forEach(function(canvasObjRef){
    container.append(canvasObjRef.canvas);
});


var rotation = 0;
// var currentStateOfRotatedTetrominoBlockArr;
var tid = window.setInterval(function (){
    canvasesForBlocks.forEach(function(canvasObjRef, i){
        var currentTetrominoBlockArr = tetrominoBlocks[i];
        console.log(currentTetrominoBlockArr);
        var currentStateOfRotatedTetrominoBlockArr = rotateTetromino(rotation, currentTetrominoBlockArr);
        drawTetrominoBlockToCanvas(currentStateOfRotatedTetrominoBlockArr, canvasObjRef.ctx);
    });
    // container.innerText = tetromino1dArrToString(currentStateOfRotatedTetrominoBlockArr);
    rotation++;
}, 500 / 2);







