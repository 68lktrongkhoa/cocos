cc.Class({
    extends: cc.Component,

    properties: {
        lifeTime: {
            default: 3,
            type: cc.Float
        },
        damage: {
            default: 1,
            type: cc.Integer
        }
    },

    onLoad() {
        this.direction = cc.v2(0, 0);
        this.speed = 0;
        let manager = cc.director.getCollisionManager();
        if (!manager.enabled) {
            manager.enabled = true;
        }

        if (this.lifeTime > 0) {
            this.scheduleOnce(() => {
                if (cc.isValid(this.node)) {
                    this.node.destroy();
                }
            }, this.lifeTime);
        }
    },

    shootTowards(direction, speed) {
        this.direction = direction.normalize();
        this.speed = speed;
    },

    update(dt) {
        if (this.speed > 0) {
            this.node.x += this.direction.x * this.speed * dt;
            this.node.y += this.direction.y * this.speed * dt;
        }
    },

    onCollisionEnter: function (other, self) {
        if (other.node.group === 'monster') {

            const enemyController = other.node.getComponent('EnemyController');

            if (enemyController) {
                enemyController.takeDamage(this.damage);
            } else {
                cc.warn(`Monster ${other.node.name} does not have an EnemyController script! Destroying it directly.`);
                if (cc.isValid(other.node)) {
                    other.node.destroy();
                }
            }
            if (cc.isValid(self.node)) {
                self.node.destroy();
            }
        }
    },
});