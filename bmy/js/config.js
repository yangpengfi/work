//配置说明：
//1.二级栏目在对应的menu中配置typeData里的id(获取栏目数据)和titleIcon(标题图片)
//2.二级栏目中有子菜单的需要配置bgIcon,数组元素依次为菜单项非焦点、焦点、辅焦点三种状态下的图片
//3.三级栏目只需配置titleIcon(标题图片)
var menuType = 0; //二级菜单
var typeData = []; //栏目数据
var titleIcon = "title_huikan.png";

function getData() {
    /*版式1 posterList1.htm*/
    if (menuType == 0) { //文化大直播-精彩回看
        typeData = [
            { "name": "演出剧目", "bgIcon": ["text_01.png", "focus_01.png", "assit_01.png"], "id": "MANU0000000000168796" },
            { "name": "经典闽剧", "bgIcon": ["text_02.png", "focus_02.png", "assit_02.png"], "id": "MANU0000000000169296" },
            { "name": "精彩分享", "bgIcon": ["text_03.png", "focus_03.png", "assit_03.png"], "id": "MANU0000000000168797" },
            { "name": "艺教中心", "bgIcon": ["text_04.png", "focus_04.png", "assit_04.png"], "id": "MANU0000000000169297" },
            { "name": "歌舞剧目", "bgIcon": ["text_05.png", "focus_05.png", "assit_05.png"], "id": "MANU0000000000168800" },
            { "name": "新闻中心", "bgIcon": ["text_06.png", "focus_06.png", "assit_06.png"], "id": "MANU0000000000168798" }
        ];
        titleIcon = "title_huikan.png";
    } else if (menuType == 1) { //魅力大福建-舌尖上的福建

    } else if (menuType == 2) { //魅力大福建-行走中的福建

    }
    /*版式2 posterList2.htm*/
    else if (menuType == 3) { //文化大直播-主播带你游福建
        typeData = [{ "name": "", "bgIcon": [], "id": "MANU0000000000168796" }];
        titleIcon = "title_huikan.png";
    } else if (menuType == 4) { //魅力大福建-文化进万家
        typeData = [{ "name": "", "bgIcon": [], "id": "MANU0000000000168796" }];
        titleIcon = "title_huikan.png";
    } else if (menuType == 5) { //魅力大福建-空中看福建
        typeData = [{ "name": "", "bgIcon": [], "id": "MANU0000000000168796" }];
        titleIcon = "title_huikan.png";
    } else if (menuType == 6) { //五个一工程-好戏剧
        typeData = [{ "name": "", "bgIcon": [], "id": "MANU0000000000168796" }];
        titleIcon = "title_huikan.png";
    } else if (menuType == 7) { //五个一工程-好电视剧
        typeData = [{ "name": "", "bgIcon": [], "id": "MANU0000000000168796" }];
        titleIcon = "title_huikan.png";
    } else if (menuType == 8) { //五个一工程-好电影
        typeData = [{ "name": "", "bgIcon": [], "id": "MANU0000000000168796" }];
        titleIcon = "title_huikan.png";
    } else if (menuType == 9) { //文化人物志-八闽先贤
        typeData = [{ "name": "", "bgIcon": [], "id": "MANU0000000000168796" }];
        titleIcon = "title_huikan.png";
    } else if (menuType == 10) { //文化人物志-文化名家
        typeData = [{ "name": "", "bgIcon": [], "id": "MANU0000000000168796" }];
        titleIcon = "title_huikan.png";
    } else if (menuType == 11) { //文化人物志-民俗艺人
        typeData = [{ "name": "", "bgIcon": [], "id": "MANU0000000000168796" }];
        titleIcon = "title_huikan.png";
    } else if (menuType == 12) { //文化百花园-红色文化
        typeData = [{ "name": "", "bgIcon": [], "id": "MANU0000000000168796" }];
        titleIcon = "title_huikan.png";
    } else if (menuType == 13) { //文化百花园-船政文化
        typeData = [{ "name": "", "bgIcon": [], "id": "MANU0000000000168796" }];
        titleIcon = "title_huikan.png";
    } else if (menuType == 14) { //文化百花园-海丝文化
        typeData = [{ "name": "", "bgIcon": [], "id": "MANU0000000000168796" }];
        titleIcon = "title_huikan.png";
    } else if (menuType == 15) { //文化百花园-朱子文化
        typeData = [{ "name": "", "bgIcon": [], "id": "MANU0000000000168796" }];
        titleIcon = "title_huikan.png";
    } else if (menuType == 16) { //文化百花园-闽台文化
        typeData = [{ "name": "", "bgIcon": [], "id": "MANU0000000000168796" }];
        titleIcon = "title_huikan.png";
    } else if (menuType == 17) { //文化百花园-客家文化
        typeData = [{ "name": "", "bgIcon": [], "id": "MANU0000000000168796" }];
        titleIcon = "title_huikan.png";
    } else if (menuType == 18) { //文化百花园-文化遗产
        typeData = [{ "name": "", "bgIcon": [], "id": "MANU0000000000168796" }];
        titleIcon = "title_huikan.png";
    }

    /*版式3 posterList3.htm 三级版式*/
    else if (menuType == 19) { //魅力大福建-文化进万家三级版式
        typeData = [{ "name": "", "bgIcon": [], "id": "MANU0000000000168796" }];
        titleIcon = "title_huikan.png";
    }

    /*版式4 posterList4.htm 三级版式*/
    else if (menuType == 20) { //魅力大福建-文化百花园-客家文化
        typeData = [{ "name": "", "bgIcon": [], "id": "MANU0000000000168796" }];
        titleIcon = "title_huikan.png";
    }

    /*版式5 posterList5.htm*/
    else if (menuType == 21) { //魅力大福建-我们的节日
        typeData = [
            { "name": "红丝文化", "bgIcon": ["blur_01.png", "pop_01.png", "com_01.png"], "id": "MANU0000000000168796" },
            { "name": "船政文化", "bgIcon": ["blur_02.png", "pop_02.png", "com_02.png"], "id": "MANU0000000000169296" },
            { "name": "海丝文化", "bgIcon": ["blur_03.png", "pop_03.png", "com_03.png"], "id": "MANU0000000000168797" },
            { "name": "朱子文化", "bgIcon": ["blur_04.png", "pop_04.png", "com_04.png"], "id": "MANU0000000000169297" },
            { "name": "闽台文化", "bgIcon": ["blur_05.png", "pop_05.png", "com_05.png"], "id": "MANU0000000000168800" },
            { "name": "客家文化", "bgIcon": ["blur_06.png", "pop_06.png", "com_06.png"], "id": "MANU0000000000168798" },
            { "name": "文化遗产", "bgIcon": ["blur_06.png", "pop_06.png", "com_06.png"], "id": "MANU0000000000168798" }
        ];
        titleIcon = "title_huikan.png";
    }

    /*版式6 posterList6.htm*/
    else if (menuType == 22) { //文化大直播-福建大剧院专区
        typeData = [{ "name": "", "bgIcon": [], "id": "MANU0000000000168796" }];
        titleIcon = "title_huikan.png";
    } else if (menuType == 23) { //文化大直播-芳华剧院专区
        typeData = [{ "name": "", "bgIcon": [], "id": "MANU0000000000168796" }];
        titleIcon = "title_huikan.png";
    }

    /*版式7 posterList7.htm*/
    else if (menuType == 24) { //文化大直播-直播各地市
        typeData = [{ "name": "", "bgIcon": [], "id": "MANU0000000000168796" }];
        titleIcon = "title_huikan.png";
    } else if (menuType == 25) { //文化百花园-客家文化
        typeData = [{ "name": "", "bgIcon": [], "id": "MANU0000000000168796" }];
        titleIcon = "title_huikan.png";
    }
}
