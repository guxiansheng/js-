/*动态添加样式表规则*/
var _add_sheet = function(){
    var doc,cssCode;
    if (arguments.length == 1) {
        doc = document;
        cssCode = arguments[0];
    } else if (arguments.length == 2) {
        doc = arguments[0];
        cssCode = arguments[1];
    } else {
        alert("addSheet函数最多接受两个参数!");
    }
    var headElement = doc.getElementsByTagName("head")[0];
    var styleElements = headElement.getElementsByTagName("style");
    if (styleElements.length == 0) { // 如果没有 就添加
        if (!+"\v1") {  // IE
            doc.createStyleSheet();
        } else {
            var tempStyleElement = doc.createElement("style"); // w3c
            tempStyleElement.setAttribute("type", "text/css");
            headElement.appendChild(tempStyleElement);
        }
    };
    var styleElement = styleElements[0];
    var media = styleElement.getAttribute("media");
    if (media != null && !/screen/.test(media.toLowerCase())) {
        styleElement.setAttribute("media", "screen");
    };
    if (!+"\v1") {  // IE
        styleElement.styleSheet.cssText += cssCode;
    } else if (/a/[-1] == 'a') { // FF
        styleElement.innerHTML += cssCode;
    } else {
        styleElement.appendChild(doc.createTextNode(cssCode));
    }
}

var Class = {
    create : function(){
        return function(){
            this.initialize.apply(this, arguments);
        };
    }
};

var extend = function(destination, source){
    for (var property in source) {
        destination[property] = source[property];
    };
    return destination;
};

