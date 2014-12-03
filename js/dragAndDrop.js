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
	var workspace = $('#workspace');
	var footer = $('#footer');
	dropContent.css("left", (dropContainer.width()-dropContent.outerWidth())/2); //48 == padding izquierdo+derecho
	dropContent.css("top", (dropContainer.height()-dropContent.outerHeight())/2); //48 == padding arriba+abajo
	footer.css("bottom", 0);
	footer.css("left", 0);
	workspace.css("top",$('#bars').outerHeight() );
	
}