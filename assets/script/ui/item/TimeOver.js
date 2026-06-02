//  Su.GuiCuan

cc.Class({
	extends: cc.Component,

	properties: {
	},

	onShow(data) {
		this.init();
	},

	update() {
		this.rise();
	},

	init() {
		this.isRise = true;
		this.riseSpeed = 8;
		this.riseIncrement = 0.2;
		this.node.x = cc.winSize.width / 2;
		this.node.y = cc.winSize.height / 2;

	},

	rise() {
		if (!this.isRise) {
			return;
		}

		this.riseSpeed -= this.riseIncrement;
		if (this.riseSpeed <= 0) {
			this.isRise = false;
			this.scheduleOnce(() => {
				this.dead();
			}, 2);
		}

		this.node.y += this.riseSpeed;
	},

	dead() {
		this.node.destroy();
	},
});
