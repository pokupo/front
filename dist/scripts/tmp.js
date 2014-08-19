
function rollPrice(el,startValue,valueToRollTo, opt_onComplete) {
	var frameIndex = 0;
	var framesCount = 10;
	var delta = (valueToRollTo - startValue) / framesCount;
	var rollInterval = setInterval(
		function() {
		frameIndex++;
		var value = (startValue + delta * frameIndex);
		var lastFrame = (frameIndex === framesCount);
		printPrice(el,lastFrame ? valueToRollTo : value);

		if (lastFrame) {
			clearTimeout(rollInterval);

			if (opt_onComplete && typeof opt_onComplete === 'function') {
			opt_onComplete();
			}
		}
		},
	45);
};

function printPrice(el,pr){
			 
	pr = pr + '';
	var sDot = '';
	if(pr.indexOf('.') != -1){
		pr = pr * 1;
		pr = pr.toFixed(2) + '';
							 
		sDot = pr.substr(pr.indexOf('.'));
	} else {
		sDot = '.00'
	}
				
	//pr = splitNumber(pr,'&nbsp;') + '<span class="kop">'+sDot+'</span>';
	pr = splitNumber(pr,'&nbsp;');

	pr = pr.replace(/\./gi,',');

		pr = pr.replace(/\,/gi,'');

	el.html(pr);
}

function getPriceFromRel(item){
	return (((item.attr('rel') || 0)+'')
		.replace(/\s/gi,'')
		.replace(/,/gi,'.'))*1
	;
};


var CountBox = function(box,onChange){
	var
		self = this,
		box = $(box),
		inp = box.find('input'),
		digits_box = box.find('.catalog_item_count_digits'),
		digits = box.find('.catalog_item_count_digits dd'),

		minus = box.find('.catalog_item_count_minus'),
		plus = box.find('.catalog_item_count_plus'),

		processing = false,
		min_val = 1,
		max_val = 99,
		duration = 500
	;
	this.getValue = function(){
		return parse();
	};
	this.setValue = function(num){
		val(num);
		applyInpVal();
	};

	if(box.length) init();

	function init(){
		inp
			.focus(function(){
				inp.css('opacity','1');
				digits_box.hide();
			})
			.keyup(function(){
				applyInpVal();
			})
			.blur(function(){
				applyInpVal();

				inp.css('opacity','0');
				digits_box.show();
			})
		;

		applyInpVal(true);


		minus.click(function(e){
			scroll(e,-1);
		});
		plus.click(function(e){
			scroll(e,1);
		});

		box.data('CountBox',self);
	}

	function scroll(e,iVal){
		e.preventDefault();
		e.stopPropagation();

		inp[0].blur();

		if(processing) return;

		iVal = iVal > 0 ? 1 : -1;
		var newVal = parse() + iVal;

		if(!checkVal(newVal)) return;

		processing = true;

		placeDigits();

		digits_box
			.stop()
			.animate({
				top: iVal * digits.height() + 'px'
//				marginTop:0
			},{
				duration : duration,
				//easing : '',
				complete : function(){
					val(newVal);
					applyInpVal();
					processing = false;
				}
			})
		;
	}


	function applyInpVal(first){
		var iVal = setInpVal();	
		setDigitVals(iVal);
		placeDigits();
		// пеерсчет корзины 
		if(!first){
			recalculateShopCartMapping(box);
		}
		//
		if(!first && onChange) onChange();
	}

	function setInpVal(){
		var res = parse();
		val(res);
		return res;
	}

	function setDigitVals(iVal){
		var max = iVal + 2;

		for(var i=0;i<5;i++){
			var num = max - i;

			digits.eq(i).html(checkVal(num) ? num : '');
		}
	}

	function placeDigits(){
		digits_box.css({
			top : 0,
			'marginTop' : -digits.height()*2+'px'
		});
	}

	function checkVal(iVal){
		return iVal >= min_val && iVal <= max_val;
	}

	function parse(){
		var res = val()
			.replace(',','.')
			.replace(/[^\d\.]/gi,'')
		;
		return parseInt(res) || 0;
	}

	function val(){
		if(arguments.length){
			inp.val(arguments[0]);
		}
		return inp.val()+'';
	}

	
};



