const PlayerState = require('./PlayerState');


class InvincibleState extends PlayerState {
    constructor(previousState = null, duration = 2.0) {
        super('Invincible');
        this.previousState = previousState; 
        this.duration = duration;
        this.timer = 0;
        this.blinkTimer = 0;
    }

    enter(player) {
        super.enter(player);
        player.isInvincible = true;
        this.timer = 0;
        this.blinkTimer = 0;
        player.node.opacity = player.originalOpacity;


        let stateToMimicAnimation = this.previousState;
        if (!stateToMimicAnimation) {
            const IdleState = require('./IdleState');
            stateToMimicAnimation = new IdleState(); 
        }

        if (stateToMimicAnimation) {
            if (stateToMimicAnimation.name === 'Idle') player.playAnimation(player.idleAnimName, true);
            else if (stateToMimicAnimation.name === 'MovingUp') player.playAnimation(player.moveUpAnimName, true);
            else if (stateToMimicAnimation.name === 'MovingDown') player.playAnimation(player.moveDownAnimName, true);
        }
    }

    update(player, dt) {
        super.update(player, dt);
        if (player.isDead) return;

        this.timer += dt;
        this.blinkTimer += dt;

        if (this.blinkTimer >= player.blinkInterval) {
            player._performBlink();
            this.blinkTimer = 0;
        }

        if (this.previousState && typeof this.previousState.update === 'function' && this.previousState.name !== this.name) {

             if (player.moveDirection !== 0) {
                let newY = player.node.y + player.moveDirection * player.moveSpeed * dt;
                if (typeof player.minY === 'number' && typeof player.maxY === 'number') {
                    newY = Math.max(player.minY, Math.min(player.maxY, newY));
                }
                player.node.y = newY;
            }
        }


        if (this.timer >= this.duration) {
            let stateToReturnTo = this.previousState;
            if (!stateToReturnTo) {
                const IdleState = require('./IdleState');
                stateToReturnTo = new IdleState();
            }
            player.changeState(stateToReturnTo);
        }
    }

    handleInput(player, eventType, event) {
        
        if (this.previousState && typeof this.previousState.handleInput === 'function' && this.previousState.name !== this.name) {
            player.lastOriginalInputEvent = event; 
            this.previousState.handleInput(player, eventType, event);
        }
       
    }

    exit(player) {
        super.exit(player);
        player.node.opacity = player.originalOpacity;
        player.isInvincible = false;
    }

    onCollisionEnter(player, other, self) {
    }
}
module.exports = InvincibleState;