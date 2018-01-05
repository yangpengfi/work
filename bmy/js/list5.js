var menuType = 0; //
var typeData = []; //栏目数据
var titleIcon = "";

function getData() {
    if (menuType == 0) { //精彩回看
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
    } else if (menuType == 1) { //舌尖上的福建

    } else if (menuType == 2) { //行走中的福建

    }
}
