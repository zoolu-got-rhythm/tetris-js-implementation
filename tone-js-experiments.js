

const pingPong = new Tone.PingPongDelay("64n", 0.2).toDestination();
const drum = new Tone.MembraneSynth().connect(pingPong);
drum.triggerAttackRelease(500, "4n");