var RichTextEditor = Class.create();
RichTextEditor.prototype = {
    initialize : function(options){
        this.setOptions(options);
        this.drawEditor(this.options.textarea_id);
    },
    setOptions : function(options){
        this.options = {
            id : 'jeditor_' + new Date().getTime(),
            textarea_id : null // 用于textarea是 我们必须传进来的容器id
        };
        extend(this.options, options || {}); // 合并
    },
    ID:function(id){
        return document.getElementById(id)
    },//getElementById的快捷方式
    TN:function(tn){
        return document.getElementsByTagName(tn)
    },//getElementsByTagName的快捷方式
    CE:function(s){
        return document.createElement(s)
    },//createElement的快捷方式
    hide:function(el){
        el.style.display = 'none';
    },
    show:function(el){
        el.style.display = 'block';
    },
    fontPickerHtml : function(str, array){
        var builder = [];
        for (var i = 0,l = array.length; i < l; i++) {
            builder.push('&nbsp;<a unselectable="on" style="');
            if (str == 'fontname') {
                builder.push('font-family');
                builder.push(':');
                builder.push(array[i]);
                builder.push(';" href="javascript:void(0)">');
                builder.push(array[i]);
            } else if (str == 'fontsize') {
                builder.push('font-size');
                builder.push(':');
                builder.push(array[i][1]);
                builder.push(';" sizevalue="');
                builder.push(array[i][0]);
                builder.push('" href="javascript:void(0)">');
                builder.push(array[i][2]);
            }
            builder.push("</a>");
        };
        return builder.join('');
    },
    iconsHtml : function(){
        var builder = [],
            j       = 0,
            _drawRow = function(builder, i){
                builder.push('<tr>');
                for (var i = 0; i < 6; i++) {
                    j++;
                    _drawCell(builder, j);
                };
                builder.push('</tr>');
            },
            _drawCell = function(builder, j){
                var url = 'images/emoticons/face'+j+'.gif';
                builder.push('<td style="background:url('+url+') center center no-repeat; width:21px;height:21px;"');
                builder.push(' url="'+url+'">&nbsp;</td>');
            };
            builder.push('<table border="1">');
            for(var i=0 ;i<6;i++){
                _drawRow(builder,i);
            }
            builder.push('</table>');
            return builder.join('');
    },
    tableHtml : function(){
        var _drawInput = function(builder, name, value){
            builder.push('<input id="');
            builder.push(name);
            builder.push('" value="');
            builder.push(value);
            builder.push('" />');
        },
        builder = [];
        builder.push('<table bgcolor="#f1f1f1">');
        builder.push('<tr><td colspan="2" style="padding:2px" bgcolor="#D0E8FC">');
        builder.push('插入表格');
        builder.push('</td></tr>');
        builder.push('<tr><td>行数</td><td>');
        _drawInput(builder, 'rows', 3);
        builder.push('</td></tr>');
        builder.push('<tr><td>列数</td><td>');
        _drawInput(builder, 'cols', 5);
        builder.push('</td></tr>');
        builder.push('<tr><td>宽度</td><td>');
        _drawInput(builder, 'width', 300);
        builder.push('</td></tr>');
        builder.push('<tr><td colspan="2" style="padding-top:6px;">');
        builder.push('<input type="button" id="rte_submit" value="提交" unselectable="on" />');
        builder.push('<input type="button" id="rte_cancel" value="取消" unselectable="on" />');
        builder.push('</td></tr>');
        builder.push('</table>');
        return builder.join('');
    },
    createTable : function(rows, cols, width){
        var builder = [];
        builder.push('<table border="1" width="');
        builder.push(width);
        builder.push('">');
        for (var r = 0; r < rows; r++) {
            builder.push('<tr>');
            for (var c = 0; c < cols; c++) {
                builder.push('<td>&nbsp;</td>');
            };
            builder.push('</tr>');
        };
        builder.push('</table>');
        return builder.join('');
    },
    colorPickerHtml : function(){
        var  _hex = ['FF', 'CC', '99', '66', '33', '00'],
        builder = [],
        // 画出一个格子的颜色
        _drawCell = function(builder, red, green, blue){
            builder.push('<td bgcolor="');
            builder.push('#' + red + green + blue);
            builder.push('" unselectable="on"></td>');
        },

        // 画出一行颜色
        _drawRow = function(builder, red, blue){
            builder.push('<tr>');
            for (var i = 0; i < 6; i++) {
                _drawCell(builder, red, _hex[i], blue);
            };
            builder.push('</tr>');
        },
        // 画出六大颜色区块之一
        _drawTable = function(builder, blue){
            builder.push('<table class="cell" unselectable="on">');
            for (var i = 0; i < 6; ++i) {
                _drawRow(builder, _hex[i], blue);
            };
            builder.push('</table>');
        };

        // 开始创建
        builder.push('<div><table><tr>');
        for (var i = 0; i < 3; i ++) {
            builder.push('<td>');
            _drawTable(builder, _hex[i]);
            builder.push('</td>');
        };
        builder.push('</tr><tr>');
        for (var i = 3; i < 6; i++) {
            builder.push('<td>');
            _drawTable(builder, _hex[i]);
            builder.push('</td>');
        };  
        builder.push('</tr></table>');
        builder.push('<table id="color_result"><tr><td id="color_view"></td><td id="color_code"></td></tr></table>');
        return builder.join('');
    },
    addEvent : function(el, type, fn){
        if (!+"\v1") {
            el['e'+type+fn] = fn;
            el.attachEvent( 'on' + type, function(){
                el['e'+type+fn]();
            })
        } else {
            el.addEventListener(type, fn, false);
        }
    },
    drawEditor : function(id){
        var $        = this,
            textarea = this.ID(id), // textarea容器
            toolbar  = this.CE('div'),
            br       = this.CE('br'),
            iframe   = this.CE('iframe');
        $.hide(textarea);
        textarea.parentNode.insertBefore(toolbar, textarea);
        textarea.parentNode.insertBefore(br, textarea);
        textarea.parentNode.insertBefore(iframe, textarea);
        br.style.cssText = 'clear:both';
        toolbar.setAttribute("id", "RTE_toolbar");
        iframe.setAttribute("id", "RTE_iframe");
        iframe.frameBorder = 0;
        var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        iframeDocument.designMode = 'on';
        iframeDocument.open();
        iframeDocument.write('<html><head><style type="text/css">body{ font-family:arial; font-size:13px;background:#DDF3FF;border:0; }</style></head></html>');
        iframeDocument.close();

        var buttons = {//工具栏的按钮集合
            'fontname':['字体',-120,-40,86,20],
            'fontsize':['文字大小',-220,-40,86,20],
            'removeformat':['还原',-580,0,20,20],
            'bold':[ '粗体',0,0,20,20],
            'italic':[ '斜体',-60,0,20,20],
            'underline': ['下划线',-140,0,20,20],
            'strikethrough':['删除线',-120,0,20,20],
            'justifyleft': ['居左', -460,0,20,20],
            'justifycenter':[ '居中',-420,0,20,20],
            'justifyright':['居右',-480,0,20,20],
            'justifyfull':['两端对齐',-440,0,20,20],
            'indent':['缩进',-400,0,20,20],
            'outdent':['悬挂',-540,0,20,20],
            'forecolor':['前景色',-720,0,20,20],
            'backcolor':['背景色',-760,0,20,20],
            'createlink':['超级连接',-500,0,20,20],
            'insertimage':['插入图片',-380,0,20,20],
            'insertorderedlist':['有序列表',-80,0,20,20],
            'insertunorderedlist':['无序列表',-20,0,20,20],
            'html':['查看',-260,0,20,20],
            'table':['表格',-580,-20,20,20],
            'emoticons':['表情',-60,-20,20,20]
        };
        var fontFamilies = ['宋体','经典中圆简','微软雅黑', '黑体', '楷体', '隶书', '幼圆',
        'Arial', 'Arial Narrow', 'Arial Black', 'Comic Sans MS',
        'Courier New', 'Georgia', 'New Roman Times', 'Verdana']
        var fontSizes= [[1, 'xx-small', '特小'],
        [2, 'x-small', '很小'],
        [3, 'small', '小'],
        [4, 'medium', '中'],
        [5, 'large', '大'],
        [6, 'x-large', '很大'],
        [7, 'xx-large', '特大']];

        var buttonClone = $.CE("a"),
        fragment = document.createDocumentFragment();
        buttonClone.className = 'bn';
        for (var i in buttons) {
            var button = buttonClone.cloneNode("true");
            if (i == 'backcolor') {
                if (!+"\v1") {
                    button.setAttribute("title", "background");
                } else {
                    button.setAttribute("title", "hilitecolor");
                }
            }
            button.style.cssText = "background-position: " +buttons[i][1]+"px "+buttons[i][2]+"px; width: "+buttons[i][3]+"px; height: " +buttons[i][4]+"px;"
            button.setAttribute("title", buttons[i][0]);
            button.setAttribute("command", i);/*把execCommand的命令参数放到自定义属性command中*/
            button.setAttribute("unselectable", "on");/*防止焦点转移到点击的元素上，从而保证文本的选中状态*/
            toolbar[i] = button;
            fragment.appendChild(button);
        }
        toolbar.appendChild(fragment);
        $.addEvent(toolbar, 'click', function(){
            var e = arguments[0] || window.event,
            target = e.srcElement ? e.srcElement : e.target,
            command = target.getAttribute("command");
            switch (command) {
                case 'createlink':
                case 'insertimage':
                    var value = prompt("请输入网址:", "http://");
                    _format(command, value);
                    break;
                case 'fontname':
                case 'fontsize':
                case 'forecolor':
                case 'backcolor':
                case 'html':
                case 'table':
                case 'emoticons':
                    return;
                default:
                    _format(command, '');
                    break;    
            }
        });
        /******************************************************************/
        var popup = $.CE('div');
        toolbar.insertBefore(popup, null);
        /******************************************************************/
        $.addEvent(toolbar['fontname'], 'click', function(){
            updatePopup(this, "fontpicker", $.fontPickerHtml('fontname', fontFamilies));
        });

        $.addEvent(toolbar['fontsize'], 'click', function(){
            updatePopup(this,"fontpicker",$.fontPickerHtml('fontsize',fontSizes));
        });

        $.addEvent(toolbar['emoticons'],'click',function(){
            updatePopup(this,"iconinsertor",$.iconsHtml());
        });

        $.addEvent(toolbar['table'],'click',function(){
            updatePopup(this,"tablecreator",$.tableHtml());
        });

        $.addEvent(toolbar['forecolor'],'click',function(){
            updatePopup(this,"colorpicker",$.colorPickerHtml());
        });

        $.addEvent(toolbar['backcolor'],'click',function(){
            updatePopup(this,"colorpicker",$.colorPickerHtml());
        });

        /******************************************************************/
        $.addEvent(popup, 'click', function(){
            var e = arguments[0] || window.event,
            element = e.srcElement ? e.srcElement : e.target,
            command = this.getAttribute("title"),
            id = this.getAttribute("id"),
            tag = element.nodeName.toLowerCase();
            switch (id) {
                case "fontpicker":
                    if (tag == 'a') {
                        var value;
                        if ('fontsize' == command) {
                            value = element.getAttribute('sizevalue');
                        } else {
                            value = element.innerHTML;
                        }
                        _format(command, value);
                        $.hide(this);
                    }
                    break;
                case "colorpicker":
                    if (tag == 'td') {
                        var value = element.bgColor;
                        _format(command, value);
                        $.hide(this);
                    };    
                    break;
                case "tablecreator":
                    var submit = $.ID('rte_submit'),
                    cancel = $.ID('rte_cancel'),
                    rows = $.ID('rows').value,
                    cols = $.ID('cols').value,
                    width = $.ID('width').value;
                    if (element == cancel) {
                        $.hide(this);
                    } else if (element == submit) {
                        var html = $.createTable(rows, cols, width);
                        _insertHTML(html);
                        $.hide(this);
                    }
                    break;
                case "iconinsertor":
                    if (tag == 'td') {
                        var url = element.getAttribute('url');
                        _insertHTML("<img src='"+url+"' />");
                        $.hide(this);
                    }    
                    break;
            };
        });
        $.addEvent(popup, 'mouseover', function(){
            var id = this.getAttribute("id");
            if (id == 'colorpicker') {
                var e = arguments[0] || window.event,
                element = e.srcElement ? e.srcElement : e.target,
                tag = element.nodeName.toLowerCase(),
                colorView = $.ID('color_view'),
                colorCode = $.ID('color_code');
                if ( 'td' == tag ) {
                    colorView.style.backgroundColor = element.bgColor;
                    colorCode.innerHTML = element.bgColor;
                }
            }
        });
        /********切换回代码界面********************************************/
        var _doHTML = function() {
            $.hide(iframe);
            $.show(textarea);
            textarea.value = iframeDocument.body.innerHTML;
            textarea.focus();
        };
        /********切换回富文本编辑器界面*************************************/
        var _doRich = function() {
            $.show(iframe);
            $.hide(textarea);
            iframeDocument.body.innerHTML = textarea.value;
            iframe.contentWindow.focus();
        };
        /********切换编辑模式的开关*******************************************/
        var switchEditMode = true;
        $.addEvent(toolbar['html'], 'click', function(){
            if(switchEditMode){
                _doHTML();
                switchEditMode = false;
            }else{
                _doRich();
                switchEditMode = true;
            }
        });
        var _insertHTML = function(html){
            iframe.contentWindow.focus();
            if(!+"\v1"){
                /****这里需要解决IE丢失光标位置的问题，详见核心代码四**************/
                iframeDocument.selection.createRange().pasteHTML(html);
            }else{
                var selection = iframe.contentWindow.getSelection();
                var range;
                if (selection) {
                    range = selection.getRangeAt(0);
                }else {
                    range = iframeDocument.createRange();
                }
                var oFragment = range.createContextualFragment(html),
                oLastNode = oFragment.lastChild ;
                range.insertNode(oFragment) ;
                range.setEndAfter(oLastNode ) ;
                range.setStartAfter(oLastNode );
                selection.removeAllRanges();//清除选择
                selection.addRange(range);
            }
        }
        /*******************核心代码之一******************************************/
        /********************处理富文本编辑器的格式化命令**************************/
        var _format = function(x,y){
            try{
                iframeDocument.execCommand(x,false,y);
                iframe.contentWindow.focus();
            }catch(e){}
        }
        /***********核心代码之二*************************************************/
        /***********隐藏与显示弹出层**********************************************/
        var bind_select_event = function(button,picker,id){
            button.style.position = 'relative';
            var command = button.getAttribute("command");
            if('backcolor' == command){
                command = !+"\v1" ? 'backcolor':'hilitecolor';
            }
            picker.setAttribute("id",id);
            picker.setAttribute("title",command);//转移命令
            if(picker.style.display == 'none'){
                $.show(picker);
                picker.style.left = button.offsetLeft + 'px';
                picker.style.top = (button.clientHeight + button.offsetTop)+ 'px';
            }else{
                $.hide(picker);
            }
        }
        /***********核心代码之三*************************************************/
        /***********动态修正弹出层的内容**********************************************/
        var updatePopup = function(button, className, html){
            var child = $.CE("span");
            child.innerHTML = html;
            popup.innerHTML = "";
            popup.appendChild(child);
            bind_select_event(button, popup, className);
        };
        /*******************核心代码之四******************************************/
        /**********************获取iframe的内容************************************/
        $.addEvent(iframe.contentWindow,"blur",function(){
            textarea.value = iframeDocument.body.innerHTML;
        });

        /*******************核心代码之五******************************************/
        /*当光标离开iframe再进入时默认放在body的第1个节点上了，所以要记录光标的位置***/
        if (!+"\v1") {
            var bookmark;
            // 记录IE的编辑光标的位置
            $.addEvent(iframe, "beforedeactivate", function(){// 在文档失去焦点以前
                var range = iframeDocument.selection.createRange();
                bookmark = range.getBookmark();
            });
            // 恢复Ie的编辑光标
            $.addEvent(iframe, "activate", function(){
                if (bookmark) {
                    var range = iframeDocument.body.createTextRange();
                    range.moveToBookmark(bookmark);
                    range.select();
                    bookmark = null;
                };
            });
        };
        /****************************************************************/
        _add_sheet('\
        #RTE_iframe{width:600px;height:300px;}\
        #RTE_toolbar{float:left;width:600px;background:#D5F3F4;}\
        #RTE_toolbar select{float:left;height:20px;width:60px;margin-right:5px;}\
        #RTE_toolbar .bn {display:block;float:left; text-decoration:none;border:1px solid;\
        border-color:#ccc #f3f8fc #f3f8fc #ccc;margin:2px 2px 5px;background-image: url(images/tinymce.gif)};\
        #RTE_toolbar .bn:hover{color:#fff;border-color:#fff #aaa #aaa #fff;}\
        div#fontpicker{display:none;height:150px;width:150px;overflow:auto;position:absolute;\
           border:2px solid #c3c9cf;background:#F1FAFA;}\
        div#fontpicker a{display:block;text-decoration:none;color:#000;background:#F1FAFA;padding:2px;line-height:1em!important;}\
        div#fontpicker a:hover{color:#999;background:#e3e6e9;}\
        div#colorpicker {display:none;position:absolute;width:216px;border:2px solid #c3c9cf;}\
        div#colorpicker table{border-collapse:collapse;margin:0;padding:0;}\
        div#colorpicker  table td {padding:0!important;}\
        div#colorpicker .cell td{height:12px;width:12px;}\
        #color_result{width:216px;}\
        #color_view{width:110px;height:25px;}\
        div#tablecreator{display:none;width:176px;position:absolute;border:2px solid #c3c9cf;padding:1px;}\
        div#tablecreator table{border:1px solid #69f;line-height:12px;font-size:12px;border-collapse:collapse;width:100%;}\
        div#tablecreator td{font-size:12px;color:#777;text-align:center;padding:0!important;}\
        #rte_submit,#rte_cancel{font-size:12px;color:#777;border:1px solid #777;background:#f4f4f4;margin:5px 3px;}\
        #rows, #cols, #width{width:80px;height:14px;line-height:12px;font-size:12px;border:1px solid #69f;background:#F1FAFA;}\
        div#iconinsertor {display:none;position:absolute;width:150px;height:150px;background:#F1FAFA;}\
        div#iconinsertor td{padding:0!important}');
    }
};