function reloadEffect(items,bShow,callback){
	//var items = $('.catalog_item').filter(':visible');
	items = $(items)
	//		.filter(bShow?':hidden':':visible')
	;
//	items.parent().height(items.parent().height());

	items.each(function(i){
//	for(var i = items.length - 1;i>=0;i--){
//	for(var i = 0;i<items.length;i++){
//		console.log(i);
		var
//			self = $(this),
			self = bShow ? items.eq(i):items.eq(items.length - i - 1),

			time = 50 * (i + 1)
		;

		setTimeout(function(){

			if(bShow){
				self.css('visibility','visible').hide();
			}
			self[bShow?'fadeIn':'fadeOut']('slow',function(){

				if(!bShow){
					self.css('visibility','hidden').show();
				}
				if(i == items.length - 1 && callback){
					callback();
				}
			});
		},time);
	}
		);
};


function showReload(){
	var catalog_items_box = $('.catalog_items');
			var catalog_items = $('.catalog_item:visible');

			reloadEffect(catalog_items,false,function(){
				catalog_items_box.addClass('catalog_items_pill');

				setTimeout(function(){

					catalog_items_box.removeClass('catalog_items_pill');
					reloadEffect(catalog_items,true,function(){
						processing = false;

						
					});

				},1000);
			});
}

$(function(){
	initCatalogItems();
	initCatalogListItems();
});

function initCatalogListItems(){
	var items = $('.catalog_list_item');

	items.each(function(){
		var self = $(this);
		if(self.data('CatalogItem')) return;

		var
			count_box_w = self.find('.catalog_list_item_count_w'),

			w_c = self.find('.catalog_list_item_price_w_c'),
			to_cart = self.find('.catalog_list_item_price_w_r .pseudo'),
			in_cart = self.find('.catalog_list_item_in_cart'),
			fav = self.find('.catalog_item_fav')
		;

		if(count_box_w.length){
			var count_box_width = count_box_w[0].offsetWidth
			to_cart.one('click',function(){
				in_cart
					.css({
						'visibility': 'visible'
//						,'paddingLeft':w_c.position().left-20
					})
					.hide()
					.fadeIn()
				;
				w_c.animate({'width':count_box_w[0].offsetWidth},300,function(){
					var data_replace_action = '';
					var attr_data_action = to_cart.attr('data-replace-action');
					if (typeof attr_data_action !== 'undefined' && attr_data_action !== false) {
						data_replace_action = attr_data_action;
					}
					if (window.is_stp_now){
						to_cart.parent().html('<a href="/shopcart.html" onclick="internal_ga_selector([\'_trackEvent\', \'Товары списком СС нд\', \'Оформить заказ\']);' + data_replace_action + '">Оформить</a>');
					}else{
						to_cart.parent().html('<a href="/shopcart.html" onclick="internal_ga_selector([\'_trackEvent\', \'Товары списком нд\', \'Оформить заказ\']);' + data_replace_action + '">Оформить</a>');
					}
				});
				// пеерсчет корзины 
				recalculateShopCartMapping($(this));
				//
				
			});


			var oCount = new CountBox(count_box_w,function(){

			});
		}

		fav.click(function(){
			var
				t = $(this),
				b = t.hasClass('catalog_item_fav_active'),
				p_id = t.attr('rel')
			;
			
			t
				.css('background','')
				.toggleClass('catalog_item_fav_active')
			;
			if(b){
				t.css('background','url("/f/1/global/star_once.gif") no-repeat 50% 1px');
				setTimeout(function(){
					t.css('background','')
				},1000);
				$.ajax({
						dataType:	"html",
						type: 		"POST",
						url:		"/ajax_deffered.html?id="+p_id+"&active=0"
					});
			}else{
				$.ajax({
						dataType:	"html",
						type: 		"POST",
						url:		"/ajax_deffered.html?id="+p_id+"&active=1"
					});
			}
			t.attr('title',b?'Добавить в отложенное':'Удалить из отложенного')

			$('.fav_count').html($('.fav_count').html()*1 + (b?-1:1));
			
		});

		self.data('CatalogItem',true);
	});
}


