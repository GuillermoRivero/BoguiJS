$(document).on('keydown', null, 'alt+s', function(){
	$("#saveButton").click();
});

$(document).on('keydown', null, 'alt+shift+s', function(){
	$("#saveAsButton").click();
});

$(document).on('keydown', null, 'alt+r', function(){
	$("#roi").click();
});

$(document).on('keydown', null, 'alt+p', function(){
	$("#puntero").click();
});

$(document).on('keydown', null, 'alt+c', function(){
	$("#recortar").click();
});

$(document).on('keydown', null, 'shift+o', function(){
	$("#openImageAs").click();
});

$(document).on('keydown', null, 'shift+i', function(){
	$("#informacion").click();
});

$(document).on('keydown', null, 'alt+i', function(){
	$("#ics").click();
});

$(document).on('keydown', null, 'alt+o', function(){
	$("#fileButton").click();
});
