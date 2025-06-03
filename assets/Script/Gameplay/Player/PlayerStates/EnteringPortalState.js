const PlayerState = require('./PlayerState');

class EnteringPortalState extends PlayerState {
    constructor() {
        super('EnteringPortal');
        this.isAnimationComplete = false;
    }

    enter(player) {
        super.enter(player);
        this.isAnimationComplete = false;
        if (player.spineAnim && player.portalEnterAnimName) {
            player.playAnimation(player.portalEnterAnimName, false, 0, true);
            player.spineAnim.setCompleteListener((trackEntry) => {
                if (trackEntry.trackIndex === 0 && trackEntry.animation.name === player.portalEnterAnimName) {
                    this.isAnimationComplete = true;
                    player.spineAnim.setCompleteListener(null);
                    if (!player.isDead) {
                        const IdleState = require('./IdleState'); // Lazy require
                        player.changeState(new IdleState());
                    }
                }
            });
        } else {
            cc.warn("Player: portalEnterAnimName not set.");
            this.isAnimationComplete = true;
            if (!player.isDead) {
                const IdleState = require('./IdleState'); // Lazy require
                player.changeState(new IdleState());
            }
        }
    }

    handleInput(player, eventType, event) {}
    update(player, dt) {}
    onCollisionEnter(player, other, self) {}
}
module.exports = EnteringPortalState;