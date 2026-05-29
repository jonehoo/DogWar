//电子邮件puhalskijsemen@gmail.com 
//源码网站 开vpn全局模式打开 http://web3incubators.com/ 
 //电报https://t.me/gamecode999 
 //网页客服 http://web3incubators.com/kefu.html  

cc.Class({
    extends: cc.Component,

    properties: {
        content: cc.Node,
		
		coinText: cc.Label,
		starText: cc.Label,
		strengthText: cc.Label,
		ticketText: cc.Label,
		
		reviewBtn: cc.Node,
    },

    onShow () {
		cc.EndRewardPanel = this;
		cc.WxAdMgr.ShowBannerAd();
        this.init();
		this.animCtrl = this.content.getComponent(cc.Animation);
		cc.EndPanel.canClick = true;
		this.scheduleOnce(() => {
		   cc.wholeUI.showUI(true,!cc.IsWin);
		}, 0.5);
		
		this.scheduleOnce(() => {
            this.reviewBtn.active = true;
        },3);
    },
	
	onClick(event,tag){
		cc.AudioMgr.playSound('button');
		switch(tag){
            case 'close':
			    this.review(1);
			    break;
				
            case 'review':
			    cc.GameEvent.send("点击结束页面领取按钮");
			    this.review(1);
			    break;	
			
			case 'review2':
			    cc.GameEvent.send("点击结束页面双倍领取按钮");
			    cc.WxAdMgr.ShowVideoAd((tag) => {
					if(tag){
						cc.GameEvent.send("结束页面双倍领取成功");
						this.review(2);
					}else{
						cc.GameEvent.send("结束页面双倍领取失败");
					}
		        });
			   
			    break
            				
			default:
			    break;
		}
	},
	
	init(){
	   this.showValue();
	},
	
	showValue(){
		if(cc.LayerIndex + 1 >= cc.UseLocalLayerIndex && cc.IsWin){
			let p = cc.Game.curConf.reward.coin;
			if(cc.Player.blood){
				if(cc.Player.blood >= 3){
				    p = cc.Game.curConf.reward.coin;
			    }else{
				    p = Math.floor(cc.Game.curConf.reward.coin * cc.Player.blood / 3);
			    }
			}
			
			this.coinText.string = cc.UILayer.coin + p;
		    this.starText.string = cc.UILayer.star + cc.Game.curConf.reward.star;
			this.strengthText.string = cc.Game.curConf.reward.strength;
		    this.ticketText.string = cc.Game.curConf.reward.lotterTicket;
		}else{
			this.coinText.string = cc.UILayer.coin;
		    this.starText.string = cc.UILayer.star;
		}
	},
	
	review(p){
		let realCoin = 0;
		let realStar = 0 ;
		let realStrength = 0;
		let realTicket = 0;
		
		if(cc.LayerIndex + 1 >= cc.UseLocalLayerIndex && cc.IsWin){
			realCoin = (cc.UILayer.coin + cc.Game.curConf.reward.coin) * p;
		    realStar = (cc.UILayer.star + cc.Game.curConf.reward.star) * p ;
		    realStrength = (cc.Game.curConf.reward.strength) * p;
		    realTicket = (cc.Game.curConf.reward.lotterTicket) * p;
		}else{
			realCoin = (cc.UILayer.coin) * p;
		    realStar = (cc.UILayer.star) * p ;
		    realStrength = 0;
		    realTicket = 0;
		}
		
		let i = 1;
		
		if(realCoin > 0){
			cc.whole.updateValue('coin',realCoin);
			cc.Utils.showTip({name: '金币' ,value: realCoin,iconIndex: 0});
		}
		
		if(realStar > 0){
			cc.whole.updateValue('star',realStar);
			setTimeout(() => {
			    cc.Utils.showTip({name: '星星' ,value: realStar,iconIndex: 5});
			},200 * i);
			i ++;
		}
		
		if(realStrength > 0){
			cc.whole.updateValue('strength',realStrength);
			cc.whole.checkRecoverST();
			setTimeout(() => {
			    cc.Utils.showTip({name: '体力' ,value: realStrength,iconIndex: 4});
			},200 * i);
			i ++;
		}
		
		if(realTicket > 0){
			cc.whole.updateValue('ticket',realTicket);
			setTimeout(() => {
			   cc.Utils.showTip({name: '抽奖券' ,value: realTicket,iconIndex: 3});
			},200 * i);
		}
		
		this.dead();
	},
	
	dead(){
		//cc.WxAdMgr.HideBannerAd();
		cc.EndRewardPanel = null;
		this.animCtrl.play('panelClose');
        this.scheduleOnce(() => {
			if(cc.LayerIndex == 0){
				cc.Utils.checkGuide(4,cc.EndPanel.node);
			}else if(cc.LayerIndex == 1){
				cc.Utils.checkGuide(5,cc.EndPanel.node);
			}
			
            this.node.destroy();
        },0.18);
	},
});
