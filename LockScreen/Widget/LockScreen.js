dojo.require('LockScreen.Widget.lib.jquerymin');
dojo.provide('LockScreen.Widget.LockScreen');

dojo.declare('LockScreen.Widget.LockScreen', mxui.widget._WidgetBase, {

	addons  : [mendix.addon._Contextable],
	inputargs: { 
		 value : ''
	},

    // Internal variables
	_code : '',
    _templateHtml : '',

    // Internal functions
    _resumeFunction : function(){
        if(window.zipzapcode.length > 0){
            $("#lockscreen").show();
            $("#content").hide();
        }
    },

	_updateLock : function( change ) {

		if(change == 'DEL'){
            this._code = this._code.substr(0, this._code.length - 1);
		}
		else{
            this._code += change;
		}
		switch (this._code.length) {
			case 0:
			  $( ".code td" ).removeClass("fill").text("").html('&nbsp;');
			  break;
			case 1:
			  $( ".code td" ).removeClass("fill").text("").html('&nbsp;');
			  $( ".code1" ).addClass( "fill" ).text("*");
			  break;
			case 2:
			  $( ".code td" ).removeClass("fill").text("").html('&nbsp;');
			  $( ".code1, .code2" ).addClass( "fill" ).text("*");
			  break;
			case 3:
			  $( ".code td" ).removeClass("fill").text("").html('&nbsp;');
			  $( ".code1, .code2, .code3" ).addClass( "fill" ).text("*");
			  break;
			case 4:
			  $( ".code td" ).removeClass("fill").text("").html('&nbsp;');
			  $( ".code1, .code2, .code3, .code4" ).addClass( "fill" ).text("*");
			  break;
			case 5:
			  $( ".code td" ).removeClass("fill").text("").html('&nbsp;');
			  $( ".code1, .code2, .code3, .code4, .code5" ).addClass( "fill" ).text("*");
			  break;
		  default: 
			$( ".code td" ).removeClass("fill").text("").html('&nbsp;');
			$( ".code1, .code2, .code3, .code4, .code5" ).addClass( "fill" ).text("*");
			break;
        }
		if (this._code.length >= 5 ) {
			
			 if(window.zipzapcode == this._code){
                 this._code = '';
				 $( ".code td" ).removeClass("fill").text("").html('&nbsp;');
				 $("#lockscreen").hide();
				 $("#content").show();
                 window.storeFlag = false;
			}
			else{
				alert("code incorrect");
                 this._code = '';
				$( ".code td" ).removeClass("fill").text("").html('&nbsp;');
			}
			
		}

	},

    // TODO
	
	_setupElements : function() {
        // StoreFlag should be true to render the template.
        if(window.storeFlag) {
            this._templateHtml = $('<div></div>');
            this._templateHtml.html('<div id="logo"><img src="Dela_20logo.png" style="width: 50%;" />' +
                '<table class="code">' +
                '	<tbody>' +
                '		<tr>' +
                '			<td class="code1">&nbsp;' +
                '			</td>' +
                '			<td class="code2">&nbsp;' +
                '			</td>' +
                '			<td class="code3">&nbsp;' +
                '			</td>' +
                '			<td class="code4">&nbsp;' +
                '			</td>' +
                '		    <td class="code5">&nbsp;' +
                '			</td>' +
                '		</tr>' +
                '	</tbody>' +
                '</table>' +
                '<p><font color="white" size="4"><b>&nbsp;&nbsp;Voer uw snelcode in</b></font></p></div>' +
                '<div id="keys">' +
                '<table id="keypad" cellpadding="5" cellspacing="3">' +
                '	<tbody>' +
                '		<tr>' +
                '			<td>' +
                '				<div class="key">1</div>' +
                '			</td>' +
                '			<td>' +
                '				<div class="key">2</div>' +
                '			</td>' +
                '			<td>' +
                '				<div class="key">3</div>' +
                '			</td>' +
                '		</tr>' +
                '		<tr>' +
                '			<td>' +
                '				<div class="key">4</div>' +
                '			</td>' +
                '		<td>' +
                '			<div class="key">5</div>' +
                '		</td>' +
                '		<td>' +
                '			<div class="key">6</div>' +
                '		</td>' +
                '	</tr>' +
                '	<tr>' +
                '		<td>' +
                '			<div class="key">7</div>' +
                '		</td>' +
                '		<td>' +
                '			<div class="key">8</div>' +
                '		</td>' +
                '		<td>' +
                '			<div class="key">9</div>' +
                '		</td>' +
                '	</tr>' +
                '	<tr>' +
                '		<td>&nbsp;' +
                '		</td>' +
                '		<td>' +
                '			<div class="key">0</div>' +
                '		</td>' +
                '		<td>' +
                '			<div class="key">DEL</div>' +
                '		</td>' +
                '	</tr>' +
                '	</tbody>' +
                '	</table>' +
                '</div>');

            // Attributes.
            this._templateHtml.css('background-color', '#056E82');
            this._templateHtml.css('z-index', '1003');
            this._templateHtml.attr('id', 'lockscreen');

            $('body').append(this._templateHtml);

            // Bind eighter to click or touchstart.
            var clickEventType = ((document.ontouchstart !== null) ? 'click' : 'touchstart'),
                me = this;

            $('.key').each(function (index, value) {
                var el = $(value);
                el.bind(clickEventType, { key: el.html() }, function (event) {

                    var data = event.data;
                    me._updateLock(data.key);

                    // Prevent default from happening.
                    event.cancelBubble = true;
                    event.stopPropagation();
                    event.preventDefault();

                }.bind(this));
            });

        } else {
            this._templateHtml = $('<div></div>');
            this._templateHtml.attr('id', 'lockscreen');
            this._templateHtml.css('display', 'none');
            $('body').append(this._templateHtml);
        }
	},

    _addHtmlEventListener: function(){

        if( /Android|webOS|iPhone|iPad|iPod|IEMobile/i.test(navigator.userAgent) ) {
            document.addEventListener("resume", dojo.hitch(this,this._resumeFunction), false);

            $('.code').click(function() {
                $('#quickcode').focus();
            });
        }

    },

    postCreate : function() {
        logger.debug(this.id + ".postCreate");
        this._setupElements();
        this._addHtmlEventListener();
    },
		
	applyContext : function(context, callback) {

        if(window.storeFlag == true) {
            var object = context.getObject();

            if (object != null) {
                window.zipzapcode = object.get(this.value);
                window.storeFlag = false;
            } else {
                window.zipzapcode = '';
                $('#lockscreen').hide();
            }
        }
		
		callback && callback(); 
    },

    uninitialize : function()
    {
        logger.debug(this.id + ".uninitialize");
        document.removeEventListener('resume',this._resumeFunction,false);
        $(this._templateHtml).empty();
        $(this._templateHtml).remove();
    }
  

});

