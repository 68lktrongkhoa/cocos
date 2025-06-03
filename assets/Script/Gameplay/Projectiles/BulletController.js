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
        },
        explosionEffectPrefab: {
            default: null,
            type: cc.Prefab
        },
        _spawnOriginWorld: cc.Vec2,
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

    shootTowards(direction, speed,spawnOriginWorld) {
        this.direction = direction.normalize();
        this.speed = speed;
        if (spawnOriginWorld) {
            this._spawnOriginWorld = spawnOriginWorld;
        } else {
            this._spawnOriginWorld = this.node.parent.convertToWorldSpaceAR(this.node.position);
        }
    },

    update(dt) {
        if (this.speed > 0) {
            this.node.x += this.direction.x * this.speed * dt;
            this.node.y += this.direction.y * this.speed * dt;
        }
    },

    onCollisionEnter: function (other, self) {
        const bulletImpactPointWorld = self.node.convertToWorldSpaceAR(cc.v2(0, 0));
        if (other.node.group === 'monster') {
            this.createExplosionEffect(bulletImpactPointWorld);
            const enemyController = other.node.getComponent('EnemyController');

            if (enemyController) {
                enemyController.takeDamage(this.damage, bulletImpactPointWorld);
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
    createExplosionEffect(worldPosition) {

        const effect = cc.instantiate(this.explosionEffectPrefab);
        const parentNode = cc.director.getScene(); 
        const localPosition = parentNode.convertToNodeSpaceAR(worldPosition);

        effect.setPosition(localPosition);
        parentNode.addChild(effect);

    },
});