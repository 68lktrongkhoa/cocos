"use strict";
cc._RF.push(module, 'e62ffYyOQZKcY/Vbf+Ye7e/', 'heroSkinChanger');
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