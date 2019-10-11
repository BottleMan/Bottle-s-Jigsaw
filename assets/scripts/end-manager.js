// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        bgNode: cc.Node,
        maskNode: cc.Node,
        winNode: cc.Node,
        loseNode: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.maskNode.on('touchstart', function (event) {
            event.stopPropagation();
        });

        this.maskNode.on('touchend', function (event) {
            event.stopPropagation();
        });
    },

    // update (dt) {},

    showWin() {
        this.node.active = true;
        this.bgNode.active = true;
        this.winNode.active = true;
        this.loseNode.active = false;
    },

    showLose() {
        this.node.active = true;
        this.bgNode.active = true;
        this.winNode.active = false;
        this.loseNode.active = true;
    },

});
