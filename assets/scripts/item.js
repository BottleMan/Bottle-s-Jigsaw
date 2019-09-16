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
        picSprite: cc.Sprite,
        frame: cc.Node,
        cfg: null,
        moveStartCb: null,
        moveEndCb: null
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    // update (dt) {},

    initPic(cfg, moveStartCb, moveEndCb) {
        this.cfg = cfg;
        this.moveStartCb = moveStartCb;
        this.moveEndCb = moveEndCb;

        this.__initNode();
        this.__initSprite();
        this.__initFrame();
        this.__initTouch();
    },

    setItemPosition(x, y) {
        this.cfg.posX = x;
        this.cfg.posY = y;

        this.__resetItemPosition();
    },

    __initNode() {
        let cfg = this.cfg;

        this.node.setPosition(cfg.posX, cfg.posY);

        // 这里要给父 Node 指定大小，因为之后要实现拖动父 Node
        this.node.setContentSize(cfg.w, cfg.h);
    },

    __initSprite() {
        let cfg = this.cfg;
        let rect = cc.rect(cfg.x, cfg.y, cfg.w, cfg.h);
        this.picSprite.spriteFrame = new cc.SpriteFrame(cfg.texture, rect);
        this.picSprite.node.setContentSize(cfg.w, cfg.h);
    },

    __initFrame() {
        let cfg = this.cfg;

        this.frame.setContentSize(cfg.w, cfg.h);
    },

    __initTouch() {
        let self = this;
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            self.moveStartCb = self.moveStartCb || function () {
            };
            self.moveStartCb(self.node);
        }, this.node);

        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            this.opacity = 100;
            let delta = event.touch.getDelta();
            this.x += delta.x;
            this.y += delta.y;
        }, this.node);

        this.node.on(cc.Node.EventType.TOUCH_END, function () {
            this.opacity = 255;

            self.moveEndCb = self.moveEndCb || function () {
            };
            self.moveEndCb();
        }, this.node);
    },

    __resetItemPosition() {
        this.node.setPosition(this.cfg.posX, this.cfg.posY);
    }
});
