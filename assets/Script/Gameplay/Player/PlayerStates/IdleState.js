const PlayerState = require('./PlayerState');

class IdleState extends PlayerState {
    constructor() {
        super('Idle');
    }

    enter(player) {
        super.enter(player);
        player.moveDirection = 0;
        if (!player.isShooting && !player.isDead) {
            player.playAnimation(player.idleAnimName, true);
        }
    }

    handleInput(player, eventType, event) {
        super.handleInput(player, eventType, event);
        if (player.isDead) return;

        if (eventType === 'KEY_DOWN') {
            switch (event.keyCode) {
                case cc.macro.KEY.w:
                case cc.macro.KEY.up:
                    const MovingUpState = require('./MovingUpState');
                    player.changeState(new MovingUpState());
                    break;
                case cc.macro.KEY.s:
                case cc.macro.KEY.down:
                    const MovingDownState = require('./MovingDownState');
                    player.changeState(new MovingDownState());
                    break;
                case cc.macro.KEY.space:
                    const ShootingState = require('./ShootingState');
                    player.changeState(new ShootingState(this));
                    break;
            }
        } else if (eventType === 'TOUCH_START') {
            if (event.targetNode === player.buttonUpNode) {
                const MovingUpState = require('./MovingUpState');
                player.changeState(new MovingUpState());
            } else if (event.targetNode === player.buttonDownNode) {
                const MovingDownState = require('./MovingDownState');
                player.changeState(new MovingDownState());
            } else if (event.targetNode === player.actionButtonNode) {
                const ShootingState = require('./ShootingState');
                player.changeState(new ShootingState(this));
            }
        }
    }
}
module.exports = IdleState;