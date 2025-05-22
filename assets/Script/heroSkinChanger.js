cc.Class({
    extends: cc.Component,

    properties: {
        heroSprite: {
            default: null,
            type: cc.Sprite,
        },

        skins: {
            default: [],
            type: [cc.SpriteFrame],
        },

        currentIndex: {
            default: 0,
            visible: false,
        }
    },

    changeSkin() {
        if (this.skins.length === 0 || !this.heroSprite) {
            return;
        }

        this.currentIndex = (this.currentIndex + 1) % this.skins.length;
        this.heroSprite.spriteFrame = this.skins[this.currentIndex];
    }
});
