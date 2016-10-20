var _moduleC = ['ngAnimate', 'ngSanitize', 'ui.router', 'validation', 'mgcrea.ngStrap'];
if (window.location.href.indexOf("/h5/") > 0) {
	_moduleC.push('ionic');
}

var moduleC = angular.module('starter.controllers', _moduleC);
var moduleS = angular.module('starter.services', ['ngResource']);
var moduleI = angular.module('starter', ['starter.controllers', 'starter.services']);

var now = new Date();
var zcarVersion = 20160711.15;


/**
 * 网站前端Global全局加载处理
 * @namespace Global
 */
var ZCar = function() {
    var __uuid = 1;
    var __debug = true;
    var uname = "";
    var __lastAction = {};
	    
    /*! !私有函数!
    * @name __cache
    * @description 将指定的数据value缓存到指定的键值key里。如果没有指定数据value，则从缓存中读取键值对应的数据。
    */
    function __cache(key, value, nouser) {
		if (typeof localStorage == "undefined") {
			return null;
		}
        try {
            //key += "_" + zcarVersion; 
            if (value !== undefined) {
                var obj = {"last-modified": (new Date() - 0), "user": nouser ? "" : ZCar.getUName(), "key": key, "data": value};
                localStorage.setItem(key, JSON.stringify(obj));
                return value;
            } else if (value === null) {
                localStorage.removeItem(key);
                return null;
            } else {
				var obj = localStorage.getItem(key);
				if (obj) {
					obj = JSON.parse(obj)["data"];
				}
                return obj;
            }
        } catch(e) {
            console.log(e);
            return null;
        }
    }
	
    /*! !私有函数!
	* @name clearStorage
	* @description 清除本地缓存
	*
	*/
    function clearStorage() {
		// clear cache data
		localStorage.clear();
	}

    // public functions
    return {
        /**
         * 判断是IE
         */
        isIE : function() {
            return !!window.ActiveXObject;
        },

        /**
         * 判断是IE低版本, IE7, IE8, IE9
         */
        isIELowerVersion : function() {
            if (!ZCar.isIE()) {
                return false;
            }
            if (navigator.appName == "Microsoft Internet Explorer") {
              if (navigator.appVersion.match(/7./i) == "7." || navigator.appVersion.match(/8./i) == "8." || navigator.appVersion.match(/9./i) == "9.") {
                return true;
              }
            }
            return false;
        },


        /**
        * @name getUName
        * @description 返回当前用户名
        * 
        * @returns {String} 当前用户名。如果没有，返回空串""。
        *
        * @example
        * <pre>
            var name = ZCar.getUName();
        * </pre>
        * 
        */
        getUName : function() {
            return uname || __cache("active_uname") || "";
        },
        
        /**
        * @name openInside
        * @description 在新窗口中打开网页
        * 
        * @param {String} 网页url。
        * @param {boolean} 是否在新窗口中打开。
        *
        * @example
        * <pre>
            ZCar.openInside("#/info?poid=" + porder["po_id"]);
        * </pre>
        * 
        */
        openInside : function(url, inside) {
			url = url + "";
			if(url.indexOf("#/") == 0) {
				url = window.location.href.split('.html')[0] + '.html' + url;
                //setLoad();
			}
			if (!inside) {
				return window.open(url, '_blank');
                //setLoad();
			}
			if (window.location.href != url) {
				window.location.href = url;
				//setLoad();
				jQuery("html,body").animate({scrollTop: 0},"fast");
			}
        },
        
        /**
        * @name getUName
        * @description 返回当前用户名
        * 
        * @returns {String} 当前用户名。如果没有，返回空串""。
        *
        * @example
        * <pre>
            var name = ZCar.getUName();
        * </pre>
        * 
        */
        isLogined : function() {
            return (ZCar.getUName() !== "");
        },
        
        
        /**
        * @name gotoLogin
        * @description 跳转自登录页面
        *
        * @example
        * <pre>
            ZCar.gotoLogin();
        * </pre>
        * 
        */
        gotoLogin : function(redirect) {
			// 用户未登录、跳转登录页面
			if (redirect) {
				window.localStorage.setItem("href", location.href);
				ZCar.data("goto_login_reason", redirect);
			}
			ZCar.openInside("/user/login.html", true);
        },
        
        /**
        * @name login
        * @description 登录ZCar系统
        * 
        * @param {String} 当前用户名。
        *
        * @example
        * <pre>
            ZCar.login(name);
        * </pre>
        * 
        */
        login : function(name) {
			clearStorage();
            __cache("active_uname", name);
            __cache("last-login", (new Date() - 0));
            uname = name;
        },
        
        /**
        * @name logout
        * @description 退出当前用户
        *
        * @example
        * <pre>
            ZCar.logout();
        * </pre>
        */
        logout : function() {
            __cache("active_uname", "");
            __cache("last-login", 0);
            uname = "";
			clearStorage();
        },

        /**
        * @name data
        * @description 用于存储与用户无关的数据。将指定的数据value缓存到指定的键值key里。如果没有指定数据value，则从缓存中读取键值对应的数据。        *
        * @param {string} key 缓存或读取缓存数据的键值
        * @param {Object} value 需要缓存的数据
        * 
        * @returns {Object} 存入的数据或者从缓存中读取的数据。如果失败，返回null。
        *
        * @example
        * <pre>
            ZCar.data("user", {"name": "Job", "password": "what?it"});
            var user = ZCar.data("user");
            
            ZCar.data("action", "hello");
            ZCar.data("count", 12);
            
            var count = ZCar.data("count");
        * </pre>
        * 
        */
        data : function(key, value) {
            __cache("last-accessed", (new Date() - 0), true);
            return __cache(key, value, true);
        },
        /**
        * @name cache
        * @description 将指定的数据value缓存到指定的键值key里。如果没有指定数据value，则从缓存中读取键值对应的数据。        *
        * @param {string} key 缓存或读取缓存数据的键值
        * @param {Object} value 需要缓存的数据
        * 
        * @returns {Object} 存入的数据或者从缓存中读取的数据。如果失败，返回null。
        *
        * @example
        * <pre>
            ZCar.cache("user", {"name": "Job", "password": "what?it"});
            var user = ZCar.cache("user");
            
            ZCar.cache("action", "hello");
            ZCar.cache("count", 12);
            
            var count = ZCar.cache("count");
        * </pre>
        * 
        */
        cache : function(key, value) {
            key += "ZCAR" + ZCar.getUName();
            __cache("last-accessed", (new Date() - 0));
            return __cache(key, value);
        },
        
        /**
        * @name doCallback
        * @description 减少垃圾代码，简单处理响应函数。
        * @param {obj} res response data
        * @param {function} callback 回调函数
        * 
        * @returns {Object} response data 或者 callback处理结果
        *
        * @example
        * <pre>
            return ZCar.doCallback(res, callback);
        * </pre>
        * 
        */
        doCallback : function(res, callback) {
            if (callback) {
                return callback(res);
            }else{
                return res;
            }
        },
		
        /**
        * @name remove
        * @description 从JSON对象或数组中移除指定对象，返回移除后的数组或json对象。
        * @param {Object} org JSON对象或数组
        * @param {Object} target 要移除的对象
        * 
        * @returns {Object} JSON对象或数组
        *
        * @example
        * <pre>
            $scope.orders = ZCar.remove($scope.orders, $scope.current);
        * </pre>
        * 
        */
        remove : function(org, target) {
            if (!org || !target) {
                return org;
            }
			for (var i in org) {
				if (org[i] == target) {
					if( typeof(org.length) != "undefined") {
						org.splice(i, 1);
					} else {
						delete org[i];
					}
					break;
				}
			}
			return org;
        },

        /**
        * @name uuid
        * @description 产生并返回唯一ID。
        * 
        * @returns {String} uuid
        *
        * @example
        * <pre>
            return ZCar.uuid();
        * </pre>
        * 
        */
        uuid : function() {
            var id = (new Date() - 0);
            if (id == __uuid) {
                __uuid++;
            } else {
                __uuid = id;
            }
            return __uuid;
        },
        /**
        * @name copy
        * @description 复制json对象中的部分或全部数据
        * 
        * @param {Object} json 复制元数据对象
        * @param {Array} names 可选参数。 复制属性名称数组
        * @returns {String} 复制指定后数据的Json对象
        *
        * @example
        * <pre>
            var data = ZCar.copy(json, ["vin", "name"]);
            var all = ZCar.copy(json);
        * </pre>
        * 
        */
        copy : function(json, names) {
            var data = {};
            json = json || {};
            if (names) {
                for (var i in names) {
                    data[names[i]] = json[names[i]] || "";
                }
            } else {
                for (var i in json) {
                    data[i] = json[i];
                }
            }
            return data;
        },
        
        /**
        * @name guard
        * @description 阻止重复请求
        * 
        * @param {String} act 要阻止的action名或key
        * @returns {boolean} 允许或阻止请求
        *
        * @example
        * <pre>
            if(ZCar.guard("findCarByVin")) {
                return;
            }
        * </pre>
        * 
        */
        guard: function(act, timeout) {
            var guard = false;
            
            if (!act) {
                // TODO 未测试代码段
                try {
                    var st = (new Error).stack.split('\n');
                    if (st[3].indexOf("(") > -1) {
                        act = st[3].replace(/(.*[\. ])([^ \.]+)([ ]?\(.*[\/\\\( ])([^:]+:[^:]+)(.+)/g, "$2");
                    } else {
                        act = st[3].replace(/(.*[\/\\])([^:]+:[^:]+)(.+)/g, "$2").replace(/[\.\(\)\:\s]/g, "_");
                    }
                } catch(e){
                    act = "empty";
                };
            }
            if (act in __lastAction && __lastAction[act].action == act && (new Date() - __lastAction[act].ts < (timeout || 300))) {
                guard = true;
                ZCar.log("repeat request?: " + act);
            } else {
                __lastAction[act] = {"action": act, "ts": new Date() - 0};
            }
            return guard;
        },
        
        /**
        * @name copy
        * @description 复制json对象中的部分或全部数据
        * 
        * @param {Object} json 复制元数据对象
        * @param {Array} names 可选参数。 复制属性名称数组
        * @returns {String} 复制指定后数据的Json对象
        *
        * @example
        * <pre>
            var data = ZCar.copy(json, ["vin", "name"]);
            var all = ZCar.copy(json);
        * </pre>
        * 
        */
        log: function(msg, obj, obj2) {
            if (!__debug) {
                return;
            }
            var line = "";
            try {
                var st = (new Error).stack.split('\n');
                if (st[3].indexOf("(") > -1) {
                    line += st[3].replace(/(.*[\. ])([^ \.]+)([ ]?\(.*[\/\\\( ])([^:]+:[^:]+)(.+)/g, "$4::$2()");
                } else {
                    line = st[3].replace(/(.*[\/\\])([^:]+:[^:]+)(.+)/g, "$2");
                }
                line += " by " + st[4].replace(/(.*[\/\\\( ])([^:]+:[^:]+)(.+)/g, "$2");
            } catch(e){};
            
            msg = "[" + line + "] " + (msg || "");
            msg += (obj ? " data: " + JSON.stringify(obj) : "") + (obj2 ? " data: " + JSON.stringify(obj2) : "");
            console.log("At " + (new Date() - 0) + " " + msg);
        },
        
		
        /**
        * @name validateMobile
        * @description 校验的手机号
        * 
        * @param {String} mobile 待校验的手机号
        * @returns {Boolean} true: 合法格式; false: 格式错误;
        *
        * @example
        * <pre>
            if (ZCar.validateMobile(mobile)) {}
        * </pre>
        * 
        */
        validateMobile: function(mobile) {
			try {
				if (typeof mobile !== "string" || mobile === "") {
					return false;
				}
				return /^(0|86|17951)?(1[3-8][0-9])\d{8}$/.test(mobile);
			} catch(e) {
				ZCar.log("Failed to test mobile string: " + mobile, e);
				return false;
			}
        },
        /**
        * @name pages
        * @description 获取分页显示用的对象数组
        * [{number: 1, status: "disabled", label: '<'}, 
		* {number: 1, status: "active", label: '1'},
		* {number: 2, status: "", label: '2'}, 
		* {number: 2, status: "", label: '>'}]
        * @param {String} total 总页码
        * @param {String} current 当前页码
        * @returns {Array} 分页显示用的对象数组
        *
        * @example
        * <pre>
            var pages = ZCar.pages(20, 1);
        * </pre>
        * 
        */
        pages: function(total, current,width) {
			if (!total || total < 2) {
				return [];
			}
            current = current || 1;
            current = current * 1;
            width = width ? width : 1;
            if(total <= 5) {
                total = total || 1;
                var pp = (current > 1) ? current - 1 : 1;
                var pages = [{number: pp, status: (pp == current ? "disabled" : ""), label: '<'}];
                try {
                 for (var i=1; i <= total; i++) {
                     pages.push({number: i, status: (i == current ? "active" : ""), label: '' + i});
                 }
                } catch(e) {
                 ZCar.log("Failed to parse json string: ", e);
                 return null;
                }
                pp = (current < total) ? current + 1 : total;
                pages.push({number: pp, status: (pp == current ? "disabled" : ""), label: '>'});
                return pages;
            }


            var start, end, i;
            var pages = [];
            start = Math.max(current - width, 1);
            end = Math.min(start + width * 2, total);
            for (i = start; i <= end; i++) {
                pages.push({number: i, status: (i == current ? "active" : ""), label: '' + i});
            }
            if (start > 2) {
                var pp = (current > 1) ? current - 1 : 1;
                pages.unshift({number: -1, status: "disabled", label: '...'});
                pages.unshift({number: 1, status: "", label: '1'});
                pages.unshift({number: pp, status: (pp == current ? "disabled" : ""), label: '<'});
            } else {
                var pp = (current > 1) ? current - 1 : 1;
                if(start == 2) {
                    pages.unshift({number: 1, status: "", label: '1'});
                }
                pages.unshift({number: pp, status: (pp == current ? "disabled" : ""), label: '<'});
            }
            if (total - end >= 2) {
                var pp = (current < total) ? current + 1 : total;
                pages.push({number: -1, status: "disabled", label: '...'});
                pages.push({number: total, status: "", label: '' + total});
                pages.push({number: pp, status: (pp == current ? "disabled" : ""), label: '>'});
            } else {
                var pp = (current < total) ? current + 1 : total;
                if (total - end == 1) {
                    pages.push({number: total, status: "", label: '' + total});                    
                }

                pages.push({number: pp, status: (pp == current ? "disabled" : ""), label: '>'});
            }
			return pages;
        },
        /**
        * @name sum
        * @description 计算数据，返回指定小数位数的结果
        * 
        * @param {Array} 要计算的数据数组
        * @param {number} 小数位数。不指定则用传入最长的小数位数。
        * @returns {number} 计算后的值
        *
        * @example
        * <pre>
            var total = ZCar.sum([num1, num2, num3, num4], 2);
        * </pre>
        * 
        */
        sum: function(numbers, len) {
			if (!numbers || !(0 in numbers)) {
				return 0;
			}
			var sum = 0;
			try {
				var hasLength = (len && len > -1);
				var len = hasLength ? len : 0;
				for (var i in numbers) {
					numbers[i] = "" + numbers[i];
					if (!hasLength && numbers[i].indexOf(".") > -1){
						len = Math.max(len, numbers[i].split(".")[1].length);
					}
					sum += new Number(numbers[i]);
				}
				sum = parseFloat(sum).toFixed(len);
			} catch(e) {
				ZCar.log("Failed to sum: ", e);
			}
			return sum;
        },
		
        /**
        * @name minusDate
        * @description 计算两个时间之间的时间差
        * 
        * @param {String} 要计算的时间字符串
        * @param {String} 要减去的时间字符串。不传递，任务
        * @returns {number} date1 - date2
        *
        * @example
        * <pre>
            var countdown = ZCar.minusDate("2015/11/13 15:45:17", "2015/11/13 13:45:17");
        * </pre>
        * 
        */
        minusDate: function(date1, date2) {
			if (!date1) {
				// 采用系统当前时间，预防后台没返回数据的问题
				return (new Date() - 0);
			}
			var minus = 0;
			try {
				if (date1) {
					minus = new Date(date1.replace(/\-/g, "/")) - 0;
				}
				if (date2) {
					minus -= (new Date(date2.replace(/\-/g, "/")) - 0);
				}
			} catch(e) {
				ZCar.log("Failed to minus: ", e);
			}
			return minus;
        },

        /**
        * @name refreshParent
        * @description 刷新父窗口并选择关闭当前窗口
        * 
        * @param {boolean} 是否关闭当前窗口
        *
        * @example
        * <pre>
            ZCar.refreshParent(true);
        * </pre>
        * 
        */
        refreshParent : function(closed) {
			try {
				// 尝试刷新父窗口数据
                window.opener.ZCar.needRefresh = true;
				// window.opener.location.href = window.opener.location.href;
				if (window.opener.progressWindow) {
					window.opener.progressWindow.close();
				}
			} catch(e){}
			try {
				// 尝试关闭当前窗口
				if (closed) {
					window.close();
				}
			} catch(e){}
        },
				
        // 
        rootScope: null,
				
        // main function
        init : function() {
            
        }
    };
}();


// 记录加载过的html以及controller，防止重复网络加载
var zfiles = {template: {}, controller: {}};
var user_name = "";
var user_password = "";

// 声明延迟加载html方法
function getHtml(name) {
    if (!zfiles.template[name]) {
       // 同步ajax请求加载html，并缓存
       try {
		   var content = jQuery.ajax({url: name + ".html?_=" + zcarVersion, async: false}).responseText;
		   if (content && content.indexOf("t_menu.html") > 0) {
			   content = content.replace(/(\/t_menu.html[^>]*)(..>)/gi, "/t_menu.html?_=" + zcarVersion + "$2");
		   }
			zfiles.template[name] = content;
       } catch(e) {
           console.log(e);
       }
    }
    return zfiles.template[name];
}

moduleI.config(["$provide", "$httpProvider", "$stateProvider", "$validationProvider",function($provide, $httpProvider, $stateProvider, $validationProvider) {
    $validationProvider.showSuccessMessage = false; 
    $validationProvider.showErrorMessage = true; // or true(default)
    $validationProvider.setErrorHTML(function (msg) {
        // remember to return your HTML
        // <span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>
        return '<small class="text-danger clearfix">' + msg + '</small>';
    });
    angular.extend($validationProvider, {
        validCallback : function(element, message) {
            var $parent = element.closest(element.attr("valid-section") || "div");
            $parent.addClass('has-success').removeClass('has-error has-feedback');
        },
        invalidCallback : function(element, message) {
            var $parent = element.closest(element.attr("valid-section") || "div");
            $parent.addClass('has-error has-feedback').removeClass('has-success');
        }
    });

    //手机校验
    var _extendsExpression = {
        "mobile" : /^(0|86|17951)?(1[3-8][0-9])\d{8}$/,
        "required" : /.+/,
        "number" : /^[+-]?\d+(,\d+)*(.\d+(e\d+)?)?$/,
        "int" : /^[+-]?\d+$/,
        "money" : /^[+-]?\d+(.\d\d?)?$/,
        "email" : /^[^\s\t@]+@[^\s\t@]+\.[^\s\t@]+$/,
        "len" : function(value, scope, element, attrs, param) {
            //return ("" + value).length == 0 || ("" + value).length == param;
			return ("" + value).length == param;
        },
        "min" : function(value, scope, element, attrs, param) {
            return value >= param;
        },
        "max" : function(value, scope, element, attrs, param) {
            return value <= param;
        },
        "equal" : function(value, scope, element, attrs, param) {
			if (element[0].attributes["equal"]) {
				return value == element[0].attributes["equal"].value;
			}
            return false;
        },
        "account" : function(value, scope, element, attrs, param) {
			return(/^(0|86|17951)?(1[3-8][0-9])\d{8}$/.test(value) || /^[^\s\t@]+@[^\s\t@]+\.[^\s\t@]+$/.test(value));
        },
        "password" : function(value, scope, element, attrs, param) {
			if (!value || value.length < 6 || value.length > 20) {
				return false;
			}
			
			if (param) {
				return false;
			}
			// 纯数字或字母的无效
			var reg = /(^\d+$|^[a-zA-Z]+$|^[^\da-zA-Z]+$)/g;
			if(reg.test(value)) {
				return false;
			}
			
            return true;
        }
    };
    var _extendsValidMsg = {
        "mobile" : { error : '手机号码格式错误' },
        "int" : { error : '整数格式不正确' },
        "number" : { error : '数值格式不正确' },
        "money" : { error : '金额格式不正确' },
        "email" : { error : 'Email格式不正确' },
        "len" : { error : '内容长度不正' },
        "min" : { error : '所填数值小于最小值' },
        "max" : { error : '所填数值大于最大值' },
        "equal" : { error : '内容不一致' },
        "account" : { error : '手机号或邮箱格式不正确' },
        "password" : { error : '密码必须是6-20位字母、数字以及特殊符号的至少2种的组合' },
        "required" : { error : '' } 
    };  // 必须项目

    $validationProvider.setExpression(_extendsExpression).setDefaultMsg(_extendsValidMsg);
}]);
// 单页面响应点击重读事件
function reopen() {
	window.location.href = $(this).attr("href") || window.location.href;
}
moduleI.run(["$rootScope", "$state", "$location", "$document", "$animate", "$modal", "$alert", "$window", "$http", "$q", "$timeout",function($rootScope, $state, $location, $document, $animate, $modal, $alert, $window, $http, $q, $timeout) {
    
	$rootScope.noProgressURL = ",getConfig," + 
	"getNoticelistDetail," + 
	"getAllCates,";
		
	function sendRequest(config, success, error, retried) {
        config.headers = {'Content-Type': 'application/json; charset=UTF-8'}; // x-www-form-urlencoded'};
        if (!config.params) {
            config.params = {};
        }
		ZCar.rootScope = $rootScope;
        config.params.uuid = ZCar.uuid();
		/*
		if ($rootScope.noProgressURL.indexOf("," + config.url + ",") < 0) {
			if (config.method == "GET" || config.url.indexOf("find") == 0 ) {
				$rootScope.busy.show(config.params.uuid, "正在加载数据，请稍候...");
			} else {
				$rootScope.busy.show(config.params.uuid, "正在提交请求，请稍候...");
			}
		}
		*/

		var conf = {};
		angular.copy(config, conf);
		var warning = config.warning;
		delete config.warning;
        ZCar.log("send request to " + config.url, config.params, config.data);
        return $http(config).success(function(res, status, headers, config, statusText){
			config._raw = res;
            var data = res;
            if (typeof res === "string") {
                data = JSON.parse(res);
            }
			if (!data) {
				if (warning) $rootScope.alert("数据解析错误，请联系客服进行紧急修复。");
				data = {code: "0", failed: true};
			}
			
			if (res.version) {
				ZCar.data("version", res.version);
				if (res.version != zcarVersion) {
					$rootScope.pop("当前网页版本过低，请重新登录或强制刷新(Ctrl+F5)页面，以免耽误您的交易。");
				}
			}
			//$rootScope.busy.show(config.params.uuid, "");
			res.failed = (data.status && "" + data.status.status_code !== "200");
			
            if (!res.failed) {
				// 只有有效data字段时，才返回该字段。
				if (res.content) {
					data = res.content;
				}
				ZCar.log("got response for " + config.url + ".", ZCar.copy(res, ["uuid", "code", "message"]));
            } else {
				data.message = data.status.status_message || "";
				data.code = "" + data.status.status_code;
				if (data.code == "3007" || "" + data.code == "9903") {
					ZCar.gotoLogin("监测到账户异常，为保护您的信息安全，请重新登录！");
					return;
				}
				if (data.code == "9901" || data.code == "9902") {
					ZCar.gotoLogin("账户异常，为保护您的信息安全，已经将账户锁定。请联系客服进行解锁！");
					return;
				}
				if (data.code == "3210") {
					ZCar.gotoLogin("在线超时或未登录，请登录后再进行页面访问！");
					return;
				}
				if (data.code == "100") {
					if (warning) $rootScope.alert("内部错误，请稍后重试");
					ZCar.cache("code1", config);
				} else if ("" + data.code == "0") {
					ZCar.data("code0", config);
				} else {
					// ZCar.log("Got wrong response: ", config);
				}
            }
			// 获取服务响应时间
			data.systime = new Date(headers("Date")).getTime();
			data.failed = res.failed;
			
            if (success) {
                return success(data, status, headers, config);
            }
        }).error(function(data, status, headers, config, statusText){
            if (status === 404) {
				if (warning) $rootScope.alert("服务无法访问，请稍后刷新重试");
			}
            if (status !== 404) {
                if (!retried) {
                    retried = 0;
                }
                if (retried > 0) {
                    return sendRequest(conf, success, error, --retried);
                }
				// 只弹一次错误框， TODO fix internal error
				if (status) {
					if (warning) $rootScope.alert("网络服务错误，请稍后刷新重试。code：" + status);
				} else {
					if (warning) $rootScope.alert("数据服务错误，请稍后刷新重试。");
				}
				ZCar.cache("code_" + (status || 0), config);
            }
			
            if (error) {
                return error(data, status, headers, config, false);
			}
            if (success) {
				data = {code: status};
                return success(data, status, headers, config);
            }
        });
    }
	
    $rootScope.sendGet = function sendGet(url, json, success, error, retried) {
        return sendHttpRequest("GET", url, json, success, error, retried);
    };
    $rootScope.sendPost = function sendPost(url, json, success, error, retried) {
        return sendHttpRequest("POST", url, json, success, error, retried);
    };
    $rootScope.sendPut = function sendPost(url, json, success, error, retried) {
        return sendHttpRequest("PUT", url, json, success, error, retried);
    };
    $rootScope.sendDelete = function sendPost(url, json, success, error, retried) {
        return sendHttpRequest("DELETE", url, json, success, error, retried);
    };
	
	function sendHttpRequest(method, url, json, success, error, retried) {
		var warning = true;
		if ("noalert" in json) {
			warning = !json.noalert;
			delete json.noalert;
		}
		method = method || "GET";
        var config = {"warning": warning, "method": method, "url": (url || "/")};
		if (method == "GET" || method == "DELETE") {
			var params = "";
			for (var i in json) {
				if (i == "$$hashKey") continue;
				params += "&" + encodeURIComponent(i) + "=" + encodeURIComponent(json[i]);
			}
			if (params.length != 0) {
				config.params = json;
			}
		} else {
			config.data = json || {};
		}
        return sendRequest(config, success, error, retried);
	}
	
	
    $rootScope.refreshFunctions = {};
    $rootScope.addRefreshFunc = function addRefreshFunc(func) {
        if (func && func.exec && func.name) {
            if (!$rootScope.refreshFunctions[func.name]) {
                $rootScope.refreshFunctions[func.name] = func;
            }else{
                delete $rootScope.refreshFunctions[func.name];
            }
        }
    };
	// 注册或取消（out）每秒的轮询事件
	$rootScope.listeners = {};
    $rootScope.listen = function listen(listener, out) {
		var success = false;
		if (listener && listener.exec && listener.name) {
			if (!out) {
				if (!$rootScope.listeners[listener.name]) {
					$rootScope.listeners[listener.name] = listener;
					success = true;
				}
			} else {
				success = true;
				delete $rootScope.listeners[listener.name];
			}
		}
        return success;
    };
	
	$rootScope.alerts = {};
    $rootScope.stringArray = function stringArray(arr) {
		if (typeof arr == "string") {
			arr = arr.replace(/,,+/g, ",").replace(/(^,)|(,$)/g, "");
			return arr.length > 0 ? arr.split(",") : null;
		}
        return arr;
    };
    $rootScope.alert = function alert(options) {
		var opt = {animation: 'am-fade-and-scale', templateUrl: "/tpl_info.html", backdrop: 'static', placement: 'center', show: true};
		if (typeof options == "string") {
			opt["content"] = options;
		} else if (typeof options == "object") {
			for (var i in options) {
				opt[i] = options[i];
			}
		}
		
		// 防止重复消息弹窗
		var key = opt["content"];
		var previous = $rootScope.alerts[key]; 
		if (previous && !previous.$isShown) {
			previous = null;
		}
		var modal = previous ? previous : $modal(opt);
		$rootScope.alerts[key] = modal;
		
		return modal;
    };
    $rootScope.pop = function pop(options) {
		var opt = {animation: 'am-fade-and-scale', container: '.w', placement: 'body-top-left', content: "", type: 'danger', duration: 5, show: true};
		if (typeof options == "string") {
			opt["content"] = options;
		} else if (typeof options == "object") {
			for (var i in options) {
				opt[i] = options[i];
			}
		}
		
		return $alert(opt);
    };
    $rootScope.updateModalContent = function updateModalContent(content) {
		var modal = jQuery('[ng-bind-html="content"]');
		if (modal) {
			modal.html(content.replace(/\n/g, "<br>"));
		}
	}
    $rootScope.modal = function modal(options) {
		var tpl = '<div class="modal" tabindex="-1" role="dialog" aria-hidden="true"><div class="modal-dialog"><div class="modal-content">' +
'	<div class="modal-header" ng-show="title">' +
'		<button type="button" class="close" aria-label="Close" ng-click="$hide();"><span aria-hidden="true">&times;</span></button>' +
'		<div class="modal-title">{{content}}</div>' + 
'	</div>' + 
'</div></div></div>';
//
		var opt = {title: "", html: true, animation: 'am-fade-and-scale', backdrop: false, placement: 'center', show: true};
		if (options) {
			for (var i in options) {
				opt[i] = options[i];
			}
		}
		return $modal(opt);
    };
	
    $rootScope.notify = function notify(options) {
		var content = '<div class="modal" style="width: ' + (options.width || 500) + 'px; margin-left: auto; margin-right: auto; display: block;" tabindex="-1" role="dialog" aria-hidden="true"><div class="modal-dialog" style="width: ' + (options.width - 20 || 480) + 'px; position:fixed; top: ' + (options.top || "30%") + ';" ><div class="modal-content" movable>' +
			"<div class='modal-body' movable>" + (options.content || options.template || "") + "</div>" + '</div></div></div>';

		var opt = {animation: 'am-fade-and-scale', template: content, backdrop: 'static', show: true};
		if (options) {
			for (var i in options) {
				opt[i] = options[i];
			}
		}
		return $modal(opt);
    };
	
    $rootScope.confirm = function confirm(options) {
        var opt = {animation: 'am-fade-and-scale', templateUrl: '/tpl_confirm.html', backdrop: 'static', placement: 'center', show: true};
		if (options) {
			for (var i in options) {
				opt[i] = options[i];
			}
		}
		return $modal(opt);
    };
	
		var tpl_doing = '<div class="modal" style="background-color:initial; width: 500px; margin-left: auto; margin-right: auto;" tabindex="-1" role="dialog" aria-hidden="true">' + 
'  <div class="modal-dialog" style="width: 480px; position:fixed; top: 30%;">' + 
'    <div class="modal-content" movable>' + 
'' + 
'    <div class="modal-body"><div class="padding-v15" style="min-height: 50px;"><a class="btn btn-link close" style="position:absolute; right: 0px; top: 0px;" ng-click="$hide()">&times;</a>' + 
'    <div class="pull-left" ng-bind-html="content"></div>' +  
'</div></div></div>' +  
'</div></div>';
	
    $rootScope.doingModal = null;
    $rootScope.busy = {msgs: {}};
	$rootScope.busy.show = function show(key, message) {
		if (!key) {
			return;
		}
		if (key in $rootScope.busy.msgs) {
			if ($rootScope.busy.msgs[key].showing) {
				$rootScope.doing(message);
			}
			if (!message) {
				delete $rootScope.busy.msgs[key];
			} else {
				$rootScope.busy.msgs[key].content = message;
			}
		} else {
			$rootScope.busy.msgs[key] = {content: message, showing: false};
			$timeout(function() {
				if (key in $rootScope.busy.msgs) {
					$rootScope.busy.msgs[key].showing = true;
					$rootScope.doing($rootScope.busy.msgs[key].content);
					if ($rootScope.busy.msgs[key] == "") {
						delete $rootScope.busy.msgs[key];
					}
				}
			}, 2000);
		}
	}
    $rootScope.doing = function doing(options, timeout) {
		if (timeout) {
			$timeout(function() {
				$rootScope.doing(options);
			}, timeout);
			return;
		}
		try {
			var opt = {animation: 'am-fade-and-scale', template: tpl_doing, backdrop: 'static', placement: 'center', show: true};
			if (options) {
				if (typeof options == "string") {
					opt["content"] = options;
				} else {
					for (var i in options) {
						opt[i] = options[i];
					}
				}
			}
			if ($rootScope.doingModal == null && !opt["content"]) {
				return;
			}
			if ($rootScope.doingModal == null) {
				$rootScope.doingModal = $modal(opt);
			}
			if (opt["content"] && opt["content"].length > 1) {
				$rootScope.doingModal.show();
				$rootScope.updateModalContent(opt["content"]);
			} else {
				$rootScope.doingModal.hide();
			}
		} catch(e) {
			
		}
    };
}]);

// register router for Cart 
//moduleI.config(["$stateProvider", "$urlRouterProvider", "$locationProvider",function($stateProvider, $urlRouterProvider, $locationProvider) {
moduleI.config(["$urlRouterProvider", function($urlRouterProvider) {
  $urlRouterProvider.otherwise("");
 // $locationProvider.html5Mode(true);
}]);


/**
// 对Date的扩展，Date 转化为指定格式的String
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
*/
Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, 
        "D+": this.getDate(),
        "d+": this.getDate(),
        "H+": this.getHours(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };
    if (/(y+)/i.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

// String.trim() is required by angular-validate 
if (!String.prototype.trim) {
	String.prototype.trim = function() {
		return this.replace(/^\s+/, '').replace(/\s+$/, '');
	};
}


moduleI.filter('formatUrl', function() {
    return function(content) {
        if (!content) {
            return content;
        }
		return content.replace(/\\/gi, "/").replace(/\#/gi, "%23");
    }
});

