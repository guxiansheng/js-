/**
 * 
 * 
 * 
 */ 

;(function(root, factory, plug) {
    factory(root.$, plug);
})(window,function($, plug){
    // 默认配置参数
    var __DEFAULT__ = {
        'triggerEvent' : 'keyup', // 默认触发事件方式
        'tipError' : '输入错误！'  // 默认错误提示文案
    };
    /*
        __RULES__ 
		require     必填项
		regex       正则验证
		length      长度限制
		minlength   最小长度
		maxlength   最大长度
		range       两者长度之间 6-16
		confirmpw   确认两次密码是否一样
        chinese     不能包含中文
        checked     检查多选框是否被选中
		phone       必须是电话号码 xxxx-xxxxxxxx
		url         必须是有效的统一资源标示符
		//cardId    身份证号码（根据业务规则来自行扩展）
		//bankId    银行卡号码（根据业务规则来自行扩展）
		//...       其他的规则（根据业务规则来自行扩展）
	*/
    // 验证规则集合
    var __RULES__ = {
        // 必填项
        require : function() {
            return $.trim(this.val()) !== ""; 
        },
        // 最大长度
        maxlength : function() {
            var maxlength = parseInt(this.data("fv-maxlength"));
            return this.val().length <= maxlength;
        },
        // 最小长度
        minlength : function() {
            var maxlength = parseInt(this.data("fv-maxlength"));
            return this.val().length >= maxlength;
        },
        // 正则验证
        regex : function() {
            if (/\s+/g.test(this.val())) return false;
            return new RegExp(this.data("fv-regex")).test(this.val());
        },
        // 长度范围验证
        range : function() {
            var length = this.val().length,
                range  = this.data("fv-range").split("-"); 
            return length>=range[0] && length <= range[1];
        },
        // 不能包含中文
        chinese : function() {
            return !(new RegExp(this.data("fv-chinese")).test(this.val()));
        },
        // 确认两次密码是否一致
        confirmpw : function() {
            return this.val() == $("[name=password]").val();
        },
        // 检查多选框是否被选中
        checked : function () {
            return $(".is_server").prop('checked');
        },
        // 固定电话号码 分机号码
        phone : function(){
			return /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/.test(this.val());
		},
        // 必须是有效的统一资源标示符
        url : function(){
			return /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g.test(this.val());
		}
    };
    // 原型方法
    var __PROTOTYPE__ = {
        // 初始化
        _init : function() {
            // 找到所有需要被验证的表单元素
            this.$inputs = this.find(".form-group .form-control");
        },
        // 封装了自定义事件的触发机制
        _attchEvent : function(event, args) {
            this.trigger(event, args);
        },
        // 绑定表单元素的验证事件
        _bind : function() {
            var _$this = this;
            // 给每一个需要被验证的表单元素绑定验证的触发事件，验证此表单域是否有效，并返回验证结果。
            _$this.$inputs.on(_$this.triggerEvent, function() {
                // console.log(_$this.triggerEvent)
                var $input = $(this),
                    // 存储此表单元素的父元素 以此添加或者删除当前的错误信息提示。 
                    $group = $input.parents(".input-group"),
                    // 默认验证结果为 true
                    result = true;
                    // 触发事件时先移除掉此表单域的错误提示
                    $group.next(".tip-error").remove();
                    // 遍历验证规则，验证当前表单元素已配置的规则
                    $.each(__RULES__, function(key, rule) {
                        // 如果当前表单元素配置了此规则，就验证规则并返回验证结果
                        if ($input.data("fv-"+ key)) {
                            // rule函数里面的this引用变成了$input
                            result = rule.call($input);
                            (!result) && $group.after("<p class=\"tip-error\">"+ ($input.data("fv-"+ key +"-message") || _$this.tipError) +"</p>")
                            return result;
                        }
                    })
                    $group.removeClass("has-success has-error").addClass("has-"+ (result ? 'success' : 'error'));
            });
            // 监听表单提交事件
            this.on('submit',function() {
                if (_$this.triggerEvent == 'blur') {
                    _$this.$inputs.trigger('focus');
                }
                var $group  = _$this.$inputs.trigger(_$this.triggerEvent).parents(".input-group");
                if ($group.filter(".has-error").size() === 0) {
                    // 触发验证成功回调函数
                    _$this._attchEvent("success",{});
                } else {
                    // 触发验证失败会调函数
                    _$this._attchEvent("error",{})
                }
                return false;
            })
        }
    };
    $.fn[plug] = function(options) {
        if (!this.is("form")) throw new Error("the target is not form tag!");
        $.extend(this,__DEFAULT__, options, __PROTOTYPE__);
        this._init();
        this._bind();
        return this;
    }
    $.fn[plug].extendRules = function(news){
		$.extend(__RULES__,news);//扩展规则
	}
}, 'formValidator')