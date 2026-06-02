//  Su.GuiCuan
function Event() {
	this.send = function (desc, param) {
		/*if(window.wx){
			if(param){
				cc.MyPlat.aldSendEvent(desc,param);
			}else{
				cc.MyPlat.aldSendEvent(desc);
			}
		}*/
	};

	this.stageStart = function (param) {
		/*if(window.wx){
			cc.MyPlat.aldStage.onStart(param);
		}*/
	};

	this.stageEnd = function (param) {
		/*if(window.wx){
			cc.MyPlat.aldStage.onEnd(param);
		}*/
	};
}

module.exports = Event;