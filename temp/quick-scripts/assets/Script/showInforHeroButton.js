(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/showInforHeroButton.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'fe5a0CqcgJDx4S1DXhos4A1', 'showInforHeroButton', __filename);
// Script/showInforHeroButton.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        heroInfoPanel: {
            default: null,
            type: cc.Node
        },
        label: {
            default: null,
            type: cc.Label
        }
    },

    start: function start() {
        this.heroInfoPanel.active = false;
        this.updateButtonLabel();
    },


    showHeroInfo: function showHeroInfo() {
        this.heroInfoPanel.active = !this.heroInfoPanel.active;
        this.updateButtonLabel();
        cc.log('HeroInfoPanel active:', this.heroInfoPanel.active);
    },

    updateButtonLabel: function updateButtonLabel() {
        this.label.string = this.heroInfoPanel.active ? "Hide infor hero" : "Show infor hero";
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
        //# sourceMappingURL=showInforHeroButton.js.map
        