//  Su.GuiCuan

cc.Class({
	extends: cc.Component,

	properties: {
		bg1: cc.Node,
		bg2: cc.Node,
	},

	setSelect(tag) {
		this.bg1.active = tag;
		this.bg2.active = !tag;
	},
});