function initCatalogItems(){
	var noCss3 = $('html').hasClass('no-csstransforms3d');

	var items = $('.catalog_item');
	

	items.each(function(){
		if($(this).data('CatalogItem')) return;
		
		var
			self = $(this),
			wrap = self.find('.catalog_item_w'),
			price_box = self.find('.catalog_item_price'),
			count_box = self.find('.catalog_item_count_box'),
//			count_box = self.find('.catalog_item_count span'),
//			minus = self.find('.catalog_item_count_minus'),
//			plus = self.find('.catalog_item_count_plus'),
			total_price_box = self.find('.catalog_item_total_price'),
			fav = self.find('.catalog_item_fav'),
			shadow = self.find('.catalog_item_shadow'),
			flip = self.find('.catalog_item_flip'),
			d = 200
		;

		self.data('CatalogItem',true);
		
		// cross-sale discount popup-window
		
		if(self.find('.cross_sale_discount').hasClass('cross_sale_discount')){
			var cross_title = self.find('.cross_sale_discount').attr("title");
			var cross_sale_html = $("<div class=\"popup cross_sale_popup popup_notify\" style=\"width:auto;left:16px;margin-top:11px;\"><div class=\"popup_tail\"></div><div class=\"popup_content\"><div class=\"popup_cross_sale_content\">" + cross_title + "</div></div></div>");
			self.append(cross_sale_html);
			self.hover(
				function(){
					$(this).find('.cross_sale_popup').show();
				},
				function(){
					$(this).find('.cross_sale_popup').hide();
				}
			)
		}
		
		
		self.find('.catalog_item_cart_price_no_items').click(function(){
			var _this = $(this);
			_this.toggleClass('pressed');
//			if(_this.hasClass('pressed')) return;

//			_this.addClass('pressed');
//			_this.find('.pseudo').html('Заявка принята');

//			$('.fav_count').html($('.fav_count').html()*1 + 1);

//			fav.addClass('catalog_item_fav_active');
		});


//		wrap.each(initFlip);

		flip.click(function(){
			// пеерсчет корзины 
				recalculateShopCartMapping($(this));
			//
			if(noCss3){
				wrap.toggleClass('catalog_item_w_flipped');
				return;
			}

			shadowHide();
			wrap
				.delay(d)
				.queue(function(){
					wrap.toggleClass('catalog_item_w_flipped');
					wrap.dequeue();
				})
				.delay(1000)
				.queue(function(){
					if(self.data('IsHover')){
						shadowShow();
					}
					wrap.dequeue();
				})
				;
				
		});

		self.hover(function(){
			self.data('IsHover',true);
			shadowShow();
		},function(){
			self.removeData('IsHover');
			shadowHide();
		});


		function shadowShow(f){
			shadow
				.stop()
				.fadeIn(d,'easeInQuad',function(){
					shadow.css('opacity','1');
					if(f) f();
				})
			;
		}
		function shadowHide(f){
			shadow
				.stop()
				.fadeOut(d,'easeInQuad',function(){
					shadow.css('opacity','1');
					if(f) f();
				})
			;
		}


//
//		minus.mousedown(function(e){
//			e.preventDefault();
//			e.stopPropagation();
//
//			setCount(-1);
//			setTotalPrice();
//		});
//		plus.mousedown(function(e){
//			e.preventDefault();
//			e.stopPropagation();
//
//			setCount(1);
//			setTotalPrice();
//		});



		var oCount = new CountBox(count_box,function(){

			var total = getCount() * getPrice();

			rollValue(TOTAL_PRICE,total,function(){
				TOTAL_PRICE = total;
			});
		});

		var TOTAL_PRICE = getCount() * getPrice();
		setTotalPrice(TOTAL_PRICE);


		function setCount(inc){
			var c = Math.max(1,getCount() + inc);

			count_box.html(c);
		}

		function getCount(){
			return oCount.getValue();
		}

		function setTotalPrice(pr){
			/*pr = pr + '';
//			var pr = getCount() * getPrice() + '';
//console.log(getCount())
			var sDot = '';
			if(pr.indexOf('.') != -1){
				pr = pr * 1;
				pr = pr.toFixed(2) + '';
				sDot = pr.substr(pr.indexOf('.'));
			} else {
				sDot = '.00'
			}
			pr = splitNumber(pr,'&nbsp;') + sDot;
			pr = pr.replace(/\./gi,',');
			total_price_box.html(pr);
						/**/

						printPrice(total_price_box,pr);
		}
		function getPrice(){
			return (((price_box.attr('rel') || 0)+'')
				.replace(/\s/gi,'')
				.replace(/,/gi,'.'))*1
			;
		}


		function rollValue(startValue,valueToRollTo, opt_onComplete) {
			var frameIndex = 0;
			var framesCount = 10;
			var delta = (valueToRollTo - startValue) / framesCount;
			var rollInterval = setInterval(
				function() {
				frameIndex++;
				var value = (startValue + delta * frameIndex);
				var lastFrame = (frameIndex === framesCount);
				setTotalPrice(lastFrame ? valueToRollTo : value);

				if (lastFrame) {
					clearTimeout(rollInterval);

					if (opt_onComplete && typeof opt_onComplete === 'function') {
					opt_onComplete();
					}
				}
				},
				45);
		};

		
		fav.click(function(){
			var
				t = $(this),
				b = t.hasClass('catalog_item_fav_active'),
				p_id = t.attr('rel');
			;
			t
				.css('background','')
				.toggleClass('catalog_item_fav_active')
			;
			if(b){
				t.css('background','url("/f/1/global/star_once.gif") no-repeat 50% 1px');
				setTimeout(function(){
					t.css('background','')
				},1000)
				$.ajax({
						dataType:	"html",
						type: 		"POST",
						url:		"/ajax_deffered.html?id="+p_id+"&active=0"
					});
			}else{
				$.ajax({
						dataType:	"html",
						type: 		"POST",
						url:		"/ajax_deffered.html?id="+p_id+"&active=1"
					});
			}
			t.attr('title',b?'Добавить в отложенное':'Удалить из отложенного')

			$('.fav_count').html($('.fav_count').html()*1 + (b?-1:1));
		});

//        console.dir(self.find('.catalog_item_cart_price_remind'))

		self.find('.catalog_item_cart_price_remind').each(function(){
			var
				_this = $(this),
				ch = _this.find('input'),
								popup = $('.popup_notify')
			;
//			ch
//				.click(_check)
//				.change(_check)
//				.each(_check)
//			;
//
//			function _check(){
//				_this.toggleClass('catalog_item_cart_price_remind_active',this.checked);
//			}

//            console.log(2)
						_this.mousedown(function () {
								var b = _this.hasClass('catalog_item_cart_price_remind_active');
//                console.log(b);

								if(b){
										_this.removeClass('catalog_item_cart_price_remind_active');
										Popup.hide(popup);
								} else {
									 Popup.show(popup);
									 var o = _this.offset();

									 popup
											 .css({
													 'margin':'0',
													 'left':o.left,
													 'top':o.top
											 })
											 .css('margin','40px 0 0 -80px')
									 ;
//                    popup.find('.name').html(self.find('.catalog_item_name a').attr('title'));

										popup.find('.submit').unbind('click').click(function () {
												if(popup.find('.popup_notify_input_mail').val()){
														Popup.hide(popup);
														_this.addClass('catalog_item_cart_price_remind_active');
												}
										});
								}
						});
		});

//		popupOpener({
//			popup	: self.find('.catalog_item_message_popup'),
//			button	: self.find('.catalog_item_cart_price_no_items .pseudo')
//
//			,show	: function(popup,button){
//				self.css('zIndex','11');
//				popup.slideDown('fast');
//
//			}
//			,hide	: function(popup,button){
//				self.css('zIndex','');
//				popup.slideUp('fast');
//			}
//		});



		if(self.is('.catalog_item_special')){
			var
				fb = self.find('.catalog_item_front, .catalog_item_back'),
				pr = self.find('.catalog_item_cart_price'),
d = 100
			;

			self.hover(function(){
//				self.animate({
//					width: '180px',
//					height: '276px',
//					marginRight: '-20px',
//					marginBottom: '-26px',
//					left:'-15px',
//					top:'-23px'
//				},{
//					duration : d
// 				});

var easing = 'linear';
				wrap
				.stop()
				.animate({
					width: '170px',
					height: '266px',
					left:'-15px',
					top:'-23px'
				},{
					duration : d,
					easing : easing
				});

				shadow
				.stop()
				.animate({
					width: '180px',
					height: '276px',
					left:'-15px',
					top:'-23px',
					opacity:'1'
				},{
					duration : d,
					easing : easing
				});


				fb
				.stop()
				.animate({
					width: '160px',
					height: '256px'
				},{
					duration : d,
					easing : easing
				});

//				pr.animate({
//					bottom: '24px'
//				},{
//					duration : d
// 				});


			},function(){

//				self.animate({
//					width: '150px',
//					height: '230px',
//					marginRight: '10px',
//					marginBottom: '20px',
//					left:'0',
//					top:'0'
//				},{
//					duration : d
// 				});


				wrap
				.stop()
				.animate({
					width: '140px',
					height: '220px',
					left:'0',
					top:'0'
				},{
					duration : d
				});
				shadow
				.stop()
				.animate({
					width: '150px',
					height: '230px',
					left:'0',
					top:'0',
					opacity:'0'
				},{
					duration : d
				})
				
				;

				fb
				.stop()
				.animate({
					width: '130px',
					height: '210px'
				},{
					duration : d
				});

//				pr.animate({
//					bottom: '3px'
//				},{
//					duration : d
// 				});
			});
		}

	});


/*
	function initFlip(){
		var self = $(this);
		self.find('.catalog_item_flip')
			.click(function(){
				var parent = self.parent();

				var f = true;




				parent
					.hover(function(){f = true;},function(){f = false;})
					.addClass('no_shadow')
					.find('.catalog_item_shadow').css('visibility','hidden')
				//	.css('boxShadow','none')
				;

				self.toggleClass('catalog_item_w_flipped');

				setTimeout(function(){
					parent
						.removeClass('no_shadow')
						.find('.catalog_item_shadow').css('visibility','')
						//.css('boxShadow','5px 5px 10px #000')
					;

				},1000);
			});

	};/**/
};



