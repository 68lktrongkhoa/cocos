const PlayerState = require('./PlayerState');

class MovingDownState extends PlayerState {
    constructor() {
        super('MovingDown');
    }

    enter(player) {
        super.enter(player);
        player.moveDirection = -1;
        if (!player.isDead && !player.isShooting) { 
            player.playAnimation(player.moveDownAnimName, true);
        }
    }

    update(player, dt) {
        super.update(player, dt);
        if (player.isDead) return;
        let newY = player.node.y + player.moveDirection * player.moveSpeed * dt;
        if (typeof player.minY === 'number' && typeof player.maxY === 'number') {
            newY = Math.max(player.minY, Math.min(player.maxY, newY));
        }
        player.node.y = newY;
    }

    handleInput(player, eventType, event) {
        super.handleInput(player, eventType, event);
        if (player.isDead) return;

        if (eventType === 'KEY_UP') {
            if (event.keyCode === cc.macro.KEY.s || event.keyCode === cc.macro.KEY.down) {
                const IdleState = require('./IdleState'); 
                player.changeState(new IdleState());
            }
        } else if (eventType === 'TOUCH_END' || eventType === 'TOUCH_CANCEL') {
            if (event.targetNode === player.buttonDownNode) {
                const IdleState = require('./IdleState');
                player.changeState(new IdleState());
            }
        } else if (eventType === 'KEY_DOWN') {
            if (event.keyCode === cc.macro.KEY.w || event.keyCode === cc.macro.KEY.up) {
                const MovingUpState = require('./MovingUpState'); 
                player.changeState(new MovingUpState());
            } else if (event.keyCode === cc.macro.KEY.space) {
                const ShootingState = require('./ShootingState'); 
                player.changeState(new ShootingState(this));
            }
        } else if (eventType === 'TOUCH_START') {
            if (event.targetNode === player.buttonUpNode) {
                const MovingUpState = require('./MovingUpState'); 
                player.changeState(new MovingUpState());
            } else if (event.targetNode === player.actionButtonNode) {
                const ShootingState = require('./ShootingState');
                player.changeState(new ShootingState(this));
            }
        }
    }
}
module.exports = MovingDownState;