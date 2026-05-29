//电子邮件puhalskijsemen@gmail.com 
//源码网站 开vpn全局模式打开 http://web3incubators.com/ 
 //电报https://t.me/gamecode999 
 //网页客服 http://web3incubators.com/kefu.html  

cc.Class({
    extends: cc.Component,

    properties: {
        Type: '',
    },

    start () {
        this.isPass = false;
		this.rect = {};
		this.rect['x'] = this.node.x - this.node.width / 4;
		this.rect['y'] = this.node.y;
		this.rect['width'] = this.node.width * 3 / 2;
		this.rect['height'] = this.node.width * 5 / 4;
    },

    update (dt) {
		if(cc.isPause){
			return;
		}
		
		this.checkPlayer();
	},
	
	checkPlayer(){
		if(this.isPass){
			return;
		}
		
		if(cc.MathUtil.rectInRect(cc.Player.getRect(4), this.rect)) {
			this.isPass = true;
			cc.Player.setPass(true);
		}
    },
});
