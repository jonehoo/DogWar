//  Su.GuiCuan

function ResMgr() {
    this.prefabs = {};

    this.loadUI = function (path, cb) {
        if (this.prefabs[path]) {
            cb && cb(this.prefabs[path]);
            return;
        }

        cc.loader.loadRes(path, (err, res) => {
            if (err) {
                cc.error(err.message || err);
                cc.log(path);
                cb && cb(null);
                return;
            }

            this.prefabs[path] = res;
            cb && cb(res);
        });
    };

    this.loadUIAnimation = function (path, cb) {
        cc.loader.loadRes(path, cb);
    };

    this.loadTexture = function (path, cb) {
        return this.loadResByType(path, cc.Texture2D, cb);
    };

    this.loadSpriteAtlas = function (path, cb) {
        return this.loadResByType(path, cc.SpriteAtlas, cb);
    };

    this.loadSpriteFrame = function (path, cb) {
        return this.loadResByType(path, cc.SpriteFrame, cb);
    };

    this.loadAnimation = function (path, cb) {
        return this.loadResByType(path, cc.AnimationClip, cb);
    };

    this.loadSpine = function (path, cb) {
        return this.loadResByType(path, sp.SkeletonData, cb);
    };

    this.loadResByType = function (resPath, type, cb) {
        if (!resPath) {
            cc.error("resPath is null");
            return;
        }

        cc.loader.loadRes(resPath, type, (err, res) => {
            if (err) {
                cc.error(err.message || err);
                cc.log(resPath);
                cb && cb(null);
                return;
            }

            cb && cb(res);
        });
    };

    this.loadJson = (jsonPath, cb) => {
        cc.loader.loadRes(jsonPath, (err, jsonAsset) => {
            if (err) {
                cc.error(err.message || err);
                cb && cb(null);
                return;
            }

            cb(jsonAsset.json);
        });
    };
}
module.exports = ResMgr;