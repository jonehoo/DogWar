//  Su.GuiCuan

cc.Class({
	extends: cc.Component,

	properties: {
		bg: cc.Node,
		bg1: cc.Node,
		bg2: cc.Node,

		panel: cc.Node,

		chapterText: cc.Label,
		chapterBtn: cc.Button,
		minChapterText: cc.Label,


		onlineBgNode: cc.Node,
		onlineReview: cc.Node,
		//onlineTimeLabel: cc.Label,
	},

	start() {
		cc.Main = this;
		cc.SceneCode = 1;
		cc.wholeUI.showUI(true);

		this.init();
		this.checkGuide();
	},

	checkGuide() {
		if (cc.GuideStep == 0) {
			cc.Utils.checkGuide(0, this.node);
		} else if (cc.GuideStep == 5) {
			cc.Utils.checkGuide(6, this.node);
		}
	},

	update(dt) {
		this.bgMove();
	},

	onClick(event, tag) {
		cc.AudioMgr.playSound('button');
		switch (tag) {
			case 'playRisk':
				this.riskStart();
				break;
			case 'playChallenge':
				this.challengeStart();
				break;
			case 'share':
				this.share();
				break;
			case 'CHAPTERPANEL':
			case 'LOTTERPANEL':
			case 'SHOPPANEL':
			case 'AUTHORPANEL':
			case 'SKILLPANEL':
			case 'ONLINEPANEL':
			case 'STATIONPANEL':
				this.showPanel(tag);
				break;

			default:
				break;
		}
	},

	init() {
		this.isOnlineAction = false;
		this.unlockChapter = cc.GameConfig.CONSTANT.UNLOCK_CHAPTER;
		this.initBg();
		this.initWxEntryButtons();
		this.show();
	},
	//电子邮件puhalskijsemen@gmail.com
	//源码网站 开vpn全局模式打开 http://web3incubators.com/
	//电报https://t.me/gamecode999

	initBg() {
		this.sw = cc.winSize.width;
		this.sh = cc.winSize.height;

		this.itemWidth = cc.GameConfig.CONSTANT.BG_ITEM_WIDTH;
		this.th = Math.ceil(this.sh / this.itemWidth) * this.itemWidth;

		this.bg1.width = this.sw;
		this.bg1.height = this.th;
		this.bg1.x = 0;
		this.bg1.y = 0;

		this.bg2.width = this.sw;
		this.bg2.height = this.th;
		this.bg2.x = 0;
		this.bg2.y = this.th;
	},

	show() {
		this.isUlockChapter = cc.LocalMinLayerIndex > this.unlockChapter;
		this.chapterText.string = this.isUlockChapter ? `第${cc.LocalLayerIndex + 1}关` : `完成挑战模式第${this.unlockChapter + 1}关解锁`;
		this.minChapterText.string = `第${cc.LocalMinLayerIndex + 1}关`;
		this.chapterBtn.interactable = this.isUlockChapter;
		this.chapterBtn.enableAutoGrayEffect = !this.isUlockChapter;
	},

	runOnlineAction(isAction) {
		if (isAction) {
			this.onlineReview.active = true;
			if (!this.isOnlineAction) {
				this.onlineBgNode.runAction(cc.repeatForever(cc.sequence(cc.rotateTo(0.1, 20), cc.rotateTo(0.15, 0), cc.rotateTo(0.1, -20), cc.rotateTo(0.15, 0), cc.delayTime(0.8))));
			}
		} else {
			this.onlineReview.active = false;
			this.onlineBgNode.stopAllActions();
		}

		this.isOnlineAction = isAction;
	},

	/*checkOnline(){
		if(cc.whole.onlineData.count >= 3){
			this.onlineBgNode.parent.active = false;
		}else{
			if(cc.whole.onlineData.canReview){
				this.onlineBgNode.runAction(cc.repeatForever(cc.sequence(cc.rotateTo(0.1,20),cc.rotateTo(0.15,0),cc.rotateTo(0.1,-20),cc.rotateTo(0.15,0),cc.delayTime(0.8))));
				this.onlineReview.active = true;
				this.onlineTimeLabel.node.active = false;
			}else{
				this.onlineReview.active = false;
				this.onlineTimeLabel.node.active = true;
				this.onlineTimeLabel.string = cc.Utils.conversionTime(cc.whole.onlineTime);
				this.onlineBgNode.stopAllActions();
				this.onlineBgNode.angle = 0;
			}
		}
	},*/

	bgMove() {
		this.bg1.y -= 1;
		this.bg2.y -= 1;
		if (this.bg1.y < -this.th) {
			this.bg1.y = this.bg2.y + this.th;
		}

		if (this.bg2.y < -this.th) {
			this.bg2.y = this.bg1.y + this.th;
		}
	},

	share() {
		/*if(!cc.MyPlat){
			return;
		}
		
		let param = {
		   title: '狗狗大作战2026',
		   imageUrl: cc.whole.sharePicPath,
		   query: 'a=b'
		}
		
		sqSdk.getDyb().share(param, function callback(){});*/
	},

	initWxEntryButtons() {
		if (this.wxEntryInited) {
			return;
		}
		this.wxEntryInited = true;

		this.rankBtnNode = this.findNodeByName(this.node, 'rank');
		if (this.rankBtnNode) {
			this.rankBtnNode.active = true;
			this.bindMainButton(this.rankBtnNode, () => {
				this.openRank();
			});
		}

		// 仅绑定场景里已存在的社区按钮，不再动态克隆创建，避免重复。
		// 优先使用你项目里的 community 节点，club 作为兼容兜底。
		this.clubBtnNode = this.findNodeByName(this.node, 'community');
		if (!this.clubBtnNode) {
			this.clubBtnNode = this.findNodeByName(this.node, 'club');
		}
		if (this.clubBtnNode) {
			this.clubBtnNode.active = true;
			// 微信环境下社区按钮由原生透明按钮接管点击，不再绑定 Cocos 点击，避免误触提示。
			if (!(window.wx && cc.MyPlat)) {
				this.bindMainButton(this.clubBtnNode, () => {
					this.openGameClub();
				});
			}
		}

		if (window.wx && cc.MyPlat && this.clubBtnNode) {
			cc.Utils.createAndBindGameClubButton(this.clubBtnNode);
		}
	},

	findNodeByName(root, name) {
		if (!root) {
			return null;
		}
		if (root.name === name) {
			return root;
		}

		for (let i = 0; i < root.childrenCount; i++) {
			let ret = this.findNodeByName(root.children[i], name);
			if (ret) {
				return ret;
			}
		}
		return null;
	},

	bindMainButton(node, cb) {
		node.off(cc.Node.EventType.TOUCH_END);
		node.on(cc.Node.EventType.TOUCH_END, () => {
			cc.AudioMgr.playSound('button');
			cb && cb();
		});
	},

	setButtonText(node, text) {
		let labels = node.getComponentsInChildren(cc.Label);
		if (!labels || labels.length == 0) {
			return;
		}
		labels[0].string = text;
	},

	openRank() {
		cc.Utils.showWxRank();
	},

	openGameClub() {
		if (!window.wx || !cc.MyPlat) {
			cc.Utils.showToast('仅支持微信小游戏游戏圈');
			return;
		}

		cc.Utils.createAndBindGameClubButton(this.clubBtnNode);
	},

	riskStart() {
		cc.Utils.hideGameClubButton && cc.Utils.hideGameClubButton();
		cc.ChapterModel = 'risk';
		cc.ChapterModelName = '冒险模式';
		cc.ChapterCode = 2;
		cc.UseLocalLayerIndex = cc.LocalLayerIndex;
		cc.GameUI.addItem(cc.GameConfig.PREFAB_TYPE.CHAPTERINFOPANEL, this.panel, { index: cc.LocalLayerIndex });
	},

	challengeStart() {
		cc.Utils.hideGameClubButton && cc.Utils.hideGameClubButton();
		cc.ChapterModel = 'challenge';
		cc.ChapterModelName = '挑战模式';
		cc.ChapterCode = 1;
		cc.UseLocalLayerIndex = cc.LocalMinLayerIndex;
		cc.GameUI.addItem(cc.GameConfig.PREFAB_TYPE.CHAPTERINFOPANEL, this.panel, { index: cc.LocalMinLayerIndex });
	},

	showPanel(tag) {
		cc.GameUI.addItem(cc.GameConfig.PREFAB_TYPE[tag], this.panel);
	},

	updateValue(key, value) {
		switch (key) {
			case 'coin':
				cc.whole.updateValue(key, value);
				//this.coinText.string = cc.Utils.dataMoney(cc.whole.coin);
				break;

			case 'strength':
				cc.whole.updateValue(key, value);
				//this.strengthText.string = cc.Utils.dataMoney(cc.whole.strength);
				break;

			case 'star':
				cc.whole.updateValue(key, value);
				//this.starText.string = cc.Utils.dataMoney(cc.whole.star);
				break;

			default:
				break;
		}
	},

	onDisable() {
		cc.Utils.hideGameClubButton && cc.Utils.hideGameClubButton();
	},

	onDestroy() {
		cc.Utils.hideGameClubButton && cc.Utils.hideGameClubButton();
	},
});
