//电子邮件puhalskijsemen@gmail.com 
//源码网站 开vpn全局模式打开 http://web3incubators.com/ 
 //电报https://t.me/gamecode999 
 //网页客服 http://web3incubators.com/kefu.html  


cc.Class({
    extends: cc.Component,

    properties: {
        
    },
	
	//setConfig(conf){},

    start () {
		this.isOpen = false;
		this.panelNode = this.node.getChildByName('panel');
		this.panelAnim = this.panelNode.getComponent(cc.Animation);
		this.initBaseParam();
	},
	
	update (dt) {
		if(cc.isPause || this.isOpen){
			return;
		}
		
		this.checkPlayer();
	},
	
	initBaseParam(){
		this.offsetX = cc.GameConfig.CONSTANT.OFFSET_X;
		this.offsetY = cc.GameConfig.CONSTANT.OFFSET_Y;
		this.offsetWidth = cc.GameConfig.CONSTANT.OFFSET_WIDTH;
		this.offsetHeight = cc.GameConfig.CONSTANT.OFFSET_HEIGHT;
		
		this.width = this.node.width;
		this.height = this.node.height;
		this.widthP = this.width / 2;
		this.heightP = this.height / 2;
		
        this.rectM = {};
		this.initRectPosition();
		this.initRectSize();
	},
	
	initRectPosition(){
		this.rectM['x'] = this.node.x + this.offsetY;
		this.rectM['y'] = this.node.y + this.offsetX;
	},
	
	initRectSize(){
		this.rectM['width'] = this.width - this.offsetHeight;
		this.rectM['height'] = this.height - this.offsetWidth;
	},
	
	checkPlayer(){
		if(cc.MathUtil.rectInRect(cc.Player.getRect(4), this.getRect(4))) {
			this.openPanel();
		}
    },
	
	openPanel(){
		this.isOpen = true;
		this.panelAnim.play('guidePanel');
	},

	getRect(type) {
        switch (type) {
            case 4: return this.rectM;
            default:
                break;
        }
    },
});
