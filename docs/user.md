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



# 注册接口 #

url： /i/register

## 请求方式 ##

post

###参数###
- username		手机号或邮箱
- password		密码        base64_encode   加密  
- code		    验证码       base64_encode   加密  
- nickname		微信用户昵称 - 微信扫码注册的情况传入该参数
- photo 		微信用户头像url - 微信扫码注册的情况传入该参数


###返回参数###

- status.status_code       状态码，值为200表示成功，其他表示失败
- status.message    状态提示信息
- content       页面所需要的数据信息, 具体参见数据说明

###状态值###

- 200        成功
- 3207       用户已注册
- 3208       验证码错误

###data数据说明###
```
{
    "status": {
		"status_code": "200",
		"status_message": "OK"
	},
    "content": {
        "memo": ""                   // 字符串，其他
    }
}
```


# 登录接口 #

url： /i/login

## 请求方式 ##

post

###参数###
- username		手机号或邮箱
- password		密码       base64_encode   加密  


###返回参数###

- status.status_code       状态码，值为200表示成功，其他表示失败
- status.message    状态提示信息
- content       页面所需要的数据信息, 具体参见数据说明

###状态值###

- 200        成功
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
        "id": "1",                   // 字符串，用户id
        "user_name": "13800138000",  // 字符串，用户名 - 必须项目
        "mobile": "13800138000",     // 字符串，手机号 - 必须项目
        "email": "123456@qq.cpom",   // 字符串，邮箱 - 必须项目
        "user_type": 0,              // 数值，角色。1、组织用户，0 个人用户 - 必须项目
        "gid": "100001",             // 字符串，金桐号 - 必须项目
        "orgId": "100001",           // 字符串，组织ID
        "passport": "13800138000",   // 字符串，注册时的手机号或邮箱
        "memo": ""                   // 字符串，其他
    }
}
```

# 退出接口 #

url： /i/logout

## 请求方式 ##

post

###参数###
- username		用户名或手机号或邮箱


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
    }
}
```


# 注册接口 #

url： /i/resetpwd

## 请求方式 ##

post

###参数###
- username		手机号或邮箱
- password		密码        base64_encode   加密  
- code		    验证码       base64_encode   加密  


###返回参数###

- status.status_code       状态码，值为200表示成功，其他表示失败
- status.message    状态提示信息
- content       页面所需要的数据信息, 具体参见数据说明

###状态值###

- 200        成功
- 3208       验证码错误

###data数据说明###
```
{
    "status": {
		"status_code": "200",
		"status_message": "OK"
	},
    "content": {
        "memo": ""                   // 字符串，其他
    }
}
```


# 发送验证码接口 #

url： /code/send

## 请求方式 ##

post

###参数###
- username		手机号或邮箱


###返回参数###

- status.status_code       状态码，值为200表示成功，其他表示失败
- status.message    状态提示信息
- content       页面所需要的数据信息, 具体参见数据说明

###状态值###

- 200        成功
- 3203       无效的手机号
- 3204       无效的邮箱

###data数据说明###
```
{
    "status": {
		"status_code": "200",
		"status_message": "OK"
	},
    "content": {
    }
}
```



# 获取微信扫码登录接口？ #

url： /weixin/login

实现可选方案：
一、页面点击“微信登录”，跳转到二维码页面 --》 根据appid获取code（redirect_uri需要进一步明确）
https://open.weixin.qq.com/connect/qrconnect?appid=wxa8d92f54c4a0e3f6&redirect_uri=http://open.gintong.com&response_type=code&scope=snsapi_login&state=123#wechat_redirect
二、微信客户端确认登录后，回转到金桐url请求， 金桐后台进行微信url交互获取微信用户信息，存入到session/cookie, 然后和系统内用户比对
三、金桐后台根据信息比对结果进行页面跳转。 信息存在，跳转到/user/login.html#/id=unionid ；不存在，跳转到/user/register.html#/id=unionid 

如果信息存入session需要此接口进行数据请求，如果cookie则不需要此接口

## 请求方式 ##

get

###参数###
- unionid		用户统一标识, 微信扫码后金桐平台跳转到登录或注册页面时传回id，相应信息存储在服务器端session内
/login.html#/?id=lddd

###返回参数###

- status.status_code       状态码，值为200表示成功，其他表示失败
- status.message    状态提示信息
- content       页面所需要的数据信息, 具体参见数据说明

###状态值###

- 200        成功
- 3203       无效的手机号
- 3204       无效的邮箱

###data数据说明###
```
{
    "status": {
		"status_code": "200",
		"status_message": "OK"
	},
    "content": {
        "nickname": "Fay", 			 // 字符串，微信用户昵称 - 必须项目
        "photo": "/img/fay.png", 	 // 字符串，微信用户头像url(需事先转存到金桐平台) - 必须项目
		
		// 如果已注册用户，需要直接登录则带回以下信息；如果需要进行注册，则不需。
        "id": "1",                   // 字符串，用户id
        "user_name": "13800138000",  // 字符串，用户名 
        "mobile": "13800138000",     // 字符串，手机号
        "email": "123456@qq.cpom",   // 字符串，邮箱 
        "user_type": 0,              // 数值，角色。1、组织用户，0 个人用户 - 必须项目
        "gid": "100001",             // 字符串，金桐号
        "orgId": "100001",           // 字符串，组织ID
        "passport": "13800138000",   // 字符串，注册时的手机号或邮箱
        "memo": ""                   // 字符串，其他
    }
}
```