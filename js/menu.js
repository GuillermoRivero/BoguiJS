$(document).ready(function() {
    $( "#menu" ).tooltip();	
	//Archivo
	//TODO: Guardar Imagen, Guardar Imagen Como, Abrir Imagen Como
	//Abrir archivo
	$("#fileMenu").click(function() {
		$("#fileSelector").click();
	});	
	
	//Descargar
	$("#saveImage").click(function() {
		if(typeof objetosBogui[objetoActual] == 'undefined'){
			errorDialog("Debe seleccionar una imagen para descargar");
		}else{
			descargarImagen(objetosBogui[objetoActual], window.formatoDescarga);
		}	
	});		
	//Boton descarga
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

	$("#openImageFromURL").click(function() {	
		//abrirImagenURL(); //TODO: Descomentar cuadno se arregle el metodo
	});

	$("#openImageFromWebCam").click(function() {
		abrirImagenWebCam();		
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
			especificarHistogramaDialog(objetosBogui[objetoActual]);
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
});	 