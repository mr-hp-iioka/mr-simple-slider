/**
 * (JQuery) MR Simple Slider.
 * 
 * @Auther MarineRoad Inc, Atsushi Iioka.
 * @version 0.5.8
 * 
 *
 *  << プラグインの組み込み >>
 * .mrSimpleSlider({ [type] : [mode] })		-		スライダーを実装します
 * .mrDeleteSimpleSlider()					-		スライダーを非実装にします
 *
 *  << 引数 >>
 *	[type]
 *		mover			-	フリック方向を指定
 *		rotation		-	ローテーションするかどうか
 *
 *	[mode] -> mover
 *		"left"	-	左フリックで前ページへ
 *		"right"	-	右フリックで前ページへ
 *
 *	[mode] -> rotation
 *		true	-	ローテーション有効にする
 *		false	-	ローテーション無効にする
 */
 
; //まれに他プラグインが正常に終了されておらず、チェーンを構築できない場合があるため対策する。

(function($) {
	var isTouch = ('ontouchstart' in window);

	$.fn.mrDeleteSimpleSlider = function(){
		return this.each(function(i, elem) {
			if(!$(elem).data("data.alival") === void 0) return;
			$.each($(elem).data("carlist"),function(i,obj){
				obj.show();
			});
			$('.guide',elem).hide();
		});
	}
	
	function _resize(elem){
		//$(elem).css("width","90%");
		//$(elem).css("overflow","hidden");
		
		$("ul",elem).css("position","relative");
		//$("ul",elem).css("width","9900px");
		//$("ul",elem).css("top","0px");
		//$("ul",elem).css("left","0px");
		
		//$("ul li",elem).width(parseInt($(elem).outerWidth(true)) - $("ul",elem).position().left);
		
		//$("ul li",elem).css("margin-right","10px");
	}

    $.fn.mrSimpleSlider = function(options) {
		return this.each(function(i, elem) {
			
			var defaults = {
					mover: 'right',
					rotation: true
			};
			
			var setting = $.extend(defaults,options);
			
			function _getCarlist(){ return $(elem).data("carlist"); }
			function _setCarlist(data){ return $(elem).data("carlist",data); }
			function _getMaincounter(){ return $(elem).data("maincounter"); }
			function _setMaincounter(data){ return $(elem).data("maincounter",data); }
			function _getPointers(){ return $(elem).data("pointers"); }
			function _setPointers(data){ return $(elem).data("pointers",data); }
			function _getClicklock(){ return $(elem).data("clicklock"); }
			function _setClicklock(data){ return $(elem).data("clicklock",data); }
			function _getAppender(){ return $(elem).data("appender"); }
			function _setAppender(data){ return $(elem).data("appender",data); }
			function _getT_flg(){ return $(elem).data("t_flg"); }
			function _setT_flg(data){ return $(elem).data("t_flg",data); }
			function _getDivs(){ return $(elem).data("divs"); }
			function _setDivs(data){ return $(elem).data("divs",data); }
			
			$(window).resize(function(){
				_resize(elem);
			});
		
			$(elem).ready(function(){
				
				if($(elem).data("data.alival") === void 0){
					_setCarlist(new Array());
					_setMaincounter(0);
					_setPointers(new Array());
					_setClicklock(false);
					_setAppender(new Array);
					_setT_flg(false);
				}else{
					$(elem).data("data.alival","on");
				}
				
				logthis = $(".slidertable tr td:nth-child(2)",elem);
				logthis.empty();
				$('li',elem).each(function(i){
					_getCarlist().push($(this));
					logthis.append("<div class='pointbutton' alt='"+i+"'></div>");
				});
				
				if(_getCarlist().length == 0){ //０件対応
					return;
				}
				
				
				$(".slidertable tr td:nth-child(2) div",elem).each(function(i){
					$(this).css("width",""+parseInt(100 / _getCarlist().length)+"%");							
					_getPointers().push($(this));
				});
				
				_resize(elem);
				
				$.each(_getCarlist(),function(i,obj){
					obj.hide();
				});
				
				$('li',elem).each(function(i){
					$(this).css("float","left");
				});
				
				_getCarlist()[0].show();
		
				_setMaincounter(0);
				$('.guide',elem).show();
				
				defult_pointer_01();
				_setOpa(_getPointers()[0],1);
				
				_setOpa($('.prevbutton',elem),0.5);
				_setOpa($('.nextbutton',elem),0.5);

				$('.prevbutton',elem).bind('tap click',prevview);
				$('.pointbutton',elem).bind('tap click',pointview);
				$('.nextbutton',elem).bind('tap click',nextview);
				
				$('.prevbutton',elem).hover(function(){
					_setOpa($(this),0.8);
				},
				function(){
					_setOpa($(this),0.5);
				});
				$('.pointbutton',elem).hover(function(){
					if(_getMaincounter() != $(this).attr("alt") && !_getClicklock()) _setOpa($(this),0.8);
				},
				function(){
					if(_getMaincounter() != $(this).attr("alt") && !_getClicklock()) _setOpa($(this),0.5);
				});
				$('.nextbutton',elem).hover(function(){
					_setOpa($(this),0.8);
				},
				function(){
					_setOpa($(this),0.5);
				});
				
				var l_left=0;
				var l_top=0;
				
				var log_left = 0;
				var log_top = 0;
				var log_width = 0;
				var log_height = 0;
				var log_pos = "";
				
				var t_left,t_right;
				
				defult_carlist(_getCarlist());
				defult_pointer_01();
				_setOpa(_getPointers()[0],1);
				_getCarlist()[0].show("slide", {direction: "left"}, 100);

				
				$("ul",elem).bind({			 
					"touchstart mousedown" : function(e){
						
						e.preventDefault();

						l_left = (isTouch ? event.changedTouches[0].pageX : e.pageX);
			    		l_top  = (isTouch ? event.changedTouches[0].pageY : e.pageY);
			
						log_left = $(this).position().left;
						log_top  = $(this).position().top;
						
						_setT_flg(true);
					},
					
					'touchmove mousemove': function(e) {
						if(!_getT_flg()) return;
						var n_left = (isTouch ? event.changedTouches[0].pageX : e.pageX);
						var n_top  = (isTouch ? event.changedTouches[0].pageY : e.pageY); 
		
					},
					
					"touchend mouseup" : function(e){
						if(!_getT_flg()) return;
						
						var n_left = (isTouch ? event.changedTouches[0].pageX : e.pageX);
						var n_top  = (isTouch ? event.changedTouches[0].pageY : e.pageY); 
						
						if((n_left - l_left) > 100){
							setting.mover == "right" ? nextview() : prevview();
						}else if((n_left - l_left) < -100){
							setting.mover == "right" ? prevview() : nextview();
						}else if((n_top - l_top) > 100){
						}else if((n_top - l_top) < -100){
						}else{
							var form = $("<form></form>");
							form.attr(
							{
								id     : "formformxtraformmrslidersliderdivision",
								// The location given in the link itself
								action : $("li",this).find("a").attr("href"), 
								method : "POST",
								// Open in new window/tab
								target : $("li",this).find("a").attr("target")
							});
					
							$("body").append(form);
							$("#formformxtraformmrslidersliderdivision").submit();
							$("#formformxtraformmrslidersliderdivision").remove();
						}
						
						_setT_flg(false);
					}
				});
			});
			

			
			function prevview() {
				if(_getClicklock()) return false;
				_setClicklock(true);
				if(_getMaincounter() > 0){
					_setMaincounter(_getMaincounter()-1);
					defult_carlist(_getCarlist());
					//_getCarlist()[_getMaincounter()+1]
					//	.hide("fast",function(){ _getCarlist()[_getMaincounter()].fadeIn("fast", function(){ _setClicklock(false); }); });
					_getCarlist()[_getMaincounter()+1]
						.hide("fast",function(){
							_getCarlist()[_getMaincounter()].show("slide", {direction: "left"}, 100, function(){
								_setClicklock(false);
							});
						});
					defult_pointer_01();
					_setOpa(_getPointers()[_getMaincounter()],1);
				}else if(setting.rotation){
					_setMaincounter(_getCarlist().length - 1);
					defult_carlist(_getCarlist());
					_getCarlist()[_getMaincounter()]
						.hide("fast",function(){
							_getCarlist()[_getMaincounter()].show("slide", {direction: "left"}, 100, function(){
								_setClicklock(false);
							});
						});
					defult_pointer_01();
					_setOpa(_getPointers()[_getMaincounter()],1);
				}else{
					_setClicklock(false);
				}
				_setOpa($(this),0.5);
				return false;	
			}
			
			function pointview(){
				if(_getMaincounter() == $(this).attr("alt")) return false;
				if(_getClicklock()) return false;
				_setClicklock(true);
				_setMaincounter(parseInt($(this).attr("alt")));
				defult_carlist(_getCarlist());
				_getCarlist()[_getMaincounter()].fadeIn("fast", function(){ _getClicklock(false); });
				defult_pointer_01();
				_setOpa($(this),1);
				_setClicklock(false);
				return false;
			}

			function nextview() {
				if(_getClicklock()) return false;
				_setClicklock(true);
				if(_getMaincounter() < (_getCarlist().length - 1)){
					_setMaincounter(_getMaincounter()+1);
					defult_carlist(_getCarlist());
					//_getCarlist()[_getMaincounter()-1]
					//	.hide("fast",function(){ _getCarlist()[_getMaincounter()].fadeIn("fast", function(){ _setClicklock(false); }); });
					_getCarlist()[_getMaincounter()-1]
						.hide("fast",function(){
							_getCarlist()[_getMaincounter()].show("slide", {direction: "right"}, 100, function(){
								_setClicklock(false);
							});
						});
					defult_pointer_01();
					_setOpa(_getPointers()[_getMaincounter()],1);
				}else if(setting.rotation){
					_setMaincounter(0);
					defult_carlist(_getCarlist());
					_getCarlist()[_getMaincounter()]
						.hide("fast",function(){
							_getCarlist()[_getMaincounter()].show("slide", {direction: "right"}, 100, function(){
								_setClicklock(false);
							});
						});
					defult_pointer_01();
					_setOpa(_getPointers()[_getMaincounter()],1);
				}else{
					_setClicklock(false);
				}
				_setOpa($(this),0.5);
				return false;	
			}
			
			function _setOpa(obj,opa) {
				obj.css("filter","_alpha(opacity="+(opa*100)+")");
				obj.css("-moz-opacity", ""+opa);
				obj.css("opacity", ""+opa);
			}
			
			function defult_carlist(carl) {
				$.each(carl,function(i,obj){
					obj.hide();
				});
			}
			
			function defult_pointer_01() {
				$.each(_getPointers(),function(i,obj){
					_setOpa(obj,0.5);
				});
			}
				
			});

	}
})(jQuery);
