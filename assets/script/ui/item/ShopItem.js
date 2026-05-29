//电子邮件puhalskijsemen@gmail.com 
//源码网站 开vpn全局模式打开 http://web3incubators.com/ 
 //电报https://t.me/gamecode999 
 //网页客服 http://web3incubators.com/kefu.html  

cc.Class({
    extends: cc.Component,

    properties: {
		nameText: cc.Label,
		descText: cc.Label,
		priceText: cc.Label,
		haveText: cc.Label,
		buyText: cc.Label,
		buyBtn: cc.Button,
		vedioIcon: cc.Node,
		unLock: cc.Node,
    },

    setKey (key) {
		this.key = key;
		this.data = cc.ObjConfig.SHOP[key];
		this.price = this.data.price;
		this.color = cc.Color.RED;
		this.checkGuide();
		this.checkPrice();
		
    },
	
	checkGuide(){
		if(this.key != 'liquid'){
			return;
		}
		
		this.inGuide = true;
		this.scheduleOnce(() => {
		    cc.Utils.checkGuide(7,this.node);
		},0.3);
	},
	
	checkPrice(){
		this.checkUseProp();
		this.canBuy =  this.usePropValue>= this.price;
		this.colorValue = this.canBuy ? '#4F2624' : '#FF1D02';
		this.priceText.node.color = this.color.fromHEX(this.colorValue);
		if(this.key == 'strength'){
			this.buyTimes = cc.DataMgr.getValue('strengthBuyTimes');
			if(this.canBuy){
				this.canBuy = this.buyTimes < 2;
			}
		}
		
		this.show();
	},
	
	checkBtn(){
		if(this.data.bigKey == 'skill'){
			this.buyBtn.interactable = !this.isUnlock;
		    this.buyBtn.enableAutoGrayEffect = this.isUnlock;
			if(!this.isUnlock){
				if(this.canBuy){
					this.vedioIcon.active = false;
				    this.buyText.string = '解  锁';
				}else{
					this.vedioIcon.active = true;
				    this.buyText.string = '立即试用';
				}
				//this.buyBtn.interactable = this.canBuy;
		        //this.buyBtn.enableAutoGrayEffect = !this.canBuy;
			}			
		}else{
			if(this.canBuy){
				this.vedioIcon.active = false;
				this.buyText.string = '购  买';
			}else{
			    this.vedioIcon.active = true;
				this.buyText.string = '立即试用';
			}
			//this.buyBtn.interactable = this.canBuy;
		    //this.buyBtn.enableAutoGrayEffect = !this.canBuy;
		}
	},
	
	checkUseProp(){
		if(this.data.consumeKey == 'coin'){
			this.usePropValue = cc.whole.coin;
		}else if(this.data.consumeKey == 'star'){
			this.usePropValue = cc.whole.star;
		}
	},
	
	show(){
		this.nameText.string = this.data.name;
		this.descText.string = this.data.desc;
		this.priceText.string = this.data.price;
		this.showHave();
	},
	
	showHave(){
		if(this.data.bigKey == 'skill'){
			if(this.key == 'power'){
				this.isUnlock = cc.IsPower;
			}else if(this.key == 'moreJump'){
				this.isUnlock = cc.IsMoreJump;
			}else if(this.key == 'immune'){
				this.isUnlock = cc.IsImmune;
			}
			
			this.unLock.opacity = this.isUnlock ? 255 : 0;
		}else{
			if(this.key == 'strength'){
			    this.haveText.string = `拥有:${cc.whole.strength}`;
		    }else{
		        this.haveText.string = `拥有:${cc.whole.prop[this.key].value}`;
		    }
		}
		
		this.checkBtn();
	},
	
	onClick(event,tag){
		cc.AudioMgr.playSound('button');
		this.buy();
		if(this.inGuide){
			cc.Utils.checkGuide(8,this.node);
		}
	},
	
	buy(){
		if(this.data.bigKey == 'skill'){
			if(this.canBuy){
				this.updateSkill();
			}else{
				cc.WxAdMgr.ShowVideoAd((tag) => {
					if(tag){
						this.updateVedioSkill();
				    }
		        });
			}
		}else{
			if(this.canBuy){
				this.updateProp();
			}else{
				cc.WxAdMgr.ShowVideoAd((tag) => {
					if(tag){
						this.updateVedioProp();
				    }
		        });
			}
		}
	},
	
	updateVedioSkill(){
		cc.whole.updateValue(this.data.tempKey,true);
		cc.Shop.checkPrice();
		cc.GameUI.addItem(cc.GameConfig.PREFAB_TYPE.UNLOCKPANEL,cc.Main.panel,{temp: true,name: this.data.name});
	},
	
	updateVedioProp(){
		if(this.key == 'strength'){
			cc.whole.updateValue('strength',3);
			cc.whole.checkRecoverST();
			this.buyTimes ++;
			cc.DataMgr.setValue('strengthBuyTimes',this.buyTimes);
			cc.Utils.showTip({name: this.data.name,value: 3,iconIndex: this.data.iconIndex});
		}else{
			cc.whole.updateValue(this.key,1);
			cc.Utils.showTip({name: this.data.name,value: 1,iconIndex: this.data.iconIndex});
		}
		
		cc.Shop.checkPrice();
	    
	},
	
	updateSkill(){
		cc.whole.updateValue(this.key,true);
		cc.whole.updateValue(this.data.consumeKey,-this.price);
		cc.Shop.checkPrice();
		cc.GameUI.addItem(cc.GameConfig.PREFAB_TYPE.UNLOCKPANEL,cc.Main.panel,{temp: false,name: this.data.name});
	},
	
	updateProp(){
		if(this.key == 'strength'){
			cc.whole.updateValue('strength',3);
			cc.whole.checkRecoverST();
			this.buyTimes ++;
			cc.DataMgr.setValue('strengthBuyTimes',this.buyTimes);
			cc.Utils.showTip({name: this.data.name,value: 3,iconIndex: this.data.iconIndex});
		}else{
			cc.whole.updateValue(this.key,1);
			cc.Utils.showTip({name: this.data.name,value: 1,iconIndex: this.data.iconIndex});
		}
			
		cc.whole.updateValue(this.data.consumeKey,-this.price);
		cc.Shop.checkPrice();
	},
});
