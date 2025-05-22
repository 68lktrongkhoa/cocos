cc.Class({
    extends: cc.Component,

    properties: {
        heroInfoPanel: {
            default: null,
            type: cc.Node
        },
        label: {
            default: null,
            type: cc.Label
        }
    },

    start () {
        this.heroInfoPanel.active = false;
        this.updateButtonLabel();
    },

    showHeroInfo: function () {
        this.heroInfoPanel.active = !this.heroInfoPanel.active;
        this.updateButtonLabel();
        cc.log('HeroInfoPanel active:', this.heroInfoPanel.active);
    },

    updateButtonLabel: function () {
        this.label.string = this.heroInfoPanel.active ? "Hide infor hero" : "Show infor hero";
    }
});
