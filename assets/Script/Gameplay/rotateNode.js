cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        let rotateAction = cc.repeatForever(cc.rotateBy(3, 360));
        this.node.runAction(rotateAction);
    },

    // update (dt) {},
});