$(document).ready(function() {
    $( "#menu" ).tooltip();	
	//Archivo
	//TODO: Abrir Imagen Como
	//Abrir archivo
		
	$("#fileMenu").click(function() {
		$("#fileSelector").click();
	});	
	
	/*
	$("#openImageFromURL").click(function() {	
		//abrirImagenURLDialog(); //TODO: Descomentar cuadno se arregle el metodo
		
	});
	
	$("#openImageFromWebCam").click(function() {
		abrirImagenWebCamDialog();		
	});*/
	
	$("#openImageAs").click(function() {
		abrirComoDialog();
	});	

	//Descargar
	$("#saveImage").click(function() {
		if(typeof objetosBogui[objetoActual] == 'undefined'){
			errorDialog("Debe seleccionar una imagen para descargar");
		}else{
			descargarImagen(objetosBogui[objetoActual], window.formatoDescarga);
		}	
	});		
	//Descargar como
	$("#saveImageAsButton").click(function() {
		if(typeof objetosBogui[objetoActual] == 'undefined'){
			errorDialog("Debe seleccionar una imagen para descargar");
		}else{
			guardarComoDialog(objetosBogui[objetoActual]);
		}
	});		
	//Ver
	//Histograma
	$("#histograma").click(function() {
		if(typeof objetosBogui[objetoActual] == 'undefined'){
			errorDialog("No se puede ejecutar el comando sin una imagen seleccionada"); 
		}else{
			histogramaSimpleDialog(objetosBogui[objetoActual]);
		}
	});	

	//Histograma acumulativo
	$("#histogramaAcumulativo").click(function() {
		if(typeof objetosBogui[objetoActual] == 'undefined'){
			errorDialog("No se puede ejecutar el comando sin una imagen seleccionada"); 
		}else{
			histogramaAcumulativoDialog(objetosBogui[objetoActual]);
			
		}
	});	
	
	//Informacion imagen
	$("#informacionImagen").click(function() {
		if(typeof objetosBogui[objetoActual] == 'undefined'){
			errorDialog("No se puede ejecutar el comando sin una imagen seleccionada"); 
		}else{
			informacionDialog(objetosBogui[objetoActual]);
		}
	});	

	
	//Operaciones lineales
	//Ajuste brillo y contraste
	$("#ajusteBrilloContraste").click(function() {
		if(typeof objetosBogui[objetoActual] == 'undefined'){
			errorDialog("No se puede ejecutar el comando sin una imagen seleccionada"); 
		}else{
			ajusteBrilloContrasteDialog(objetosBogui[objetoActual]);
		}
	});			
	
	//Transformacion lineal por tramos
	$("#transformacionTramos").click(function() {
		if(typeof objetosBogui[objetoActual] == 'undefined'){
			errorDialog("No se puede ejecutar el comando sin una imagen seleccionada"); 
		}else{
			transformacionLinealTramosDialog(objetosBogui[objetoActual]);
		}
	});			
	
	//Operaciones no lineales
	//Histogramas
	//Ecualizacion histograma
	$("#ecualizacion").click(function() {
		if(typeof objetosBogui[objetoActual] == 'undefined'){
			errorDialog("No se puede ejecutar el comando sin una imagen seleccionada"); 
		}else{
			ecualizarHistograma(objetosBogui[objetoActual]);
		}
	});

	//Especificacion histograma
	$("#especificacion").click(function() {
		if(typeof objetosBogui[objetoActual] == 'undefined'){
			errorDialog("No se puede ejecutar el comando sin una imagen seleccionada"); 
		}else{
			if(objetosBogui.length < 2){
				errorDialog("Debe tener 2 imagenes para usar esta funci&oacute;n")
			}else{
				especificarHistogramaDialog();
			}
			
		}
	});	
	
	//Comparacion imagenes
	//Diferencia imagenes
	$("#imagenDiferencia").click(function() {
		if(typeof objetosBogui[objetoActual] == 'undefined'){
			errorDialog("No se puede ejecutar el comando sin una imagen seleccionada"); 
		}else{
			if(typeof objetosBogui[objetoActual] == 'undefined'){
				errorDialog("No se puede ejecutar el comando sin una imagen seleccionada"); 
			}else{
				imagenDiferenciaDialog(objetosBogui[objetoActual]);
			}
		}
	});	
	
	//Mapa de cambios
	$("#mapaCambios").click(function() {
		if(typeof objetosBogui[objetoActual] == 'undefined'){
			errorDialog("No se puede ejecutar el comando sin una imagen seleccionada"); 
		}else{
			mapaCambiosDialog(objetosBogui[objetoActual]);
		}
	});	
	
	//Correccion Gamma
	$("#correccionGamma").click(function() {
		if(typeof objetosBogui[objetoActual] == 'undefined'){
			errorDialog("No se puede ejecutar el comando sin una imagen seleccionada"); 
		}else{
			correccionGammaDialog(objetosBogui[objetoActual]);
		}	
	});		

	//Image-Cross Section
	$("#imageCrossSection").click(function() {
		if(typeof objetosBogui[objetoActual] == 'undefined'){
			errorDialog("No se puede ejecutar el comando sin una imagen seleccionada"); 
		}else{
			
			if(window.herramientaActual != "ics"){
				errorDialog("Debe tener seleccionada la herramienta \"ICS\" para poder ejecutarlo"); 	
			}else{
				imageCrossSectionDialog();
			}

		}
	})
	
	//Simular digitalizacion
	$("#simularDigitalizacion").click(function() {
		if(typeof objetosBogui[objetoActual] == 'undefined'){
			errorDialog("No se puede ejecutar el comando sin una imagen seleccionada"); 
		}else{
				simularDigitalizacionDialog(objetosBogui[objetoActual]);
		}
	});

	//Operaciones Geometricas
	//Espejo Horizontal
	$("#espejoHorizontal").click(function() {
		if(typeof objetosBogui[objetoActual] == 'undefined'){
			errorDialog("No se puede ejecutar el comando sin una imagen seleccionada"); 
		}else{
				espejoHorizontal(objetosBogui[objetoActual]);
		}
	});

	//Espejo Vertical
	$("#espejoVertical").click(function() {
		if(typeof objetosBogui[objetoActual] == 'undefined'){
			errorDialog("No se puede ejecutar el comando sin una imagen seleccionada"); 
		}else{
				espejoVertical(objetosBogui[objetoActual]);
		}
	});

	//Transpuesta
	$("#transpuesta").click(function() {
		if(typeof objetosBogui[objetoActual] == 'undefined'){
			errorDialog("No se puede ejecutar el comando sin una imagen seleccionada"); 
		}else{
				transpuesta(objetosBogui[objetoActual]);
		}
	});
	
	//Rotacion
	$("#rotacion").click(function() {
		if(typeof objetosBogui[objetoActual] == 'undefined'){
			errorDialog("No se puede ejecutar el comando sin una imagen seleccionada"); 
		}else{
			rotacionDialog(objetosBogui[objetoActual]);
		}
	});	
	
	//Zoom
	$("#zoom").click(function() {
		if(typeof objetosBogui[objetoActual] == 'undefined'){
			errorDialog("No se puede ejecutar el comando sin una imagen seleccionada"); 
		}else{
			zoomDialog(objetosBogui[objetoActual]);
		}
	});	



});	 
