//  Su.GuiCuan


cc.Class({
  extends: cc.Component,

  properties: {
    bg: cc.Node,
  },

  setConfig(conf) {
    this.bg.angle = conf.Num;
  },
});
