const globalEmitter = require('mEmitter'); 

cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad() {
        globalEmitter.registerEvent("HELLO", this.onHello.bind(this));
        globalEmitter.registerOnce("WELCOME", this.onWelcome.bind(this));
    },

    onHello(data) {
        cc.log('NodeA received HELLO:', data);
    },

    onWelcome(data) {
        cc.log('NodeA received WELCOME:', data);
    },

    start() {
        
    },
});