$.parallayer = function() {
	if ($('.parallayer').length) {
		parallayer();

		$(window).on('scroll', function() {
			parallayer();
		});

		$(window).on('resize', function() {
			parallayer();
		});
	}

	function parallayer() {
		var $windowScrollTop = $(window).scrollTop();
		var $windowHeight    = $(window).height();

		$('.parallayer').each(function() {
			var $parent = $(this);

			// добавляем стили
			$parent.css({
				'position': 'relative',
				'overflow': 'hidden'
			});

			if ($windowScrollTop + $windowHeight >= $parent.offset().top && $windowScrollTop <= $parent.offset().top + $parent.innerHeight()) {
				$parent.find('.parallayer-item').each(function() {
					var $child = $(this);

					// данные
					var $action = $child.attr('data-pl-action');
					var $offset = $child.attr('data-pl-offset') * 1;
					var $scale  = $child.attr('data-pl-scale') * 1;

					// процесс выполнения в процентах
					var $process = ($parent.offset().top - $windowScrollTop + $parent.innerHeight()) * 100 / ($windowHeight + $parent.innerHeight());

					if ($action && $offset > 0) {

						// замедление или ускорение
						if ($action == 'deceleration' || $action == 'acceleration') {
							// смещение блока
							$child.css({
								'position': 'absolute',
								'top': '-' + $offset * .5 + 'px',
								'bottom': '-' + $offset * .5 + 'px',
								'left': 0,
								'right': 0
							});

							if ($action == 'deceleration') $process = 100 - $process;

							var $position = ($offset * ($process / 100)) - $offset * .5;

							$child.css({
								'-webkit-transform': 'translate3d(0, ' + $position + 'px, 0)',
								'transform': 'translate3d(0, ' + $position + 'px, 0)'
							});
						}

						// вправо или влево
						if ($action == 'to-right' || $action == 'to-left') {
							// смещение блока
							$child.css({
								'position': 'absolute',
								'top': 0,
								'bottom': 0,
								'left': '-' + $offset * .5 + 'px',
								'right': '-' + $offset * .5 + 'px'
							});

							if ($action == 'to-right') $process = 100 - $process;

							var $position = ($offset * ($process / 100)) - $offset * .5;

							$child.css({
								'-webkit-transform': 'translate3d(' + $position + 'px, 0, 0)',
								'transform': 'translate3d(' + $position + 'px, 0, 0)'
							});
						}
					}

					if ($action && $scale > 0) {
						// увеличение или уменьшение
						if ($action == 'increase' || $action == 'decrease') {
							if ($action == 'increase') $process = 100 - $process;

							var $position = (($scale - 1) * ($process / 100)) + 1;

							$child.css({
								'position': 'absolute',
								'top': 0,
								'bottom': 0,
								'left': 0,
								'right': 0,
								'-webkit-transform': 'scale3d(' + $position + ', ' + $position + ', 1)',
								'transform': 'scale3d(' + $position + ', ' + $position + ', 1)'
							});
						}
					}
				});
			}
		});
	}
};
