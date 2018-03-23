$(function () {
	var orientation = screen.orientation;
	if (orientation.angle === 90 && orientation.type == "landscape-primary") {
		$('.fc-day-grid-event.fc-h-event.fc-event.fc-start.fc-end').css('margin-left', '33%');
	}else if(orientation.angle === 0 && orientation.type == "portrait-primary"){
		$('.fc-day-grid-event.fc-h-event.fc-event.fc-start.fc-end').css('margin-left', '15%');
	}
	$('.collapsible').collapsible();
});

window.addEventListener("orientationchange", function () {
	var orientation = screen.orientation;
	if (orientation.angle === 90 && orientation.type == "landscape-primary") {
		console.log('enabye')
		$('.fc-day-grid-event.fc-h-event.fc-event.fc-start.fc-end').css('margin-left','33%');
	} else if (orientation.angle === 0 && orientation.type == "portrait-primary") {
		console.log('enabye111')
		$('.fc-day-grid-event.fc-h-event.fc-event.fc-start.fc-end').css('margin-left', '15%');
	}
}, false);

$('#faq').on('click', function () {
	$('#faqNav').addClass('fadeInDown animated');
	$('.imgleft').addClass('fadeInRight animated');
	$('#titlefaq').addClass('fadeIn animated');
	$('#ulfaq').addClass('fadeIn animated');
});
