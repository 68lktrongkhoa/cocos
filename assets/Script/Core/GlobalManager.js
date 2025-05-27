const mEmitter = require('mEmitter');

cc.Class({
    extends: cc.Component,

    onLoad() {
        if (!mEmitter.instance) {
            mEmitter.instance = new mEmitter();
            cc.log("mEmitter instance CREATED by GlobalManager.");
        } else {
            cc.log("mEmitter instance ALREADY EXISTS when GlobalManager loaded.");
        }
    },

    onDestroy() {
        if (mEmitter.instance) {
            mEmitter.instance.destroy();
            cc.log("mEmitter instance DESTROYED by GlobalManager.");
        }
    }
});