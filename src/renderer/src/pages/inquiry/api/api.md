SSE接口如下：

1.房卡询价流式接口：http://192.168.0.111:9919/api/v1/enquiry
POST请求
请求参数 {
    "user_id":11,
    "user_name":"easy",
    "prod_type":"room_card",
    "filter": {
        "material": "纸质",
        "thickness": "1.85",
        "length":"86.5",
        "width":"55",
        "craft":"烫金;印刷",//用;拼接
        "chip":"CP.1.01.0372",
        "encrypt":"是"
    }
}

2.拖鞋询价流式接口：http://192.168.0.111:9919/api/v1/enquiry
POST请求
请求参数 {
    "user_id":11,//用户uid
    "user_name":"easy",//用户名称
    "prod_type":"slipper",//拖鞋品类--slipper
    "filter": {
        "texture": "真美布+软木度",//材质
        "size": "30*12.3",//长宽
        "craft":"单色胶印",//工艺
        "packaging":"OPP袋"//包装
    }
}

3.环保笔询价流式接口：http://192.168.0.111:9919/api/v1/enquiry
POST请求
请求参数 {
    "user_id":11,//用户uid
    "user_name":"easy",//用户名称
    "prod_type":"pen",//拖鞋品类--pen
    "filter": {
        "texture": "竹子-GCSEP-102",//材质
        "size": "138*11.11",//长宽
        "craft":"雕刻"//工艺
    }
}

4.伞询价流式接口：http://192.168.0.111:9919/api/v1/enquiry
POST请求
请求参数 {
    "user_id":11,//用户uid
    "user_name":"easy",//用户名称
    "prod_type":"umbrella",
    "filter": {
        "name":"12骨灰色弯柄雨伞",//名称
        "texture": "塑料",//伞珠材质
        "size": "27英寸",//雨伞尺寸
        "boneNum":"12",//雨伞骨数
        "handShank":"塑料弯柄",//雨伞手柄
        "craft":"单色一片印刷"//工艺
    }
}

5.胸牌询价流式接口：http://192.168.0.111:9919/api/v1/enquiry
POST请求
请求参数 {
    "user_id":11,//用户uid
    "user_name":"easy",//用户名称
    "prod_type":"badge_lanyard",
    "filter": {
        "name": "金属胸章（定制，长方形，强磁吸背扣）",//名称
        "size": "80*18mm",//尺寸
        "craft":"切割电镀凹凸logo"//工艺
    }
}

6.六小件询价流式接口：http://192.168.0.111:9919/api/v1/enquiry
POST请求
请求参数 {
    "user_id":11,//用户uid
    "user_name":"easy",//用户名称
    "prod_type":"six_small_items",
    "filter": {
        "name": "可降解内膜袋(牙刷) 4.4*20+2.6CM  0.06PLA+PBAT",//名称
        "texture":"降解塑料",//材质
        "thickness": "0.05",//厚度
        "length":"200",//长度
        "width":"44",//宽度
        "weight":"/",//重量
        "craft":"挤压成型"//工艺
    }
}
