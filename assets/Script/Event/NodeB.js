const Emitter = require('mEmitter');

cc.Class({
    extends: cc.Component,

    properties: {
        emitHelloButton: cc.Button,
        emitWelcomeButton: cc.Button,
    },

    start() {
        this.emitHelloEvent()
        //this.emitWelcomeEvent();
        cc.log('NodeB started');
    },

    emitHelloEvent() {
        Emitter.emit('HELLO', "Data for HELLO from NodeB");
    },

    emitWelcomeEvent() {
        Emitter.emit('WELCOME', "Data for WELCOME from NodeB");
    },

});