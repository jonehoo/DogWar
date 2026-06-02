//  Su.GuiCuan

cc.Class({
	extends: cc.Component,

	properties: {
		timesLabel: cc.Label,
		startBtn: cc.Button,
		content: cc.Node,
		itemArea: cc.Node,
	},

	start() {
		setTimeout(() => {
			cc.WxAdMgr.ShowInterstitialAd();
		}, 2000);
	},

	onShow() {
		//cc.WxAdMgr.ShowBannerAd();
		cc.LotterPanel = this;
		this.init();

		cc.GameEvent.send("打开抽奖窗口");
	},

	update() {
		this.turn();
	},

	onClick(event, tag) {
		cc.AudioMgr.playSound('button');
		switch (tag) {
			case 'start':
				cc.GameEvent.send("点击抽奖按钮");
				this.begin();
				break;

			case 'close':
				this.dead();
				break;

			case 'addTimes':
				cc.GameEvent.send("点击增加抽奖次数按钮");
				cc.WxAdMgr.ShowVideoAd((tag) => {
					if (tag) {
						cc.GameEvent.send("增加抽奖次数成功");
						this.addTimes();
					} else {
						cc.GameEvent.send("增加抽奖次数失败");
					}
				});
				break;
			default:
				break;
		}
	},

	init() {
		this.animCtrl = this.content.getComponent(cc.Animation);
		this.items = this.itemArea.children;
		//this.c1 = this.items[5].getChildByName('c1');
		//this.c2 = this.items[5].getChildByName('c2');
		this.itemLength = this.items.length;
		this.itemMax = this.itemLength - 1;
		this.conf = cc.ObjConfig.LOTTER;

		this.initParam();
		this.initItem();
		this.show();
	},

	show() {
		this.timesLabel.string = `${cc.whole.lotterTicket}`;
	},

	turn() {
		if (!this.isTurn) {
			return
		}

		this.time++;
		if (this.time >= this.rate) {
			this.check();
			this.time = 0;
		}
	},

	check() {
		this.scripts[this.index].setSelect(false);
		this.index++;
		if (this.index > this.itemMax) {
			this.index = 0;
		}

		this.scripts[this.index].setSelect(true);
		if (this.index == this.targetIndex) {
			this.turnCount++;
		}

		if (this.turnCount == this.turnMax - 1) {
			if (this.index >= this.realSlow) {
				if (this.isBig) {
					if (this.index < this.targetIndex) {
						this.rate = 6;
					}
				} else {
					this.rate = 6;
				}
			}
		}

		if (this.turnCount >= this.turnMax) {
			this.end();
			this.isTurn = false;
		}
	},

	addTimes() {
		cc.whole.updateValue('lotterTicket', 3);
		//cc.Main.checkLotterReddot();
		this.timesLabel.string = `${cc.whole.lotterTicket}`;
	},

	initParam() {
		this.isTurn = false;
		this.index = 0;
		this.targetIndex = 0;
		this.time = 0;
		this.rate = 2;
		this.turnCount = 0;
		this.turnMax = 4;
		this.slowCount = 2;

		this.initWeight();
	},

	initWeight() {
		//this.unLockAllSkin = cc.DataMgr.getValue('unLockAllSkin');
		//this.c1.active = !this.unLockAllSkin;
		//this.c2.active = this.unLockAllSkin;
		this.weights = [];
		for (let key in this.conf) {
			let t = this.conf[key];
			if (t.weight) {
				this.weights.push(t.weight);
			} else {
				this.weights.push(t.c2.weight);
			}
		}
	},

	initItem() {
		this.scripts = [];
		for (let key in this.items) {
			let script = this.items[key].getComponent('LotterItem');
			this.scripts.push(script);
		}
	},

	checkSlow() {
		let t = this.targetIndex - this.slowCount;
		if (t >= 0) {
			this.realSlow = t;
			this.isBig = true;
		} else {
			this.realSlow = this.itemLength + t;
			this.isBig = false;
		}
	},

	begin() {
		if (cc.whole.lotterTicket <= 0) {
			cc.Utils.showToast('抽奖次数用完了!');
			return;
		}

		if (cc.whole.lotterTicket >= 1) {
			cc.whole.updateValue('lotterTicket', -1);
			//cc.Main.checkLotterReddot();
			this.timesLabel.string = `${cc.whole.lotterTicket}`;
		}

		this.resetBtn(false);
		this.isBegin = true;
		this.targetIndex = cc.Utils.generateResult(this.weights);
		this.isTurn = true;
		this.rate = 3;
		this.turnCount = 0;
		this.turnMax = Math.round(Math.random() * 1000) % 5 + 4;
		this.slowCount = Math.round(Math.random() * 1000) % 3 + 3;
		this.checkSlow();
	},

	end() {
		this.scheduleOnce(() => {
			cc.GameEvent.send('抽奖结束', { 'lotter_end': '抽奖结束' });
			if (this.targetIndex == 5) {

				cc.GameUI.addItem(cc.GameConfig.PREFAB_TYPE.LOTTERRESULTPANEL, cc.Main.panel, this.conf[this.targetIndex].c2, () => {
					this.resetBtn(true);
				});

			} else {
				cc.GameUI.addItem(cc.GameConfig.PREFAB_TYPE.LOTTERRESULTPANEL, cc.Main.panel, this.conf[this.targetIndex], () => {
					this.resetBtn(true);
				});
			}
		}, 0.2);
	},

	resetBtn(tag) {
		this.startBtn.interactable = tag;
		this.startBtn.enableAutoGrayEffect = !tag;
	},

	dead() {
		if (this.isTurn) {
			cc.Utils.showToast('抽奖中,不能关闭');
			return;
		}

		//cc.WxAdMgr.HideBannerAd();
		this.animCtrl.play('panelClose');
		this.scheduleOnce(() => {
			cc.LotterPanel = null;
			this.node.destroy();
		}, 0.18);
	},
});
