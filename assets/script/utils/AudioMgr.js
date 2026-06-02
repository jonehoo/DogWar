//  Su.GuiCuan
cc.Class({
    extends: cc.Component,
    properties: {
        audio: {
            type: [cc.AudioClip],
            default: []
        },

        bgAudio: {
            type: [cc.AudioClip],
            default: []
        },

        isOn: true,
    },


    onLoad() {
        cc.AudioMgr = this;
        this.init();
    },

    init() {
        if (this.isInit) {
            return;
        }

        this._audioMap = {};
        this._bgaudioMap = {};

        for (const key in this.audio) {
            const au = this.audio[key];
            if (this._audioMap.hasOwnProperty(au.name)) {
                cc.error("Exist same name of ", au.name);
                continue;
            }
            this._audioMap[au.name] = { audio: au, audioId: -1 };
        }

        for (const key in this.bgAudio) {
            const bau = this.bgAudio[key];
            if (this._bgaudioMap.hasOwnProperty(bau.name)) {
                cc.error("Exist same name of ", bau.name);
                continue;
            }
            this._bgaudioMap[bau.name] = { audio: bau, audioId: -1 };
        }

        this.isInit = true;
    },

    turnOn(isOn) {
        this.isOn = isOn;
        if (this.isOn) {
            this.resumeAll();
        } else {
            this.stopAll();
        }
    },

    playMusic(name, loop, volume) {
        if (!cc.IsMusic) {
            return;
        }

        if (!this.isOn) {
            return;
        }

        if (!this._checkBgName(name)) {
            return;
        }

        this.stopAll();
        loop = loop || false;
        volume = volume || 1;
        let audio = this._bgaudioMap[name];
        audio.audioId = cc.audioEngine.play(audio.audio, loop, volume);
    },

    playSound(name, loop, volume) {
        if (!cc.IsSound) {
            return;
        }

        if (!this.isOn) {
            return;
        }

        if (!this._checkName(name)) {
            return;
        }

        loop = loop || false;
        volume = volume || 1;
        let audio = this._audioMap[name];
        audio.audioId = cc.audioEngine.play(audio.audio, loop, volume);
    },

    pause(name) {
        /*if(!this._checkBgName(name)){
            return;
        }

        let audio = this._audioMap[name];
        if(!audio){
            audio = this._bgaudioMap[name];
        }
        cc.audioEngine.pause(audio.audioId);*/
    },

    resume(name) {
        /* if(!this._checkBgName(name)){
             return;
         }
 
         let audio = this._audioMap[name];
         if(!audio){
             audio = this._bgaudioMap[name];
         }
         cc.audioEngine.resume(audio.audioId);*/
    },

    stop(name) {
        let audio = this._audioMap[name];
        if (!audio) {
            audio = this._bgaudioMap[name];
        }
        cc.audioEngine.stop(audio.audioId);
    },

    pauseAll() {
        cc.audioEngine.pauseAll();
    },

    resumeAll() {
        cc.audioEngine.resumeAll();
    },

    stopAll() {
        cc.audioEngine.stopAll();
    },

    _checkName(name) {
        if (!name) {
            cc.error("name is empty.");
            return false;
        }

        if (!this._audioMap.hasOwnProperty(name)) {
            cc.error("Don't found any audio of ", name);
            return false;
        }

        return true;
    },

    _checkBgName(name) {
        if (!name) {
            cc.error("name is empty.");
            return false;
        }

        if (!this._bgaudioMap.hasOwnProperty(name)) {
            cc.error("Don't found any audio of ", name);
            return false;
        }

        return true;
    }


});