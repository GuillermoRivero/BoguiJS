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
var output = [];
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

$("#ajusteBrilloContraste").click(function() {
		var dialog, form;
		
		$("body").append("<div id=\"dialog\"></div>");
		dialog = $( "#dialog" ).dialog({
		  title: "Brillo:",
		  height: 250,
		  width: 350,
		  modal: true,
		  buttons: {
			Ok:function() {
			  //EJECUTAR BRILLO Y CONTRASTE
			  console.log(objetosBogui[objetoActual].calcularBrilloContraste());
			  dialog.dialog( "close" );
			  dialog.remove();
			},
			Cancel: function() {
			  dialog.dialog( "close" );
			  dialog.remove();
			}
		  }
		});
		
		dialog.append("<form><fieldset><p><label for=\"brilloSpinner\">Brillo:</label><input id=\"brilloSpinner\" name=\"brightValue\" type=\"text\"></p><div id=\"sliderBrillo\"></div><p><label for=\"contrasteSpinner\">Contraste:</label><input id=\"contrasteSpinner\" name=\"contrastValue\" type=\"text\"></p><div id=\"sliderContraste\"></div></fieldset></form>");;

		form = dialog.find( "form" ).on( "submit", function( event ) {
		  event.preventDefault();
		});		
		
		var brilloSpinner = $( "#brilloSpinner" ).spinner({
		  min: -255,
		  max: 255,
		  step: 1,
		  start: 0,
		  spin: (function(event, ui ){
			$( "#sliderBrillo" ).slider( "value", ui.value );
			})
		});
			
		$( "#sliderBrillo" ).slider({
		  range: "min",
		  value: 0,
		  min: -255,
		  autofocus: "autofocus",
		  max: 255,
		  slide: function( event, ui ) {
			brilloSpinner.spinner( "value", ui.value );
		  }
		});
		brilloSpinner.spinner( "value", $( "#sliderBrillo" ).slider( "value" ));

		var contrasteSpinner = $( "#contrasteSpinner" ).spinner({
		  min: -255,
		  max: 255,
		  step: 1,
		  start: 0,
		  spin: (function(event, ui ){
			$( "#sliderContraste" ).slider( "value", ui.value );
			})
		});
			
		$( "#sliderContraste" ).slider({
		  range: "min",
		  value: 0,
		  min: -255,
		  autofocus: "autofocus",
		  max: 255,
		  slide: function( event, ui ) {
			contrasteSpinner.spinner( "value", ui.value );
		  }
		});
		contrasteSpinner.spinner( "value", $( "#sliderContraste" ).slider( "value" ));
		
		dialog.dialog();
	});		
	
	$("#instaDownloadButton").click(function() {
		if(typeof objetosBogui[objetoActual] == 'undefined'){
			console.log("ERROR"); //TODO: Cambiar el log, por un mensaje en pantalla explicando que no se puede mostrar la opcion sin un objeto seleccionado
		}else{
			objetosBogui[objetoActual].descargarImagen("foto" + objetosBogui[objetoActual].ident, window.formatoDescarga);
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
	this.regCanvas;
	this.ctx;
	this.regctx;
	this.histograma = new Array(256);
	this.histogramaAcumulativo = new Array(256);
	this.dialogoHistograma;
	this.contenedorHistograma;
	this.dialogoHistogramaAcumulativo;
	this.contenedorHistogramaAcumulativo;
	this.mouseXini = 0; //Variables para funciones que requieras capturar posiciones de raton
	this.mouseYini = 0;
	this.mouseXfin = 0; //Variables para funciones que requieras capturar posiciones de raton
	this.mouseYfin = 0;
	
	//METODOS
	this.dibujarRegionInteres = dibujarRegionInteres;
	this.calcularBrilloContraste = calcularBrilloContraste;
	this.reducirImagen = reducirImagen;
	this.RGBA2BW = RGBA2BW;
	this.crearHistogramaSimple = crearHistogramaSimple;
	this.crearHistogramaAcumulativo = crearHistogramaAcumulativo;
	this.descargarImagen = descargarImagen;
	
	this.imgCanvas = document.createElement("canvas");
	this.imgCanvas.setAttribute("id", "canvas"+this.ident);
	this.imgCanvas.setAttribute("height", this.imagen.height);
	this.imgCanvas.setAttribute("width", this.imagen.width);
	this.imgCanvas.setAttribute("class", "capaCanvas");

	
	//Crear ventana con el canvas
	this.dialogo = $('<div/>', {
	    id: "dialogo" + this.ident,
		title: "Imagen: " + this.ident,
	   	height: maxHeight,
		width: maxWidth
	}).appendTo('#workspace');

	var canvasContainer = $("<div id=\"canvasContainer"+this.ident+"\" class=\"canvasContainer\"></div>");
	canvasContainer.append(this.imgCanvas);

	this.dialogo.dialog({ resizable: false });
	
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



	this.regCanvas = document.createElement("canvas");
	this.regCanvas.setAttribute("id", "canvasreg"+this.ident);
	this.regCanvas.setAttribute("height", this.imgCanvas.height);
	this.regCanvas.setAttribute("width", this.imgCanvas.width);
	this.regCanvas.setAttribute("z-index", 1);
	this.regCanvas.setAttribute("class", "capaCanvas");

	
	canvasContainer.append(this.regCanvas);
	canvasContainer.append("<div style=\"clear:both\"></div>");
	canvasContainer.css("height",this.imgCanvas.height+"px");
	canvasContainer.css("width",this.imgCanvas.width+"px");
	
	$('.ui-dialog :button').blur();//REMOVE FOCUS
	
	this.dialogo.append(canvasContainer);
	this.dialogo.append("<div id=\"position"+this.ident+"\"><span id=\"coordinates"+this.ident+"\">x= - y= - value= - </span></div>");
	//Ajustar tamaño de la ventana
	this.dialogo.dialog("option", "width", this.imgCanvas.width + 24); 
	this.dialogo.css("overflow","hidden");

	
	//Listeners del canvas
	$(this.regCanvas).mousedown(function(e){
		var exp = /canvasreg(\d+)/i
		var res = exp.exec(e.target.id);
		var idActual = res[1];
		var pos = findPos(this);
                objetosBogui[obtenerPosArray(idActual)].mouseXini = e.pageX - pos.x;
                objetosBogui[obtenerPosArray(idActual)].mouseYini = e.pageY - pos.y;
	});

	$(this.regCanvas).mouseup(function(e){
		var exp = /canvasreg(\d+)/i
		var res = exp.exec(e.target.id);
		var idActual = res[1];

		var pos = findPos(this);
                objetosBogui[obtenerPosArray(idActual)].mouseXfin = e.pageX - pos.x;
                objetosBogui[obtenerPosArray(idActual)].mouseYfin = e.pageY - pos.y;
		objetosBogui[obtenerPosArray(idActual)].dibujarRegionInteres();
	});

	$(this.regCanvas).mousemove(function(e) {
                var pos = findPos(this);
                var x = e.pageX - pos.x;
                var y = e.pageY - pos.y;

		var exp = /canvasreg(\d+)/i
		var res = exp.exec(e.target.id);
		var idActual = res[1];

                var p = objetosBogui[obtenerPosArray(idActual)].ctx.getImageData(x, y, 1, 1).data;
                var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
				if(x >= 0 && y >= 0){
					$("#coordinates"+ objetosBogui[obtenerPosArray(idActual)].ident).html("x=" + x + " y=" + y + " value=" + hex);
				}
                

        });		
}

function dibujarRegionInteres(){

	this.regCanvas.width = this.regCanvas.width;
	this.regctx = this.regCanvas.getContext("2d");

	this.regctx.rect(this.mouseXini, this.mouseYini, this.mouseXfin - this.mouseXini , this.mouseYfin - this.mouseYini);
	this.regctx.stroke();
}

function findPos(obj) {
    var curleft = 0, curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return { x: curleft, y: curtop };
    }
    return undefined;
}
 
function rgbToHex(r, g, b){
        if (r > 255 || g > 255 || b > 255)
                throw "Invalid color component";
        return ((r << 16) | (g << 8) | b).toString(16);
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

function descargarImagen(nombreArchivo, formato){

	var dataUrl;
	var link = document.createElement('a');
   	
	switch(formato){
	case "png":
		dataUrl = this.imgCanvas.toDataURL('image/png', 1); // obtenemos la imagen como png
		dataUrl = dataUrl.replace("image/png",'image/octet-stream'); // sustituimos el tipo por octet
		link.download = nombreArchivo + ".png";
		break;
	case "jpeg":
		dataUrl = this.imgCanvas.toDataURL('image/jpeg', 1);
		dataUrl = dataUrl.replace("image/jpeg",'image/octet-stream'); // sustituimos el tipo por octet
		link.download = nombreArchivo + ".jpeg";
		break;
	case "webp":
		dataUrl = this.imgCanvas.toDataURL('image/webp', 1);
		dataUrl = dataUrl.replace("image/webp",'image/octet-stream'); // sustituimos el tipo por octet
		link.download = nombreArchivo + ".webp";
		break;
	default:
		dataUrl = this.imgCanvas.toDataURL();
		dataUrl = dataUrl.replace("image/png",'image/octet-stream'); // sustituimos el tipo por octet
		link.download = nombreArchivo + ".png";
	}
	link.href = dataUrl;
   	link.click();
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
	this.contenedorHistograma.attr("autofocus", "autofocus");
	
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
	this.contenedorHistogramaAcumulativo.attr("autofocus", "autofocus");
	
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
		objetoActual = 0;
	}else{
		objetoActual = null;
	}
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

}


function recortar(){

	var canvasCopy = document.createElement("canvas");
	var copyContext = canvasCopy.getContext("2d");

	var imageData = objetosBogui[obtenerPosArray(objetoActual)].ctx.getImageData( objetosBogui[obtenerPosArray(objetoActual)].mouseXini,  objetosBogui[obtenerPosArray(objetoActual)].mouseYini,  objetosBogui[obtenerPosArray(objetoActual)].mouseXfin -  objetosBogui[obtenerPosArray(objetoActual)].mouseXini ,  objetosBogui[obtenerPosArray(objetoActual)].mouseYfin -  objetosBogui[obtenerPosArray(objetoActual)].mouseYini);

	canvasCopy.width = objetosBogui[obtenerPosArray(objetoActual)].mouseXfin -  objetosBogui[obtenerPosArray(objetoActual)].mouseXini;
	canvasCopy.height = objetosBogui[obtenerPosArray(objetoActual)].mouseYfin -  objetosBogui[obtenerPosArray(objetoActual)].mouseYini;

	copyContext.putImageData(imageData, 0,0);

	var savedData = new Image();
	savedData.src = canvasCopy.toDataURL("image/png", 1);
	//Cargar la matriz de datos en el canvas
	objetosBogui.push(new Bogui(savedData, numeroObjetos));
	cambiarFoco(numeroObjetos);
	numeroObjetos++;
}




function calcularBrilloContraste(){
	this.crearHistogramaSimple();
	var brillo = 0;
	var contraste = 0;
	var total = 0;
	
	//BRILLO
	for (i = 0; i < this.histograma.length; i++) {
		brillo += this.histograma[i] * i;
		total = total + this.histograma[i];
	}

	brillo = brillo/total;

	//CONTRASTE
	for (i = 0; i < this.histograma.length; i++){
		contraste += this.histograma[i] * Math.pow( (brillo-i) ,2 );
	}

	contraste = Math.sqrt(contraste/total);

	return [brillo, contraste];
}

function cambiarBrilloContraste(nuevoBrillo, nuevoContraste){

	var imageData = objetosBogui[objetoActual].ctx.getImageData(0, 0, objetosBogui[objetoActual].imagen.width, objetosBogui[objetoActual].imagen.height);
	var pixelData = imageData.data;
	var bytesPerPixel = 4;

	var brillo, contraste = objetosBogui[objetoActual].calcularBrilloContraste();
		   // Int32[] byc = brightnessAndContrast(Image);
		   // Bitmap result = new Bitmap(Image.Width, Image.Height);
	var a, b;
	var funcionTransferencia = new Array(256);

	a = nuevoContraste / contraste; 
	b = nuevoBrillo-a * brillo; 
	for (i = 0; i < funcionTransferencia.length; i++) {
		funcionTransferencia[i] = (a * i + b);
		if (funcionTransferencia[i] > 255)
		    funcionTransferencia[i] = 255;
		if (funcionTransferencia[i] < 0)
		    funcionTransferencia[i] = 0;
	}

	for(var y = 0; y < objetosBogui[objetoActual].imagen.height; y++) {
		for(var x = 0; x < objetosBogui[objetoActual].imagen.width; x++) {
			var startIdx = (y * bytesPerPixel * objetosBogui[objetoActual].imagen.width) + (x * bytesPerPixel);

			pixelData[startIdx] = funcionTransferencia[pixelData[startIdx]];
			pixelData[startIdx+1] = funcionTransferencia[pixelData[startIdx+1]];
			pixelData[startIdx+2] = funcionTransferencia[pixelData[startIdx+2]];
		}
	}

	objetosBogui.push(new Bogui(objetosBogui[objetoActual].imagen, numeroObjetos));
	objetosBogui[obtenerPosArray(numeroObjetos)].imgCanvas = objetosBogui[objetoActual].imgCanvas;
	objetosBogui[obtenerPosArray(numeroObjetos)].ctx.putImageData(imageData, 0, 0);
	cambiarFoco(numeroObjetos);
	numeroObjetos++;          
}


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
		objetosBogui[objetoActual].descargarImagen("foto" + objetosBogui[objetoActual].ident, formato);
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
