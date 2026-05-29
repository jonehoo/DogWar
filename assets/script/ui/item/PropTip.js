//电子邮件puhalskijsemen@gmail.com 
//源码网站 开vpn全局模式打开 http://web3incubators.com/ 
 //电报https://t.me/gamecode999 
 //网页客服 http://web3incubators.com/kefu.html  

cc.Class({
    extends: cc.Component,

    properties: {
        iconArea: cc.Node,
		symbol: cc.Label,
		valueText: cc.Label,
    },

    onShow (data) {
		this.data = data;

        this.init();
    },
	
	update(){
		this.rise();
	},
	
	init(){
		this.holdTime = this.data.holdTime || cc.GameConfig.CONSTANT.TIP_HOLD_TIME;
		this.isRise = true;
		this.riseSpeed = 12;
		this.riseIncrement = 0.3;
		this.icons = this.iconArea.children;
		this.node.x = cc.winSize.width / 2;
		this.node.y = cc.winSize.height / 2;
		this.showItem();
		//this.runActon();
	 },	
	
	showItem(){
		this.icons[this.data.iconIndex].active = true;
		this.valueText.string = Math.abs(this.data.value);
		if(this.data.value >= 0){
			this.symbol.node.y = 0;
			this.symbol.string = '+';
		}else{
			this.symbol.node.y = -8;
			this.symbol.string = '-';
		}
	},
	
	rise(){
		if(!this.isRise){
			return;
		}
		
		this.riseSpeed -= this.riseIncrement;
		if(this.riseSpeed <= 0){
			this.isRise = false;
			this.dead();
		}
		
		this.node.y += this.riseSpeed;
	},
	
	/*runActon(){
		this.endX = this.node.x;
	    this.endY = this.node.y + 200;
		
		this.node.runAction(
		    cc.sequence(
			    cc.moveTo(this.holdTime,cc.v2(this.endX,this.endY)).easing(cc.easeOut(0.5)),
			    cc.callFunc(() => {
                    this.dead()
                },this)
			)
		);
	    //cc.tween(this.node)
        //.to(this.holdTime, {position: cc.v2(this.endX,this.endY)},{easing: 'sineOut'})
		//.call(()=>{this.dead()})
        //.start();
	},*/
	
	dead(){
		//cc.Utils.deleteTip();
        this.node.destroy();
	},
});
