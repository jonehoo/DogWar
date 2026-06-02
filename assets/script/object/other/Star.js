//  Su.GuiCuan


cc.Class({
	extends: cc.Component,

	properties: {
		Type: 'star',
	},

	setConfig(conf) {
		this.id = conf.Id;
	},

	start() {
		this.conf = cc.ObjConfig.OTHER[this.Type];
		this.isCheck = true;
		this.initBaseParam();
	},

	initBaseParam() {
		this.offsetX = cc.GameConfig.CONSTANT.OFFSET_X;
		this.offsetY = cc.GameConfig.CONSTANT.OFFSET_Y;
		this.offsetWidth = cc.GameConfig.CONSTANT.OFFSET_WIDTH;
		this.offsetHeight = cc.GameConfig.CONSTANT.OFFSET_HEIGHT;

		this.width = this.node.width;
		this.height = this.node.height;
		this.widthP = this.width / 2;
		this.heightP = this.height / 2;

		this.rectM = {};
		this.initRectPosition();
		this.initRectSize();
	},

	initRectPosition() {
		this.rectM['x'] = this.node.x + this.offsetY;
		this.rectM['y'] = this.node.y + this.offsetX;
	},

	initRectSize() {
		this.rectM['width'] = this.width - this.offsetHeight;
		this.rectM['height'] = this.height - this.offsetWidth;
	},

	update(dt) {
		if (cc.isPause || !this.isCheck || !cc.Player) {
			return;
		}

		this.checkPlayer();
	},

	checkPlayer() {
		if (cc.MathUtil.rectInRect(cc.Player.getRect(4), this.getRect(4))) {
			this.move();
		}
	},

	move() {
		this.isCheck = false;
		this.node.active = false;
		cc.AudioMgr.playSound('eatFood');

		cc.Utils.addScore(this.getRect(4), this.conf.SCORE);
		cc.GameUI.loadNode(cc.GameConfig.PREFAB_TYPE.STARANIM, cc.Game.panel, null, null, (item) => {
			item.x = this.node.x + this.widthP - cc.CameraNode.x;
			item.y = this.node.y + this.heightP - cc.CameraNode.y;

			cc.tween(item)
				.to(0.8, { position: cc.v2(cc.UILayer.starX, cc.UILayer.starY) }, { easing: 'sineOut' })
				.call(() => {
					item.destroy();
					this.dead();
				}).start();
		});

	},

	dead() {
		cc.UILayer.updateValue('star', 1);
		cc.whole.addStarId(this.id);
		this.node.destroy();
	},

	getRect(type) {
		switch (type) {
			case 4: return this.rectM;
			default:
				break;
		}
	},
});
