//  Su.GuiCuan

cc.Class({
	extends: cc.Component,

	properties: {
		content: cc.Node,
		itemArea: cc.Node,
		closeBtn: cc.Node,
		vedioIcon: cc.Node,
	},

	start() {
		setTimeout(() => {
			cc.WxAdMgr.ShowInterstitialAd();
		}, 2000);
	},

	onShow(data) {
		cc.Station = this;
		cc.WxAdMgr.ShowBannerAd();

		this.layerIndex = data.index;
		this.init();

		//cc.GameEvent.send("打开商店窗口");
	},

	init() {
		this.animCtrl = this.content.getComponent(cc.Animation);
		this.shopCfg = cc.ObjConfig.SHOP;
		this.keys = Object.keys(this.shopCfg);
		this.isClick = false;
		this.show();
	},

	show() {
		this.checkItem();
		this.checkGuideShow();

		this.scheduleOnce(() => {
			this.closeBtn.active = true;
		}, 2);

		this.scheduleOnce(() => {
			cc.Utils.checkGuide(3, this.node);
		}, 0.2);
	},

	onClick(event, tag) {
		cc.AudioMgr.playSound('button');
		switch (tag) {
			case 'close':
				cc.MoreBlood = false;
				this.dead();
				break;
			case 'double':
				if (this.isGuide) {
					cc.MoreBlood = true;
					this.dead();
				} else {
					cc.GameEvent.send("点击双倍血量按钮");
					cc.WxAdMgr.ShowVideoAd((tag) => {
						if (tag) {
							cc.MoreBlood = true
							cc.GameEvent.send("使用双倍血量成功");
							this.dead();
						} else {
							cc.GameEvent.send("使用双倍血量失败");
						}
					});
				}
				break;
			default:
				break;
		}
	},

	checkGuideShow() {
		if (cc.LocalMinLayerIndex == 0 && !cc.FinishGuide) {
			this.isGuide = true;
			this.vedioIcon.active = false;
			this.closeBtn.active = true;
		} else {
			this.isGuide = false;
			this.vedioIcon.active = true;
		}
	},

	checkItem() {
		this.realArr = [];
		this.needArr = [];
		for (let k in this.keys) {
			let value = 0;
			let t = this.shopCfg[this.keys[k]];

			if (t.tempKey) {
				let m = cc.DataMgr.getValue(t.bigKey);
				if (m[t.key] || m[t.tempKey]) {
					value = 1;
				} else {
					value = 0;
				}
			} else {
				if (t.bigKey == t.key) {
					value = cc.DataMgr.getValue(t.key);
				} else {
					let p = cc.DataMgr.getValue(t.bigKey);
					value = p[t.key].value;
				}
			}


			if (value <= 0) {
				this.needArr.push(t.key);
			}
		}

		this.needNum = this.needArr.length;
		if (this.needNum < 3) {
			this.replenishItem();
		} else if (this.needNum > 3) {
			this.randomItem();
		} else {
			for (let key in this.needArr) {
				this.realArr.push(this.needArr[key]);
			}
		}

		this.addItem();
	},

	randomItem() {
		this.indexArr = [];
		this.addIndex();

		for (let key in this.indexArr) {
			this.realArr.push(this.needArr[this.indexArr[key]]);
		}
	},

	addIndex() {
		if (this.indexArr.length >= 3) {
			return;
		}

		let l = Math.round(Math.random() * 1000) % this.needNum;
		//cc.log(l,this.indexArr);
		let isAdd = true;
		for (let key in this.indexArr) {
			if (l == this.indexArr[key]) {
				isAdd = false;
				break;
			}
		}

		if (isAdd) {
			this.indexArr.push(l);
		}

		this.addIndex();
	},

	replenishItem() {
		this.stationArr = cc.ObjConfig.STATION;
		for (let key in this.needArr) {
			this.realArr.push(this.needArr[key]);
		}

		for (let key in this.stationArr) {
			let isAdd = true;
			let i = this.stationArr[key];
			for (let k in this.realArr) {
				if (i == this.realArr[k]) {
					isAdd = false;
					break;
				}
			}

			if (isAdd) {
				this.realArr.push(i);
				this.needNum = this.realArr.length;
				if (this.needNum >= 3) {
					break;
				}
			}
		}
	},

	addItem() {
		//cc.log(this.realArr);
		for (let i = 0; i < this.realArr.length; i++) {
			cc.GameUI.addItem(cc.GameConfig.PREFAB_TYPE.STATIONITEM, this.itemArea, { key: this.realArr[i] });
		}
	},

	play() {
		this.isClick = true;
		cc.WxAdMgr.HideBannerAd();
		cc.IsPassChapter = false;
		cc.Station = null;
		cc.Guide && cc.Guide.dead();
		cc.LayerIndex = this.layerIndex;
		cc.wholeUI.showUI(false);
	},

	toGameSecne() {
		this.play();
		cc.director.loadScene('game');
	},

	dead() {
		cc.WxAdMgr.HideBannerAd();
		if (this.isClick) {
			return;
		}

		if (cc.SceneCode == 1) {
			this.toGameSecne();
		} else {
			this.play();
			cc.Game.restart();
			this.node.destroy();
		}
	},
});
