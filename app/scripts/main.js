var PKP = {};

PKP.init = function() {
	PKP.$window        = $(window);
	PKP.$document      = $(document);
	PKP.$body          = $('body');

	PKP.Sliders.init();
	PKP.UI.init();
};

PKP.Sliders = {
	init: function() {
		$('#cases')
			.fotorama({
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
		
		// При хавере останавливать слайдер
		if(PKP.$rates) {
			var slider = PKP.$rates.data('fotorama');

			$('.slider').hover(
				function () {
					slider.stopAutoplay();
				},
				function () {
					slider.startAutoplay(5000);
				}
			);
		}

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
};

PKP.UI = {
	init: function() {
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
		PKP.$body.on("click", '.dropdown__trigger', function(e) {
			e.preventDefault();
			var $this = $(this);

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
				if(1 !== $this.parents().filter('.dropdown__trigger.active').length) {
					if($this.prop("tagName") === 'TEXTAREA') {
						// если в выпадайке инпуты или текст.поле
					} else {
						$('.dropdown__trigger.active').
							removeClass('active').
							siblings('.dropdown__content').addClass('hidden');
					}
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

		/* Радио-селектор */
		PKP.$body.on("click", '.catalog-layout a', function() {
			$('.b-catalog__items').
				removeClass().
				addClass('b-catalog__items ' + $(this).data('value'));
		});
	}
};

$($.proxy(PKP.init, PKP));
