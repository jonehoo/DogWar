//  Su.GuiCuan

cc.Class({
	extends: cc.Component,

	properties: {
		Type: '',
	},

	applyRect() {
		if (this.baseRect) {
			this.node.x = this.baseRect.x;
			this.node.y = this.baseRect.y;
			this.node.width = this.baseRect.width;
			this.node.height = this.baseRect.height;
		}
	},

	setRect(rect) {
		this.baseRect = rect;
		this.node.x = rect.x;
		this.node.y = rect.y;
		this.node.width = rect.width;
		this.node.height = rect.height;
	},
});
