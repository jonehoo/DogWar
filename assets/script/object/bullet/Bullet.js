//电子邮件puhalskijsemen@gmail.com 
//源码网站 开vpn全局模式打开 http://web3incubators.com/ 
 //电报https://t.me/gamecode999 
 //网页客服 http://web3incubators.com/kefu.html  

cc.Class({
    extends: cc.Component,

    properties: {
        Type: '',
    },
	
	setConf (conf) {
	    switch (this.Type) {
			case cc.GameConfig.PREFAB_TYPE.TURRETBULLET[3]:
			case cc.GameConfig.PREFAB_TYPE.CHESTBULLET[3]:
			case cc.GameConfig.PREFAB_TYPE.PLANTBULLET[3]:
			case cc.GameConfig.PREFAB_TYPE.BATBULLET[3]:
				this.directX = conf.DirectX;
                break;
            default:
                break;
        }
		
		this.isReady = true;
    },
	
	start(){
		this.init();
	},
	
	update() {
		if(cc.isPause || !this.isReady){
			return;
		}
		
		this.checkPlayer();
		this.checkDead();
		switch (this.Type) {
			case cc.GameConfig.PREFAB_TYPE.CHESTBULLET[3]:
			case cc.GameConfig.PREFAB_TYPE.PLANTBULLET[3]:
			    this.plantFire();
                break;
			case cc.GameConfig.PREFAB_TYPE.BEEBULLET[3]:
			    this.beeFire();
                break;
			case cc.GameConfig.PREFAB_TYPE.BATBULLET[3]:
			case cc.GameConfig.PREFAB_TYPE.TURRETBULLET[3]:
			    this.normalFire();
                break;

            default:
                break;
        }
	},
	
	init(){
		this.conf = cc.ObjConfig.BULLET[this.Type];
		this.moveSpeed = this.conf.MOVE_SPEED;
		this.jumpIncrement = this.conf.JUMP_INCREMENT;
		this.dropIncrement = this.conf.DROP_INCREMENT;
		this.dropMaxSpeed = this.conf.DROP_MAX_SPEED;
		this.jumpMaxSpeed = this.conf.JUMP_MAX_SPEED;
		
		
		this.initBaseParam();
	
		switch (this.Type) {
			case cc.GameConfig.PREFAB_TYPE.PLANTBULLET[3]:
			case cc.GameConfig.PREFAB_TYPE.CHESTBULLET[3]:
			    this.jumpSpeed = this.jumpMaxSpeed;
			    this.directY = true;
                break;
			case cc.GameConfig.PREFAB_TYPE.BEEBULLET[3]:
			    this.moveSpeed = this.conf.MIN_MOVE_SPEED + Math.round(Math.random()* (this.conf.MAX_MOVE_SPEED - this.conf.MIN_MOVE_SPEED));
                break;
			case cc.GameConfig.PREFAB_TYPE.BATBULLET[3]:
			case cc.GameConfig.PREFAB_TYPE.TURRETBULLET[3]:
			    this.moveSpeed = this.conf.MOVE_SPEED;
                break;

            default:
                break;
        }
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
	
	beeFire(){
        this.node.y -= this.moveSpeed;
		if(this.node.y + this.height < cc.CameraMgr.getMaxDrawRect().y){
			this.dead();
		}
	},
	
	plantFire(){
		if(this.directX){
			this.node.x += this.moveSpeed;
		}else{
			this.node.x -= this.moveSpeed;
		}
		
		if(this.directY){
			if(this.jumpSpeed > 0){
				this.jumpSpeed -= this.jumpIncrement;
			}else{
				this.jumpSpeed = 0;
				this.directY = false;
			}
			
			this.node.y += this.jumpSpeed;
		}else{
			if(this.jumpSpeed < this.dropMaxSpeed){
				this.jumpSpeed += this.jumpIncrement;
			}else{
				this.jumpSpeed = this.dropMaxSpeed;
			}
			
			this.node.y -= this.jumpSpeed;
			if(this.node.y + this.height < cc.CameraMgr.getMaxDrawRect().y){
				this.dead();
			}
		}
	
	},
	
	normalFire(){
		if(this.directX){
			this.node.x += this.moveSpeed;
			if(this.node.x >= cc.CameraMgr.getMaxDrawRect().x + cc.CameraMgr.getMaxDrawRect().width){
				this.dead();
			}
		}else{
			this.node.x -= this.moveSpeed;
			if(this.node.x + this.width <= cc.CameraMgr.getMaxDrawRect().x){
				this.dead();
			}
		}
	},
	
	checkDead(){
		if(this.node.y >= cc.CameraMgr.getMaxDrawRect().y + cc.CameraMgr.getMaxDrawRect().height){
			this.dead();
		}else if(this.node.y + this.height <= cc.CameraMgr.getMaxDrawRect().y){
			this.dead();
		}
		
		/*if(this.node.x >= cc.CameraMgr.getMaxDrawRect().x + cc.CameraMgr.getMaxDrawRect().width){
			this.dead();
		}else if(this.node.x + this.width <= cc.CameraMgr.getMaxDrawRect().x){
			this.dead();
		}*/
	},
	
	checkPlayer(){
		if(cc.Player.isFlicker || cc.Player.isHide || cc.Player.isShield || cc.Player.isInvincible ){
            return;
        }
		
		if(cc.MathUtil.rectInRect(cc.Player.getRect(4), this.getRect(4))) {
			this.dead();
			cc.Player.hurt(this.conf.HURT);
		}
    },
	
	dead(){
		this.node.destroy();
	},
	
	getRect(type) {
        this.initRectPosition();
        switch (type) {
            case 4: return this.rectM;
            default:
                break;
        }
    },
});
