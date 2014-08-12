var PKP = {};

PKP.init = function() {
	PKP.$window        = $(window);
	PKP.$document      = $(document);
	PKP.$body          = $('body');

	PKP.Sliders.init();
	PKP.Toggle.init();
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
	}
};

PKP.Toggle = {
	init: function() {
		$('.with-submenu').hover(
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

	}
};

$($.proxy(PKP.init, PKP));        
