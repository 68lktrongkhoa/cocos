cc.Class({
    extends: cc.Component,

    properties: {
        monsterPrefab: {
            default: null,
            type: cc.Prefab
        },
        foxMonsterPrefab: {
            default: null,
            type: cc.Prefab
        },

        spawnIntervalMin: {
            default: 1,
            type: cc.Float
        },
        spawnIntervalMax: {
            default: 2,
            type: cc.Float
        },
        moveDurationMin: {
            default: 3,
            type: cc.Float
        },
        moveDurationMax: {
            default: 5,
            type: cc.Float
        },
        spawnYMin: {
            default: -200
        },
        spawnYMax: {
            default: 200
        },
        useTweenSystem: {
            default: true
        },

        dogMonstersBeforeFoxMin: {
            default: 5,
            type: cc.Integer
        },
        dogMonstersBeforeFoxMax: {
            default: 7,
            type: cc.Integer
        },
    },

    onLoad() {
        this.parentForMonsters = cc.find('Canvas/Body/Object/MonstersContainer');
        if (!this.parentForMonsters) {
            cc.error("MonsterSpawner: Không tìm thấy node cha ('Canvas')! Script sẽ bị vô hiệu hóa.");
            this.enabled = false;
            return;
        }

        if (!this.monsterPrefab) {
            cc.error("MonsterSpawner: Monster Prefab (chính) CHƯA được gán! Script sẽ bị vô hiệu hóa.");
            this.enabled = false;
            return;
        }

        if (!this.foxMonsterPrefab) {
            cc.warn("MonsterSpawner: FoxMonster Prefab CHƯA được gán. Sẽ chỉ spawn quái vật chính.");
        } else {
            cc.log("MonsterSpawner: FoxMonster Prefab đã được gán:", this.foxMonsterPrefab.name);
        }

        this.spawnAreaWidth = this.parentForMonsters.width;

        this.dogMonsterCount = 0;
        this.setNextFoxMonsterThreshold();

        this.scheduleNextSpawn();
    },

    setNextFoxMonsterThreshold() {
        this.thresholdForFox = Math.floor(
            this.dogMonstersBeforeFoxMin + 
            Math.random() * (this.dogMonstersBeforeFoxMax - this.dogMonstersBeforeFoxMin + 1)
        );
    },

    scheduleNextSpawn() {
        const interval = this.spawnIntervalMin + Math.random() * (this.spawnIntervalMax - this.spawnIntervalMin);
        
        this.scheduleOnce(() => {
            this.spawnMonster(); 
        }, interval);
    },

    spawnMonster() {

        let prefabToSpawn;
        let isFoxMonster = false;

        if (this.foxMonsterPrefab && this.dogMonsterCount >= this.thresholdForFox) {
            prefabToSpawn = this.foxMonsterPrefab;
            isFoxMonster = true;
            this.dogMonsterCount = 0;
            this.setNextFoxMonsterThreshold();
        } else {
            prefabToSpawn = this.monsterPrefab;
            if(this.foxMonsterPrefab) {
                this.dogMonsterCount++;
            }
        }

        if (!prefabToSpawn) {
            this.scheduleNextSpawn();
            return;
        }

        let monsterNode;
        try {
            monsterNode = cc.instantiate(prefabToSpawn);
        } catch (e) {
            cc.error(`MonsterSpawner: Lỗi khi cc.instantiate prefab '${prefabToSpawn.name}':`, e);
            this.scheduleNextSpawn();
            return;
        }

        this.parentForMonsters.addChild(monsterNode);
        const monsterUUIDShort = monsterNode.uuid.substr(0, 5);
        const monsterType = isFoxMonster ? "FOX" : "DOG";

        const startX = this.spawnAreaWidth / 2 + monsterNode.width / 2 + 20;
        const endX = -this.spawnAreaWidth / 2 - monsterNode.width / 2 - 20;
        const randomY = this.spawnYMin + Math.random() * (this.spawnYMax - this.spawnYMin);
        monsterNode.setPosition(startX, randomY);

        const moveDuration = this.moveDurationMin + Math.random() * (this.moveDurationMax - this.moveDurationMin);

        if (this.useTweenSystem) {
            cc.tween(monsterNode)
                .to(moveDuration, { position: cc.v2(endX, randomY) }, { easing: 'linear' })
                .call(() => {
                    if (cc.isValid(monsterNode, true)) {
                        monsterNode.destroy();
                    } 
                })
                .start();
        } else {
            const moveAction = cc.moveTo(moveDuration, cc.v2(endX, randomY));
            const destroyCallback = cc.callFunc(() => {
                if (cc.isValid(monsterNode, true)) {
                    monsterNode.destroy();
                } 
            });
            const sequence = cc.sequence(moveAction, destroyCallback);
            monsterNode.runAction(sequence);
        }
        this.scheduleNextSpawn();
    },
});