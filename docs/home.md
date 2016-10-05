#  用户相关API #
 API定义的格式说明参见： api.md文件
* 修改日志

|--------|----------------------------------------------|-----------|---------|
| 版本    | 内容/修改                                      | 时间       | 修改人   |
|--------|----------------------------------------------|-----------|---------|
| 0.1   | API初稿                                         | 2016.10.07 | Job   |
|--------|----------------------------------------------|-----------|---------|

#目录#
[TOC]


# 登录接口 #

url： /home/list

## 请求方式 ##

get

###参数###
无


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
		"slides": [
					{"start": "2016-10-03", "end": "2018-10-03", "img": "/common/img/slides/1.jpg", "name": "", "url": "../events.html?id=SD0429wzs02", "picture": "/events/img/1461922320_20160429zs02.png"},
					{"img": "/common/img/slides/2.jpg", "name": "", "url": ""},
					{
						"start": "2016-10-03",   					// 可选参数： 生效开始日期 format: yyyy-mm-dd hh:mm:ss
						"end": "2018-10-03",     					 // 可选参数： 生效结束日期 format: yyyy-mm-dd hh:mm:ss
						"img": "/common/img/slides/1.jpg", 			// 轮播图片 
						"name": "",  								// 可选参数： 轮播图片描述
						"url": "../events.html?id=SD0429wzs02",  	 // 可选参数： 轮播图片点击弹出的网页地址
					},
					{"img": "/common/img/slides/2.jpg", "name": "", "url": ""}
				  ],  // 轮播图片信息对象数组
        "service": {  // 首页显示数据服务区域内容， 
				"img": "/common/img/service/7.png",    // 首页显示数据服务区域-区域头部图片， 
				"description": "【丰富的数据】<br>为数据服务", // 首页显示数据服务区域-区域头部说明html文字，
				"list": [{"img": "/common/img/service/1.png",  // 区域内图片，
							"name": "",                        // 区域内图片提示，
							"description": "",                 // 区域内说明html文字，
							"url": ""},                        // 预留- 点击后响应的URL，
						{"img": "/common/img/service/2.png", "name": "", "url": ""}]   // 服务区域内-图片信息对象数组
				},
        "saas": {"img": "/common/img/service/5.png",  // 首页显示SAAS服务区域内容， 结构同上述service
				"description": "", 
				"list": [{"img": "/common/img/service/5.png", "name": "弹性扩展", "description": "服务资源弹性升级<br>应对不同业务强度", "url": ""},
				{"img": "/common/img/service/8.png", "name": "贴心服务", "description": "7*24咨询应答<br>及时有效解决各种问题", "url": ""}]},
        "solution": {"img": "/common/img/service/5.png",  // 首页显示解决方案区域内容， 结构同上述service
				"description": "", 
				"list": [{"img": "/common/img/service/5.png", "name": "弹性扩展", "description": "服务资源弹性升级<br>应对不同业务强度", "url": ""},
				{"img": "/common/img/service/8.png", "name": "贴心服务", "description": "7*24咨询应答<br>及时有效解决各种问题", "url": ""}]},
        "solution": {"img": "/common/img/service/8.png",  "description": "", "list": [{"img": "/common/img/service/1.png", "name": "", "description": "", "url": ""}]},
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
		"slides": [
					{"start": "2016-10-03", "end": "2018-10-03", "img": "/common/img/slides/1.jpg", "name": "", "url": "../events.html?id=SD0429wzs02", "picture": "/events/img/1461922320_20160429zs02.png"},
					{"img": "/common/img/slides/2.jpg", "name": "", "url": ""},
					{"start": "2016-10-03", "end": "2018-10-03", "img": "/common/img/slides/1.jpg", "name": "", "url": "../events.html?id=SD0429wzs02", "picture": "/events/img/1461922320_20160429zs02.png"},
					{"img": "/common/img/slides/2.jpg", "name": "", "url": ""}
				  ],
        "service": {"img": "/common/img/service/7.png",  "description": "【丰富的数据】<br>【强大的数据处理能力】<br>为客户提供全面便捷的数据服务", "list": [{"img": "/common/img/service/1.png", "name": "", "description": "", "url": ""},{"img": "/common/img/service/2.png", "name": "", "url": ""},{"img": "/common/img/service/3.png", "name": "", "url": ""},{"img": "/common/img/service/4.png", "name": "", "url": ""}]},
        "saas": {"img": "/common/img/service/5.png",  "description": "", "list": [{"img": "/common/img/service/5.png", "name": "弹性扩展", "description": "服务资源弹性升级<br>应对不同业务强度", "url": ""},
				{"img": "/common/img/service/6.png", "name": "简单易用", "description": "控制台直接管控资源<br>操作便捷", "url": ""},
				{"img": "/common/img/service/7.png", "name": "安全防护", "description": "多维度安全保护<br>安心托管各种应用", "url": ""},
				{"img": "/common/img/service/8.png", "name": "贴心服务", "description": "7*24咨询应答<br>及时有效解决各种问题", "url": ""}]},
        "solution": {"img": "/common/img/service/8.png",  "description": "", "list": [{"img": "/common/img/service/1.png", "name": "", "description": "", "url": ""}]},
		"memo": ""
    }
}
```