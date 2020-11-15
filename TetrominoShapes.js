// Object.prototype.implements=function(funcName){
//     return this && this[funcName] && this[funcName] instanceof Function;
// }

// function tetromino2dArrayIteratorForEach(tetrominoShape, fn){
//     for (var y = 0; y < 3; y++){
//         for (var x = 0; x < 3; x++){
//             var symbolAtIndex = tetrominoShape[(y * 3) + x];
//             fn(x, y, symbolAtIndex);
//         }
//     }
// }

// mapping of tetromino original shape to new degrees of shape via callback
// maybe rename this function to something including word 'map' rename from 1d to 2d
function tetromino2dArrayIteratorCallback(origTetrominoShape, fn){
    var newShape = new Array(9);
    for (var y = 0; y < 3; y++){
        for (var x = 0; x < 3; x++){
            // i = index
            var i = fn(x, y);
            newShape[(y * 3) + x] = origTetrominoShape[i];
        }
    }
    return newShape;
}


function TetrominoBlock(){}

TetrominoBlock.prototype.arrayState1dArr = [];

TetrominoBlock.prototype.rotate = function(nOfRotatationsNumber){
    var rotatedTetrominoShape;
    switch (nOfRotatationsNumber % 4){
        case 0:
            return this.arrayState1dArr;
        // 90 degrees
        case 1:
            rotatedTetrominoShape = tetromino2dArrayIteratorCallback(this.arrayState1dArr, function(x, y){
                return (6 + y) - (x * 3);
            });
            break;
        // 180 degrees
        case 2:
            rotatedTetrominoShape = tetromino2dArrayIteratorCallback(this.arrayState1dArr, function(x, y){
                return (8 - x) - (y * 3);
            });
            break;
        // 270 degree
        case 3:
            rotatedTetrominoShape = tetromino2dArrayIteratorCallback(this.arrayState1dArr, function(x, y){
                return (2 - y) + (x * 3);
            });
            break;
    }

    return rotatedTetrominoShape;
}

// prototypal inheritance
function inheritTetrominoBlockClassPrototype(subClassFunctionConstructor){
    subClassFunctionConstructor.prototype = TetrominoBlock.prototype;
    subClassFunctionConstructor.prototype.constructor = subClassFunctionConstructor;
}


// TetrominoBlock.prototype.implements=function(funcName){
//     // return this && this[funcName] && this[funcName] instanceof Function;
//     return this[funcName];
// }
//
// TetrominoBlock.prototype.rotate = function(){
//     this.x = this.x + 1;
// }

function Jblock(){
    this.blockShapeLetter = "j";
}

inheritTetrominoBlockClassPrototype(Jblock);

Jblock.prototype.init = function(){
    // make prop "arrayState1dArr" a constant (not re-assignable) and immutable
    Object.defineProperty(this, "arrayState1dArr", {
        value: Object.freeze([0,2,0,
                                    0,2,0,
                                    2,2,0]),
        writable: false,
        enumerable: true,
        configurable: true
    });
}





// duck typing, check if obj implements methods and inherits from TetrominoBlock base class:
// note: also checks for methods implemented (on prototype) of base class/inherited class
function checkIfTetrominoSubclassImplementsMethod(objFunctionConstructor, method){
    if(!(new objFunctionConstructor()) instanceof TetrominoBlock)
        return false;
    for (var i = 1; i < arguments.length; i++){
        var arg = arguments[i];
        if(typeof objFunctionConstructor.prototype[arg] === "function"){
            continue;
        }else{
            return false;
        }
    }
    return true;
}

// factory pattern: get desired object at runtime
function tetrominoObjectFactory(shapeString){
    var tetrominoObject; // should I make this null by default?
    switch (shapeString){
        case "j":
            if(checkIfTetrominoSubclassImplementsMethod(Jblock, "init")){
                tetrominoObject = new Jblock();
                tetrominoObject.init();
            }else{
                throw new Error("tetromino shape has not implemented init method")
            }
    }
    return tetrominoObject;
}

var jBlockInstace = tetrominoObjectFactory("j");
console.log(jBlockInstace.arrayState1dArr);
console.log(jBlockInstace.rotate(1));
console.log(jBlockInstace.arrayState1dArr);
console.log(jBlockInstace);




// console.log(checkIfObjectImplementsInitMethod(Jblock));


