//电子邮件puhalskijsemen@gmail.com 
//源码网站 开vpn全局模式打开 http://web3incubators.com/ 
 //电报https://t.me/gamecode999 
 //网页客服 http://web3incubators.com/kefu.html  

cc.Class({
    extends: cc.Component,

    properties: {
		Type: '',
        frames : [cc.SpriteFrame]
    },

    start(){
		this.conf = cc.ObjConfig.OTHER[this.Type];
		this.index = 0;
        this.time = 0;
        this.rectM = {};
		this.isBlast = false;
		this.limmit = this.conf.LIMMIT_TIME;
		this.size = this.frames.length;
        
		this.bg = this.node.getChildByName('bg');
		this.sprite =  this.bg.getComponent(cc.Sprite);
		
		this.checkPlayer();
        switch (this.Type) {
            case cc.GameConfig.PREFAB_TYPE.BOMBBLAST[3]:
			    cc.AudioMgr.playSound('blast');
              
			    this.mScripts = cc.Layer.getObjArray(cc.GameConfig.OBJ_TYPE.MONSTER);
				this.fmScripts = cc.Layer.getObjArray(cc.GameConfig.OBJ_TYPE.FLYMONSTER);
                this.rScripts = cc.Layer.getObjArray(cc.GameConfig.OBJ_TYPE.ROAD);
                break;
        
            default:
                break;
        }
    },
	
	checkPlayer(){
		if(cc.IsImmune){
			this.isCheckPlayer = false;
		}else{
			this.isCheckPlayer = !cc.IsImmuneTemp;
		}
	},

    update: function () {
		this.updateFrame();
		switch (this.Type) {
            case cc.GameConfig.PREFAB_TYPE.BOMBBLAST[3]:
                this.check();
                break;
        
            default:
                break;
        }
    },
	
	updateFrame(){
		this.time++;
        if(this.time >= this.limmit){
            this.index ++;
            this.sprite.spriteFrame = this.frames[this.index];
            if(this.index == this.size){
                this.node.destroy();
            }
            this.time = 0;
        }
	},

    check(){
		if(this.isBlast || this.index > 3){
			return;
		}
		
        for(let key in this.mScripts){
			if(this.mScripts[key].isDeadDrop){
				continue;
			}
			
            if (cc.MathUtil.rectInRect(this.getRect(4), this.mScripts[key].getRect(4))) {
                this.mScripts[key].hurt(this.conf,this.node.uuid);
            }
        }
		
		for(let key in this.fmScripts){
            if (cc.MathUtil.rectInRect(this.getRect(4), this.fmScripts[key].getRect(4))) {
                this.fmScripts[key].hurt(this.conf,this.node.uuid);
            }
        }

        if(this.isCheckPlayer){
			if(!cc.Player.isFlicker && !cc.Player.isInvincible && !cc.Player.isHide && !cc.Player.isShield){
			    if (cc.MathUtil.rectInRect(this.getRect(4), cc.Player.getRect(4))) {
                    cc.Player.hurt(this.conf.HURT);
                }
		    }
		}
        
        
		this.isPlaySound = false;
        for(let key in this.rScripts){
			if(this.rScripts[key].isBullet){
				continue;
			}
			
            if (cc.MathUtil.rectInRect(this.getRect(4), this.rScripts[key].getRect(4))) {
				if(!this.isPlaySound && this.rScripts[key].haveDebris){
					if(cc.MathUtil.rectInRect(this.getRect(4),cc.CameraMgr.getDrawRect())){
			           cc.AudioMgr.playSound('zhuankuai');
					   this.isPlaySound = true;
		            }
				}
				
                this.rScripts[key].bombBlast(true);
            }
        }
		
		this.isBlast = true;
    },

    getRect(type) {
        switch (type) {
            case 4:
                this.rectM['width'] = this.node.width;
                this.rectM['height'] = this.node.height;
                this.rectM['x'] = this.node.x;
                this.rectM['y'] = this.node.y;
                return this.rectM;

            default:
                break;
        }
    },

});