$(function(){
	var
		menu_items = $('.category_specials_menu_item'),
		frames_layout = $('.category_specials_frames_layout'),
		frames = $('.category_specials_frame')
	;

	menu_items.each(function(i){
		var
			self = $(this),
			frame = frames.eq(i)
		;
		if(frame.length){
						self.click(function(){
				if(self.hasClass('category_specials_menu_active')) return;

				menu_items.removeClass('category_specials_menu_active');
				self.addClass('category_specials_menu_active');


				if(frames_layout.hasClass('category_specials_frames_layout_flipped')){
					frames.filter('.category_specials_frame_front').removeClass('category_specials_frame_front');
					frame.addClass('category_specials_frame_front');
				} else {
					frames.filter('.category_specials_frame_back').removeClass('category_specials_frame_back');
					frame.addClass('category_specials_frame_back');
				}

				frames_layout.toggleClass('category_specials_frames_layout_flipped');
			});
		}
	});


	if($.browser.safari){

		$(window).resize(function(){
			var els = $('.category_specials_frames').hide();
			setTimeout(function(){
				els.show();
			},10);
		});
	}
	
//	$('.category_specials_menu_item').click(function(){
//		$('.category_specials_frames_layout').toggleClass('category_specials_frames_layout_flipped');
//	});
});

