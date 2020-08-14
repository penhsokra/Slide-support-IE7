/* html
<div class="" id="slide">
	<div><a href="#"><img src="../../img/eVoucher/im_eVoucher1.png" alt="" /></a></div>
	<div><a href="#"><img src="../../img/eVoucher/im_eVoucher2.png" alt="" /></a></div>
	<div><a href="#"><img src="../../img/eVoucher/im_eVoucher2.png" alt="" /></a></div>
</div>
*/

/*css
#slide{position:relative;margin:0;padding:0;width:736px;height:273px;border-radius:10px;overflow:hidden;}
#slide > div{position:absolute;display:block;width:100%;height:100%;padding:0;z-index:111;}
.slide .ctrl-slide{display:block;position:absolute;top:100px;display:block;width:25px;height:62px;z-index:222;background-repeat:no-repeat;background-position:0 0;background-color:red;}
#slide .ctrl-slide.prev{}
#slide .ctrl-slide.next{right:0}
#slide .slide-tabs{position:absolute;bottom:30px;display:block !important;right:0;left:0;margin:0;padding:0;text-align:center;overflow:hidden;z-index:222;}
#slide .slide-tabs li{height:15px;width:15px;display:inline-block;*display:inline;*zoom:1;margin:0 5px;}
#slide .slide-tabs li:first-child{margin:0;}
#slide .slide-tabs li > a{display:block;width:15px;height:15px;background-image:url(../../img/comm/bullet/bt_rolling.png);background-repeat:no-repeat;background-position:0 0;background-color:transparent;}
#slide .slide-tabs li > a.on{background-image:url(../../img/comm/bullet/bt_rolling_on.png);}

/*Call slide
$(document).ready(function(){
	$('#slide').slide({
		start:true,
		speed:2000,
		fade:true
	})
})*/

(function($) {
	$.fn.slide = function(options) {
		var thisClass = '#'+$(this).attr('id');
		this.defaults = {
			start: true,
			speed: 5000,
			fade: false
		}
		opts = $.extend({}, this.defaults, options);
		this.each(function() {
			var slideContainer = $(thisClass+' > div');
			var fade = opts.fade;
			var slide = $(thisClass+' > div');
			var count = slide.length;
			var index = 0;
			var time = null;
			var _this = this;
			var speed = opts.speed || 5000;
			$(this).data('opts', opts);
			$(slide[0]).show();
			var ctrlHtml = '<a href="javascript:;" class="ctrl-slide prev"></a>' + '<a href="javascript:;" class="ctrl-slide next"></a>';
			$(thisClass).append(ctrlHtml);
			var pageIndex = '<ul class="slide-tabs">';
			for (var i = 0; i < count; i++) {
				if(i == 0){
					pageIndex += '<li><a href="#none" class="on"></a></li>'
				}else{
					pageIndex += '<li><a href="#none"></a></li>'
				}
			}
			//trigger
			pageIndex += '</ul>';
			$(thisClass).append(pageIndex);
			function start() {
				if (opts.start) {
					time = setInterval(function() {
						var old = index;
						if (index >= count - 1) {
							index = 0;
						}
						else {
							index++;
						}
						change.call(_this, index, old);
					},speed);
				}
			};

			$(this).find('.next').on('click', function() {
				var old = index;
				if (index >= count - 1) {
					index = 0;
				}else {
					index++;
				}
				change.call(_this, index, old);
			});

			$(this).find('.prev').on('click', function() {
			    var old = index;
				if (index <= 0) {
					index = count - 1;
				}else{
					index--;
				}
				change.call(_this, index, old, 'left');
			});

			$(this).on('mouseover', function() {
				if (opts.start) {
					clearInterval(time);
				}
				$(this).find('.ctrl-slide').css({
					//opacity: 0.6
				});
			});

			$(this).on('mouseout', function() {
				if (opts.start) {
					start();
				}
				$(this).find('.ctrl-slide').css({
					//opacity: 0
				});
			});

			//trigger
			$(this).find('.slide-tabs li').each(function(aIndex) {
				$(this).on('click.slide-tabs', function() {
					if (aIndex < index) {
						change.call(_this, aIndex, index, 'left');
					}else if (aIndex == index) {

					}else {
						change.call(_this, aIndex, index);
					}
					index = aIndex;
				});
			});

			switch (opts.fade){
				case false:
					opts['width'] = $(this).width();
					slide.css('left', -opts['width']);
					$(slide[0]).css('left',0);
					slide.show();
					break;
				case true:
					slide.css('display', 'none');
					$(slide[0]).show();
			}
			start();
		});
	};

	function change(showIndex, hideIndex, left) {
		var opts = $(this).data('opts');
		var thisClass = '#'+$(this).attr('id');
		var slide = $(thisClass+' > div');
		if(!opts.fade){
			var x = showIndex % (slide.length);
			var y = hideIndex % (slide.length);
			var slideWidth;
			if(showIndex == 0){
				$(thisClass+' .prev').addClass("off");
			}else{
				$(thisClass+' .prev').removeClass("off");
			}
			if(showIndex == slide.length - 1){
				$(thisClass+' .next').addClass("off");
			}else{
				$(thisClass+' .next').removeClass("off");
			}
			slideWidth = $(this).outerWidth();
			if (left == 'left') {
				slide.eq(x).stop().css({"left": -slideWidth}).addClass("active").animate({
					left: 0
				});
				slide.eq(y).stop().css("left","0").animate({
					left: slideWidth
				}, function() {
					slide.eq(x).removeClass('active');
				});
			}else{
				slide.eq(x).stop().css("left", slideWidth).addClass("active").animate({
					left: 0
				});
				slide.eq(y).stop().css("left", 0).animate({
					left: -slideWidth
				}, function() {
					slide.eq(x).removeClass('active');
				});
			}
			$(this).find('.slide-tabs li > a').eq(hideIndex).removeClass("on");
			$(this).find('.slide-tabs li > a').eq(showIndex).addClass("on");
		}else{
			$(thisClass+' > div').eq(hideIndex).fadeOut(500);
			$(this).find('.slide-tabs li > a').eq(hideIndex).removeClass("on");
			$(this).find('.slide-tabs li > a').eq(showIndex).addClass("on");
			$(thisClass+' > div').eq(showIndex).fadeIn(500);
		}
	};
})(jQuery);