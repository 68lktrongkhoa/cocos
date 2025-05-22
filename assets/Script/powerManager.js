cc.Class({
    extends: cc.Component,

    properties: {
        labelPower: cc.Label,
        btnAddPower: cc.Node
    },

    onLoad() {
        this.power = 3986;

        this.updatePowerLabel();
        this.btnAddPower.on('touchend', this.onAddPower, this);
    },

    onAddPower() {
        this.power += 1;

        this.updatePowerLabel();

        this.labelPower.node.stopAllActions();
        this.labelPower.node.runAction(
            cc.sequence(
                cc.scaleTo(0.1, 1.2),
                cc.scaleTo(0.1, 1.0)
            )
        );
    },

    updatePowerLabel() {
        this.labelPower.string = this.power.toLocaleString();
    }
});
