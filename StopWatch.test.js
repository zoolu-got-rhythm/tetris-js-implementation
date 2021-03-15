
// hello world test
test('adds 1 + 2 to equal 3', () => {
    expect(1 + 2).toBe(3);
});

// template
// test('', () => {
//     expect().toBe();
// });

const StopWatch = require("./StopWatch");
const sleep = require("./sleep");

test('on object initialisation time elapsed in ms(millaseconds) to be equal to 0', () => {
    const sw = new StopWatch();
    expect(sw.getTimeElapsedInMs).toBe(0);
});

test('on object initialisation before starting timer, stop watch format string to be \
equal to 00:00:00 and to be same after calling reset()', () => {
    const sw = new StopWatch();
    expect(sw.getTimeElapsedInStopWatchFormatString).toBe("00:00:00");
    sw.reset();
    expect(sw.getTimeElapsedInStopWatchFormatString).toBe("00:00:00");
});

test('on timer start, after 1 second elapsed result to be equal or greater than 1000ms', done => {
    const tollerenceInMs = 10;
    const oneSecondInMs = 1000;
    const sw = new StopWatch();
    sw.startTimer();
    setTimeout(() => {
        sw.stopTimer();
        testTimerDisplaysCorrectTimeAfterMsElapsed(sw, oneSecondInMs, tollerenceInMs);
        done();
    },oneSecondInMs);
});

test('start, stop, resume, reset, start: stopwatch timer', async () => {
    // will need to use await sleep()'s
    const tollerenceInMs = 10;
    const sw = new StopWatch();
    sw.startTimer();
    await sleep(1000);
    sw.stopTimer();
    testTimerDisplaysCorrectTimeAfterMsElapsed(sw, 1000, tollerenceInMs);
    await sleep(1000);
    testTimerDisplaysCorrectTimeAfterMsElapsed(sw, 1000, tollerenceInMs);
    sw.startTimer();
    await sleep(1000);
    testTimerDisplaysCorrectTimeAfterMsElapsed(sw, 2000, tollerenceInMs);
    sw.stopTimer();
    testTimerDisplaysCorrectTimeAfterMsElapsed(sw, 2000, tollerenceInMs);
    sw.reset();
    testTimerDisplaysCorrectTimeAfterMsElapsed(sw, 0, tollerenceInMs);
    sw.startTimer();
    await sleep(1500);
    testTimerDisplaysCorrectTimeAfterMsElapsed(sw, 1500, tollerenceInMs);
});

function testTimerDisplaysCorrectTimeAfterMsElapsed(stopWatchObject, ms, msTollerence){
    const re = new RegExp(`00:0${Math.floor(ms / 1000)}:0[0-9]`);
    expect(stopWatchObject.getTimeElapsedInMs).toBeGreaterThanOrEqual(ms);
    expect(stopWatchObject.getTimeElapsedInMs).toBeLessThanOrEqual(ms + msTollerence);
    expect(stopWatchObject.getTimeElapsedInStopWatchFormatString).toMatch(re);
}

