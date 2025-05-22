(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/powerManager.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'f11d1QOk6VAJ7vbMaC8I02U', 'powerManager', __filename);
// Script/powerManager.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {
        labelPower: cc.Label,
        btnAddPower: cc.Node
    },

    onLoad: function onLoad() {
        this.power = 3986;

        this.updatePowerLabel();
        this.btnAddPower.on('touchend', this.onAddPower, this);
    },
    onAddPower: function onAddPower() {
        this.power += 1;

        this.updatePowerLabel();

        this.labelPower.node.stopAllActions();
        this.labelPower.node.runAction(cc.sequence(cc.scaleTo(0.1, 1.2), cc.scaleTo(0.1, 1.0)));
    },
    updatePowerLabel: function updatePowerLabel() {
        this.labelPower.string = this.power.toLocaleString();
    }
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=powerManager.js.map
        