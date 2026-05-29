//电子邮件puhalskijsemen@gmail.com 
//源码网站 开vpn全局模式打开 http://web3incubators.com/ 
 //电报https://t.me/gamecode999 
 //网页客服 http://web3incubators.com/kefu.html  
const GameConfig = require('GameConfig');
cc.Class({
    extends: cc.Component,

    properties: {
		ui: cc.Node,
		panel: cc.Node,
		
		passTip: cc.Label,
		passBtn: cc.Node,
		
		resetBtn: cc.Node,
		
        coinText: cc.Label,
		starText: cc.Label,
		strengthText: cc.Label,
		recoverSTText: cc.Label,
    },

    start () {
		cc.wholeUI = this;
        cc.game.addPersistRootNode(this.node);
      
		this.init();
    },
	
	onClick(event,tag){
		cc.AudioMgr.playSound('button');
		switch(tag){
            case 'moreGame':
			    cc.WxAdMgr.showGridAd();
			    break;
			case 'coin':
			case 'star':
			case 'strength':
			     cc.GameUI.addItem(cc.GameConfig.PREFAB_TYPE.STRENGTHPANEL,this.panel,{key: tag});
			    break;
			case 'BAGPANEL':
			    this.addPanel(tag);
			    break;
			case 'pass':
			    cc.whole.passChapter();
			    break;
		    case 'resetGame':
			    this.resetGame();
			    break;
				
			default:
			    break;
		}
	},
	
	init(){
		cc.whole.initLoaclData();
		cc.whole.checkRecoverST();
		
		this.showPropValue();
	},
	
	showUI(tag,showPassBtn){
		this.ui.active = tag;
		//this.resetBtn.active = true;
		/*if(this.isNoPassTimes){
			this.passBtn.active = false;
		}else{
			if(showPassBtn){
			    this.passBtn.active = true;
		    }else{
			    this.passBtn.active = false;
		    }
		}*/
		
	},
	
	addPanel(tag){
		cc.GameUI.addItem(cc.GameConfig.PREFAB_TYPE[tag],this.panel);
	},
	
	showPropValue(){
		this.coinText.string = cc.whole.coin;
		this.starText.string = cc.whole.star;
		this.strengthText.string = cc.whole.strength;
	},
	
	resetGame(){
		cc.sys.localStorage.removeItem('SQUIRREL_WAR_DATA');
		this.scheduleOnce(() => {
			cc.whole.isPause = true;
			cc.game.pause();
			cc.game.restart();
        },0.2);
	},
});
