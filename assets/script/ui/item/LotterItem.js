//电子邮件puhalskijsemen@gmail.com 
//源码网站 开vpn全局模式打开 http://web3incubators.com/ 
 //电报https://t.me/gamecode999 
 //网页客服 http://web3incubators.com/kefu.html  

cc.Class({
    extends: cc.Component,

    properties: {
		bg1: cc.Node,
		bg2: cc.Node,
    },
	
	setSelect(tag){
		this.bg1.active = tag;
		this.bg2.active = !tag;
	},
});
