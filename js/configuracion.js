//CONFIGURACION POR DEFECTO
var modoImagen = "PAL";
var formatoDescarga = "PNG";
var maxWidth = 600;
var maxHeight = 600;
/*
TO DO:
	AÑADIR VARIABLES DE TAMAÑO DE TRABAJO
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
			  }
			});
		}else{
			$("body").append("<div id=\"dialog-message\">Your browser doesn't support LocalStorage</div>");
			$("#dialog-message").dialog({
			  title: "Error",
			  modal: true,
			  buttons: {
				Ok: function() {
				  $(this).dialog( "close" );
				  $(this).remove();
				}
			  }
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
