// CharacterController.js
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
        moveUpAnimName: {
            default: "move_up",
        },
        moveDownAnimName: {
            default: "move_down",
        },
        shootAnimName: {
            default: "shoot"
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
            default: 15.0, // 15 giây
            type: cc.Float
        }
    },

    onLoad() {
        if (!this.spineAnim) {
            this.enabled = false;
            return;
        }

        this.moveDirection = 0;
        this.isMovingUp = false;
        this.isMovingDown = false;
        this.isShooting = false;

        this.canDropBombByKey = false;
        this.scheduleOnce(() => {
            this.canDropBombByKey = true;
        }, this.bombCooldown);
        this.playAnimation(this.idleAnimName, true);

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        if (this.bombDropButtonNode) {
            this.bombDropButtonComponent = this.bombDropButtonNode.getComponent(cc.Button);
            if (!this.bombDropButtonComponent) {
            } else {
            }
        } else {
            cc.warn("CharacterController: Thuộc tính 'bombDropButtonNode' CHƯA được gán trong Inspector (dùng cho phím Enter).");
        }

        if (this.buttonUpNode) {
            this.buttonUpNode.on(cc.Node.EventType.TOUCH_START, this.startMoveUp, this);
            this.buttonUpNode.on(cc.Node.EventType.TOUCH_END, this.stopMoveUp, this);
            this.buttonUpNode.on(cc.Node.EventType.TOUCH_CANCEL, this.stopMoveUp, this);
        } else {
            cc.warn("CharacterController: Thuộc tính 'buttonUpNode' CHƯA được gán trong Inspector.");
        }

        if (this.buttonDownNode) {
            this.buttonDownNode.on(cc.Node.EventType.TOUCH_START, this.startMoveDown, this);
            this.buttonDownNode.on(cc.Node.EventType.TOUCH_END, this.stopMoveDown, this);
            this.buttonDownNode.on(cc.Node.EventType.TOUCH_CANCEL, this.stopMoveDown, this);
        } else {
            cc.warn("CharacterController: Thuộc tính 'buttonDownNode' CHƯA được gán trong Inspector.");
        }

        if (this.actionButtonNode) {
            this.actionButtonComponent = this.actionButtonNode.getComponent(cc.Button);
            if (!this.actionButtonComponent) {
                cc.warn("CharacterController: Thuộc tính 'actionButtonNode' được gán nhưng không có component cc.Button.");
            } 
        } else {
            cc.warn("CharacterController: Thuộc tính 'actionButtonNode' CHƯA được gán trong Inspector (dùng cho phím Space).");
        }

        if (!this.bulletPrefab) {
            cc.warn("CharacterController: Thuộc tính 'bulletPrefab' CHƯA được gán.");
        }
        if (!this.bulletSpawnPoint) {
            cc.warn("CharacterController: Thuộc tính 'bulletSpawnPoint' (điểm bắn đạn) CHƯA được gán.");
        }
    },

    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        if (this.buttonUpNode) {
            this.buttonUpNode.off(cc.Node.EventType.TOUCH_START, this.startMoveUp, this);
            this.buttonUpNode.off(cc.Node.EventType.TOUCH_END, this.stopMoveUp, this);
            this.buttonUpNode.off(cc.Node.EventType.TOUCH_CANCEL, this.stopMoveUp, this);
        }
        if (this.buttonDownNode) {
            this.buttonDownNode.off(cc.Node.EventType.TOUCH_START, this.startMoveDown, this);
            this.buttonDownNode.off(cc.Node.EventType.TOUCH_END, this.stopMoveDown, this);
            this.buttonDownNode.off(cc.Node.EventType.TOUCH_CANCEL, this.stopMoveDown, this);
        }
        if (this.spineAnim) {
            this.spineAnim.setCompleteListener(null);
        }
        this.unscheduleAllCallbacks();
    },

    update(dt) {
        if (this.moveDirection !== 0) {
            let newY = this.node.y + this.moveDirection * this.moveSpeed * dt;
            if (typeof this.minY === 'number' && typeof this.maxY === 'number') {
                newY = Math.max(this.minY, Math.min(this.maxY, newY));
            }
            this.node.y = newY;
        }
    },

    playAnimation(animName, loop = false, trackIndex = 0) {
        if (!this.spineAnim || !animName) {
            return;
        }
        if (this.isShooting && animName !== this.shootAnimName && trackIndex === 0) {
            return;
        }
        const currentTrackEntry = this.spineAnim.getCurrent(trackIndex);
        if (currentTrackEntry) {
            const currentAnimName = currentTrackEntry.animation ? currentTrackEntry.animation.name : null;
            if (currentAnimName === animName && currentTrackEntry.loop) {
                return;
            }
        }
        this.spineAnim.setAnimation(trackIndex, animName, loop);
    },

    onKeyDown(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.w:
            case cc.macro.KEY.up:
                this.isMovingUp = true;
                this.updateMovementState();
                break;
            case cc.macro.KEY.s:
            case cc.macro.KEY.down:
                this.isMovingDown = true;
                this.updateMovementState();
                break;
            case cc.macro.KEY.space:
                if (!this.isShooting) {
                    this.performShootAndOrAction(event);
                } 
                break;
            case cc.macro.KEY.enter:
               
                if (this.canDropBombByKey) {
                    if (this.bombDropButtonNode && this.bombDropButtonComponent && this.bombDropButtonComponent.interactable) {
                        this.simulateBombDropButtonClick(event);

                        this.canDropBombByKey = false;
                        
                        this.scheduleOnce(() => {
                            this.canDropBombByKey = true;
                           
                        }, this.bombCooldown);
                    }
                } else {
                    cc.log("CharacterController: Phím Enter - Bom đang trong thời gian hồi chiêu.");
                }
                break;
        }
    },

    triggerBombDropFromUI() {
        if (!this.bombPrefab) {
            cc.warn("CharacterController: Không thể thả bom, 'bombPrefab' chưa được gán.");
            return;
        }

        const bomb = cc.instantiate(this.bombPrefab);
        const parentForBomb = this.bombsContainerNode ? this.bombsContainerNode : this.node.parent;
        if (!parentForBomb) {
            cc.error("CharacterController: Không tìm thấy Node cha hợp lệ để thả bom.");
            return;
        }

        const worldPosX = this.node.convertToWorldSpaceAR(cc.v2(0, 0)).x;
        const localSpawnPos = parentForBomb.convertToNodeSpaceAR(cc.v2(worldPosX, 0));
        bomb.setPosition(localSpawnPos.x, this.bombSpawnHeight);
        parentForBomb.addChild(bomb);
        cc.log(`CharacterController: Bom đã được thả tại (${bomb.x.toFixed(0)}, ${bomb.y.toFixed(0)})`);

        const bombComp = bomb.getComponent('BombController');
        if (bombComp) {
            bombComp.startFalling(this.bombFallSpeed);
        } else {
            cc.warn("CharacterController: Prefab bom không có script BombController. Cần cơ chế để bom rơi.");
        }
    },

    simulateBombDropButtonClick(originalEvent = null) {
        if (!this.bombDropButtonComponent || !this.bombDropButtonComponent.interactable) {
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
            if (this.bombDropButtonComponent.transition === cc.Button.Transition.SCALE && this.bombDropButtonComponent.zoomScale !== 1) {
                cc.tween(this.bombDropButtonNode)
                    .to(this.bombDropButtonComponent.duration, { scale: originalScale })
                    .start();
            } else if (this.bombDropButtonComponent.transition === cc.Button.Transition.COLOR) {
                 cc.tween(this.bombDropButtonNode)
                    .to(this.bombDropButtonComponent.duration, { color: originalColor })
                    .start();
            }

            if (this.bombDropButtonComponent.clickEvents && this.bombDropButtonComponent.clickEvents.length > 0) {
                cc.Component.EventHandler.emitEvents(this.bombDropButtonComponent.clickEvents, originalEvent);
            } else {
                this.triggerBombDropFromUI();
            }
        }, this.simulatedPressDuration);
    },

    onKeyUp(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.w:
            case cc.macro.KEY.up:
                this.isMovingUp = false;
                this.updateMovementState();
                break;
            case cc.macro.KEY.s:
            case cc.macro.KEY.down:
                this.isMovingDown = false;
                this.updateMovementState();
                break;
        }
    },

    startMoveUp() {
        this.isMovingUp = true;
        this.updateMovementState();
    },
    stopMoveUp() {
        this.isMovingUp = false;
        this.updateMovementState();
    },
    startMoveDown() {
        this.isMovingDown = true;
        this.updateMovementState();
    },
    stopMoveDown() {
        this.isMovingDown = false;
        this.updateMovementState();
    },

    updateMovementState() {
        if (this.isShooting) {
            return;
        }
        if (this.isMovingUp && !this.isMovingDown) {
            this.moveDirection = 1;
            this.playAnimation(this.moveUpAnimName, true);
        } else if (this.isMovingDown && !this.isMovingUp) {
            this.moveDirection = -1;
            this.playAnimation(this.moveDownAnimName, true);
        } else {
            this.moveDirection = 0;
            this.playAnimation(this.idleAnimName, true);
        }
    },

    performShootAndOrAction(originalEvent = null) {
        if (this.shootAnimName) {
            this.isShooting = true;
            this.playAnimation(this.shootAnimName, false);

            this.spineAnim.setCompleteListener((trackEntry) => {
                if (trackEntry.animation.name === this.shootAnimName) {
                    this.isShooting = false;
                    this.updateMovementState();
                    this.spineAnim.setCompleteListener(null);
                }
            });
        } else {
            cc.warn("CharacterController: Tên animation 'shoot' chưa được cấu hình.");
        }

        if (this.bulletPrefab && this.bulletSpawnPoint) {
            const bullet = cc.instantiate(this.bulletPrefab);
            const spawnPosWorld = this.bulletSpawnPoint.convertToWorldSpaceAR(cc.v2(0, 0));
            const parentOfBullet = this.node.parent;
            const spawnPosLocal = parentOfBullet.convertToNodeSpaceAR(spawnPosWorld);

            bullet.setPosition(spawnPosLocal);
            parentOfBullet.addChild(bullet);

            const bulletComp = bullet.getComponent('BulletController');
            if (bulletComp) {
                bulletComp.shootTowards(cc.v2(1, 0), this.bulletSpeed);
            } else {
                cc.warn("CharacterController: Prefab đạn không có script BulletController.");
            }
        } else {
            cc.warn("CharacterController: Không thể bắn đạn do bulletPrefab hoặc bulletSpawnPoint chưa được gán.");
        }

        if (this.actionButtonComponent && this.actionButtonComponent.interactable) {
            const originalScale = this.actionButtonNode.scale;
            const originalColor = this.actionButtonNode.color;

            if (this.actionButtonComponent.transition === cc.Button.Transition.SCALE && this.actionButtonComponent.zoomScale !== 1) {
                this.actionButtonNode.scale = originalScale * this.actionButtonComponent.zoomScale;
            } else if (this.actionButtonComponent.transition === cc.Button.Transition.COLOR) {
                this.actionButtonNode.color = this.actionButtonComponent.pressedColor;
            }

            this.scheduleOnce(() => {
                if (this.actionButtonComponent.transition === cc.Button.Transition.SCALE && this.actionButtonComponent.zoomScale !== 1) {
                    cc.tween(this.actionButtonNode)
                        .to(this.actionButtonComponent.duration, { scale: originalScale })
                        .start();
                } else if (this.actionButtonComponent.transition === cc.Button.Transition.COLOR) {
                     cc.tween(this.actionButtonNode)
                        .to(this.actionButtonComponent.duration, { color: originalColor })
                        .start();
                }
                if (this.actionButtonComponent.clickEvents && this.actionButtonComponent.clickEvents.length > 0) {
                    cc.Component.EventHandler.emitEvents(this.actionButtonComponent.clickEvents, originalEvent);
                } else {
                     cc.log("CharacterController: Action Button không có Click Events nào được cấu hình.");
                }
            }, this.simulatedPressDuration);
        } else {
             cc.log("CharacterController: Không mô phỏng click Action Button (chưa gán hoặc không tương tác).");
        }
    }
});