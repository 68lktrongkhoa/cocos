// Player/PlayerStates/PlayerState.js
class PlayerState {
    constructor(name) {
        this.name = name;
    }

    enter(player) {
        
    }

    exit(player) {
        
    }

    update(player, dt) {
       
    }

    handleInput(player, eventType, event) {
        
    }

    onCollisionEnter(player, other, self) {
        if (player.isDead || player.isInvincible) { 
            return;
        }
        if (other.node.group === 'monster') {
            player.takeDamage(1); 
            if (cc.isValid(other.node)) {
                const monsterController = other.node.getComponent('EnemyController');
                if (monsterController && typeof monsterController.handleCollisionWithPlayer === 'function') {
                    monsterController.handleCollisionWithPlayer(player.node);
                } else {
                    other.node.destroy();
                }
            }
        }
    }
}
module.exports = PlayerState;