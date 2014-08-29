var PKP = {};

var treeData = [
			{title: "Компьютерная техника", folder: true,
				children: [
					{title: "Ноутбуки", selected: true},
					{title: "Моноблоки"},
					{title: "Планшеты"}
				]
			},
			{title:"Бытовая техника", folder: true, selected: true,
				children: [
					{title:"Стиральные машины", selected: true},
					{title:"Телевизоры", selected: true},
					{title:"Кухонная техника", selected: true},
					{title:"Пылесосы", selected: true}
				]
			},
			{title: "Телефоны и связь"},
			{title: "Фото и оптика", folder: true,
				children: [
					{title: "Фотоаппараты"},
					{title: "Объективы"},
					{title: "Средства и химия"}
				]
			},
			{title: "Одежда, обувь, аксессуары", folder: true, expanded: true,
				children:[
					{title:"Кроссовки"},
					{title:"Кеды", folder: true, expanded: true,
						children: [
							{title: "Ботильоны", selected: true},
							{title: "Босоножки", selected: true},
							{title: "Туфли", selected: true}
						]
					},
					{title:"Сандалии"},
					{title:"Балетки"},
					{title:"Сапоги"},
					{title:"Резиновая обувь"}
				]
			},
			{title: "Подарки и праздники", folder: true,
				children: [
					{title: "Цветы"},
					{title: "Открытки"},
					{title: "Игрушки"}
				]
			},
			{title: "Книги, учебники и журналы", folder: true,
				children: [
					{title: "Цветы"},
					{title: "Открытки"},
					{title: "Игрушки"}
				]
			},
			{title: "Мебель, интерьеры и обиход", folder: true,
				children: [
					{title: "Цветы", selected: true},
					{title: "Открытки", selected: true}
				]
			},
			{title: "Другое", folder: true, lazy: true }
];

PKP.init = function() {
	PKP.$window        = $(window);
	PKP.$document      = $(document);
	PKP.$body          = $('body');

	PKP.Sliders.init();
	PKP.UI.init();
	PKP.UI.cart();
	PKP.UI.tree();
	PKP.Video.init();
	PKP.Canvas.init();
};

PKP.Canvas = {
	init: function() {
		function drawArc(progress) {
			var canvas = document.getElementById('progressCircle'); 
			if (canvas.getContext) {
				var ctx = canvas.getContext('2d');
				var cX = 80,
					cY = 80,
					radius = 80,
					sAngle = 1.5 * Math.PI,
					eAngle = (1.5 * Math.PI + (2*progress*Math.PI / 100)),
					clockwise = false;

				ctx.arc(cX, cY, radius, sAngle, eAngle, clockwise);
				ctx.lineWidth = 13;
				ctx.strokeStyle = "#ffa800"; 
				ctx.stroke();
			} else { 
				console.error('браузер не поддерживает Canvas API');
			}			
		}

		if($('#progressCircle').length > 0) {
			drawArc(25);
		}
	}
}

PKP.Sliders = {
	init: function() {
		$('#cases').fotorama({
				width: '100%',
				height: 620,
				allowfullscreen: false,
				loop: true,
				autoplay: 3500,
				stopautoplayontouch: true,
				nav: 'dots',
				arrows: false,
				shadows: false,
				transition: 'crossfade'
			});

		$('.chain-slider').owlCarousel({
			items: 3,
			slideSpeed: 700,
			rewindSpeed: 700,
			navigation: true,
			navigationText: ['',''],
			scrollPerPage: true,
			pagination: false,
			responsive: false,
			theme: '',
		});

		if($('.rates').length){
			PKP.Sliders.rates();
		}

		if($('.catalog-banner').length > 0){
			PKP.Sliders.catalogBanner();
		}
	},

	catalogBanner: function() {
		$('.b-catalog-banner').fotorama({
			width: '100%',
			height: 330,
			allowfullscreen: false,
			loop: true,
			autoplay: 3500,
			stopautoplayontouch: true,
			nav: 'dots',
			arrows: false,
			shadows: false,
			transition: 'crossfade',
			fit: 'cover'
		});
	},
	
	rates: function() {
		// Слайдер тарифов
		PKP.$rates = $('.slider')
			.fotorama({
				width: '100%',
				height: 657,
				allowfullscreen: false,
				loop: true,
				autoplay: 5000,
				stopautoplayontouch: true,
				nav: false,
				arrows: false,
				shadows: true,
				click: false
			});
		
		if(PKP.$rates) {

			// При хавере останавливать слайдер
			var slider = PKP.$rates.data('fotorama');

			$('.slider').hover(
				function () {
					slider.stopAutoplay();
				},
				function () {
					slider.startAutoplay(5000);
				}
			);
		
			// Контролы
			$('.slider-control').click(function() {
				if(PKP.$rates) {
					var slider = PKP.$rates.data('fotorama');

					if($(this).is('.next')) {
						slider.show('>');
					} else {
						slider.show('<');
					}
				}
			});

			// Заголовок
			$('.slider').on('fotorama:show fotorama:load',
				function (e, fotorama, extra) {
					$(this).siblings('.slider-status').text(fotorama.data[fotorama.activeIndex].title);
				}
			);
		}
	}
};

