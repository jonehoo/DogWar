//电子邮件puhalskijsemen@gmail.com 
//源码网站 开vpn全局模式打开 http://web3incubators.com/ 
 //电报https://t.me/gamecode999 
 //网页客服 http://web3incubators.com/kefu.html  

cc.Class({
    extends: cc.Component,

    properties: {
       Type: '',
    },
	
	applyRect(){
		if(this.baseRect){
			this.node.x = this.baseRect.x;
	        this.node.y = this.baseRect.y;
		    this.node.width = this.baseRect.width;
		    this.node.height = this.baseRect.height;
		}
	},
	
	setRect(rect){
		this.baseRect = rect;
		this.node.x = rect.x;
	    this.node.y = rect.y;
		this.node.width = rect.width;
		this.node.height = rect.height;
	},
});
