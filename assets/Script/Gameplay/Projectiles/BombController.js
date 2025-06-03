cc.Class({
    extends: cc.Component,

    properties: {
        groundY: {
            default: -300,
            type: cc.Float
        },
        lifeTime: {
            default: 5,
            type: cc.Float
        }
    },

    onLoad() {
        this.fallSpeed = 0;
        this.isFalling = false;
        this.hasHitGround = false;
        this.collidingMonsterNode = null;

        let manager = cc.director.getCollisionManager();
        if (!manager.enabled) {
            manager.enabled = true;
        }

        if (this.lifeTime > 0) {
            this.scheduleOnce(() => {
                if (cc.isValid(this.node) && !this.hasHitGround) {
                    this.node.destroy();
                }
            }, this.lifeTime);
        }
    },

    startFalling(speed) {
        this.fallSpeed = speed;
        this.isFalling = true;
    },

    update(dt) {
        if (this.isFalling && this.fallSpeed > 0 && !this.hasHitGround) {
            this.node.y -= this.fallSpeed * dt;

            if (this.node.y <= this.groundY) {
                this.isFalling = false;
                this.hasHitGround = true;
                this.processGroundImpact();
            }
        }
    },

    processGroundImpact() {
        if (cc.isValid(this.collidingMonsterNode)) {
            this.collidingMonsterNode.destroy();
            this.collidingMonsterNode = null;
        } else {
            cc.log("BombController: Bom chạm đất nhưng không va chạm với quái vật nào lúc đó.");
        }

        if (cc.isValid(this.node)) {
            this.node.destroy();
        }
    },
    onCollisionEnter: function (other, self) {
        if (other.node.group === 'monster') {
            this.collidingMonsterNode = other.node;
        }
    },

    onCollisionExit: function(other, self) {
        if (this.collidingMonsterNode && other.node === this.collidingMonsterNode) {
            this.collidingMonsterNode = null;
        }
    }
});