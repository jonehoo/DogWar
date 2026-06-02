//  Su.GuiCuan

cc.Class({
	extends: cc.Component,

	properties: {
		maskNode: cc.Node,
		maskBg: cc.Node,
		click: cc.Node,

		people: cc.Node,
		finger: cc.Node,
		tip: cc.Node,

		textLabel: cc.Label,
	},

	onShow(data) {
		cc.Guide = this;

		this.data = data;
		this.step = this.data.step;
		this.rect = this.data.rect;

		this.init();
	},

	init() {
		this.maskBg.width = cc.winSize.width;
		this.maskBg.height = cc.winSize.height;

		this.setRect();
		this.show();

		this.checkClick();
	},

	saveStep() {
		cc.GuideStep = this.step;
		cc.FinishStep = this.step;
		cc.DataMgr.setValue('finishStep', this.step);
		//cc.DataMgr.setValue('finishGuide',true);
	},

	showContent(isShow) {
		this.node.opacity = isShow ? 255 : 0;
	},

	show() {
		this.saveStep();
		this.info = cc.GuideArr[this.step];
		this.textLabel.string = this.info.desc;
		this.finger.active = this.info.showFinger;
		this.tip.active = this.info.showTip;
		this.click.active = this.info.canClick;
		this.finger.x = this.rect.x + this.rect.width / 2 - this.finger.width / 2;
		this.finger.y = this.rect.y + this.rect.height / 2 - this.finger.height / 2;
		if (this.step == 0) {
			this.people.x = cc.winSize.width / 2 - this.people.width / 2;
			this.people.y = cc.winSize.height / 2 - 100;
		} else if (this.step == 1) {
			this.people.x = this.rect.x - 110;
			this.people.y = this.rect.y + this.rect.height - 50;
		} else if (this.step == 2) {
			this.people.x = this.rect.x - 110;
			this.people.y = this.rect.y + this.rect.height - 50;
		} else if (this.step == 3) {
			this.people.x = this.rect.x - 120;
			this.people.y = this.rect.y + this.rect.height - 50;
		} else if (this.step == 4) {
			this.people.x = this.rect.x - 140;
			this.people.y = this.rect.y + this.rect.height - 50;
		} else if (this.step == 5) {
			this.people.x = this.rect.x - 140;
			this.people.y = this.rect.y + this.rect.height - 50;
		} else if (this.step == 6) {
			this.people.x = this.rect.x - 125;
			this.people.y = this.rect.y + this.rect.height - 50;
		} else if (this.step == 7) {
			this.people.x = this.rect.x - 400;
			this.people.y = this.rect.y + this.rect.height - 20;
		} else if (this.step == 8) {
			this.people.x = cc.winSize.width / 2 - this.people.width / 2;
			this.people.y = cc.winSize.height / 2 - 100;
		}
	},

	updateStep(data) {
		this.step = data.step;
		this.rect = data.rect;
		this.show();
		this.setRect();
	},

	checkClick() {
		this.click.on(cc.Node.EventType.TOUCH_START, (event) => {
			this.checkStep();
		}, this);
	},

	checkStep() {
		if (this.step == 0) {
			cc.Utils.checkGuide(1, cc.Main.node);
		} else if (this.step == 8) {
			cc.Shop && cc.Shop.dead();
			cc.FinishGuide = true;
			this.dead();
		}
	},

	setRect() {
		this.maskNode.x = this.rect.x;
		this.maskNode.y = this.rect.y;
		this.maskNode.width = this.rect.width;
		this.maskNode.height = this.rect.height;

		this.maskBg.x = -this.maskNode.x;
		this.maskBg.y = -this.maskNode.y;

		this.tip.x = cc.winSize.width / 2;
	},

	dead() {
		if (this.step == 3) {
			cc.DataMgr.setValue('finishGuide', true);
		}

		cc.Guide = null;
		this.node.destroy();
	}
});
