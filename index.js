

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




// console.log(tetromino1dArrToString(tetromino));

//
// var tetromino90DegreesArr = tetromino2dArrayIteratorCallback(tetromino, function(x, y){
//     return (12 + y) - (x * 4)
// });
//
// var tetromino180DegreesArr = tetromino2dArrayIteratorCallback(tetromino, function(x, y){
//     return (15 - x) - (y * 4)
// });
//
// var tetromino270DegreesArr = tetromino2dArrayIteratorCallback(tetromino, function(x, y){
//     return (3 - y) + (x * 4)
// });
//
// // console.log("\n");
// console.log(tetromino1dArrToString(tetromino90DegreesArr));
// console.log(tetromino1dArrToString(tetromino180DegreesArr));
// console.log(tetromino1dArrToString(tetromino270DegreesArr));

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
    ctx.clearRect(0,0, 100, 100);
    var blockSize = 25;
    var y = 0;
    for (var x = 0; x < 16; x++){
        if(arr1d[x] == 1){
            ctx.fillStyle = "#BF0000";
            ctx.fillRect((x % 4) * blockSize, y * blockSize, blockSize, blockSize);
            ctx.fillStyle = "#FF0000";
            ctx.fillRect((x % 4) * blockSize, y * blockSize, blockSize, 4);
            ctx.fillRect((x % 4) * blockSize, y * blockSize, 4, blockSize);
            ctx.fillStyle = "#8F0000";
            ctx.fillRect((x % 4) * blockSize, (y * blockSize) + (blockSize - 4), blockSize, 4);
            ctx.fillRect(((x % 4) * blockSize) + blockSize - 4, y * blockSize, 4, blockSize);
        }

        if((x+1) % 4 == 0 && x+1 != 16)
            y++;
    }
    // str += "\n";
}


var container = document.getElementById("container");
var canvas = document.getElementById("tetromino-block");
var ctx = canvas.getContext("2d");

var rotation = 0;
var currentStateOfRotatedTetrominoBlockArr;
var tid = window.setInterval(function (){
    currentStateOfRotatedTetrominoBlockArr = rotateTetromino(rotation, currentTetrominoBlock);
    container.innerText = tetromino1dArrToString(currentStateOfRotatedTetrominoBlockArr);
    drawTetrominoBlockToCanvas(currentStateOfRotatedTetrominoBlockArr);
    rotation++;
}, 500 / 2);




