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
        timerLabel: cc.Label,
        endManager: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.__startTimer();
        this.isPause = false;
    },

    // update (dt) {},

    pauseTimer() {
        this.isPause = true;
    },

    resumeTimer() {
        this.isPause = false;
    },

    stopTimer() {
        this.unschedule(this.__timerCallback);
    },

    __startTimer() {
        this.count = 60;
        this.schedule(this.__timerCallback, 1);
    },

    __timerCallback() {
        if (this.isPause) {
            return;
        }

        if (this.count <= 0) {
            this.unschedule(this.callback);
            this.endManager.getComponent('end-manager').showLose();
            return;
        }

        this.count--;
        this.timerLabel.string = "00:" + this.__prefixZero(this.count, 2);
    },

    __prefixZero(num, length) {
        return (Array(length).join('0') + num).slice(-length);
    }
});
