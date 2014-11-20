$(document).ready(function() {

	$("#workspace").on("dragover", function(event) {
	    event.preventDefault();  
    	event.stopPropagation();
	    $(this).addClass('overlay');	
		$('#dropContent').addClass('visible');
		$('#dropContent').removeClass('hidden');	
	});

	$("#workspace").on("dragleave", function(event) {
	    event.preventDefault();  
	    event.stopPropagation();		
	    $(this).removeClass('overlay');	
		$('#dropContent').removeClass('visible');
		$('#dropContent').addClass('hidden');		
	});
	
	$("#workspace").on("drop", function(event) {
	    event.preventDefault();  
	    event.stopPropagation();
	    var files = event.originalEvent.dataTransfer.files;
	    for(i = 0; i < files.length;i++){
	    	readImage(files[i]);
	    }
		clearFileInput();
		$(this).removeClass('overlay');	
		$('#dropContent').removeClass('visible');
		$('#dropContent').addClass('hidden');				
	});

	$(window).load(function()
	{
		 centerDropContent();
	});
	
	$(window).resize(function()
	{
		 centerDropContent();
	});
	
});

function centerDropContent(){
	var dropContainer = $('#workspace');
	var dropContent = $('#dropContent');
	dropContent.css("left", (dropContainer.width()-(dropContent.width()+48))/2); //48 == padding izquierdo+derecho
	dropContent.css("top", (dropContainer.height()-(dropContent.height()+48))/2); //48 == padding arriba+abajo
}