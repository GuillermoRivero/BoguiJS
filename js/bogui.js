/* Libreria de tratamiento de imágenes 

Autores: Guillermo Rivero Rodríguez y Boris Ballester Hernández"

IMPORTANTEEEEEEEEEEEEEEEEEE!!!!!!!!!!!!!!!!!!!!
EL TAMAÑO DE TRABAJO DE IMAGEN, FORMATO DE DESCARGA Y MODO DE IMAGEN VIENEN DADOS POR EL FICHERO DE CONFIGURACION, PARA USARLOS
	-window.maxHeight
	-window.maxWidth
	-window.modoImagen
	-window.formatoDescarga
*/

var imagen;
var objetosBogui = [];
var objetoActual = 0;
var numeroObjetos = 0;
var altoHistograma = 470;
var anchoHistograma = 500;

$(document).ready(function() {
	//Añadimos el evento para las imagenes
	$("#fileSelector").on("change", readImage);
	
	// Hover para los botones de la barra
	$( "#tools li" ).hover(
		function() {
			$( this ).addClass( "ui-state-hover" );
		},
		function() {
			$( this ).removeClass( "ui-state-hover" );
		}
	);	
	//Habilitamos tooltips del menu
	$( "#bars" ).tooltip();	
	
	//Añadimos la opciones del menu
	$("#fileButton, #fileMenu").click(function() {
		$("#fileSelector").click();
	});	

	$("#instaDownloadButton").click(function() {
		if(typeof objetosBogui[objetoActual] == 'undefined'){
			console.log("ERROR"); //TODO: Cambiar el log, por un mensaje en pantalla explicando que no se puede mostrar la opcion sin un objeto seleccionado
		}else{
			objetosBogui[objetoActual].descargarImagen(window.formatoDescarga);
		}	
	});		
});


function readImage() {
    if ( this.files && this.files[0] ) {
        var FR= new FileReader();
        FR.onload = function(e) {
		imagen = new Image();   
	    	imagen.src = e.target.result;
		imagen.onload = function() {
		     objetosBogui.push(new Bogui(imagen, numeroObjetos-1));
		     cambiarFoco(numeroObjetos-1);
		   };
        };       
        FR.readAsDataURL( this.files[0] );
	numeroObjetos++;
    }
}

function Bogui(img, id) {

	//ATRIBUTOS
	this.ident = id;
	this.modo = window.modoImagen;
	this.imagen = img;
	this.imgCanvas;
	this.ctx;
	this.histograma = new Array(256);
	this.histogramaAcumulativo = new Array(256);
	this.dialogoHistograma;
	this.contenedorHistograma;
	this.dialogoHistogramaAcumulativo;
	this.contenedorHistogramaAcumulativo;
	//METODOS
	this.calcularBrillo = calcularBrillo;
	this.reducirImagen = reducirImagen;
	this.RGBA2BW = RGBA2BW;
	this.crearHistogramaSimple = crearHistogramaSimple;
	this.crearHistogramaAcumulativo = crearHistogramaAcumulativo;
	this.descargarImagen = descargarImagen;

	this.imgCanvas = document.createElement("canvas");
	this.imgCanvas.setAttribute("id", "canvas"+this.ident);
	this.imgCanvas.setAttribute("height", this.imagen.height);
	this.imgCanvas.setAttribute("width", this.imagen.width);
	this.imgCanvas.setAttribute("autofocus", "autofocus"); //Si no se especifica el foco, se asigna al primer elemento del dialog (boton cerrar)

	//Crear ventana con el canvas
	this.dialogo = $('<div/>', {
	    id: "dialogo" + this.ident,
		title: "Imagen: " + this.ident,
	   	height: maxHeight,
		width: maxWidth	
	}).appendTo('#workspace');
		
	this.dialogo.append(this.imgCanvas);
	this.dialogo.dialog();
	
	this.dialogo.on("dialogclose",function(e){			
		
		var exp = /dialogo(\d+)/i
		var res = exp.exec(e.target.id);
		var idActual = res[1];
		
		borrarObjetoBogui(idActual);
		
 	});
	
	this.dialogo.on( "dialogfocus", function( e, ui ) {
						var exp = /dialogo(\d+)/i
						var res = exp.exec(e.target.id);
						var idActual = res[1];

						cambiarFoco(idActual);
						} );

	//Dibujar imagen en el canvas
	this.ctx = this.imgCanvas.getContext('2d');
	this.ctx.drawImage(this.imagen, 0, 0);

	//Reducir imagen y ponerla en blanco y negro
	this.reducirImagen();
	this.RGBA2BW();

	//Ajustar tamaño de la ventana
	this.dialogo.dialog("option", "width", this.imgCanvas.width + 55); 
	this.dialogo.dialog("option", "height", this.imgCanvas.height + 80);
		
}

