//电子邮件puhalskijsemen@gmail.com 
//源码网站 开vpn全局模式打开 http://web3incubators.com/ 
 //电报https://t.me/gamecode999 
 //网页客服 http://web3incubators.com/kefu.html  

cc.Class({
    extends: cc.Component,

    properties: {
		Type:'eye',
        frames: [cc.SpriteFrame]
    },

    start () {
		cc.Eye = null;
		cc.Eye = this;
		
		this.width = this.node.width;
		this.height = this.node.height;
        this.widthP = this.width / 2;
		this.heightP = this.height / 2;
		
        this.conf = cc.ObjConfig.OTHER[this.Type];
		this.sprite = this.node.getComponent(cc.Sprite);
		
		this.isBlick = false;
		this.frameIndex = 0;
		this.frameMax = this.frames.length;
		this.blinkTime = 0;
		this.blinkLimmit = this.conf.WAIT_TIME;
		this.rateTime = 0;
		this.rateLimmit = this.conf.RATE_TIME;
		this.blinkCount = 0;
    },

    update (dt) {
		this.blick();
	},
	
	blick(){
		if(!this.isBlick){
			this.blinkTime ++;
			if(this.blinkTime >= this.blinkLimmit){
				this.isBlick = true;
				this.blinkLimmit = this.conf.WAIT_TIME + Math.round(Math.random() * this.conf.WAIT_RANDOM);
				this.blinkTime = 0;
			}
		}else{
			this.rateTime ++;
			if(this.rateTime >= this.rateLimmit){
				this.frameIndex ++;
				this.rateLimmit = this.conf.RATE_TIME;
				if(this.frameIndex >= this.frameMax){
					if(this.blinkCount >= 1){
						this.blinkCount = 0;
						this.sprite.spriteFrame = this.frames[0];
						this.isBlick = false;
					}else{
						this.rateLimmit = this.conf.RATE_INTERVAL_TIME;
						this.blinkCount ++;
					}
					this.frameIndex = 0;
				}
				this.sprite.spriteFrame = this.frames[this.frameIndex];
				this.rateTime = 0;
			}
		}
	},
	
	dead(){
		this.node.destroy();
	},
});
