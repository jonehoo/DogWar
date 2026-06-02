//  Su.GuiCuan

cc.Class({
	extends: cc.Component,

	properties: {
		content: cc.Node,
		btnArea: cc.Node,
		itemArea: cc.Node,

		pageLabel: cc.Label,
	},

	start() {
		cc.WxAdMgr.ShowInterstitialAd();
	},

	onShow() {
		cc.ChapterPanel = this;
		cc.WxAdMgr.ShowBannerAd();
		this.init();

		cc.GameEvent.send("打开关卡窗口");
	},

	onClick(event, tag) {
		cc.AudioMgr.playSound('button');
		switch (tag) {
			case 'close':
				this.dead();
				break;

			case 'up':
				if (this.pageIndex >= this.pageMax) {
					return;
				}

				this.pageIndex++;
				this.showItem();
				break;
			case 'down':
				if (this.pageIndex <= 1) {
					return;
				}

				this.pageIndex--;
				this.showItem();
				break;
			case 'risk':
				cc.ChapterModel = tag;
				cc.UseLocalLayerIndex = cc.LocalLayerIndex;
				cc.ChapterModelName = '冒险模式';
				cc.ChapterCode = 2;
				this.initItemParam();
				break;
			case 'challenge':
				cc.ChapterModel = tag;
				cc.UseLocalLayerIndex = cc.LocalMinLayerIndex;
				cc.ChapterModelName = '挑战模式';
				cc.ChapterCode = 1;
				this.initItemParam();
				break;

			default:
				break;
		}
	},

	init() {
		this.animCtrl = this.content.getComponent(cc.Animation);
		this.chapterData = cc.DataMgr.getValue('chapterData');
		this.btns = this.btnArea.children;
		this.timers = [];
		this.pageItemMax = 9;
		this.initItemParam();
	},

	initItemParam() {
		this.checkModel();
		this.showItem();
	},

	checkModel() {
		if (cc.ChapterModel == 'risk') {
			this.useMaxLayerIndex = cc.LocalLayerIndex;
			this.pageIndex = Math.ceil((cc.LocalLayerIndex + 1) / this.pageItemMax);
			this.itemNormalMax = cc.MapMax + 1;
			this.btns[0].getChildByName('Background').getChildByName('bg1').active = false;
			this.btns[0].getChildByName('Background').getChildByName('bg2').active = true;
			this.btns[1].getChildByName('Background').getChildByName('bg1').active = true;
			this.btns[1].getChildByName('Background').getChildByName('bg2').active = false;
		} else {
			this.useMaxLayerIndex = cc.LocalMinLayerIndex;
			this.pageIndex = Math.ceil((cc.LocalMinLayerIndex + 1) / this.pageItemMax);
			this.itemNormalMax = cc.MinMapMax + 1;;
			this.btns[0].getChildByName('Background').getChildByName('bg1').active = true;
			this.btns[0].getChildByName('Background').getChildByName('bg2').active = false;
			this.btns[1].getChildByName('Background').getChildByName('bg1').active = false;
			this.btns[1].getChildByName('Background').getChildByName('bg2').active = true;
		}

		this.itemMax = this.itemNormalMax;
		this.pageMax = Math.ceil(this.itemMax / this.pageItemMax);
	},

	initPageItemNum() {
		if (this.pageIndex * this.pageItemMax <= this.itemMax) {
			this.pageItemNum = this.pageItemMax;
		} else {
			this.pageItemNum = this.itemMax % this.pageItemMax;
		}
	},

	showItem() {
		this.initPageItemNum();
		this.clearTimers();
		this.itemArea.removeAllChildren();
		for (let i = 0; i < this.pageItemNum; i++) {
			this.timers[i] = setTimeout(() => {
				this.curIndex = (this.pageIndex - 1) * this.pageItemMax + i;
				cc.GameUI.addItem(cc.GameConfig.PREFAB_TYPE.CHAPTERITEM, this.itemArea, { index: this.curIndex, itemMax: this.itemMax - 1, isLock: this.curIndex > this.useMaxLayerIndex, isNow: this.curIndex == this.useMaxLayerIndex });
				//cc.GameUI.addItem(cc.GameConfig.PREFAB_TYPE.CHAPTERITEM,this.itemArea,{index: this.curIndex,isLock: false,isNow: this.curIndex == cc.LocalLayerIndex});
			}, 80 * (i + 1));
		}

		this.pageLabel.string = `${this.pageIndex}/${this.pageMax}`;
	},

	clearTimers() {
		for (let key in this.timers) {
			clearTimeout(this.timers[key]);
		}

		this.timers = [];
	},

	dead() {
		cc.WxAdMgr.HideBannerAd();
		this.animCtrl.play('panelClose');
		this.scheduleOnce(() => {
			cc.ChapterPanel = null;
			this.node.destroy();
		}, 0.18);
	},
});
