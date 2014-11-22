$(document).ready(function() {

	//Habilitamos tooltips de la barra de herramientas
	$( "#tools" ).tooltip();	

	// Hover para los botones de la barra de herramientas
	$( "#tools li.ui-state-default" ).hover(
		function() {
			$( this ).addClass( "ui-state-hover" );
		},
		function() {
			$( this ).removeClass( "ui-state-hover" );
		}
	);	

	//Boton descarga directa
	$("#saveButton").click(function() {
		if(typeof objetosBogui[objetoActual] == 'undefined'){
			errorDialog("Debe seleccionar una imagen para descargar");
		}else{
			descargarImagen(objetosBogui[objetoActual],objetosBogui[objetoActual].nombre,window.formatoDescarga);
		}	
	});		
	
	//Boton descarga
	$("#saveAsButton").click(function() {
		if(typeof objetosBogui[objetoActual] == 'undefined'){
			errorDialog("Debe seleccionar una imagen para descargar");
		}else{
			guardarComoDialog(objetosBogui[objetoActual]);
		}
	});		
	
	//Boton region de interes
	$("#roi").click(function() {
		if(typeof objetosBogui[objetoActual] == 'undefined'){
			errorDialog("No se puede ejecutar el comando sin una imagen seleccionada"); 
		}else{
			resetearRegionInteres();
			$("#"+window.herramientaActual ).removeClass( "ui-state-hover" );			
		    window.herramientaActual = "roi";
			$(this).addClass( "ui-state-hover" );

		}
	});	
	
	//Boton puntero
	$("#puntero").click(function() {
		if(typeof objetosBogui[objetoActual] == 'undefined'){
			errorDialog("No se puede ejecutar el comando sin una imagen seleccionada"); 
		}else{			
			resetearRegionInteres();
			$("#"+window.herramientaActual ).removeClass( "ui-state-hover" );			
		    window.herramientaActual = "puntero";
			$(this).addClass( "ui-state-hover" );
		}
	});	
	
	//Boton recortar
	$("#recortar").click(function() {
		if(typeof objetosBogui[objetoActual] == 'undefined'){
			errorDialog("No se puede ejecutar el comando sin una imagen seleccionada"); 
		}else{
			if(window.herramientaActual != "roi"){
				errorDialog("Debe tener seleccionada la herramienta \"Región de interés\" para poder recortar"); 	
			}else{
				recortar(objetosBogui[objetoActual]);
			}
		}
	});	
	
	//Boton abrir archivo
	$("#fileButton").click(function() {
		$("#fileSelector").click();
	});	
	
	//Boton informacion
	$("#informacion").click(function() {
		if(typeof objetosBogui[objetoActual] == 'undefined'){
			errorDialog("No se puede ejecutar el comando sin una imagen seleccionada"); 
		}else{
			informacionDialog(objetosBogui[objetoActual]);
		}
	});		
	
	//Boton image-cross section
	$("#ics").click(function() {
		if(typeof objetosBogui[objetoActual] == 'undefined'){
			errorDialog("No se puede ejecutar el comando sin una imagen seleccionada"); 
		}else{
			resetearRegionInteres();
			$("#"+window.herramientaActual ).removeClass( "ui-state-hover" );			
		    window.herramientaActual = "ics";
			$(this).addClass( "ui-state-hover" );
		}
	});	 
});	 

//Region de interes
function resetearRegionInteres(){
	for(var i = 0; i < objetosBogui.length; i++){
				objetosBogui[i].regCanvas.width = objetosBogui[i].regCanvas.width;
				objetosBogui[i].mouseXini = 0;
				objetosBogui[i].mouseYini = 0;		
				objetosBogui[i].mouseXfin = 0;
				objetosBogui[i].mouseYfin = 0;
			}
}

