//电子邮件puhalskijsemen@gmail.com 
//源码网站 开vpn全局模式打开 http://web3incubators.com/ 
 //电报https://t.me/gamecode999 
 //网页客服 http://web3incubators.com/kefu.html  

cc.Class({
    extends: cc.Component,

    properties: {
        Type: '',
    },
	
	setConf(conf){
        this.riseSpeed = conf.speedY;
        this.moveSpeed = conf.speedX;
		//this.node.angle = conf.rotate;
        this.isJump = true;
		this.isAction = true; 
		
		this.node.getChildByName(`bg${conf.type}`).active = true;
		this.conf = cc.ObjConfig.OTHER[this.Type];
    },

    update: function (dt) {
        this.logic();
    },
	
    logic() {
        if(this.isAction){
            this.node.x += this.moveSpeed;
            if (this.isJump) {
                if (this.riseSpeed > 0) {
                    this.riseSpeed -= this.conf.JUMP_INCREMENT;
                    this.node.y += this.riseSpeed;
                } else {
                    this.isJump = false;
                    this.riseSpeed = 0;
                }
            } else {
                this.riseSpeed += this.conf.JUMP_INCREMENT;
                this.node.y -= this.riseSpeed;
                if (this.node.y <= 0) {
                    this.node.destroy();
                }
            }
        }
    },
});