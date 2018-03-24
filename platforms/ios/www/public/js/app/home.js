var tabs = [
	'.tabbed-section__selector-tab-1',
	'.tabbed-section__selector-tab-2'
];

var toggleTab = function (element) {
	var parent = element.parentNode;

	$(element)[0].addEventListener('click', function () {
		$('.tabbed-section__selector-tab-2').removeClass('active');
		$('.tabbed-section__selector-tab-1').removeClass('active');

		this.classList.add('active');

		if (this.classList.contains('tabbed-section__selector-tab-1')) {
			// and change the classes, show the first content panel
			$('.tabbed-section-1')[0].classList.remove('hidden');
			$('.tabbed-section-1')[0].classList.add('visible');

			$('.tabbed-section-2')[0].classList.remove('visible');
			$('.tabbed-section-2')[0].classList.add('hidden');
		}

		if (this.classList.contains('tabbed-section__selector-tab-2')) {
			$('.tabbed-section-2')[0].classList.remove('hidden');
			$('.tabbed-section-2')[0].classList.add('visible');
			$('.tabbed-section-1')[0].classList.remove('visible');
			$('.tabbed-section-1')[0].classList.add('hidden');
		}
	});
};

for (var i = tabs.length - 1; i >= 0; i--) {
	toggleTab(tabs[i])
};

$('#faq').on('click', function () {
	$('#faqNav').addClass('fadeInDown animated');
	$('.imgleft').addClass('fadeInRight animated');
	$('#titlefaq').addClass('fadeIn animated');
	$('#ulfaq').addClass('fadeIn animated');
});

$('#search').on('click', function () {
	$('#searchNav').addClass('fadeInDown animated');
	$('.effectJ').addClass('fadeIn animated');
	$('#searcher').focus();
});

$('#clearInput').on('click', function () {
	$('#searcher').val('');
	$('#searcher').focus();
});

$(function () {
	'use strict';

	$('.collapsible').collapsible();

	var $swipeTabsContainer = $('.swipe-tabs'),
		$swipeTabs = $('.swipe-tab'),
		$swipeTabsContentContainer = $('.swipe-tabs-container'),
		currentIndex = 0,
		activeTabClassName = 'active-tab';

	$swipeTabsContainer.on('init', function (event, slick) {
		$swipeTabsContentContainer.removeClass('invisible');
		$swipeTabsContainer.removeClass('invisible');

		currentIndex = slick.getCurrent();
		$swipeTabs.removeClass(activeTabClassName);
		$('.swipe-tab[data-slick-index=' + currentIndex + ']').addClass(activeTabClassName);
	});

	$swipeTabsContainer.slick({
		//slidesToShow: 3.25,
		slidesToShow: 2,
		slidesToScroll: 1,
		arrows: false,
		infinite: false,
		swipeToSlide: true,
		touchThreshold: 5
	});

	$swipeTabsContentContainer.slick({
		asNavFor: $swipeTabsContainer,
		slidesToShow: 1,
		slidesToScroll: 1,
		arrows: false,
		infinite: false,
		swipeToSlide: true,
		draggable: false,
		touchThreshold: 5,
		adaptiveHeight: true,
		//fade: true,
	});


	$swipeTabs.on('click', function (event) {
		// gets index of clicked tab
		currentIndex = $(this).data('slick-index');
		$swipeTabs.removeClass(activeTabClassName);
		$('.swipe-tab[data-slick-index=' + currentIndex + ']').addClass(activeTabClassName);
		$swipeTabsContainer.slick('slickGoTo', currentIndex);
		$swipeTabsContentContainer.slick('slickGoTo', currentIndex);
	});

	//initializes slick navigation tabs swipe handler
	$swipeTabsContentContainer.on('swipe', function (event, slick, direction) {
		currentIndex = $(this).slick('slickCurrentSlide');
		$swipeTabs.removeClass(activeTabClassName);
		$('.swipe-tab[data-slick-index=' + currentIndex + ']').addClass(activeTabClassName);
	});
});