$(function() {
	$('.category_specials_menu').each(function(){
		var self = $(this);

		var menu_scroll = new Scrollbox(
			self.find('.category_specials_menu_layer'),
			self.find('.category_specials_menu_w'),
			self.find('.category_specials_menu_scroll_box'),
			self.find('.category_specials_menu_scroller'),
			'vertical',
			true
		);
	})
});


$(function() {
	$('.today_list').each(function(){
		var self = $(this);
		var items = self.find('.today_list_item');
		if (items.length == 1){
			self.find('.today_list_w').height(116);
		}else if (items.length == 2){
			self.find('.today_list_w').height(216);
		}
		
		var menu_scroll = new Scrollbox(
			self.find('.today_list_w'),
			self.find('.today_list_frame'),
			self.find('.today_list_scroll_box'),
			self.find('.today_list_scroller'),
			'vertical',
			true
		);
	})
});


$(function() {
	$('.today_list').each(function(){
		var self = $(this);
		self.find('.catalog_item_cart_price_w_r .pseudo').click(function(){
			var p_id = $(this).attr('rel');
			$(this).closest('.today_list_item_text').find('.today_list_item_price').append('<span class="today_list_item_in_cart">Добавлено <a href="/shopcart.html" onclick="internal_ga_selector([\'_trackEvent\', \'Сегодня Вы смотрели нд\', \'Переход в корзину\']);">в корзину</a></span>');
			$(this).replaceWith('<i></i>');
			recalculateShopCart(p_id, 1);
		});
	})
});


