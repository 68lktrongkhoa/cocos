const FlagMapping = cc.Class({
    name: 'FlagMapping',
    properties: {
        countryCode: {
            default: "",
            type: cc.String
        },
        flagSprite: {
            default: null,
            type: cc.SpriteFrame
        }
    }
});


cc.Class({
    extends: cc.Component,

    properties: {
        rankItemPrefab: {
            default: null,
            type: cc.Prefab
        },
        contentNode: {
            default: null,
            type: cc.Node
        },
        flagMappings: {
            default: [],
            type: [FlagMapping]
        }
    },

    onLoad () {
        this.rankingData = [
            { rank: 298, name: "Khoa_NASA", score: 32589, countryCode: "kr" },
            { rank: 1, name: "Hunter", score: 96167, countryCode: "kr" },
            { rank: 2, name: "Monter", score: 87609, countryCode: "us" },
            { rank: 3, name: "hêhhe", score: 87443, countryCode: "de" },
            { rank: 4, name: "LiulIU", score: 79176, countryCode: "fr" },
            { rank: 5, name: "HuyDepTrai123", score: 74751, countryCode: "cn" },
            { rank: 6, name: "Vortex", score: 72290, countryCode: "tr" },
            { rank: 7, name: "MysticFlow", score: 72290, countryCode: "kr" },
            { rank: 8, name: "DuyHandSome", score: 72290, countryCode: "tr" },
            { rank: 9, name: "Khaaaaaa", score: 72290, countryCode: "tr" },
            { rank: 10, name: "hihihhi", score: 72290, countryCode: "kr" },
            { rank: 11, name: "RogueShadow", score: 72290, countryCode: "tr" },
            { rank: 12, name: "123lala", score: 72290, countryCode: "us" },
            { rank: 13, name: "RogueShadow23456", score: 72290, countryCode: "kr" },
            { rank: 14, name: "lalaaaaa", score: 72290, countryCode: "tr" },
            { rank: 15, name: "RogueShadow1234", score: 72290, countryCode: "kr" },
        ];
    },

    start () {
        this.populateRankingList();
    },

    getFlagSpriteFrameByCountryCode: function (countryCode) {
        if (!this.flagMappings || this.flagMappings.length === 0) {
            return null;
        }
        for (let i = 0; i < this.flagMappings.length; i++) {
            if (this.flagMappings[i].countryCode.toLowerCase() === countryCode.toLowerCase()) {
                return this.flagMappings[i].flagSprite;
            }
        }
        return null;
    },

    populateRankingList: function () {
        if (!this.rankItemPrefab) {
            return;
        }
        if (!this.contentNode) {
            return;
        }

        this.contentNode.removeAllChildren();

        if (!this.rankingData || this.rankingData.length === 0) {
            return;
        }

        for (let i = 0; i < this.rankingData.length; i++) {
            const playerData = this.rankingData[i];
            const itemNode = cc.instantiate(this.rankItemPrefab);

            if (!itemNode) {
                continue;
            }

            const rankItemScript = itemNode.getComponent("RankItem");

            if (rankItemScript) {
                const flagSf = this.getFlagSpriteFrameByCountryCode(playerData.countryCode);
                if (!flagSf) {
                    console.warn(`No flag found for ${playerData.countryCode} for player ${playerData.name}`);
                }
                rankItemScript.setData(playerData.rank, playerData.name, playerData.score, playerData.countryCode, flagSf);
            } else {
                console.error("populateRankingList: Could not find RankItem script on prefab instance for player:", playerData.name);
            }
            this.contentNode.addChild(itemNode);
        }
    }
});