(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/heroSkinChanger.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'e62ffYyOQZKcY/Vbf+Ye7e/', 'heroSkinChanger', __filename);
// Script/heroSkinChanger.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        heroSprite: {
            default: null,
            type: cc.Sprite
        },

        skins: {
            default: [],
            type: [cc.SpriteFrame]
        },

        currentIndex: {
            default: 0,
            visible: false
        }
    },

    changeSkin: function changeSkin() {
        if (this.skins.length === 0 || !this.heroSprite) {
            return;
        }

        this.currentIndex = (this.currentIndex + 1) % this.skins.length;
        this.heroSprite.spriteFrame = this.skins[this.currentIndex];
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
        //# sourceMappingURL=heroSkinChanger.js.map
        