$(function() {
	$('.extra_scroll').each(function(){
		var self = $(this);

		var menu_scroll = new Scrollbox(
			self.find('.extra_scroll_inner'),
			self.find('.item_wrapper'),
			self.find('.cart_page_extra_scroll_box'),
			self.find('.cart_page_extra_scroller'),
			'vertical',
			true,
			function(){
				if($.browser.safari){
//					setTimeout(function(){
						self.find('.item_wrapper')
							.css('visibility','hidden')
						;
//								.hide().show();
						setTimeout(function(){
//							self.find('.item_wrapper').show();
							self.find('.item_wrapper')
								.css('visibility','visible')
							;
						},1);
//					},1);
				}
			},
			{
				step : 60
			}
		);

		var corner = self.find('.cart_float_corner');
		self.find('.extra_scroll_item').hover(function(){
			$(this).addClass('extra_scroll_item_hover');
			corner.show().css('top',
				$(this).offset().top - self.offset().top
			)
		},function(){
			$(this).removeClass('extra_scroll_item_hover');
			corner.hide();
		});
	});

});













$(function(){



//	var
//		scroll_f = $('.category_specials_frames_scroll'),
//		fr = $('.category_specials_type_group')
//	;
//
//	scroll_f
//		.scroll(_scroll)
//		.each(_scroll)
//	;
//
//	function _scroll(){
//		fr.css('backgroundPosition', scroll_f.scrollLeft()/10 + 'px 0');
//	}

	$('.category_specials_frames_w').each(function(){
		var
			self = $(this),
			gr = self.parents('.category_specials_type_group'),
			fr = self.find('.category_specials_frames_scroll_frame')
		;

		var specials_scroll = new Scrollbox(
			self.find('.category_specials_frames_scroll'),
			self.find('.category_specials_frames_scroll_frame'),
			self.find('.category_specials_frames_scroll_box'),
			self.find('.category_specials_frames_scroller'),
			'horizontal',
			false,
			function(){
				gr.css('backgroundPosition', Math.round((- fr.position().left)/10) + 'px 0');
			}
		);

	});

//	var specials_scroll = new Scrollbox(
//		'.category_specials_frames_scroll',
//		'.category_specials_frames_scroll_frame',
//		'.category_specials_frames_scroll_box',
//		'.category_specials_frames_scroller',
//		'horizontal',
//		false,
//		function(){
//			fr.css('backgroundPosition', (- $('.category_specials_frames_scroll_frame').position().left)/10 + 'px 0');
//		}
//	);

/*
	$('.category_specials_item_img').each(function(){
		var
			self = $(this),
			chb = self.find('.category_specials_item_checkbox'),
			cl = 'category_specials_item_checkbox_checked',
			d = 500
		;

		self.click(function(){
			var b = chb.toggleClass(cl).hasClass(cl);
//			self.toggleClass('category_specials_item_img_checked');

			self
				.stop()
				.animate({
					opacity: b ? '1': '0.6'
				},{
					duration : d
				})
			;
		});
	});/**/


	$('.category_specials_type_group').each(function(){
		var
			self = $(this),
			td = self.find('.category_specials_item_name_td'),
			counts = self.find('.category_specials_frames_counts'),
			count_box = self.find('.category_specials_frames_product_count'),
			disc = self.find('.category_specials_frames_total_disc'),
			total = self.find('.category_specials_frames_total_price'),
			button = self.find('.category_specials_frames_to_cart'),

			cl = 'category_specials_item_checkbox_checked',
			d = 500,

			TOTAL = 0,
			TOTAL_DISC = 0
		;


		td.find('.category_specials_item_img').each(function(){
			var
				img = $(this),
				chb = img.find('.category_specials_item_checkbox')
			;

			img.click(function(){
				var b = chb.toggleClass(cl).hasClass(cl);

				calc();

				img
					.stop()
					.animate({
						opacity: b ? '1': '0.6'
					},{
						duration : d,
						complete : function(){

						}
					})
				;
			});
		});


		calc(true);

		function calc(first){
			var
				total_price = 0,
				total_disc = 0,
				count = 0
			;
			td.each(function(){
				var
					_this = $(this),
					price_box = _this.find('.category_specials_item_price'),
					old_price_box = _this.find('.category_specials_item_old_price'),
					price = getPrice(price_box),
					old_price = getPrice(old_price_box) || price,
					b = _this.find('.category_specials_item_checkbox').hasClass(cl)
				;

				if(b){
					count++;
					total_price += price;
					total_disc += old_price;
				}

				function getPrice(el){
					return (((el.attr('rel') || 0)+'')
						.replace(/\s/gi,'')
						.replace(/,/gi,'.'))*1
					;
				}
			});

			if(first === true){
				setTotalPrice(total.find('.price'),total_price);
				setTotalPrice(disc.find('.price'),total_disc);
			} else {
				rollValue(total.find('.price'),TOTAL,total_price);
				rollValue(disc.find('.price'),TOTAL_DISC,total_disc);
			}

			counts.toggleClass('category_specials_frames_counts_zero',count == 0);

			TOTAL = total_price;
			TOTAL_DISC = total_disc;

			count_box.html(count + '&nbsp;товар' + numberWord(count , '', 'а', 'ов'));
		}


		function setTotalPrice(el,pr){
			/*pr = pr + '';

			var sDot = '';
			if(pr.indexOf('.') != -1){
				pr = pr * 1;
				pr = pr.toFixed(2) + '';
				sDot = pr.substr(pr.indexOf('.'));
			} else {
				sDot = '.00'
			}
			pr = splitNumber(pr,'&nbsp;') + sDot;
			pr = pr.replace(/\./gi,',');
/**/
						printPrice(el,pr);

//			el.html(pr);
		}

		function rollValue(el,startValue,valueToRollTo, opt_onComplete) {
			var frameIndex = 0;
			var framesCount = 8;
			var delta = (valueToRollTo - startValue) / framesCount;
			var rollInterval = setInterval(
				function() {
				frameIndex++;
				var value = (startValue + delta * frameIndex);
				var lastFrame = (frameIndex === framesCount);
				setTotalPrice(el,lastFrame ? valueToRollTo : value);

				if (lastFrame) {
					clearTimeout(rollInterval);

					if (opt_onComplete && typeof opt_onComplete === 'function') {
					opt_onComplete();
					}
				}
				},
				45);
		};
	});

});



