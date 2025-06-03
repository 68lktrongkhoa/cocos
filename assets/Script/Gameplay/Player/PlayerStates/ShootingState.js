const PlayerState = require('PlayerState');
const IdleState = require('IdleState');

class ShootingState extends PlayerState {
    constructor(previousState = null) {
        super('Shooting');
        this.previousState = previousState || new IdleState(); 
        this.isAnimationComplete = false;
    }

    enter(player) {
        super.enter(player);
        player.isShooting = true;
        this.isAnimationComplete = false;

        if (player.shootAnimName) {
            player.playAnimation(player.shootAnimName, false, 0, true); 
            player.spineAnim.setCompleteListener((trackEntry) => {
                if (trackEntry.animation.name === player.shootAnimName) {
                    this.isAnimationComplete = true;
                    player.isShooting = false;
                    player.spineAnim.setCompleteListener(null);
                    if (!player.isDead) {
                        player.changeState(this.previousState);
                    }
                }
            });
        } else {
            cc.warn("Player: Tên animation 'shoot' chưa được cấu hình.");
            player.isShooting = false;
            this.isAnimationComplete = true;
            if (!player.isDead) {
                 player.changeState(this.previousState);
            }
        }
        player._performActualShoot();
    }

    update(player, dt) {
        if (this.isAnimationComplete && !player.isDead) {
            player.changeState(this.previousState);
        }
    }
    exit(player){
        super.exit(player);
        player.isShooting = false;
    }
}
module.exports = ShootingState;