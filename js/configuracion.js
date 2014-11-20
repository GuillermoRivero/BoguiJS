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
	<li><span id="saveConfig">Tama�o por defecto</span></li> --> DIALOGO
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
			anchoHistograma = localStorage.getItem("anchoHistograma");
			altoHistograma = localStorage.getItem("altoHistograma");
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
			localStorage.setItem("anchoHistograma",anchoHistograma);	
			localStorage.setItem("altoHistograma",altoHistograma);	
			savedConfigurationDialog();
		}else{
			errorDialog("Tu navegador no soporta Local Storage");
		}
	});		
	
	$("#defaultConfig").click(function() {
		if(window.localStorage !== null){
			localStorage.clear();
		}
		modoImagen = "PAL";
		formatoDescarga = "PNG";		
		maxWidth = 400;
		maxHeight = 400;
		altoHistograma = 470;
		anchoHistograma = 500;		
	});				
	
	$("#imageSize").click(function() {
		cambiarDimensionDialog();
	});	
	
});
