//  Su.GuiCuan

cc.Class({
    extends: cc.Component,

    properties: {
        Type: 'score',
    },

    setValue(score) {
        this.label = this.node.getComponent(cc.Label);
        this.label.string = score;
        this.endX = this.node.x;
        this.endY = this.node.y + 200;

        cc.tween(this.node)
            .to(0.5, { position: cc.v2(this.endX, this.endY) }, { easing: 'sineOut' })
            .call(() => { this.node.destroy() })
            .start();
    },
});
