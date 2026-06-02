//  Su.GuiCuan
const GameConfig = require('GameConfig');
function CameraManager() {

    this.init = function () {
        //this.mXDistance = 0;
        //this.mYDistance = 0;

        this.sw = cc.winSize.width;
        this.sh = cc.winSize.height;

        this.rect = {};
        this.mRect = {};
        this.rect.width = this.sw;
        this.rect.height = this.sh;
        this.mRect.width = this.sw * 3 / 2;
        this.mRect.height = this.sh * 3 / 2;

        this.XDirectCoce = GameConfig.CAMERA_MOVE_TYPE.MOVE_X;
        this.YDirectCoce = GameConfig.CAMERA_MOVE_TYPE.MOVE_Y;
    };

    /**
     * @param directCode 移动的方向 1 = x , 2 = y
     * @param distance 移动距离
     */
    this.move = function (directCode, distance) {
        if (!distance) {
            //console.log(directCode,distance);
            return;
        }

        this.distanceP = distance / 2;
        if (distance < 0) {
            if (directCode == this.XDirectCoce) {
                if (cc.CameraNode.x + distance >= 0) {
                    cc.CameraNode.x += distance;
                    cc.BGCamera.x += this.distanceP;
                } else {
                    cc.CameraNode.x = 0;
                }

                /*if (cc.BGCamera.x + this.distanceP >= 0) {
                    cc.BGCamera.x += this.distanceP;
                } else {
                    cc.BGCamera.x = 0;
                }*/
            } else {
                if (cc.CameraNode.y + distance >= 0) {
                    cc.CameraNode.y += distance;
                    cc.BGCamera.y += this.distanceP;
                } else {
                    cc.CameraNode.y = 0;
                }

                /*if (cc.BGCamera.y + this.distanceP >= 0) {
                    cc.BGCamera.y += this.distanceP;
                } else {
                    cc.BGCamera.y = 0;
                }*/
            }

        } else {
            if (directCode == this.XDirectCoce) {
                if (cc.CameraNode.x + distance <= cc.Layer.width - this.sw) {
                    cc.CameraNode.x += distance;
                    cc.BGCamera.x += this.distanceP;
                } else {
                    cc.CameraNode.x = cc.Layer.width - this.sw;
                }

                /*if (cc.BGCamera.x + this.distanceP <= cc.Layer.width - this.sw) {
                    cc.BGCamera.x += this.distanceP;
                } else {
                    cc.BGCamera.x = cc.Layer.width - this.sw;
                }*/
            } else {
                if (cc.CameraNode.y + distance <= cc.Layer.height - this.sh) {
                    cc.CameraNode.y += distance;
                    cc.BGCamera.y += this.distanceP;
                } else {
                    cc.CameraNode.y = cc.Layer.height - this.sh;
                }

                /*if (cc.BGCamera.y + this.distanceP <= cc.Layer.height - this.sh) {
                    cc.BGCamera.y += this.distanceP;
                } else {
                    cc.BGCamera.y = cc.Layer.height - this.sh;
                }*/
            }
        }
    };

    /*this.getXMoveDistance = function () {
        return //this.mXDistance;
    };

    this.getYMoveDistance = function () {
        return //this.mYDistance;
    };*/

    this.getMaxDrawRect = function () {
        this.mRect.x = cc.CameraNode.x - this.sw / 4;
        this.mRect.y = cc.CameraNode.y - this.sh / 4;
        return this.mRect;
    };

    this.getDrawRect = function () {
        this.rect.x = cc.CameraNode.x;
        this.rect.y = cc.CameraNode.y;
        return this.rect;
    };

    this.reset = function () {
        cc.CameraNode.x = 0;
        cc.CameraNode.y = 0;
        cc.BGCamera.x = 0;
        cc.BGCamera.y = 0;
    };

    this.setCameraPos = function (x, y) {
        if (x > cc.Layer.width - this.sw) {
            cc.CameraNode.x = cc.Layer.width - this.sw;
            cc.BGCamera.x = cc.CameraNode.x;
        } else if (x < 0) {
            cc.CameraNode.x = 0;
            cc.BGCamera.x = 0;
        } else {
            cc.CameraNode.x = x;
            cc.BGCamera.x = x;
        }

        if (y > cc.Layer.height - this.sh) {
            cc.CameraNode.y = cc.Layer.height - this.sh;
            cc.BGCamera.y = cc.CameraNode.y;
        } else if (y < 0) {
            cc.CameraNode.y = 0;
            cc.BGCamera.y = 0;
        } else {
            cc.CameraNode.y = y;
            cc.BGCamera.y = y;
        }
    };

}

module.exports = CameraManager;