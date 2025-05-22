"use strict";
cc._RF.push(module, 'c084bsNNJhKZZYQS6wfv1uB', 'rotateNode');
// Script/rotateNode.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {},

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start: function start() {
        var rotateAction = cc.repeatForever(cc.rotateBy(3, 360));
        this.node.runAction(rotateAction);
    }
}

// update (dt) {},
);

cc._RF.pop();