function obtenerPosArray(id){

	var i = 0;
	for(i = 0; i < objetosBogui.length; i++){
		if(objetosBogui[i].ident == id ){
			return i;	
		}
	}

}


function cambiarFoco(foco){
	
	var i = 0;
	for(i = 0; i < objetosBogui.length; i++){
		if(objetosBogui[i].ident == foco ){
			objetoActual = i;	
		}
	}
}

function descargarImagen(formato){

	var dataUrl;

	switch(formato){
	case "PNG":
		dataUrl = this.imgCanvas.toDataURL('image/png', 1); // obtenemos la imagen como png
		dataUrl = dataUrl.replace("image/png",'image/octet-stream'); // sustituimos el tipo por octet
		break;
	case "JPEG":
		dataUrl = this.imgCanvas.toDataURL('image/jpeg', 1);
		dataUrl = dataUrl.replace("image/jpeg",'image/octet-stream'); // sustituimos el tipo por octet
		break;
	case "WEBP":
		dataUrl = this.imgCanvas.toDataURL('image/webp', 1);
		dataUrl = dataUrl.replace("image/webp",'image/octet-stream'); // sustituimos el tipo por octet
		break;
	default:
		dataUrl = this.imgCanvas.toDataURL();
		dataUrl = dataUrl.replace("image/png",'image/octet-stream'); // sustituimos el tipo por octet
	}

	document.location.href = dataUrl; // para forzar al navegador a descargarlo
}

function crearHistogramaSimple(){

	var imageData = this.ctx.getImageData(0, 0, this.imgCanvas.width, this.imgCanvas.height);
   	var pixelData = imageData.data;

	//Inicializar Variables
	for(i = 0; i < this.histograma.length; i++) {
		this.histograma[i] = 0;
	}
	
	//Rellenar histograma Simple
   	for(j = 0; j < pixelData.length; j += 4) {
		this.histograma[pixelData[j]]++; 
	}

	//Histograma Simple
	this.dialogoHistograma = jQuery('<div/>', {
	    	id: "dialogo" + this.ident
	}).appendTo('#workspace');

	this.contenedorHistograma = jQuery('<div/>').appendTo(this.dialogoHistograma);
	
	this.contenedorHistograma.highcharts({
        chart: {
            type: 'column',
	    width: anchoHistograma - 50,
	    height: altoHistograma - 70
        },
        title: {
            text: 'Histograma'
        },
        xAxis: {
            min: 0,
            title: {
                text: 'Intensidad'
            }
        },
        yAxis: {
            min: 0,
	    max: Math.max.apply(Math, this.histograma),
            title: {
                text: 'Cantidad de Pixeles'
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color}; padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y} </b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0,
                borderWidth: 0
            }
        },
        series: [{
            name: 'Histograma Simple',
            data: this.histograma,
	    color: "#39b1cc"

        }]
    });
	//APPEND
	this.dialogoHistograma.dialog();
	this.dialogoHistograma.dialog("option", "title", "Histograma: " + this.ident);
	this.dialogoHistograma.dialog("option", "resizable", false);
	this.dialogoHistograma.dialog("option", "width", anchoHistograma); 
	this.dialogoHistograma.dialog("option", "height", altoHistograma);

	//Se cierran los histogramas ya que no deben abrirse hasta que el usuario los invoque.
	this.dialogoHistograma.dialog( "close" );
}


