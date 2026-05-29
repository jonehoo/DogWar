//电子邮件puhalskijsemen@gmail.com 
//源码网站 开vpn全局模式打开 http://web3incubators.com/ 
 //电报https://t.me/gamecode999 
 //网页客服 http://web3incubators.com/kefu.html  

cc.Class({
    extends: cc.Component,

    properties: {
        Type: 'door',
    },
	
    setConfig (conf) {
        this.OtherType = conf.OtherType1;
	  
	    this.Id = conf.Id;
	    this.CloseId = conf.CloseId;
	    this.TargertId = conf.TargertId;
	    this.TargertLayer = conf.TargertLayer;
	    this.IsSetPos = conf.IsSetPos;
	},
	
	start(){
		 this.isOpen = true;
		 this.initBaseParam();
	},

    update(){
		if(!this.isOpen){
			return
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
	
	
	goLayer(){
		cc.Player.setDoorLeft(this.getRect(4));
		cc.Game.switchLayer(this.TargertLayer);
	},
	
	checkPlayer(){
		if(!cc.Player){
            return;
        }
		
       
        if (cc.MathUtil.rectInRect(this.getRect(4), cc.Player.getRect(4))) {
            this.goLayer();
        }
    },
	
	closeDoor(){
		this.node.getChildByName('bg1').active = false;
		this.node.getChildByName('bg2').active = true;
	},
	
	getRect(type) {
        switch (type) {
            case 4: return this.rectM;
            default:
                break;
        }
    },
});
