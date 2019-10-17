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
        pauseWindow: cc.Node,
        maskNode: cc.Node
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


    pause() {
        this.pauseWindow.active = true;
        this.__plaClickSound();
    },

    resume() {
        this.pauseWindow.active = false;
        this.__plaClickSound();
    },

    __plaClickSound() {
        cc.loader.loadRes('sound/ButtonClick', cc.AudioClip, function (err, clip) {
            cc.audioEngine.playEffect(clip, false);
        });
    }


});