function crearHistogramaAcumulativo(){

	this.crearHistogramaSimple();
	//Inicializar Variables
	for(i = 0; i < this.histograma.length; i++) {
		this.histogramaAcumulativo[i] = 0; 
	}

	//Rellenar histograma Acumulativo
	this.histogramaAcumulativo[0] = this.histograma[0]; 
	for(k = 1; k < this.histograma.length; k++) {
		this.histogramaAcumulativo[k] = this.histograma[k] + this.histogramaAcumulativo[k-1]; 
	}

	//Histograma Acumulativo
	
	this.dialogoHistogramaAcumulativo = jQuery('<div/>', {
	    	id: "dialogo" + this.ident
	}).appendTo('#workspace');

	
	this.contenedorHistogramaAcumulativo = jQuery('<div/>').appendTo(this.dialogoHistogramaAcumulativo);
	
	this.contenedorHistogramaAcumulativo.highcharts({
        chart: {
            type: 'column',
	    width: anchoHistograma - 50,
	    height: altoHistograma - 70
        },
        title: {
            text: 'Histograma Acumulativo'
        },
        xAxis: {
            min: 0,
            title: {
                text: 'Intensidad'
            }
        },
        yAxis: {
            min: 0,
	    max: Math.max.apply(Math, this.histogramaAcumulativo),
            title: {
                text: 'Cantidad de Pixeles'
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color}; padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y} </b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0,
                borderWidth: 0
            }
        },
        series: [{
            name: 'Histograma Acumulativo',
            data: this.histogramaAcumulativo,
	    color: "#39b1cc"

        }]
    });

	this.dialogoHistogramaAcumulativo.dialog();
	this.dialogoHistogramaAcumulativo.dialog("option", "title", "Histograma: " + this.ident);
	this.dialogoHistogramaAcumulativo.dialog("option", "resizable", false);
	
	this.dialogoHistogramaAcumulativo.dialog("option", "width", anchoHistograma); 
	this.dialogoHistogramaAcumulativo.dialog("option", "height", altoHistograma);

	//Se cierran los histogramas ya que no deben abrirse hasta que el usuario los invoque.
	this.dialogoHistogramaAcumulativo.dialog( "close" );
}


function borrarObjetoBogui(id){
	var i = 0;
	for(i = 0; i < objetosBogui.length; i++){
		if(objetosBogui[i].ident == id ){
			objetosBogui.splice(i, 1);
		}
	}
	if(objetosBogui.length > 0){
		objetosBogui[0].dialogo.dialog( "moveToTop" );
	}
	objetoActual = 0;
}

function reducirImagen(){

	//Hacer un nuevo canvas
	var canvasCopy = document.createElement("canvas");
	var copyContext = canvasCopy.getContext("2d");

	// Determinar el ratio de conversion de la imagen
	var ratio = 1;
	if(this.imagen.width > window.maxWidth)
		ratio = window.maxWidth / this.imagen.width;
	else if(this.imagen.height > window.maxHeight)
		ratio = window.maxHeight / this.imagen.height;

	//Dibujar la imagen original en el segundo canvas
	canvasCopy.width = this.imagen.width;
	canvasCopy.height = this.imagen.height;
	copyContext.drawImage(this.imagen, 0, 0);
	//Copiar y cambiar de tamño el segundo canvas en el primer canvas
	this.imgCanvas.width = this.imagen.width * ratio;
	this.imgCanvas.height = this.imagen.height * ratio;
	this.ctx.drawImage(canvasCopy, 0, 0, canvasCopy.width, canvasCopy.height, 0, 0, this.imgCanvas.width, this.imgCanvas.height);

}

function RGBA2BW(){

	//Obtener la matriz de datos.
	var imageData = this.ctx.getImageData(0, 0, this.imagen.width, this.imagen.height);
   	var pixelData = imageData.data;
   	var bytesPerPixel = 4;

	//Modificar los valores RGB para pasarlos a B&W
   	for(var y = 0; y < this.imagen.height; y++) {
      		for(var x = 0; x < this.imagen.width; x++) {
			 var startIdx = (y * bytesPerPixel * this.imagen.width) + (x * bytesPerPixel);

			 var red = pixelData[startIdx];
			 var green = pixelData[startIdx + 1];
			 var blue = pixelData[startIdx + 2];
			 //Cambiar para NTSC Y PAL Y PONER LOS VALORES DEL GUION
			
			 var grayScale;

			 switch(this.modo){
				 case "PAL":
					 grayScale = (red * 0.222) + (green * 0.707) + (blue * 0.071);
					 break;
				 case "NTSC":
					 grayScale = (red * 0.2999) + (green * 0.587) + (blue * 0.114);
					 break;
			 }

			 pixelData[startIdx] = grayScale;
			 pixelData[startIdx + 1] = grayScale;
			 pixelData[startIdx + 2] = grayScale;
	      	}
	   }
	//Cargar la matriz de datos en el canvas
	this.ctx.putImageData(imageData, 0, 0);

};

