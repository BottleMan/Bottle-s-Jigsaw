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
        itemPrefeb: cc.Prefab,
        endManager: cc.Node,
        timer: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        let self = this;

        // 初始化变量
        self.__initParams();

        for (let i = 0; i < 9; i++) {
            let node = cc.instantiate(self.itemPrefeb);
            node.parent = self.node;
            self.items.push(node.getComponent('item'));
        }

        // 加载 Texture
        cc.loader.loadRes("pic", cc.Texture2D, function (err, texture) {
            self.curTexture = texture;
            self.__initItems();
            self.__shuffleItemPos();
        });
    },

    // update (dt) {},

    __initParams() {
        this.items = [];
        this.curTexture = null;
        this.picHeight = 540;
        this.picWidth = 810;
        this.maxIndex = 0;
    },

    __initItems() {
        let self = this;

        let itemWidth = self.picWidth / 3;
        let itemHeight = self.picHeight / 3;
        let itemIndex = 0;
        let posY = 0;
        let posX = 0;

        for (let l = 0; l < 3; l++) {
            posY = (1 - l) * itemHeight;
            for (let r = 0; r < 3; r++) {
                posX = (r - 1) * itemWidth;

                let item = self.items[itemIndex];
                item.initPic({
                    texture: self.curTexture,
                    x: itemWidth * r,
                    y: itemHeight * l,
                    w: itemWidth,
                    h: itemHeight,
                    posX: posX,
                    posY: posY,
                    index: itemIndex
                }, self.__moveStart, self.__moveEnd);

                itemIndex++;
            }
        }
    },

    __shuffleItemPos() {
        let self = this;

        for (let i = 0; i < self.items.length; i++) {
            let randomSeed = Math.floor(Math.random() * (self.items.length));
            let item = self.items[i];
            let rItem = self.items[randomSeed];
            let x = item.cfg.posX;
            let y = item.cfg.posY;

            item.setItemPosition(rItem.cfg.posX, rItem.cfg.posY);
            rItem.setItemPosition(x, y);
        }
    },

    __moveStart(node) {
        console.info('start');

        let itemManager = node.parent.getComponent('item-manager');
        itemManager.maxIndex++;
        node.zIndex = itemManager.maxIndex;

        cc.loader.loadRes('sound/pick', cc.AudioClip, function (err, clip) {
            cc.audioEngine.playEffect(clip, false);
        });
    },

    __moveEnd(node) {
        console.info('end');

        cc.loader.loadRes('sound/drop', cc.AudioClip, function (err, clip) {
            cc.audioEngine.playEffect(clip, false);
        });

        let self = node.parent.getComponent('item-manager');
        self.adsorption(node);
    },

    adsorption(node) {
        let picHeight = node.height;
        let picWidth = node.width;
        let nodeVec = cc.v2({x: node.position.x, y: node.position.y});
        let conditions = [
            {x: picWidth, y: 0},
            {x: (-1) * picWidth, y: 0},
            {x: 0, y: picHeight},
            {x: 0, y: (-1) * picHeight},
        ];

        for (let i = 0; i < this.items.length; i++) {
            let itemNode = this.items[i].node;
            let itemPos = itemNode.position;
            let isMoved = false;

            for (let j = 0; j < conditions.length; j++) {
                let con = conditions[j];
                let targetVec = cc.v2({
                    x: itemPos.x + con.x,
                    y: itemPos.y + con.y
                });
                let distance = targetVec.sub(nodeVec).mag();
                if (distance > 100) continue;

                isMoved = true;

                let finished = cc.callFunc(this.checkWin, this);
                let action = cc.moveTo(0.1, targetVec);
                let seq = cc.sequence(action, finished);
                node.runAction(seq);
            }

            if (!isMoved) continue;
            console.info('自动吸附条件成立！！！！');
            break;
        }
    },

    checkWin() {
        let conditions = [
            {x: 270, y: 0}, // 2-1
            {x: 270, y: 0}, // 3-2
            {x: 270 * (-2), y: -180}, // 4-3
            {x: 270, y: 0}, // 5-4
            {x: 270, y: 0}, // 6-5
            {x: 270 * (-2), y: -180}, // 7-6
            {x: 270, y: 0}, // 8-7
            {x: 270, y: 0}, // 9-8
        ];

        let j = 0;
        for (let i = 0; i < this.items.length - 1; i++) {
            let thisPos = this.items[i].node.position;
            let nextPos = this.items[i + 1].node.position;
            if (Math.abs(nextPos.x - thisPos.x - conditions[j].x) > 5) return;
            if (Math.abs(nextPos.y - thisPos.y - conditions[j].y) > 5) return;

            j++;
        }

        this.endManager.getComponent('end-manager').showWin();
        this.timer.getComponent('timer').stopTimer();
    }

});
