
cc.Class({
    extends: cc.Component,

    properties: {
        rankLabel: { default: null, type: cc.Label },
        medalSprite: { default: null, type: cc.Sprite },
        flagSprite: { default: null, type: cc.Sprite },
        nameLabel: { default: null, type: cc.Label },
        scoreLabel: { default: null, type: cc.Label },
        medalSpriteFrames: { default: [], type: [cc.SpriteFrame] }
    },

    setData: function (rank, playerName, score, countryCode, flagSpriteFrame) {
        if (this.rankLabel) this.rankLabel.node.active = false; 
        if (this.medalSprite) this.medalSprite.node.active = false; 

        if (rank >= 1 && rank <= 3) {
            if (this.medalSprite) {
                this.medalSprite.node.active = true;
                if (this.medalSpriteFrames && this.medalSpriteFrames[rank - 1]) {
                    this.medalSprite.spriteFrame = this.medalSpriteFrames[rank - 1];
                } else {
                    console.warn(`Medal sprite frame for rank ${rank} not found or medalSpriteFrames not set.`);
                    this.medalSprite.node.active = false;
                }
            }
        } else {
            if (this.rankLabel) {
                this.rankLabel.node.active = true;
                this.rankLabel.string = rank.toString();
            }
        }
        if (this.nameLabel) this.nameLabel.string = playerName;
        if (this.scoreLabel) this.scoreLabel.string = score.toLocaleString('en-US');
        if (this.flagSprite) {
            if (flagSpriteFrame) {
                this.flagSprite.spriteFrame = flagSpriteFrame;
                this.flagSprite.node.active = true;
            } else {
                this.flagSprite.spriteFrame = null;
                this.flagSprite.node.active = false;
            }
        } else {
            console.warn("RankItem: flagSprite property (Node) is not assigned in Inspector.");
        }
    }
});