//电子邮件puhalskijsemen@gmail.com 
//源码网站 开vpn全局模式打开 http://web3incubators.com/ 
 //电报https://t.me/gamecode999 
 //网页客服 http://web3incubators.com/kefu.html  
const GameConfig = require('GameConfig');
function GameUI() {
    this.init = function (cb) {
        let items = cc.GameConfig.PREFAB_TYPE;
        this.max = Object.keys(items).length;
        this.count = 0;
        for(let key in items){
            cc.ResMgr.loadUI(items[key][0],() => {
				//cc.log(items[key][0])
                this.count ++;
                cb && cb(this.count / this.max);
            });
        }
    };
	
	this.addItem = function (conf,parent,data,cb) {
		cc.ResMgr.loadUI(conf[0],(prefab) => {
            let node = cc.instantiate(prefab);
            let script = node.getComponent(conf[1] || 'null');
            if(script){
                script.onShow(data);
            }else{
                cc.log(conf);
            }

            if (!parent) {
                cb && cb(node);
                return;
            }

            parent.addChild(node,conf[4],conf[3]);
            cb && cb(node);
        });
    };

    this.loadNode = function (conf, parent,target, posType, cb) {
        cc.ResMgr.loadUI(conf[0],function (prefab){
            let item = cc.instantiate(prefab);
			if(!parent){
				cb && cb(item);
				return;
			}
			
			if(target){
				let pos = posType || GameConfig.POS_TYPE.MIDDLE;
                switch (pos) {
                    case GameConfig.POS_TYPE.MIDDLE:
                        item.x = target.x + (target.width - item.width) / 2;
                        item.y = target.y + (target.height - item.height) / 2;
                        break;
                    case GameConfig.POS_TYPE.LEFT_DOWN:
                        item.x = target.x;
                        item.y = target.y;
                        break;
                
                    default:
                        break;
                }
			}

            parent.addChild(item, conf[4],conf[3]);
            cb && cb(item);
        }.bind(this));
    };
	
	this.addObj = function (conf,target, posType, cb){
		this.loadNode(conf,cc.Layer.node,target,posType, (item) => {
			this.tempScript = item.getComponent(conf[1]);
			if(conf[2] != "NO"){
				if(this.tempScript){
					cc.Layer.scripts[conf[2]][item.uuid] = this.tempScript;
				}else{
					cc.log(conf)
				}
				
			}
			cb && cb(item);
		});
	};

    this.setLayer = function (conf,parent,cb) {
        this.loadNode(conf,parent,null,null,cb);
    }
}

module.exports = GameUI;