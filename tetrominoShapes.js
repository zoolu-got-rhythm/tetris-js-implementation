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
// this function only works with 3x3 tetromino shapes
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

TetrominoBlock.prototype.arrayState1dArr = []; // if this was java, this prop would be defined with 'protected'

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

// abstract away re-usable prototypal inheritance, that can be used for each tetromino shape class
function inheritTetrominoBlockClassPrototype(subClassFunctionConstructor){
    subClassFunctionConstructor.prototype = new TetrominoBlock();
    subClassFunctionConstructor.prototype.constructor = subClassFunctionConstructor; // is this line still needed?
}

// re-usable
// issue with this function by the looks
function createConstantImmutableObjectPropertyOnClass(functionConstructor, propertyNameString, property){
    console.log(functionConstructor);
    Object.defineProperty(functionConstructor.prototype, propertyNameString, {
        value: Object.freeze(property),
        writable: false,
        enumerable: true,
        configurable: true
    });
}

// assign this function to each init method of each child block/shape subclass (and call with .call(objectContext),
// this avoids me wr-writing this same method for each .init method (keeping good DRY) (don't repeat yourself)
function check1dArrayStateBeenAssignedToChildShapeClass() {
    // make prop "arrayState1dArr" a constant (non re-assignable) and immutable
    // console.log(this.arrayState1dArr);
    if (!(this.arrayState1dArr.length > 0)) {
        throw new Error("arrayState1dArr not assigned yet")
    }
}


function Jblock(){
    this.blockShapeLetter = "j";
}

inheritTetrominoBlockClassPrototype(Jblock);
// make prop "arrayState1dArr" a constant (non re-assignable) and immutable
createConstantImmutableObjectPropertyOnClass(Jblock, "arrayState1dArr",
    ["j","","",
        "j","j","j",
        "","",""]);


Jblock.prototype.init = check1dArrayStateBeenAssignedToChildShapeClass;



function Lblock(){
    this.blockShapeLetter = "l";
}

inheritTetrominoBlockClassPrototype(Lblock);
// make prop "arrayState1dArr" a constant (non re-assignable) and immutable
createConstantImmutableObjectPropertyOnClass(Lblock, "arrayState1dArr",
    ["","","l",
        "l","l","l",
        "","",""]);


Lblock.prototype.init = check1dArrayStateBeenAssignedToChildShapeClass;





function Sblock(){
    this.blockShapeLetter = "s";
}

inheritTetrominoBlockClassPrototype(Sblock);
// make prop "arrayState1dArr" a constant (non re-assignable) and immutable
createConstantImmutableObjectPropertyOnClass(Sblock, "arrayState1dArr",
    ["","s","s",
        "s","s","",
        "","",""]);

Sblock.prototype.init = check1dArrayStateBeenAssignedToChildShapeClass;




function Zblock(){
    this.blockShapeLetter = "z";
}

inheritTetrominoBlockClassPrototype(Zblock);
// make prop "arrayState1dArr" a constant (non re-assignable) and immutable
createConstantImmutableObjectPropertyOnClass(Zblock, "arrayState1dArr",
    ["z","z","",
        "","z","z",
        "","",""]);

Zblock.prototype.init = check1dArrayStateBeenAssignedToChildShapeClass;






function Tblock(){
    this.blockShapeLetter = "t";
}

inheritTetrominoBlockClassPrototype(Tblock);
// make prop "arrayState1dArr" a constant (non re-assignable) and immutable
createConstantImmutableObjectPropertyOnClass(Tblock, "arrayState1dArr",
    ["","t","",
        "t","t","t",
        "","",""]);

Tblock.prototype.init = check1dArrayStateBeenAssignedToChildShapeClass;



function Oblock(){
    this.blockShapeLetter = "o";
}

inheritTetrominoBlockClassPrototype(Oblock);
// make prop "arrayState1dArr" a constant (non re-assignable) and immutable
createConstantImmutableObjectPropertyOnClass(Oblock, "arrayState1dArr",
    ["","o","o","",
        "","o","o","",
        "","","",""]);

Oblock.prototype.init = check1dArrayStateBeenAssignedToChildShapeClass;

// override rotate on
Oblock.prototype.rotate = function(){
    return this.arrayState1dArr;
}


function Iblock(){
    this.blockShapeLetter = "i";
}

