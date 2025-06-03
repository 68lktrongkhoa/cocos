const mEmitter = require('mEmitter');
const UIConstants = require('UIConstants'); 

const EnteringPortalState = require('./PlayerStates/EnteringPortalState');
const IdleState = require('./PlayerStates/IdleState');
const MovingUpState = require('./PlayerStates/MovingUpState');
const MovingDownState = require('./PlayerStates/MovingDownState');
const InvincibleState = require('./PlayerStates/InvincibleState');
const DeadState = require('./PlayerStates/DeadState');


cc.Class({
    extends: cc.Component,

    properties: {
        spineAnim: {
            default: null,
            type: sp.Skeleton
        },
        moveSpeed: {
            default: 200,
            type: cc.Float
        },
        idleAnimName: {
            default: "hoverboard"
        },
        portalEnterAnimName: {
            default: "portal"
        },
        moveUpAnimName: {
            default: "move_up",
        },
        moveDownAnimName: {
            default: "move_down",
        },
        shootAnimName: {
            default: "shoot"
        },
        deathAnimName: {
            default: "death",
            type: cc.String
        },
        minY: {
            default: -250,
            type: cc.Float
        },
        maxY: {
            default: 250,
            type: cc.Float
        },

        buttonUpNode: {
            default: null,
            type: cc.Node
        },
        buttonDownNode: {
            default: null,
            type: cc.Node
        },

        actionButtonNode: {
            default: null,
            type: cc.Node
        },

        bulletPrefab: {
            default: null,
            type: cc.Prefab,
        },
        bulletSpawnPoint: {
            default: null,
            type: cc.Node
        },
        bulletSpeed: {
            default: 800,
            type: cc.Float
        },
        // ---  BOM ---
        bombPrefab: {
            default: null,
            type: cc.Prefab
        },
        bombSpawnHeight: {
            default: 400, 
            type: cc.Float
        },
        bombFallSpeed: {
            default: 300,
            type: cc.Float
        },
        bombsContainerNode: { 
            default: null,
            type: cc.Node
        },
        bombDropButtonNode: { 
            default: null,
            type: cc.Node
        },
        simulatedPressDuration: { 
            default: 0.1,
            type: cc.Float
        },
        bombCooldown: { 
            default: 5.0,
            type: cc.Float
        },

        invincibilityDuration: {
            default: 2.0,
            type: cc.Float
        },
        blinkInterval: {
            default: 0.1,
            type: cc.Float
        },
        blinkOpacity: {
            default: 100,
            type: cc.Integer
        },
        maxLives: {
            default: 5,
            type: cc.Integer
        },
        heartIconPrefab: {
            default: null,
            type: cc.Prefab
        },
        heartsContainerNode: {
            default: null,
            type: cc.Node
        },
        lastOriginalInputEvent: null,
    },

    onLoad() {
        if (!this.spineAnim) {
            this.enabled = false;
            cc.error("PlayerController: SpineAnim chưa được gán!");
            return;
        }

        let collisionManager = cc.director.getCollisionManager();
        if (!collisionManager.enabled) {
            collisionManager.enabled = true;
        }

        this.currentLives = this.maxLives;
        this._heartNodes = [];
        this.initHeartsUI();

        this.moveDirection = 0;
        this.isInvincible = false;
        this.isDead = false;
        this.isShooting = false;
        this.originalOpacity = this.node.opacity;

        this.canDropBombByKey = true; 
        this.bombDropButtonComponent = this.bombDropButtonNode ? this.bombDropButtonNode.getComponent(cc.Button) : null;
        this.actionButtonComponent = this.actionButtonNode ? this.actionButtonNode.getComponent(cc.Button) : null;


        this.currentState = new EnteringPortalState();
        this.currentState.enter(this);

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        if (this.buttonUpNode) {
            this.buttonUpNode.on(cc.Node.EventType.TOUCH_START, (event) => this.onTouchEvent(event, 'TOUCH_START', this.buttonUpNode), this);
            this.buttonUpNode.on(cc.Node.EventType.TOUCH_END, (event) => this.onTouchEvent(event, 'TOUCH_END', this.buttonUpNode), this);
            this.buttonUpNode.on(cc.Node.EventType.TOUCH_CANCEL, (event) => this.onTouchEvent(event, 'TOUCH_CANCEL', this.buttonUpNode), this);
        }
        if (this.buttonDownNode) {
            this.buttonDownNode.on(cc.Node.EventType.TOUCH_START, (event) => this.onTouchEvent(event, 'TOUCH_START', this.buttonDownNode), this);
            this.buttonDownNode.on(cc.Node.EventType.TOUCH_END, (event) => this.onTouchEvent(event, 'TOUCH_END', this.buttonDownNode), this);
            this.buttonDownNode.on(cc.Node.EventType.TOUCH_CANCEL, (event) => this.onTouchEvent(event, 'TOUCH_CANCEL', this.buttonDownNode), this);
        }
        if (this.actionButtonNode) {
            this.actionButtonNode.on(cc.Node.EventType.TOUCH_START, (event) => this.onTouchEvent(event, 'TOUCH_START', this.actionButtonNode), this);
            
        }
        if (this.bombDropButtonNode) {
            this.bombDropButtonNode.on('click', this.handleBombDropButtonClick, this);
        }
    },

    changeState(newState) {
        if (this.isDead && newState.name !== "Dead") { 
            return;
        }
        if (this.currentState && typeof this.currentState.exit === 'function') {
            this.currentState.exit(this);
        }
       
        this.currentState = newState;
        if (this.currentState && typeof this.currentState.enter === 'function') {
            this.currentState.enter(this);
        }
    },

    initHeartsUI() {
        if (!this.heartIconPrefab || !this.heartsContainerNode) {
            cc.warn("PlayerController: Chưa gán HeartIconPrefab hoặc HeartsContainerNode để hiển thị mạng.");
            return;
        }
        this.heartsContainerNode.removeAllChildren();
        this._heartNodes = [];

        for (let i = 0; i < this.maxLives; i++) {
            const heart = cc.instantiate(this.heartIconPrefab);
            this.heartsContainerNode.addChild(heart);
            heart.active = true;
            this._heartNodes.push(heart);
        }
    },

    updateHeartsUI() {
        if (!this._heartNodes || this._heartNodes.length === 0) return;
        for (let i = 0; i < this.maxLives; i++) {
            if (this._heartNodes[i]) {
                this._heartNodes[i].active = i < this.currentLives;
            }
        }
    },

    takeDamage(amount) {
        if (this.isDead || this.isInvincible) {
            return;
        }
        this.currentLives -= amount;
        this.currentLives = Math.max(0, this.currentLives);
        this.updateHeartsUI();

        if (this.currentLives <= 0) {
            this.changeState(new DeadState());
        } else {
            this.changeState(new InvincibleState(this.currentState, this.invincibilityDuration));
        }
    },

    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        if (this.buttonUpNode) {
            this.buttonUpNode.targetOff(this);
        }
        if (this.buttonDownNode) {
            this.buttonDownNode.targetOff(this);
        }
        if (this.actionButtonNode) {
            this.actionButtonNode.targetOff(this);
        }
        if (this.bombDropButtonNode) {
            this.bombDropButtonNode.targetOff(this);
        }

        if (this.spineAnim) {
            this.spineAnim.setCompleteListener(null);
        }
        this.unscheduleAllCallbacks(); 
    },

    update(dt) {
        if (this.currentState && typeof this.currentState.update === 'function') {
            this.currentState.update(this, dt);
        }
    },

    playAnimation(animName, loop = false, trackIndex = 0, forceOverride = false) {
        if (!this.spineAnim || !animName) {
            return;
        }

        const currentTrackEntry = this.spineAnim.getCurrent(trackIndex);
        if (!forceOverride && currentTrackEntry) {
            const currentAnimName = currentTrackEntry.animation ? currentTrackEntry.animation.name : null;
            if (currentAnimName === animName && currentTrackEntry.loop === loop) {
                return;
            }
        }

        if (forceOverride) {
            this.spineAnim.clearTrack(trackIndex);
        }
        this.spineAnim.setAnimation(trackIndex, animName, loop);
    },

    onKeyDown(event) {
        if (this.isDead && event.keyCode !== cc.macro.KEY.escape) return;

        if (this.currentState && typeof this.currentState.handleInput === 'function') {
            this.currentState.handleInput(this, 'KEY_DOWN', event);
        }

        if (event.keyCode === cc.macro.KEY.enter) {
            this.handleBombDropKeyPress(event);
        }
    },

    onKeyUp(event) {
        if (this.isDead) return;
        if (this.currentState && typeof this.currentState.handleInput === 'function') {
            this.currentState.handleInput(this, 'KEY_UP', event);
        }
    },

    onTouchEvent(event, eventType, targetNode) { 
        if (this.isDead) return;
        this.lastOriginalInputEvent = event;
        if (this.currentState && typeof this.currentState.handleInput === 'function') {
            event.targetNode = targetNode;
            this.currentState.handleInput(this, eventType, event);
        }
    },

    _performActualShoot(originalEvent = null) {
        if (!this.bulletPrefab || !this.bulletSpawnPoint) {
        
            return;
        }

        const bullet = cc.instantiate(this.bulletPrefab);
        const spawnPosWorld = this.bulletSpawnPoint.convertToWorldSpaceAR(cc.v2(0, 0));
        const parentOfBullet = this.node.parent || cc.director.getScene(); 
        const spawnPosLocal = parentOfBullet.convertToNodeSpaceAR(spawnPosWorld);

        bullet.setPosition(spawnPosLocal);
        parentOfBullet.addChild(bullet);

        const bulletComp = bullet.getComponent('BulletController');
        if (bulletComp) {
            bulletComp.shootTowards(cc.v2(1, 0), this.bulletSpeed, spawnPosWorld);
        } 
        if (originalEvent && originalEvent.targetNode === this.actionButtonNode && this.actionButtonComponent && this.actionButtonComponent.interactable) {
            this.simulateActionButtonVisuals(originalEvent);
        }
    },
    
    simulateActionButtonVisuals(originalEvent){
        if (!this.actionButtonComponent || !this.actionButtonComponent.interactable) return;

        const originalScale = this.actionButtonNode.scale;
        const originalColor = this.actionButtonNode.color;

        if (this.actionButtonComponent.transition === cc.Button.Transition.SCALE && this.actionButtonComponent.zoomScale !== 1) {
            this.actionButtonNode.scale = originalScale * this.actionButtonComponent.zoomScale;
        } else if (this.actionButtonComponent.transition === cc.Button.Transition.COLOR) {
            this.actionButtonNode.color = this.actionButtonComponent.pressedColor;
        }

        this.scheduleOnce(() => {
            if (!cc.isValid(this.actionButtonNode)) return;

            if (this.actionButtonComponent.transition === cc.Button.Transition.SCALE && this.actionButtonComponent.zoomScale !== 1) {
                cc.tween(this.actionButtonNode).to(this.actionButtonComponent.duration, { scale: originalScale }).start();
            } else if (this.actionButtonComponent.transition === cc.Button.Transition.COLOR) {
                 cc.tween(this.actionButtonNode).to(this.actionButtonComponent.duration, { color: originalColor }).start();
            }
            if (this.actionButtonComponent.clickEvents && this.actionButtonComponent.clickEvents.length > 0) {
                 cc.Component.EventHandler.emitEvents(this.actionButtonComponent.clickEvents, originalEvent);
            }
        }, this.simulatedPressDuration);
    },

    handleBombDropKeyPress(originalEvent = null) {
        if (this.isDead || this.isInvincible) return;

        if (this.canDropBombByKey) {
            if (this.bombDropButtonNode && this.bombDropButtonComponent && this.bombDropButtonComponent.interactable) {
                this.simulateBombDropVisualsAndAction(originalEvent); 
                this.startBombCooldown();
            } else {
                this.triggerBombDropLogic();
                this.startBombCooldown();
            }
        }
    },
    
    handleBombDropButtonClick() { 
        if (this.isDead || this.isInvincible) return;
        if (this.canDropBombByKey) {
            this.triggerBombDropLogic();
            this.startBombCooldown();
        } 
    },

    startBombCooldown() {
        this.canDropBombByKey = false;
        if (this.bombDropButtonComponent) this.bombDropButtonComponent.interactable = false;

        this.scheduleOnce(() => {
            this.canDropBombByKey = true;
            if (this.bombDropButtonComponent) this.bombDropButtonComponent.interactable = true;
        }, this.bombCooldown);
    },
    
    triggerBombDropLogic() { 
        if (!this.bombPrefab) {
           
            return;
        }
        const bomb = cc.instantiate(this.bombPrefab);
        const parentForBomb = this.bombsContainerNode || this.node.parent || cc.director.getScene();
        if (!parentForBomb) {
           
            return;
        }

      
        const dropOffset = 150; 
        const worldDropPos = this.node.convertToWorldSpaceAR(cc.v2(dropOffset, 0));
        const localSpawnPos = parentForBomb.convertToNodeSpaceAR(worldDropPos);

        bomb.setPosition(localSpawnPos.x, this.bombSpawnHeight);
        parentForBomb.addChild(bomb);

        const bombComp = bomb.getComponent('BombController');
        if (bombComp) {
            bombComp.startFalling(this.bombFallSpeed);
        } 
    },
    
    simulateBombDropVisualsAndAction(originalEvent = null) { 
        if (!this.bombDropButtonComponent || !this.bombDropButtonComponent.interactable) {
            this.triggerBombDropLogic();
            return;
        }

        const originalScale = this.bombDropButtonNode.scale;
        const originalColor = this.bombDropButtonNode.color;

        if (this.bombDropButtonComponent.transition === cc.Button.Transition.SCALE && this.bombDropButtonComponent.zoomScale !== 1) {
            this.bombDropButtonNode.scale = originalScale * this.bombDropButtonComponent.zoomScale;
        } else if (this.bombDropButtonComponent.transition === cc.Button.Transition.COLOR) {
            this.bombDropButtonNode.color = this.bombDropButtonComponent.pressedColor;
        }

        this.scheduleOnce(() => {
            if (!cc.isValid(this.bombDropButtonNode)) return;

            if (this.bombDropButtonComponent.transition === cc.Button.Transition.SCALE && this.bombDropButtonComponent.zoomScale !== 1) {
                cc.tween(this.bombDropButtonNode).to(this.bombDropButtonComponent.duration, { scale: originalScale }).start();
            } else if (this.bombDropButtonComponent.transition === cc.Button.Transition.COLOR) {
                cc.tween(this.bombDropButtonNode).to(this.bombDropButtonComponent.duration, { color: originalColor }).start();
            }

            if (this.bombDropButtonComponent.clickEvents && this.bombDropButtonComponent.clickEvents.length > 0) {
                cc.Component.EventHandler.emitEvents(this.bombDropButtonComponent.clickEvents, originalEvent);
            } else {
                this.triggerBombDropLogic();
            }
        }, this.simulatedPressDuration);
    },

    onCollisionEnter: function (other, self) {
        if (this.currentState && typeof this.currentState.onCollisionEnter === 'function') {
            this.currentState.onCollisionEnter(this, other, self);
        } else {
            if (this.isDead || this.isInvincible) return;
            if (other.node.group === 'monster') {
                if (cc.isValid(other.node)) {
                    other.node.destroy();
                    const monsterController = other.node.getComponent('EnemyController'); 
                    if (monsterController && typeof monsterController.handleCollisionWithPlayer === 'function') {
                        monsterController.handleCollisionWithPlayer(this.node);
                    } else {
                        other.node.destroy();
                    }
                }
                this.takeDamage(1);
            }
        }
    },

    _performBlink() {
        this.node.opacity = (this.node.opacity === this.originalOpacity) ? this.blinkOpacity : this.originalOpacity;
    },

});