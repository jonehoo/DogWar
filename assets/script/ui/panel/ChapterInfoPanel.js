//  Su.GuiCuan

cc.Class({
	extends: cc.Component,

	properties: {
		chapterText: cc.Label,
		coinText: cc.Label,
		starText: cc.Label,
		strengthText: cc.Label,
		ticketText: cc.Label,

		content: cc.Node,
		rewardList: cc.Node,
		rewarded: cc.Node,
	},

	start() {
		cc.WxAdMgr.ShowInterstitialAd();
	},

	onShow(data) {
		//cc.EndPanel && cc.EndPanel.dead();
		cc.WxAdMgr.ShowBannerAd();
		this.layerIndex = data.index;
		this.init();

		this.scheduleOnce(() => {
			cc.Utils.checkGuide(2, this.node);
		}, 0.2);
	},

	init() {
		this.animCtrl = this.content.getComponent(cc.Animation);
		this.isClick = false;
		this.checkStrength();
		this.checkChapterInfo();
	},


	checkStrength() {
		if (cc.ChapterCode == 1) {
			cc.NeedStrength = 1;
		} else {
			cc.NeedStrength = 2;
		}
	},

	checkChapterInfo() {
		if (cc.ChapterModel == 'risk') {
			this.useMap = cc.Map;
			this.useMaps = cc.Maps;
			this.useMapMax = cc.MapMax;
		} else {
			this.useMap = cc.MinMap;
			this.useMaps = cc.MinMaps;
			this.useMapMax = cc.MinMapMax;
		}

		this.layerIndex = this.layerIndex > this.useMapMax ? this.useMapMax : this.layerIndex;
		this.layerName = this.useMaps[this.layerIndex];
		this.layerConf = cc.ObjConfig.LAYERCONF[this.layerName];
		this.show();
	},

	show() {
		if (this.layerIndex >= cc.UseLocalLayerIndex) {
			this.rewardList.active = true;
			this.rewarded.active = false;
			this.chapterText.string = `第${this.layerIndex + 1}关`;
			this.coinText.string = `x${this.layerConf.reward.coin}`;
			this.starText.string = `x${this.layerConf.reward.star}`;
			this.strengthText.string = `x${this.layerConf.reward.strength}`;
			this.ticketText.string = `x${this.layerConf.reward.lotterTicket}`;
		} else {
			this.rewardList.active = false;
			this.rewarded.active = true;
		}
	},

	onClick(event, tag) {
		cc.AudioMgr.playSound('button');
		switch (tag) {
			case 'close':
				if (cc.SceneCode == 1) {
					this.dead();
				} else {
					this.toMain();
				}
				break;
			case 'start':
				this.reduceStrength();
				break;
			default:
				break;
		}
	},


	reduceStrength() {
		if (this.layerIndex == cc.UseLocalLayerIndex) {
			if (cc.whole.strength >= cc.NeedStrength) {
				this.play();
			} else {
				cc.GameUI.addItem(cc.GameConfig.PREFAB_TYPE.STRENGTHPANEL, cc.wholeUI.panel);
			}
		} else {
			this.play();
		}
	},

	toMain() {
		this.scheduleOnce(() => {
			cc.Player = null;
			cc.UILayer = null;
			cc.Game = null;
			cc.EndPanel = null;
			//cc.wholeUI.showUI(false);
			cc.director.loadScene('main');
		}, 0.1);

		setTimeout(() => {
			cc.WxAdMgr.ShowInterstitialAd();
		}, 2000);
	},

	play() {
		if (cc.SceneCode == 1) {
			cc.GameUI.addItem(cc.GameConfig.PREFAB_TYPE.DOUBLEPANEL, cc.Main.panel, { index: this.layerIndex });
		} else {
			cc.GameUI.addItem(cc.GameConfig.PREFAB_TYPE.DOUBLEPANEL, cc.UILayer.panel, { index: this.layerIndex });
		}

		this.dead();
	},

	dead() {
		cc.WxAdMgr.HideBannerAd();
		this.animCtrl.play('panelClose');
		this.scheduleOnce(() => {
			this.node.destroy();
		}, 0.18);
	},
});
