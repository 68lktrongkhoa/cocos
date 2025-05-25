cc.Class({
    extends: cc.Component,

    properties: {
        toggle: {
            default: null,
            type: cc.Toggle
        },
        knob: {
            default: null,
            type: cc.Node
        },
        offPositionX: {
            default: -30, 
            type: cc.Float
        },
        onPositionX: {
            default: 30, 
            type: cc.Float
        },
        animationDuration: {
            default: 0.1,
            type: cc.Float
        }
    },

    onLoad () {
        if (!this.toggle) {
            this.toggle = this.node.getComponent(cc.Toggle);
            if (!this.toggle) {
                cc.error("CustomSwitch: cc.Toggle component not found on this node.");
                this.enabled = false;
                return;
            }
        }
        if (!this.knob) {
            cc.error("CustomSwitch: Knob node not assigned.");
            this.enabled = false;
            return;
        }

        this._updateKnobPosition(this.toggle.isChecked, false);

        this.node.on('toggle', this._onToggleStateChanged, this);
    },

    _onToggleStateChanged(toggleComponent) {
        let isChecked = toggleComponent.isChecked;

        this._updateKnobPosition(isChecked, true);
    },

    _updateKnobPosition(isChecked, animate) {
        if (!this.knob) return;

        const targetX = isChecked ? this.onPositionX : this.offPositionX;
        const targetY = this.knob.y;

        if (animate && this.animationDuration > 0) {
            cc.tween(this.knob)
                .to(this.animationDuration, { position: cc.v2(targetX, targetY) }, { easing: 'sineOut' }) // Hoặc cc.v3
                .start();
        } else {
            this.knob.setPosition(targetX, targetY);
        }
    },

    setChecked(isChecked, triggerEvent = true, animate = true) {
        if (!this.toggle || this.toggle.isChecked === isChecked) {
            return;
        }

        this.toggle.isChecked = isChecked;

        if (!triggerEvent) {
             this._updateKnobPosition(isChecked, animate);
        }
    },

    onDestroy() {
        if (this.node) {
            this.node.off('toggle', this._onToggleStateChanged, this);
        }
    }
});