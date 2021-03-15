module.exports = async function(delayInMs){
    return new Promise(function(resolve) {
        const timeAtStartInMs = Date.now();
        setTimeout(()=>{
            resolve(Date.now() - timeAtStartInMs);
        }, delayInMs);
    });
};