inheritTetrominoBlockClassPrototype(Iblock);
// make prop "arrayState1dArr" a constant (non re-assignable) and immutable
createConstantImmutableObjectPropertyOnClass(Iblock, "arrayState1dArr",
    ["","","","",
        "i","i","i","i",
        "","","","",
        "","","",""]);

Iblock.prototype.init = check1dArrayStateBeenAssignedToChildShapeClass;

// override rotate on
Iblock.prototype.rotate = function(rotationNumber){
    // implement
    var rotatedTetrominoShape;
    switch (rotationNumber % 4){
        case 0:
            return this.arrayState1dArr;
        // 90 degrees
        case 1:
            rotatedTetrominoShape = ["","","i","",
                                "","","i","",
                                "","","i","",
                                "","","i",""];
            break;
        // 180 degrees
        case 2:
            rotatedTetrominoShape = ["","","","",
                                "","","","",
                                "i","i","i","i",
                                "","","",""];
            break;
        // 270 degree
        case 3:
            rotatedTetrominoShape = ["","i","","",
                                "","i","","",
                                "","i","","",
                                "","i","",""];
            break;
    }

    return rotatedTetrominoShape;
}






// function Tblock(){
//     this.blockShapeLetter = "t";
// }
//
// inheritTetrominoBlockClassPrototype(Tblock);
//
// Tblock.prototype.init = function(){
//     // console.log(this);
//     // make prop "arrayState1dArr" a constant (non re-assignable) and immutable
//     createConstantImmutableObjectProperty(this, "arrayState1dArr",
//         [0,3,0,
//                 3,3,0,
//                 0,3,0]);
// }

// 'duck typing' pattern: check if obj implements methods and inherits from TetrominoBlock base class,
// note: also checks for methods implemented (on prototype) of base class/inherited class
function checkIfTetrominoSubclassImplementsMethod(objFunctionConstructor, /*method args*/){
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
    var TetrominoObjectConstructor; // should I make this null by default?
    switch (shapeString){
        case "j":
            TetrominoObjectConstructor = Jblock;
            break;
        case "s":
            TetrominoObjectConstructor = Sblock;
            break;
        case "t":
            TetrominoObjectConstructor = Tblock;
            break;
        case "l":
            TetrominoObjectConstructor = Lblock;
            break;
        case "z":
            TetrominoObjectConstructor = Zblock;
            break;
        case "o":
            TetrominoObjectConstructor = Oblock;
            break;
        case "i":
            TetrominoObjectConstructor = Iblock;
            break;
        default:
            throw new Error(`tetromino shape of ${shapeString} letter does not exist`);
            break;
    }
    var tetrominoObject;
    if(checkIfTetrominoSubclassImplementsMethod(TetrominoObjectConstructor, "init")){
       tetrominoObject = new TetrominoObjectConstructor();
    }else{
        throw new Error("tetromino shape class: " + TetrominoObjectConstructor.name + " has not implemented init method");
    }

    try{
        // init method does a check too see if array has been set for shape block class overriding one on super class
        tetrominoObject.init.call(tetrominoObject);
    }catch (e) {
        throw new Error(e.message + " for " + shapeString + " shape");
    }

    return tetrominoObject;
}


// run below code as unit tests using some node js based testing lib
// var jBlockInstance = tetrominoObjectFactory("j");
// console.log(jBlockInstance.arrayState1dArr);
//
// var sBlockInstance = tetrominoObjectFactory("s");
// console.log(sBlockInstance.arrayState1dArr);
//
// var tBlockInstance = tetrominoObjectFactory("t");
// console.log(tBlockInstance.arrayState1dArr);
//
// console.log(sBlockInstance.rotate(1));
// sBlockInstance.arrayState1dArr = [2,2];
// // sBlockInstance.arrayState1dArr.push(2);
// console.log(sBlockInstance.arrayState1dArr);

// jBlockInstance.arrayState1dArr = [1,2,3,4];
// // jBlockInstance.arrayState1dArr.push(2);
// console.log(jBlockInstance.rotate(1));
// console.log(jBlockInstance.arrayState1dArr);
// console.log(jBlockInstance);

// const readline = require("readline");
// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });
//
// rl.question("what block do you want?", function(blockLetter) {
//     try {
//         console.log(tetrominoObjectFactory(blockLetter));
//     }catch (e) {
//         console.log(e);
//     }
// });




// console.log(checkIfObjectImplementsInitMethod(Jblock));


