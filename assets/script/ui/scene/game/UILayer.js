//电子邮件puhalskijsemen@gmail.com 
//源码网站 开vpn全局模式打开 http://web3incubators.com/ 
 //电报https://t.me/gamecode999 
 //网页客服 http://web3incubators.com/kefu.html  

cc.Class({
    extends: cc.Component,

    properties: {
        bloodArea: cc.Node,
		
		bloodText: cc.Label,
		liquidText: cc.Label,
		bloodVedio: cc.Node,
		liquidVedio: cc.Node,
		
		coinLabel: cc.Label,
		starLabel: cc.Label,
		starCollectLabel: cc.Label,
		//timeText: cc.Label,
		scoreText: cc.Label,
		chapterText: cc.Label,

        passTip: cc.Label,
		passBtn: cc.Node,
		pauseBtn: cc.Node,
		
		ui: cc.Node,
		panel: cc.Node,
		
		control: cc.Node,
		upArea: cc.Node,
		downArea: cc.Node,
		leftArea: cc.Node,
		rightArea: cc.Node,
		jumpArea: cc.Node,
		fireArea: cc.Node,
		
		bloodFinger: cc.Node,
		liquidFinger: cc.Node,
    },

    start () {
		cc.UILayer = this;
		
		this.init();
		this.addLisener();
    },
	
	/*update (dt) {
		if(cc.isPause){
			return;
		}
		
		
		this.checkTime();
	},*/
	
	init(){
		this.initBase();
		this.initControlRect();
		this.initValue();
		this.showPassInfo();
		this.checkGuide();
	},
	
	checkGuide(){
		if(cc.LayerIndex == 0 && !cc.FinishGuide){
			this.pauseBtn.active = false;
		}else{
			this.pauseBtn.active = true;
		}
	},
	
	onClick(event,tag){
		switch(tag){
			case 'pause':
			    cc.AudioMgr.playSound('button');
			    cc.GameUI.addItem(cc.GameConfig.PREFAB_TYPE.PAUSEPANEL,this.panel);
			    break;
				
		    case 'blood':
			case 'liquid':
			    cc.AudioMgr.playSound('button');
			    this.useProp(tag);
			    break;
				
			case 'record':
			    cc.AudioMgr.playSound('button');
			    this.checkRecord();
			    break;
				
			case 'hotGame':
			    //cc.WxAdMgr.showGridAd();
			    break;	
            case 'pass':
			    this.passChapter();
			    break;				
	
			default:
			    break;
		}
	},
	
	passChapter(){
		if(cc.MyPlat){
		    cc.WxAdMgr.ShowVideoAd((tag) => {
			    if(tag){
					cc.IsNext = true;
					cc.IsPassChapter = true;
					this.updateLocalChapterData();
					cc.GameUI.addItem(cc.GameConfig.PREFAB_TYPE.CHAPTERINFOPANEL,this.panel,{index: cc.LayerIndex + 1});
					cc.whole.updateValue('passTimes',-1);
					this.showPassInfo();
				}
		    });
		}else{
		    cc.IsNext = true;
		    cc.IsPassChapter = true;
			this.updateLocalChapterData();
			cc.GameUI.addItem(cc.GameConfig.PREFAB_TYPE.CHAPTERINFOPANEL,this.panel,{index: cc.LayerIndex + 1});
			cc.whole.updateValue('passTimes',-1);
            this.showPassInfo();			
	    }
	},
	
	checkChapterIndex() {
		if(cc.ChapterModel == 'risk'){
			if(cc.LayerIndex == cc.LocalLayerIndex){
			    cc.LocalLayerIndex ++;
			    cc.LocalLayerIndex = cc.LocalLayerIndex > cc.MapMax ? cc.MapMax : cc.LocalLayerIndex;
				cc.UseLocalLayerIndex = cc.LocalLayerIndex;
			    cc.whole.updateValue('layerIndex',cc.LocalLayerIndex);
		    }
		}else{
			if(cc.LayerIndex == cc.LocalMinLayerIndex){
			    cc.LocalMinLayerIndex ++;
			    cc.LocalMinLayerIndex = cc.LocalMinLayerIndex > cc.MinMapMax ? cc.MinMapMax : cc.LocalMinLayerIndex;
				cc.UseLocalLayerIndex = cc.LocalMinLayerIndex;
			    cc.whole.updateValue('minLayerIndex',cc.LocalMinLayerIndex);
		    }
		}
	},

	updateLocalChapterData(){
		//cc.Utils.postMessage({message: 'chapterPost',chapter: cc.LayerIndex,time: this.scoreValue});
		this.checkChapterIndex()
		this.time = cc.Game.useTime;
		this.chapterData = cc.DataMgr.getValue('chapterData');
		this.curChapterData = this.chapterData[cc.LayerIndex];
		if(this.curChapterData){
			if(this.score > this.curChapterData.score){
				this.curChapterData.score = this.score;
			}
			
			if(this.levelCode < this.curChapterData.levelCode){
				this.curChapterData.levelCode = this.levelCode;
			}
			
			if(this.time > 0 && this.time < this.curChapterData.time){
				this.curChapterData.time = this.time;
			}
		}else{
			let t = {};
			t['score'] = this.score;
			t['time'] = this.time;
			t['levelCode'] = this.levelCode;
			
            this.chapterData.push(t);
		}
		
		cc.DataMgr.setValue('chapterData',this.chapterData);
	},
	
	showPassInfo(){
		this.isNoPassTimes = cc.whole.passTimes <= 0;
		if(this.isNoPassTimes){
			this.passBtn.active = false;
		}else{
			this.passTip.string = `今日剩余次数:${cc.whole.passTimes}`;
		}
	},
	
	checkStarCollect(){
		cc.whole.checkCollectStar();
		this.colorValue = cc.Star >= 3 ? '#09FC9A' : '#FF1D02';
		this.starCollectLabel.node.color = this.color.fromHEX(this.colorValue);
		this.showStar();
	},
	
	showStar(){
		this.starCollectLabel.string = `${cc.Star}/3`;
	},
	
	initControlRect(){
		this.point = {};
		this.upRect = {};
		this.downRect = {};
		this.leftRect = {};
		this.rightRect = {};
		this.jumpRect = {};
		this.fireRect = {};
		
		this.point['x'] = 0;
		this.point['y'] = 0;
		
		this.upRect['x'] =  this.upArea.x - this.upArea.width / 2;
		this.upRect['y'] =  this.upArea.y - this.upArea.height / 2;
		this.upRect['width'] =  this.upArea.width;
		this.upRect['height'] =  this.upArea.height;
		
		this.downRect['x'] =  this.downArea.x - this.downArea.width / 2;
		this.downRect['y'] =  this.downArea.y - this.downArea.height / 2;
		this.downRect['width'] =  this.downArea.width;
		this.downRect['height'] =  this.downArea.height;
		
		this.leftRect['x'] =  this.leftArea.x - this.leftArea.height / 2;
		this.leftRect['y'] =  this.leftArea.y - this.leftArea.width / 2;
		this.leftRect['width'] =  this.leftArea.height;
		this.leftRect['height'] =  this.leftArea.width;
		
		this.rightRect['x'] =  this.rightArea.x - this.rightArea.height / 2;
		this.rightRect['y'] =  this.rightArea.y - this.rightArea.width / 2;
		this.rightRect['width'] =  this.rightArea.height;
		this.rightRect['height'] =  this.rightArea.width;
		
		this.jumpRect['x'] =  this.jumpArea.x - this.jumpArea.width / 2;
		this.jumpRect['y'] =  this.jumpArea.y - this.jumpArea.height / 2;
		this.jumpRect['width'] =  this.jumpArea.width;
		this.jumpRect['height'] =  this.jumpArea.height;
		
		this.fireRect['x'] =  this.fireArea.x - this.fireArea.width / 2;
		this.fireRect['y'] =  this.fireArea.y - this.fireArea.height / 2;
		this.fireRect['width'] =  this.fireArea.width;
		this.fireRect['height'] =  this.fireArea.height;
	},
	
	initBase(){
		this.color = cc.Color.RED;
		this.starCollectLabel.node.active = (cc.LayerIndex + 1) % 9 != 0;
		this.starX = this.starLabel.node.parent.x;
		this.starY = this.starLabel.node.parent.y;
		this.leftBtnBg = this.leftArea.getChildByName('Background');
		this.rightBtnBg = this.rightArea.getChildByName('Background');
		this.upBtnBg = this.upArea.getChildByName('Background');
		this.downBtnBg = this.downArea.getChildByName('Background');
		this.jumpBtnBg = this.jumpArea.getChildByName('Background');
		this.fireBtnBg = this.fireArea.getChildByName('Background');
		this.bloodRate = cc.GameConfig.CONSTANT.BLOOD_ANIMATION_RATE;
		this.starMax = 3;
		
		this.checkStarCollect();
		this.showProp();
	},
	
	initValue(cb){
		cc.BossNum = 0;
		this.coin = 0;
		this.score = 0;
		this.star = 0;
		this.levelCode = 0;
		this.initBlood(cb);
		this.showText();
	},
	
	initBlood(cb){
		this.bloods = [];
		this.bloodCount = 0;
		this.bloodSize = cc.GameConfig.CONSTANT.PLAYER_BLOOD;
		this.buyMaxBloodR = cc.GameConfig.CONSTANT.BUY_MAX_BLOODR;
		if(cc.MoreBlood){
			this.bloodSize = this.bloodSize * 2;
		}else{
			this.curBuyBloodR = cc.whole.prop.bloodr.value;
			if(this.curBuyBloodR > 0){
				this.curBuyBloodR = this.curBuyBloodR > this.buyMaxBloodR ?  this.buyMaxBloodR : this.curBuyBloodR;
				this.bloodSize = this.bloodSize + this.curBuyBloodR;
			    cc.whole.updateValue('bloodr',-this.curBuyBloodR);
			}
		}
		
		this.bloodArea.removeAllChildren();
		for(let i = 0; i < this.bloodSize; i ++){
			cc.GameUI.addItem(cc.GameConfig.PREFAB_TYPE.BLOODITEM,this.bloodArea,null,(node) => {
				this.bloods.push(node);
				this.bloodCount ++;
				if(this.bloodCount >= this.bloodSize){
					cb && cb();
				}
			});
		}
	},
	
	showText(){
		this.coinLabel.string = this.coin;
		this.starLabel.string = this.star;
		this.scoreText.string = this.score;
		//this.timeText.string = cc.Utils.conversionTime(this.time);
		this.chapterText.string = (cc.LayerIndex + 1);
	},
	
	showProp(){
		if(cc.whole.prop.blood.value > 0){
			this.bloodVedio.active = false;
			this.bloodText.node.active = true;
			this.bloodText.string = cc.whole.prop.blood.value;
		}else{
			this.bloodVedio.active = true;
			this.bloodText.node.active = false;
		}
		
		if(cc.whole.prop.liquid.value > 0){
			this.liquidVedio.active = false;
			this.liquidText.node.active = true;
			this.liquidText.string = cc.whole.prop.liquid.value;
		}else{
			this.liquidVedio.active = true;
			this.liquidText.node.active = false;
		}
	},
	
	useProp(key){
		if(key == 'blood'){
		    cc.whole.useProp(key,(tag) => {
				if(tag){
					cc.Player.resetBlood();
					this.resetBlood();
				}
				
				this.showProp();
			})
		}else if(key == 'liquid'){
			cc.whole.useProp(key,(tag) => {
				if(tag){
					this.liquidFinger.active = false;
					cc.Player.wake();
				}
				
				this.showProp();
			})
		}
	},
	
	setPlayerDirect(){
		if(!cc.Player){
			return;
		}
		
		if(cc.MathUtil.pointInRect(this.point,this.upRect)){
			cc.Player.setUp();
			cc.Player.noDown();
			cc.Player.noLeft();
			cc.Player.noRight();
				
			this.upBtnBg.scale = -1.05;
			this.downBtnBg.scale = 1;
			this.leftBtnBg.scale = 1;
			this.rightBtnBg.scale = 1;
		}else if(cc.MathUtil.pointInRect(this.point,this.downRect)){
			cc.Player.noUp();
			cc.Player.setDown();
			cc.Player.noLeft();
			cc.Player.noRight();
				
			this.upBtnBg.scale = -1;
			this.downBtnBg.scale = 1.05;
			this.leftBtnBg.scale = 1;
			this.rightBtnBg.scale = 1;
		}else if(cc.MathUtil.pointInRect(this.point,this.leftRect)){
			cc.Player.noUp();
			cc.Player.noDown();
			cc.Player.setLeft();
			cc.Player.noRight();
				
			this.upBtnBg.scale = -1;
			this.downBtnBg.scale = 1;
			this.leftBtnBg.scale = 1.05;
			this.rightBtnBg.scale = 1;
		}else if(cc.MathUtil.pointInRect(this.point,this.rightRect)){
			cc.Player.noUp();
			cc.Player.noDown();
			cc.Player.noLeft();
			cc.Player.setRight();
				
			this.upBtnBg.scale = -1;
			this.downBtnBg.scale = 1;
			this.leftBtnBg.scale = 1;
			this.rightBtnBg.scale = 1.05;
		}
	},
	
	addLisener(){
		this.control.on(cc.Node.EventType.TOUCH_START,(event) => {
			this.point.x = event.getLocationX();
			this.point.y = event.getLocationY();
			this.setPlayerDirect();
		},this);
		
		this.control.on(cc.Node.EventType.TOUCH_MOVE,(event) => {
			this.point.x = event.getLocationX();
			this.point.y = event.getLocationY();
			this.setPlayerDirect();
		},this);
		
		this.control.on(cc.Node.EventType.TOUCH_END,(event) => {
			if(cc.Player){
				cc.Player.noUp();
				cc.Player.noDown();
				cc.Player.noLeft();
				cc.Player.noRight();
				
				this.upBtnBg.scale = -1;
				this.downBtnBg.scale = 1;
				this.leftBtnBg.scale = 1;
				this.rightBtnBg.scale = 1;
				this.fireBtnBg.scale = 1;
				this.jumpBtnBg.scale = 1;
			}
		},this);
		
		this.control.on(cc.Node.EventType.TOUCH_CANCEL,(event) => {
			if(cc.Player){
				cc.Player.noUp();
				cc.Player.noDown();
				cc.Player.noLeft();
				cc.Player.noRight();
				
				this.upBtnBg.scale = -1;
				this.downBtnBg.scale = 1;
				this.leftBtnBg.scale = 1;
				this.rightBtnBg.scale = 1;
				this.fireBtnBg.scale = 1;
				this.jumpBtnBg.scale = 1;
			}
		},this);
		
		this.jumpArea.on(cc.Node.EventType.TOUCH_START,(event) => {
			cc.Player.setJump();
			this.jumpBtnBg.scale = 1.05;
		},this);
		
		this.jumpArea.on(cc.Node.EventType.TOUCH_END,(event) => {
			this.jumpBtnBg.scale = 1;
		},this);
		
		this.jumpArea.on(cc.Node.EventType.TOUCH_CANCEL,(event) => {
			this.jumpBtnBg.scale = 1;
		},this);
		
		this.fireArea.on(cc.Node.EventType.TOUCH_START,(event) => {
			cc.Player.setFire();
			this.fireBtnBg.scale = 1.05;
		},this);
		
		this.fireArea.on(cc.Node.EventType.TOUCH_END,(event) => {
			this.fireBtnBg.scale = 1;
		},this);
		
		this.fireArea.on(cc.Node.EventType.TOUCH_CANCEL,(event) => {
			this.fireBtnBg.scale = 1;
		},this);
	},
	
	updateValue (key ,value) {
		switch(key){
			case 'coin':
			    this.coin += value;
				this.coinLabel.string = this.coin;
			    break;
			case 'star':
			    cc.Star += value;
			    this.star += value;
				this.starLabel.string = this.star;
				this.showStar();
			    break;
			case 'score':
			    this.score += value;
				this.scoreText.string = this.score;
			    break;
			default:
			    break;
		}
	},
	
	hideBlood(index){
		if(index <= 1){
			this.bloodFinger.active = true;
		}
		
		//cc.log('bloodIndex:'+index);
		for(let i = 0; i< this.bloodSize; i++){
			this.bloods[i].getChildByName('bg1').active = i >= index;
            this.bloods[i].getChildByName('bg2').active = i < index;
		}
    },

    resetBlood(){
		this.bloodFinger.active = false;
		for(let i = 0; i < this.bloodSize; i++){
            this.bloods[i].getChildByName('bg1').active = false;
            this.bloods[i].getChildByName('bg2').active = true;
        }
    },
	
	continuePlay(){
		this.bloodFinger.active = false;
		this.initBlood();
		cc.Player.continuePlay();
	},
	
	restart(){
		this.initValue(() => {
			this.resetBlood();
		});
		this.checkStarCollect();
	},
});