// Блок Медицинские учереждения
$(function(){
	$(window)
		.resize(_w)
		.each(_w)
	;

	function _w(){
		var items = $('.medical_institutions_text');
		var b = items.parent().width() > items.eq(0).find('.medical_institutions_img_link').width() * 2 + 20

		items.each(function(){
			var
				t = $(this),
				p = t.parent()
//					,
//				img = items.find('.medical_institutions_img_link')
			;

			p.toggleClass('medical_institutions_wide',
				b
			);
		});
	}
});





// Блок дополнительных товаров
$(function(){

	$('.more_goods_block').each(initMoreGoodsBlock);
	$('.about_catalog').each(initMoreGoodsBlock);

});


function initMoreGoodsBlock(){
	var
		self = $(this),
		box = self.find('.catalog_items'),
		button = self.find('.more_goods_block_button'),
		processing = false
	;

	$(window)
		.resize(setNormalRows)
		.each(setNormalRows)
	;

	button.click(function(){
		if(processing) return;
		processing = true;

		makeLoader(button);

		$('<div></div>').load('/ajax_catalog/', function() {
			var oldHeight = box.height();




			$(this).find('.catalog_item').appendTo(box)
//					.remove()
			;
			initCatalogItems();
			setNormalRows();

			var newHeight = box.height();

			box
				.css({
						'height': oldHeight + 'px',
						'overflow':''
				})
				.animate({
					height: newHeight + 'px'
				},500, function(){
					processing = false;
					box.css({
						'height':'',
						'overflow':''
					});
					
					removeLoader(button);
				});
			;

		})
	});


	function setNormalRows(){
		var
			itemsCount = items().length,
			topCount = topItems().length,
			showCount = Math.floor(itemsCount / topCount)*topCount
		;

		items().each(function(i){
			$(this).toggle(i < showCount)
		});
	}


	function items(){
		return self.find('.catalog_item');
	}

	function topItems(){
		return items().show().filter(function(){
			return $(this).position().top <= 0;
		});
	}
}


$(function () {
		var t = null;

		$('.category_menu_item').each(function () {
				var self = $(this);
				self.hover(function () {
						start(function () {
								self.css('height',self.height()).addClass('category_menu_item_hover');
						});
				}, function () {
						stop();
						self.css('height','').removeClass('category_menu_item_hover');
				})
		});

		function stop(){
				if(t){
						clearTimeout(t);
				}
				t = null;
		};

		function start(f){
				stop();
				t = setTimeout(function () {
						f();
				},400);
		};

	 $(window)
			 .resize(_w)
			 .each(_w)
	 ;
		function _w() {
				$('.catalog_filter_name').toggle($('body').width() > 1155);
		}

});


