//CONFIGURACION POR DEFECTO
var modoImagen = "PAL";
var formatoDescarga = "PNG";
var maxWidth = 400;
var maxHeight = 400;
var altoHistograma = 470;
var anchoHistograma = 500;
var herramientaActual = "puntero";

/*
TO DO:
	<li><span id="saveConfig">Tamaño por defecto</span></li> --> DIALOGO
	COLORES PARA EL CSS??? 
*/

// Atajo para $( document ).ready()
$(function() {
	if (window.localStorage) { //Si el navegador soporta localStorage
		if(localStorage.getItem("modoImagen") !== null ){ //Comprobamos si hemos guardado la configuracion personalizada
			//Actualizamos las variables
			modoImagen = localStorage.getItem("modoImagen");
		    formatoDescarga = localStorage.getItem("formatoDescarga");
			maxWidth = localStorage.getItem("maxWidth");
			maxHeight = localStorage.getItem("maxHeight");
		}
	}

	$("#"+modoImagen).toggleClass('checked');
	$("#"+formatoDescarga).toggleClass('checked');

	$("#PAL").click(function() {
		$("#"+modoImagen).toggleClass('checked');
		modoImagen = "PAL";
		$("#"+modoImagen).toggleClass('checked');
	});		
	
	$("#NTSC").click(function() {
		$("#"+modoImagen).toggleClass('checked');
		modoImagen = "NTSC";
		$("#"+modoImagen).toggleClass('checked');
	});		
	
	$("#WEBP").click(function() {
		$("#"+formatoDescarga).toggleClass('checked');
		formatoDescarga = "WEBP";
		$("#"+formatoDescarga).toggleClass('checked');
	});		
	
	$("#JPEG").click(function() {
		$("#"+formatoDescarga).toggleClass('checked');
		formatoDescarga = "JPEG";
		$("#"+formatoDescarga).toggleClass('checked');
	});	
	
	$("#PNG").click(function() {
		$("#"+formatoDescarga).toggleClass('checked');
		formatoDescarga = "PNG";
		$("#"+formatoDescarga).toggleClass('checked');
	});			

	$("#saveConfig,  #saveButton").click(function() {
		if (window.localStorage) { //Si el navegador soporta localStorage
			localStorage.setItem("modoImagen",modoImagen);
			localStorage.setItem("formatoDescarga",formatoDescarga);
			localStorage.setItem("maxWidth",maxWidth);
			localStorage.setItem("maxHeight",maxHeight);					
			$("body").append("<div id=\"dialog-message\">Your configuration has been saved</div>");
			$( "#dialog-message" ).dialog({
				title: "Message",
				modal: true,
				buttons: {
				Ok: function() {
				  $(this).dialog( "close" );
				  $(this).remove();
				}
				},
				dialogClass: 'no-close' 		
				/*
				1 FORMA JQUERY
				open: function(event, ui) { 
					// Hide close button 
					$(this).parent().children().children(".ui-dialog-titlebar-close").hide(); 
				}
				2 JQUERY Y CSS, MAS LIMPIA
				dialogClass: 'no-close' 	 CSS: .no-close .ui-dialog-titlebar-close {display: none }
				3 JQUERY OPTIMA
					open: function(event, ui) {
					  $(this).closest('.ui-dialog').find('.ui-dialog-titlebar-close').hide();
					}			

				open: function(event, ui) { 
					// Hide close button 
					$(".ui-dialog-titlebar-close", ui).hide()
				}					
				*/
			});
		}else{
			$("body").append("<div id=\"dialog-message\"><div class=\"izq\"><img src=\"../images/error.png\" alt=\"Error\"></div><div class=\"dcha\"><p>Tu navegador no soporta localStorage</p></div></div>");
			$("#dialog-message").dialog({
				title: "Error",
				modal: true,
				buttons: {
				Ok: function() {
				  $(this).dialog( "close" );
				  $(this).remove();
				}
				},
				dialogClass: 'no-close' 
			});

		}
	});		
	
	$("#defaultConfig").click(function() {
		if(window.localStorage !== null){
			localStorage.clear();
		}
		modoImagen = "PAL";
		formatoDescarga = "PNG";		
	});				
	
	
	
});
