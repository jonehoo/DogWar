//电子邮件puhalskijsemen@gmail.com 
//源码网站 开vpn全局模式打开 http://web3incubators.com/ 
 //电报https://t.me/gamecode999 
 //网页客服 http://web3incubators.com/kefu.html  
function Event() {
    this.send = function(desc,param){
		/*if(window.wx){
			if(param){
				cc.MyPlat.aldSendEvent(desc,param);
			}else{
				cc.MyPlat.aldSendEvent(desc);
			}
		}*/
    };
	
	this.stageStart = function(param){
		/*if(window.wx){
			cc.MyPlat.aldStage.onStart(param);
		}*/
    };
	
	this.stageEnd = function(param){
		/*if(window.wx){
			cc.MyPlat.aldStage.onEnd(param);
		}*/
    };
}

module.exports = Event;