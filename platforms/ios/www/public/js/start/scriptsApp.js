$(function(){
	$('#drawer-menu01').drawer_menu();
	$('#drawer-menu02').drawer_menu({
		side : 'right',
		child_side : 'right',
	});
	$('.collapsible').collapsible();
});

$('#atletas-tab').each(function(index) {
	$(this).find('.col.s12.m7').last().css('padding-bottom','61px');
});
$('#fitplans-tab').each(function(index) {
	$(this).find('.col.s12.m7').last().css('padding-bottom','61px');
});
