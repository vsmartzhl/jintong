#  服务管理相关API #
 API定义的格式说明参见： api.md文件
* 修改日志

|--------|----------------------------------------------|-----------|---------|
| 版本    | 内容/修改                                      | 时间       | 修改人   |
|--------|----------------------------------------------|-----------|---------|
| 0.1   | API初稿                                         | 2016.10.07 | Job   |
|--------|----------------------------------------------|-----------|---------|

#目录#
[TOC]


# 清单接口 #

url： /service/list

## 请求方式 ##

get

###参数###
TODO
- status //字符串，状态，nodelivery待发货，delivery配送中,complete已完成,cancel已取消
- page		//int类型，页码，默认为1
- offset	//int类型，每页查询数量，默认为20条记录


###返回参数###

- status.status_code       状态码，值为200表示成功，其他表示失败
- status.message    状态提示信息
- content       页面所需要的数据信息, 具体参见数据说明

###状态值###

- 200        成功

###data数据说明###
```
{
    "status": {
		"status_code": "200",
		"status_message": "OK"
	},
    "content": {
		"page": 1,    // 整数， 页码
		"pages": 1,   // 整数， 总页数
		"offset": 20, // 整数， 每页数量
		"list": [{"img": "/common/img/service/1.png",  // 展示用图片，
					"id": "S002",                      // 服务ID，
					"name": "",                        // 服务名称，
					"price": 0,                        // 服务收费价格，
					"unit": "",                        // 服务收费标准，
					"description": "",                 // 服务说明文字，，
				}, // 服务信息对象
				{"id": "S002", "img": "/common/img/service/6.png", "name": "简单易用", "price": 50, "unit": "元/月", "description": "控制台直接管控资源<br>操作便捷"},
				{"id": "S003", "img": "/common/img/service/7.png", "name": "安全防护", "price": 15, "unit": "元/月", "description": "多维度安全保护<br>安心托管各种应用"},
				{"id": "S004", "img": "/common/img/service/8.png", "name": "贴心服务", "price": 0, "unit": "", "description": "7*24咨询应答<br>及时有效解决各种问题"}
				],  // 服务信息对象列表
        "memo": ""                   // 字符串，其他
    }
}
```

###返回数据举例###
```
{
    "status": {
		"status_code": "200",
		"status_message": "OK"
	},
    "content": {
		"page": 1,
		"offset": 10,
		"pages": 1,
		"list": [{"id": "S001", "img": "/common/img/service/5.png", "name": "弹性扩展", "price": 1.50, "unit": "元/次", "description": "服务资源弹性升级<br>应对不同业务强度"},
				{"id": "S002", "img": "/common/img/service/6.png", "name": "简单易用", "price": 50, "unit": "元/月", "description": "控制台直接管控资源<br>操作便捷"},
				{"id": "S003", "img": "/common/img/service/7.png", "name": "安全防护", "price": 15, "unit": "元/月", "description": "多维度安全保护<br>安心托管各种应用"},
				{"id": "S004", "img": "/common/img/service/8.png", "name": "贴心服务", "price": 0, "unit": "", "description": "7*24咨询应答<br>及时有效解决各种问题"}],
		"memo": "" 
    }
}
```