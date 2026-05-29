//电子邮件puhalskijsemen@gmail.com 
//源码网站 开vpn全局模式打开 http://web3incubators.com/ 
 //电报https://t.me/gamecode999 
 //网页客服 http://web3incubators.com/kefu.html  

cc.Class({
    extends: cc.Component,

    properties: {
        Type: '',
    },
	//电子邮件puhalskijsemen@gmail.com
//源码网站 开vpn全局模式打开 http://web3incubators.com/
//电报https://t.me/gamecode999

	setConfig(conf){},

    start () {
        this.conf = cc.ObjConfig.FOOD[this.Type];
		this.initRect();
    },

    update (dt) {
		if(cc.isPause){
			return;
		}
		
		this.check();
	},
	
	initRect(){
		this.rectM = {};
		this.rectM['width'] = this.node.width;
        this.rectM['height'] = this.node.height;
        this.rectM['x'] = this.node.x;
        this.rectM['y'] = this.node.y;
	},
	
	check(){
		if(!cc.Player){
			return;
		}
		
		if (cc.MathUtil.rectInRect(this.getRect(4), cc.Player.getRect(4))) {
            this.dead();
        }
	},
	
	dead(){
		cc.Utils.addScore(this.getRect(4),this.conf.SCORE);
		this.node.destroy();
	},
	
	getRect(type) {
        switch (type) {
            case 4:
                return this.rectM;
            default:
                break;
        }
    },
});
