cc.Class({
    extends: cc.Component,

    properties: {
        spine: {
            default: null,
            type: sp.Skeleton
        },
        scrollView: {
            default: null,
            type: cc.ScrollView 
        },
        animationButton: {
            default: null,
            type: cc.Prefab,
        },
    },

    onLoad() {
        if (!this.spine || !this.spine.skeletonData) {
            console.error("Spine or skeleton data missing");
            return;
        }

        if (!this.scrollView || !this.scrollView.content) {
            console.error("ScrollView or content node Editor.");
            return;
        }

        const contentNode = this.scrollView.content; 

        contentNode.removeAllChildren(true);

        const animations = this.spine.skeletonData.skeletonJson.animations;
        for (let animName in animations) {
            const animBtn = cc.instantiate(this.animationButton);
            const label = animBtn.getComponentInChildren(cc.Label);
            if (label) {
                label.string = animName;
            } else {
                console.warn("Prefab 'animationButton' have not child Label component .");
            }

            const buttonComponent = animBtn.getComponent(cc.Button);
            if (buttonComponent) {
                const clickEvent = this.createClickEvent(animName);
                buttonComponent.clickEvents.push(clickEvent);
            } else {
                console.warn("Prefab 'animationButton' have not Button component.");
            }
            
            animBtn.parent = contentNode;
        }
    },

    createClickEvent(animName) {
        const event = new cc.Component.EventHandler();
        event.target = this.node;
        event.component = "SpineController"; 
        event.handler = "playAnimation";
        event.customEventData = animName;
        return event;
    },

    playAnimation(event, animName) {
        if (this.spine) {
            this.spine.setAnimation(0, animName, false);
        }
    }
});