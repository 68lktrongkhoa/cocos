// SpineController.js

cc.Class({
    extends: cc.Component,

    properties: {
        spineCharacter: {
            default: null,
            type: sp.Skeleton
        },
        buttonContainer: {
            default: null,
            type: cc.Node
        },
        textButtonPrefab: {
            default: null,
            type: cc.Prefab
        },
        labelNodeNameInPrefab: {
            default: "Label", 
            type: cc.String
        },
        labelFontSize: {
            default: 20,
            type: cc.Integer
        },
    },

    start () {
        if (!this.spineCharacter) {
            cc.error("Spine Character chưa được gán!");
            return;
        }
        if (!this.buttonContainer) {
            cc.error("Button Container chưa được gán!");
            return;
        }
        if (!this.textButtonPrefab) {
            cc.error("Text Button Prefab chưa được gán!");
            return;
        }
        if (!this.labelNodeNameInPrefab) {
            cc.warn("Label Node Name In Prefab chưa được chỉ định. Sẽ không thể set text cho button.");
        }

        if (this.spineCharacter.skeletonData) {
            this.createAllAnimationTextButtons();
        } else {
            cc.log("SpineData chưa sẵn sàng, đang chờ một chút...");
            this.scheduleOnce(() => {
                if (this.spineCharacter.skeletonData) {
                    this.createAllAnimationTextButtons();
                } else {
                    cc.error("SpineData vẫn chưa sẵn sàng sau khi chờ. Không thể tạo buttons.");
                }
            }, 0.1);
        }
    },

    createAllAnimationTextButtons () {
        this.buttonContainer.removeAllChildren();

        let layout = this.buttonContainer.getComponent(cc.Layout);
        if (!layout) {
            layout = this.buttonContainer.addComponent(cc.Layout);
        }
        
        layout.type = cc.Layout.Type.HORIZONTAL; 
        layout.spacingY = 10;
        layout.spacingX = 30; 
        layout.resizeMode = cc.Layout.ResizeMode.CONTAINER;

        if (!this.spineCharacter.skeletonData) {
            cc.warn("Không thể tạo buttons vì SpineData không có sẵn.");
            return;
        }

        const allSpineAnimations = this.spineCharacter.skeletonData._skeletonCache.animations; 
        let animationNamesToCreate = allSpineAnimations.map(anim => anim.name);

        animationNamesToCreate.unshift("<None>");

        animationNamesToCreate.forEach(animName => {
            const buttonNodeInstance = cc.instantiate(this.textButtonPrefab);
            buttonNodeInstance.name = animName + "Button";

            if (this.labelNodeNameInPrefab) {
                const labelNode = buttonNodeInstance.getChildByName(this.labelNodeNameInPrefab);
                if (labelNode) {
                    const labelComponent = labelNode.getComponent(cc.Label);
                    if (labelComponent) {
                        labelComponent.string = (animName === "<None>") ? "None" : animName;
                        if (this.labelFontSize > 0) { 
                            labelComponent.fontSize = this.labelFontSize;
                        }
                    } else {
                        cc.warn(`Node '${this.labelNodeNameInPrefab}' trong Prefab không có cc.Label component cho button '${animName}'.`);
                    }
                } else {
                    cc.warn(`Không tìm thấy Node con Label tên là '${this.labelNodeNameInPrefab}' trong Prefab cho button '${animName}'.`);
                }
            } else {
                cc.warn("Chưa chỉ định 'Label Node Name In Prefab', không thể set text cho button.");
            }

            const buttonComponent = buttonNodeInstance.getComponent(cc.Button);
            if (!buttonComponent) {
                cc.error(`Prefab button cho '${animName}' phải có sẵn Component cc.Button!`);
                buttonNodeInstance.destroy();
                return;
            }
            buttonComponent.clickEvents = [];

            const clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = this.node;
            clickEventHandler.component = "SpineController";
            clickEventHandler.handler = "onAnimationButtonClick";
            clickEventHandler.customEventData = animName;

            buttonComponent.clickEvents.push(clickEventHandler);
            this.buttonContainer.addChild(buttonNodeInstance);
        });
    },

    onAnimationButtonClick (event, customEventData) {
        const animationName = customEventData;
        this.playAnimation(animationName);
    },

    playAnimation (animationName) {
        if (this.spineCharacter) {
            if (animationName === "<None>") {
                this.spineCharacter.clearTrack(0);
            } else {
                let loop = false;
                const loopedAnimations = ["idle", "run", "walk", "hoverboard"];
                if (loopedAnimations.includes(animationName)) {
                    loop = true;
                }
                this.spineCharacter.setAnimation(0, animationName, loop);
            }
        }
    },
});