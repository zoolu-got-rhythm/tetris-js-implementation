

var tetrominoSBlock = [0,1,0,0,
                         0,1,1,0,
                         0,0,1,0,
                         0,0,0,0];

var tetrominoJBlock = [0,0,1,0,
                        0,0,1,0,
                        0,1,1,0,
                        0,0,0,0];

var tetrominoIBlock = [0,0,1,0,
                        0,0,1,0,
                        0,0,1,0,
                        0,0,1,0];

var currentTetrominoBlock = tetrominoJBlock;

function tetromino1dArrToString(arr1d){
    str = ""
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
            // console.log((y * 4) + x);
            // console.log(i);
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

function drawTetrominoBlockToCanvas(arr1d, canvasCtx){
    canvasCtx.clearRect(0,0, 100, 100);
    var blockSize = 25;
    var y = 0;
    for (var x = 0; x < 16; x++){
        if(arr1d[x] == 1){
            canvasCtx.fillStyle = "#BF0000";
            canvasCtx.fillRect((x % 4) * blockSize, y * blockSize, blockSize, blockSize);
            canvasCtx.fillStyle = "#FF0000";
            canvasCtx.fillRect((x % 4) * blockSize, y * blockSize, blockSize, 4);
            canvasCtx.fillRect((x % 4) * blockSize, y * blockSize, 4, blockSize);
            canvasCtx.fillStyle = "#8F0000";
            canvasCtx.fillRect((x % 4) * blockSize, (y * blockSize) + (blockSize - 4), blockSize, 4);
            canvasCtx.fillRect(((x % 4) * blockSize) + blockSize - 4, y * blockSize, 4, blockSize);
        }

        if((x+1) % 4 == 0 && x+1 != 16)
            y++;
    }
    // str += "\n";
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







