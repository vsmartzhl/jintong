# API Sample #

* 修改日志

| 版本    | 内容/修改                                      | 时间       | 修改人   |
|--------|----------------------------------------------|-----------|---------|
| 0.1   | API初稿                                         | 2016.10.07 | Job   |
|--------|----------------------------------------------|-----------|---------|

#目录#
[TOC]

#基本原则#

1. API有两种格式，选用哪种格式请参见每个接口的说明：
    - 普通Http访问请求，例：`http://$HOSTNAME:$PORT/$api/API_NAME?p0=$1&p1=$2&pn=$n`
        - 服务端默认同时支持POST和GET
    - (暂不支持)跨域Http访问请求，例：`http://$HOSTNAME:$PORT/$api/API_NAME?p0=$1&p1=$2&pn=$n&callback=$jsonpcallback`
2. 返回数据均为json格式，涉及用户隐私信息时会使用base64进行简单转码，特殊信息将使用其他加密方式
3. 所有返回集合的API默认返回条数：10条(可由offset参数更改)，结果集合中将会有以下参数
    - 默认分页参数page=n, n为大于等于1的整数
    - 每页数量offset=n, n为大于等于1的整数，默认值：10
    - 总记录数total
4. 请求中涉及富文本信息请先使用base64转码后发送。富文本中如果有指向本app的链接，链接的头为: `http://$HOSTNAME:$PORT/api` ，
其他链接为`http或/https://`，客户端需要注册URL schema识别。
5. 默认返回格式：
```
    {
		"status": {
			"status_code": "200", // 3位数值，请求处理状态码。200成功，其他：错误，具体参见系统错误代码表
			"status_message": "OK" // 字符串，描述返回code含义
		},
		"content": {// json对象字符串，请求的响应数据。返回code 2xx以外系列可以不返回该data
        obj: 对象
        }
    }
```
6. 默认向服务端发送REST请求格式
使用post/put发送请求时，header必须为包含`Content-Type: application/json; charset=UTF-8`
7. 日期格式
所有向服务端发送的日期以字符串的方式发送，日期格式为：`yyyy-MM-dd HH:mm:ss`


举例：
---------------------
#  用户相关API #


# 登录接口 #

url： /i/login

## 请求方式 ##

post

###参数###
- username		用户名或手机号
- password		密码       base64_encode   加密  


###返回参数###

- status.status_code       状态码，值为200表示成功，其他表示失败
- status.message    状态提示信息
- content       页面所需要的数据信息, 具体参见数据说明

###状态值###

- 200        登录成功
- 3201       没有此用户
- 3202       密码错误
- 3208       验证码错误

###data数据说明###
```
{
    "status": {
		"status_code": "200",
		"status_message": "OK"
	},
    "content": {
        "id": "1",                  数值，用户id
        "user_name": "1",            字符串，用户名 - 必须项目
        "mobile": "13800138000",     字符串，手机号 - 必须项目
        "email": "123456@qq.cpom",   字符串，邮箱 - 必须项目
        "user_type": "0",            字符串，角色。1、组织用户，0 个人用户 - 必须项目
        "gid": "100001",             字符串，金桐号 - 必须项目
        "orgId": "100001",           字符串，组织ID
        "passport": "13800138000",   字符串，注册时的手机号或邮箱
        "memo": ""                   字符串，其他
    }
}
```

