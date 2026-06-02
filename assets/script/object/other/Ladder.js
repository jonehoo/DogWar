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

	start() {
		this.node.Script = this;

		this.initRect();
	},

	initRect() {
		this.signHeight = this.node.height - 20;
		this.offsetX = cc.GameConfig.CONSTANT.OFFSET_X;
		this.offsetY = cc.GameConfig.CONSTANT.OFFSET_Y;
		this.offsetWidth = cc.GameConfig.CONSTANT.OFFSET_WIDTH;
		this.offsetHeight = cc.GameConfig.CONSTANT.OFFSET_HEIGHT;
		//this.collisionWidth = cc.GameConfig.CONSTANT.COLLISION_RECT_WIDTH;

		this.rectM = {};
		this.rectM['width'] = this.node.width - this.offsetWidth;
		this.rectM['height'] = this.node.height - this.offsetHeight;
		this.rectM['x'] = this.node.x + this.offsetX;
		this.rectM['y'] = this.node.y + this.offsetY;
	},

	update(dt) {
		if (cc.isPause) {
			return;
		}

		this.checkPlayer();
	},


	checkPlayer() {
		if (!cc.Player) {
			return;
		}

		if (cc.MathUtil.rectInRect(this.getRect(4), cc.Player.getRect(4))) {
			if (!cc.Player.ladder) {
				cc.Player.ladder = this.node;
			}

			cc.Player.setLadder();
		}
	},

	getRect(type) {
		switch (type) {
			case 4: return this.rectM;
			default:
				break;
		}
	},
});
