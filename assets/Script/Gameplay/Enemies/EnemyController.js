cc.Class({
    extends: cc.Component,

    properties: {
        maxHitPoints: {
            default: 1,
            type: cc.Integer
        },
    },

    onLoad() {
        this.currentHitPoints = this.maxHitPoints;
        let manager = cc.director.getCollisionManager();
        if (!manager.enabled) {
            manager.enabled = true;
        }
    },

    takeDamage(damageAmount) {
        if (this.currentHitPoints <= 0) {
            return; 
        }

        this.currentHitPoints -= damageAmount;
        if (this.currentHitPoints <= 0) {
            this.die();
        }
    },

    die() {
        if (cc.isValid(this.node)) {
            this.node.destroy();
        }
    },
});