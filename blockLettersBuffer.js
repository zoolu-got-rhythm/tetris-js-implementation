function BlockLettersBufferController(lettersArr, bufferSize){
    this.lettersArr = lettersArr;
    this.bufferSize = bufferSize;
    this.bufferArr = [];
    this.addNewLettersToBuffer();
}

BlockLettersBufferController.prototype.getNextLetter = function(){
    let itemAtFrontOfArr = this.bufferArr.shift();
    // this could affect performance of game, if takes a long time to find letter not currently in buffer
    this.addNewLettersToBuffer();
    return itemAtFrontOfArr;
}

BlockLettersBufferController.prototype.whatsNext = function(){
    return this.bufferArr[0];
}

// should run this method asynchronously
BlockLettersBufferController.prototype.addNewLettersToBuffer = function(){
    while(this.bufferArr.length !== this.bufferSize){
        let randomLetter = this.lettersArr[Math.floor(Math.random() * this.lettersArr.length)];
        // console.log(randomLetter);
        if(!this.bufferArr.includes(randomLetter))
            this.bufferArr.push(randomLetter);
    }
}

// console.log("hello");
// var tetrominoBlockLettersBuffer = new BlockLettersBufferController(["a","b","c","d","e","f","g"], 4);
// console.log(tetrominoBlockLettersBuffer.bufferArr);
// console.log(tetrominoBlockLettersBuffer.whatsNext());
// console.log(tetrominoBlockLettersBuffer.getNextLetter());
// console.log(tetrominoBlockLettersBuffer.bufferArr);
// console.log(tetrominoBlockLettersBuffer.getNextLetter());