//电子邮件puhalskijsemen@gmail.com 
//源码网站 开vpn全局模式打开 http://web3incubators.com/ 
 //电报https://t.me/gamecode999 
 //网页客服 http://web3incubators.com/kefu.html  

cc.Class({
    extends: cc.Component,

    properties: {
        Type: '',
		frames: [cc.SpriteFrame],
    },
	
	setConfig(conf){
		this.config = conf;
		this.otherType1 = conf.OtherType1;
		this.limmitX = conf.Num2;
		this.limmitY = conf.Num3;
		
		this.addUrl = cc.GameConfig.PREFAB_TYPE[this.otherType1];
	},

    start () {
		this.conf = cc.ObjConfig.OTHER[this.Type];
		
        this.sprite = this.node.getComponent(cc.Sprite);
		this.initBaseParam();
		
		this.isOpen = false;
    },

    update (dt) {
		 this.checkDistance();
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
		this.rectP = {};
		this.initRectPosition();
		this.initRectSize();
	},
	
	initRectPosition(){
		this.rectM['x'] = this.node.x + this.offsetY;
		this.rectM['y'] = this.node.y + this.offsetX;
		
		this.rectP['x'] = this.node.x + this.widthP;
        this.rectP['y'] = this.node.y + this.heightP;
	},
	
	initRectSize(){
		this.rectM['width'] = this.width - this.offsetHeight;
		this.rectM['height'] = this.height - this.offsetWidth;
		
		this.rectP['r'] = this.width / 2 + this.height / 2;
	},
	
	checkDistance(){
        if(this.isOpen || !cc.Player){
            return;
        }
		
		if(Math.abs(cc.Player.getRect(5).y - this.getRect(5).y) <= this.limmitY && Math.abs(cc.Player.getRect(5).x - this.getRect(5).x) <= this.limmitX){
			this.isOpen = true;
            this.sprite.spriteFrame = this.frames[0];
			cc.AudioMgr.playSound('woodOpen');
            
            switch(this.otherType1){
				case 'CHESTBULLET':
			        this.addBullet();
                    break;
				case 'CLOCKICON':
				case 'WATERICON':
				case 'SHIELDICON':
				case 'STARICON':
				case 'NOTEICON':
			        this.addIcon();
                    break;
				case 'INSECT':
			        this.addMonster();
                    break;
			
                default:
                    break;
			}				
        }
    },
	
	addMonster(){
	    cc.GameUI.addObj(this.addUrl, this.node,cc.GameConfig.POS_TYPE.MIDDLE,(item) => {
            //item.y = this.getRect(5).y - item.height / 2;
			//item.x = this.getRect(5).x - item.width / 2;
           
            item.getComponent(this.addUrl[1]).setConfig(this.config);
        });
	},
	
	addIcon(){
	    cc.GameUI.addObj(this.addUrl, this.node,cc.GameConfig.POS_TYPE.MIDDLE,(item) => {
            item.y = this.node.y + this.height * 2;
			item.x = this.getRect(5).x - item.width / 2;
           
            item.getComponent(this.addUrl[1]).setConfig(this.config);
        });
	},
	
	addBullet(){
	    cc.GameUI.addObj(this.addUrl, this.node,cc.GameConfig.POS_TYPE.MIDDLE,(item) => {
            item.y = this.node.y + item.height;
			item.x = this.getRect(5).x - item.width / 2;
           
            item.getComponent(this.addUrl[1]).setConf({
                'DirectX': true,
            });
        });
		
		cc.GameUI.addObj(this.addUrl, this.node,cc.GameConfig.POS_TYPE.MIDDLE,(item) => {
            item.y = this.node.y + item.height;
			item.x = this.getRect(5).x - item.width / 2;
			
            item.getComponent(this.addUrl[1]).setConf({
                'DirectX': false,
            });
        });
	},
	
	getRect(type) {
        switch (type) {
            case 4: return this.rectM;
			case 5: return this.rectP;
            default:
                break;
        }
    },
});