function dibujarRegionInteres(objetoBoguiActual, estado){
	objetoBoguiActual.regCanvas.width = objetoBoguiActual.regCanvas.width;
	objetoBoguiActual.regctx = objetoBoguiActual.regCanvas.getContext("2d");

	objetoBoguiActual.regctx.rect(objetoBoguiActual.mouseXini, objetoBoguiActual.mouseYini, objetoBoguiActual.mouseXfin - objetoBoguiActual.mouseXini , objetoBoguiActual.mouseYfin - objetoBoguiActual.mouseYini);
	objetoBoguiActual.regctx.lineWidth="1";
	objetoBoguiActual.regctx.setLineDash([5,2]);

	objetoBoguiActual.regctx.strokeStyle="#39b1cc";
	objetoBoguiActual.regctx.stroke();
}

//Recortar
function recortar(objetoBoguiActual){ 
	if(typeof objetoBoguiActual == 'undefined'){
		errorDialog("No se puede ejecutar el comando sin una imagen seleccionada");
	}else{

		if((objetoBoguiActual.mouseXini == objetoBoguiActual.mouseXfin) || (objetoBoguiActual.mouseYini == objetoBoguiActual.mouseYfin)){
				errorDialog("Debe seleccionar un area no nula para recortar"); 	
		}else{
			var canvasCopy = document.createElement("canvas");
			var copyContext = canvasCopy.getContext("2d");

			var imageData = objetoBoguiActual.ctx.getImageData( objetoBoguiActual.mouseXini,  objetoBoguiActual.mouseYini,  objetoBoguiActual.mouseXfin -  objetoBoguiActual.mouseXini ,  objetoBoguiActual.mouseYfin -  objetoBoguiActual.mouseYini);

			canvasCopy.width = objetoBoguiActual.mouseXfin -  objetoBoguiActual.mouseXini;
			canvasCopy.height = objetoBoguiActual.mouseYfin -  objetoBoguiActual.mouseYini;

			copyContext.putImageData(imageData, 0,0);

			var savedData = new Image();
			savedData.src = canvasCopy.toDataURL("image/png", 1);
			//Cargar la matriz de datos en el canvas
			objetosBogui.push(new Bogui(savedData, numeroObjetos, objetoBoguiActual.nombre+objetoBoguiActual.formato));
			cambiarFoco(numeroObjetos);
			numeroObjetos++;
		}
	}
}

//Image-Cross Section
function dibujarLineaICS(objetoBoguiActual, estado){

	objetoBoguiActual.regCanvas.width = objetoBoguiActual.regCanvas.width;
	objetoBoguiActual.regctx = objetoBoguiActual.regCanvas.getContext("2d");

	if(objetoBoguiActual.regctx.mouseXini > objetoBoguiActual.regctx.mouseXfin){
		aux = objetoBoguiActual.regctx.mouseXini;
		objetoBoguiActual.regctx.mouseXini = objetoBoguiActual.regctx.mouseXfin;
		objetoBoguiActual.regctx.mouseXfin = aux;
	}

	if(objetoBoguiActual.regctx.mouseYini > objetoBoguiActual.regctx.mouseYfin){
		aux = objetoBoguiActual.regctx.mouseYini;
		objetoBoguiActual.regctx.mouseYini = objetoBoguiActual.regctx.mouseYfin;
		objetoBoguiActual.regctx.mouseYfin = aux;
	}

	//objetoBoguiActual.regctx.rect(objetoBoguiActual.mouseXini, objetoBoguiActual.mouseYini, objetoBoguiActual.mouseXfin - objetoBoguiActual.mouseXini , objetoBoguiActual.mouseYfin - objetoBoguiActual.mouseYini);
	objetoBoguiActual.regctx.beginPath();
	objetoBoguiActual.regctx.moveTo(objetoBoguiActual.mouseXini, objetoBoguiActual.mouseYini);
	objetoBoguiActual.regctx.lineTo(objetoBoguiActual.mouseXfin, objetoBoguiActual.mouseYfin);
	objetoBoguiActual.regctx.lineWidth="1";
	objetoBoguiActual.regctx.setLineDash([5,2]);

	objetoBoguiActual.regctx.strokeStyle="#39b1cc";
	objetoBoguiActual.regctx.stroke();
}