function cambiarBrillo(nivel){
	//Obtener la matriz de datos.
	var imageData = objetosBogui[objetoActual].ctx.getImageData(0, 0, objetosBogui[objetoActual].imagen.width, objetosBogui[objetoActual].imagen.height);
   	var pixelData = imageData.data;
   	var bytesPerPixel = 4;

	var funcionTransferencia = new Array(256);
	var i = 0;
	for(i = 0; i < funcionTransferencia.length; i++){
	
			if(i + nivel < 0){
				funcionTransferencia[i] = 0;
			}else if(i + nivel > 255){
				funcionTransferencia[i] = 255;
			}else{
				funcionTransferencia[i] = i + + nivel;
			}
	}

   	for(var y = 0; y < objetosBogui[objetoActual].imagen.height; y++) {
      		for(var x = 0; x < objetosBogui[objetoActual].imagen.width; x++) {
			 var startIdx = (y * bytesPerPixel * objetosBogui[objetoActual].imagen.width) + (x * bytesPerPixel);
			
			pixelData[startIdx] = funcionTransferencia[pixelData[startIdx]];
			pixelData[startIdx+1] = funcionTransferencia[pixelData[startIdx+1]];
			pixelData[startIdx+2] = funcionTransferencia[pixelData[startIdx+2]];
			
	      	}
	   }
	//Cargar la matriz de datos en el canvas

	objetosBogui.push(new Bogui(objetosBogui[objetoActual].imagen, numeroObjetos));
	objetosBogui[obtenerPosArray(numeroObjetos)].imgCanvas = objetosBogui[objetoActual].imgCanvas;
	objetosBogui[obtenerPosArray(numeroObjetos)].ctx.putImageData(imageData, 0, 0);
	cambiarFoco(numeroObjetos);
};


function calcularBrillo(nivel){

	this.crearHistogramaSimple();

	var brillo = 0;
	var sumatorio = 0;
	var total = 0;

	for(i = 0; i < this.histograma.length; i++){
		sumatorio = sumatorio + this.histograma[i] * i;
		total = total + this.histograma[i];
	}

	brillo = sumatorio/total;
	console.log(brillo);
	return brillo;
};


/////BOTONES INTERFAZ
function abrirHistograma(){

	if(typeof objetosBogui[objetoActual] == 'undefined'){
		console.log("ERROR"); //TODO: Cambiar el log, por un mensaje en pantalla explicando que no se puede mostrar la opcion sin un objeto seleccionado
	}else{
		objetosBogui[objetoActual].crearHistogramaSimple();
		objetosBogui[objetoActual].dialogoHistograma.dialog("open");
	}
}

function abrirHistogramaAcumulativo(){

	if(typeof objetosBogui[objetoActual] == 'undefined'){
		console.log("ERROR"); //TODO: Cambiar el log, por un mensaje en pantalla explicando que no se puede mostrar la opcion sin un objeto seleccionado
	}else{
		objetosBogui[objetoActual].crearHistogramaAcumulativo();
		objetosBogui[objetoActual].dialogoHistogramaAcumulativo.dialog("open");
		
	}
}

function descargar(formato){
	if(typeof objetosBogui[objetoActual] == 'undefined'){
		console.log("ERROR"); //TODO: Cambiar el log, por un mensaje en pantalla explicando que no se puede mostrar la opcion sin un objeto seleccionado
	}else{
		objetosBogui[objetoActual].descargarImagen(formato);
	}
}

function setModoImagen(modo){
	//TODO: Mostrar un mensaje al usuario de que se ha actualizado el modo
	if(typeof objetosBogui[objetoActual] == 'undefined'){
		console.log("ERROR"); //TODO: Cambiar el log, por un mensaje en pantalla explicando que no se puede mostrar la opcion sin un objeto seleccionado
	}else{
		objetosBogui[objetoActual].modo = modo;
	}
}