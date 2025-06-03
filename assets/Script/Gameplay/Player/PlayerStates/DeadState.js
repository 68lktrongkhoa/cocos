const PlayerState = require('./PlayerState');
const mEmitter = require('mEmitter'); 
const UIConstants = require('UIConstants');

class DeadState extends PlayerState {
    constructor() {
        super('Dead');
    }

    enter(player) {
        super.enter(player);
        player.isDead = true;
        player.moveDirection = 0;

        if (player.isInvincible) {
            player.isInvincible = false; 
            player.node.opacity = player.originalOpacity;
        }

        cc.log("GAME OVER from DeadState!");

        if (player.spineAnim && player.deathAnimName) {
            player.playAnimation(player.deathAnimName, false, 0, true);
            player.spineAnim.setCompleteListener((trackEntry) => {
                if (trackEntry.animation.name === player.deathAnimName) {
                    player.spineAnim.setCompleteListener(null);
                    this._emitGameOverPopup(player);
                }
            });
        } else {
            cc.warn("Player: SpineAnim or deathAnimName not set. Cannot play death animation.");
            this._emitGameOverPopup(player);
        }
    }

    _emitGameOverPopup(player) {
        try {
            if (mEmitter && mEmitter.instance && UIConstants && UIConstants.EVENT_NAME && UIConstants.POPUP_ID) {
                mEmitter.instance.emit(UIConstants.EVENT_NAME.OPEN_POPUP, { popupId: UIConstants.POPUP_ID.GAME_OVER });
            } else {
                cc.error("Player (DeadState): mEmitter hoặc UIConstants chưa được cấu hình đúng để mở popup game over.");
            }
        } catch (e) {
             cc.error("Player (DeadState): Lỗi khi emit game over popup: " + e);
        }
    }

    handleInput(player, eventType, event) {}
    update(player, dt) {}
    onCollisionEnter(player, other, self) {}
}
module.exports = DeadState;