PKP.UI = {
	init: function() {
		PKP.UI.popup();

		/* Селекты */
		$('select').chosen({
			disable_search_threshold: 6,
			width: '100%'
		});

		/* Главное меню */
		$('.header .with-submenu').hover(
			function() {
				var $this = $(this);
				$this.closest('.menu').find('.submenu.active').removeClass('active').addClass('current');
				$this.children('a').addClass('bordered');
				$this.children('.submenu').addClass('active');
				$('.submenu-bg').addClass('active');
			}, 
			function() {
				var $this = $(this);
				$this.children('a').removeClass('bordered');
				$this.children('.submenu').removeClass('active');

				if($this.closest('.menu').is('.menu--opened')) {
					$this.closest('.menu').find('.submenu.current').removeClass('current').addClass('active');
				} else {
					$('.submenu-bg').removeClass('active');
				}
			}
		);

		/* Скрывалка */
		PKP.$body.on("click", '.collapse-trigger', function(e) {
			e.preventDefault();
			$('#' + $(this).data('target')).slideToggle();
		});

		/* «Выпадайка» */
		PKP.$body.on("click", '.accordeon__header', function(e) {
			e.preventDefault();
			var $this = $(this);
			
			$this
				.find('.accordeon__trigger')
				.toggleClass('active')
				.closest('.accordeon')
				.toggleClass('active')
				.find('.accordeon__content')
				.slideToggle(500)
			;
		});

		/* «Выпадайка» */
		PKP.$body.on("click", '.dropdown__trigger', function(e) {
			e.preventDefault();
			var $this = $(this);

			if($this.is('.disabled')) {
				return false;
			}

			if(0 < $('.dropdown__trigger.active').length) {
				$('.dropdown__trigger.active')
					.not(this).removeClass('active').
					siblings('.dropdown__content').addClass('hidden');   
			}
			
			$this.
				toggleClass('active').
				siblings('.dropdown__content[data-target="' + $this.data('target') + '"]').toggleClass('hidden');
		});

		/* Скрываем выпадайку по клику мимо неё */
		PKP.$document.click(function(e) {
			var $this = $(e.target);

			if($this.is('.dropdown__trigger')) {
				//
			} else {
				if(1 !== $this.parents().filter('.dropdown__content').length) {
					$('.dropdown__trigger.active').
						removeClass('active').
						siblings('.dropdown__content').addClass('hidden');
				}
			}
		});

		/* По клику на внутреннюю ссылку «выпадайка» закрывается */
		PKP.$body.on("click", '.dropdown__content a', function() {
			$(this).
				closest('.dropdown__content').toggleClass('hidden').
				siblings('.dropdown__trigger').toggleClass('active');
		});

		/* Сортировка */
		PKP.$body.on("click", '.selector__options a', function() {
			var $this = $(this);
			$this.
				closest('.menu__item').addClass('active').
				siblings().removeClass('active').
				closest('.selector').find('.selector__current').text($this.text());
		});

		/* Радио-селектор */
		PKP.$body.on("click", '.radio-circles a', function() {
			$(this).
				closest('.menu__item').addClass('active').
				siblings().removeClass('active');
		});

		/* Переключение лэйаута */
		PKP.$body.on("click", '.catalog-layout a', function() {
			$('.b-catalog__items').
				removeClass().
				addClass('b-catalog__items ' + $(this).data('value'));
		});

		/* Баян-меню */
		$('.b-sidebar').on("click", '.with-submenu', function(e) {
			var $this = $(e.target);
			if(1 !== $this.parents().filter('.submenu').length) {
				$(this).
					toggleClass('active').
					children('.submenu').toggleClass('active');
			}
		});
		$('.b-advanced-search').on("click", '.with-submenu', function(e) {
			var $this = $(e.target);
			if(1 !== $this.parents().filter('.submenu').length) {
				$(this)
					.find('.b-tree__folder').toggleClass('b-tree__expanded');
				$(this)
					.children('.submenu').toggleClass('hidden');
			}
		});

		/* Вспомогательное, для тестирования */
		$('#js-nosidebar').on('click', function () {
			var li = $(this).closest('.menu__item');

			$('aside.b-sidebar').
				find('a.btn').
					toggleClass('dropdown__trigger').
				siblings('.b-sidebar__dropdown').
					toggleClass('dropdown__content hidden');

			if (li.is('.active')) {
				li.toggleClass('active');
			}

			
			$('section.store').toggleClass('nosidebar');
		});

		$('#js-login, #js-logout').on('click', function() {
			var t = $(this).closest('.menu-login');
			t.find('.not-logged-in').toggleClass('hidden');
			t.find('.logged-in').toggleClass('hidden');
		});
		$('#js-advanced-search').on('click', function () {
			$('section.advanced-search').toggleClass('active');
			$('.b-advanced-search').slideToggle(500);
		});

		/* Снимаем класс ошибки при фокусе */
		$('input.error').on('focus', function() {
			$(this).removeClass('error');
		});
	},
	formatNumber: function (number, dSeparator, fSeparator) {
		// Default digits & fraction separators
		if (!dSeparator) {
			dSeparator = '<i class="b-price__separator"></i>';
		}
		if (!fSeparator) {
			fSeparator = ',';
		}
	 
		var str 		= number.toString(),
			isNegative  = (number < 0),
			intLength 	= str.lastIndexOf('.'),
			output = '',
			cnt    = -1;

		intLength = (intLength > -1) ? intLength : str.length;
		output    = str.substring(intLength);

		if(intLength > 4) {
			for (var i = intLength; i > 0; i--) {
				cnt++;
				if (((cnt % 3) === 0 ) && (i !== intLength) && (!isNegative || (i > 1))) {
					output = dSeparator + output;
				}
				output = str.charAt(i - 1) + output;
			}
		} else {
			output = str;
		}

		return output.replace('.', fSeparator);
	},
	cart: function () {
		// Уменьшить
		$(".b-increment-group__darr").on('click', function(){
			var $this       = $(this),
				$tr   	    = $this.closest(".b-order-item"),
				$price 	    = $tr.find(".b-price__number"),
				$qty        = $tr.find(".b-increment-group__qty"),
				$total_sum  = $(".b-cart-menu__amount .b-price__number"),
				$cartQty    = $('.dropdown__trigger[data-target="cart"]').find('.circles-menu__num');

			var total_sum 	= Number( $total_sum.text() ),
				item_sum 	= Number( $price.text() ),
				num 		= Number( $qty.text() ),
				cartNum 	= Number( $cartQty.text() ),
				price 		= item_sum / num;

			$price.html(PKP.UI.formatNumber(item_sum - price));
			$total_sum.html(PKP.UI.formatNumber(total_sum - price));

			num -= 1;
			cartNum -= 1;

			if(num <= 1) {
				$this.addClass("invisible");
			}

			$qty.text(num);
			$cartQty.text(cartNum);
			return false;
		});

		// Увеличить
		$(".b-increment-group__uarr").on('click', function(){
			var $this 		= $(this),
				$tr   		= $this.closest(".b-order-item"),
				$price 	 	= $tr.find(".b-price__number"),
				$qty       	= $tr.find(".b-increment-group__qty"),
				$total_sum 	= $(".b-cart-menu__amount .b-price__number"),
				$cartQty    = $('.dropdown__trigger[data-target="cart"]').find('.circles-menu__num');


			var total_sum 	= Number( $total_sum.text() ),
				item_sum 	= Number( $price.text() ),
				num 		= Number( $qty.text() ),
				cartNum 	= Number( $cartQty.text() ),
				price 		= item_sum / num;

			$price.html(PKP.UI.formatNumber(item_sum + price));
			$total_sum.html(PKP.UI.formatNumber(total_sum + price));

			num += 1;
			cartNum += 1;

			if(num > 1) {
				$this.siblings(".b-increment-group__darr").removeClass("invisible");
			}
			$qty.text(num);
			$cartQty.text(cartNum);

			return false;
		});

		// Удалить
		$(".b-order-item__drop").on('click', function(){
			var $this = $(this),
				$tr   = $this.closest(".b-order-item"),
				$price 	 = $tr.find(".b-price__number"),
				$qty       	= $tr.find(".b-increment-group__qty"),
				$cartQty    = $('.dropdown__trigger[data-target="cart"]').find('.circles-menu__num');

			var $total_sum = $(".b-cart-menu__amount .b-price__number"),
				total_sum 		 = Number($total_sum.text()),
				item_sum 		 = Number($price.text());

			$total_sum.text(total_sum - item_sum);
			$cartQty.text(Number($cartQty.text()) - Number($qty.text()));

			$tr.fadeOut();
			setTimeout(function(){
				$tr.remove();

				if($(".b-cart-menu__goods li").length === 0) {
					var t = $('.dropdown__trigger[data-target="cart"]');
					t.trigger('click').addClass('disabled').find('.circles-menu__num').addClass('invisible');
				}
			}, 500);

			return false;
		});
	},
	popup: function() {
		// Форма "задать ворпос"
		$("#js-join").click(function(){
			var request_form = $("#request_form");

			// Скрываем результаты отправки, если уже отправляли.
			// Показываем форму, если была скрыта
			request_form.find('.send_request_result').hide();
			request_form.find('#request_form_wrapper').show();

			request_form.show(); //.find("input").eq(0).focus();
			
			return false;
		});
		
		$("#js-close_request_form").click(function(){
			$("#request_form").hide();
			return false;
		});
		
		// Отправка заявки
		$("#js-send-request").click(function(){
			var request_name  = $("#request_name");
			var request_email = $("#request_email");
			var request 	  = $("#request_text");

			if (request_name.val().length > 0 && request_email.val().length > 0) {
				
				$.ajax({
					type: 'POST',
					url: '/api',
					data: {
						name: request_name.val(), 
						email: request_email.val(),
						text: request.val()
					},
					success: function(result){
						if (result === 'success') {
							request.val('');
							request_name.val('');
							request_email.val('');
							
							$('#request_form_wrapper').hide();
							$("#send_request_success").show();
						} else {
							$("#send_request_fail").show();
						}
					},
					error: function (xhr, ajaxOptions, thrownError) {
						console.error(xhr.status);
						console.error(thrownError);
						$('#request_form_wrapper').hide();
						$("#send_request_fail").show();
					},
					dataType: 'html'
				});
			
			} else {
				request_name.focus(); // addClass('error');
			}

			return false;
		});
		
		// Предотвращаем закрытие окна при клике внутри него
		$(".popup").click(function(event){
			event.stopPropagation();
		});

		PKP.$body.click(function(){
			$("#request_form").hide();
		});
	},
	tree: function() {
		$("#multilocation").fancytree({
			minExpandLevel: 1,
			rootVisible: false,
			checkbox: true,
			selectMode: 3,
			source: treeData,
			icons: false,
			clickFolderMode: 4,

			loadChildren: function(event, ctx) {
				// ctx.node.fixSelection3AfterClick();
			},

			select: function(event, data) {
				// Get a list of all selected nodes, and convert to a key array:
				var selKeys = $.map(data.tree.getSelectedNodes(), function(node) {
					return node.key;
				});

				// Get a list of all selected TOP nodes
				var selRootNodes = data.tree.getSelectedNodes(true);
				// console.log(selRootNodes.length);

				// ... and convert to a key array:
				var selRootKeys = $.map(selRootNodes, function(node) {
					return node.key;
				});
				$("#js-multilocation").removeClass('checked').addClass('part');
				if(data.tree.getSelectedNodes().length === 0) {
					$("#js-multilocation").removeClass('part');
				}
			},

			keydown: function(event, data) {
				if( event.which === 32 ) {
					data.node.toggleSelected();
					return false;
				}
			}
		});


		$("#js-multilocation").click(function(){
			var $this  = $(this),
				$tree  = $("#multilocation");
			var is_clr = ($this.is('.checked') || $this.is('.part')) ? false : true
			

			$tree.fancytree("getTree").visit(function(node) {
				node.setSelected( is_clr );
			});

			$this.removeClass('part');

			if(is_clr) {
				$this.addClass('checked');
			}
			
			return false;
		});
	}
};



PKP.Video = {
	init: function() {
		if($('#intro-video').length > 0) {
			var pkPlayer = videojs("intro-video", { 
				"width" : "100%",
				"height": "100%",
				"controls": true, 
				"autoplay": false, 
				"preload": "auto" 
			});

			$('#js-video').on('click',function () {
				PKP.$body.addClass('locked');
				$('.video-holder').fadeIn(400, function() {
					// pkPlayer.requestFullscreen();
					pkPlayer.play();
				});
			});

			$('#js-close-video').on('click',function () {
				$('.video-holder').fadeOut(400,function(){
					PKP.$body.removeClass('locked');
					pkPlayer.pause().currentTime(0);
				});
			});
		}
	}
}

$($.proxy(PKP.init, PKP));