$(function(){

		$('.category_menu').each(function(){
				var
						$This = $(this),
						iMinCols = ($This.attr('rel') || 3) * 1
				;

				$(window)
						.resize(_w)
						.each(_w)
				;
				function _w(){
						var
								$Tr = td().eq(0).parent(),
								$Items = items(),
								iCols = Math.min(items().length,Math.max(iMinCols,Math.floor($This.width()/315))),
								iColCount = Math.ceil($Items.length / iCols),
								mCounts = distribute($Items.length,iCols),
								iPos = 0
								;

						$Items.detach();
						td().remove();

						$.each(mCounts,function(i,val){
								var $Td = $('<div class="category_menu_col"></div>');
								$Tr.append($Td);

								$Items
										.slice( iPos , iPos + val )
										.appendTo($Td)
								;
								iPos += val;
						});

						td().width(Math.floor(100/iCols) + '%')
						//console.dir(distribute($Items.length,iCols))
				}

				function td(){
						return $This.find('.category_menu_col');
				};
				function items(){
						return $This.find('.category_menu_item').parent();
				};
				function distribute(iCount,iCols){
						var res = [];
						for(var i=0;i<iCols;i++){
								var iVar = Math.ceil(iCount / (iCols - i));
								res.push(iVar);
								iCount -= iVar;
						};
						return res;
				};
		});
});


$(function(){
	 window.re_comm = function(){
		var
			self = $('.comments_block'),
			form = $('.comments_block_form'),
			wrap = $('.comments_block_form_w'),
			form_box = $('.comments_block_form_box'),
	
			opener = $('.comments_block_form_opener'),
	
			box = $('.comments_block_list_w'),
			button = $('.comments_block_more'),
			processing = false
		;
	
		formChecker(self.find('form'));
	
		opener.click(function(){
	
			form_box.show();
			wrap.animate({
				height: form_box.height() + 'px'
			},500, function(){
				form_box.css('position','relative');
							wrap.css('overflow','visible');
			});
			opener.hide();
		});



				 button.click(function(){

						 if(processing) return;
						 processing = true;


						 makeLoader(button);

						 var posFrom = box.children('.comments_block_item').length;
						 // special for without rebooting. Alex
						 posFrom = posFrom - 5;

						 var urlComm = $('form#pm_reviews_form').attr('action');
						 // all reviews current product
						 var product_all_object = $('input#reviews_products_all').val();

						 if (urlComm != ''){
								 $('<div></div>').load(urlComm,{t_comm: 1, p_from: posFrom, rev_prod_all_obj: product_all_object}, function() {

										 var oldHeight = box.height();
										 $(this).find('.comments_block_item').appendTo(box);

										 var total_comm = self.find('.comments_block_item_name').attr('rel');
										 //var shown_comm = self.find('.comments_block_item').length - 1;
										 var shown_comm = self.find('.comments_block_item').length;

										 var newHeight = box.height();

										 box
												 .css({
														 'height': oldHeight + 'px',
														 'overflow':''
												 })
												 .animate({
														 height: newHeight + 'px'
												 },500, function(){
														 processing = false;
														 box.css({
																 'height':'',
																 'overflow':''
														 });

														 removeLoader(button);
														 if ((total_comm - shown_comm) > 0) {
																 $('span.comments_block_more').html("Еще отзывы (" + ( ((total_comm - shown_comm)>=5) ? 5 : (total_comm - shown_comm)) + ") <i>&#9660;</i>");
														 }else{
																 //$('.comments_block_more_w').hide();
																 $('span.comments_block_more').hide();
														 }
												 });
										 ;

								 })
						 }


				 });
	}
	window.re_comm();
});











function popupOpener(o){
	var
		p = o.popup,
		l = o.button
	;

	l.click(function(){

		var b = p.is(':visible');
		if(b){
			_hide();
		}
		else {
			_show();
		}
	});


	function _show(){
		if(o.show){
			o.show(p,l);
		}
		else {
			p.show();
		}

		$(document).click(_check);
	}
	function _check(e){
		var target = $(e.target);

		if(
			!target.is(p) &&
			!target.parents().is(p) &&
			!target.is(l) &&
			!target.parents().is(l)
		){
			_hide();
		}
	}
	function _hide(){
		if(o.hide){
			o.hide(p,l);
		}
		else {
			p.hide();
		}
		$(document).unbind('click',_check);
	}
};
