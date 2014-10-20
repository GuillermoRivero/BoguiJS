/* Libreria de tratamiento de imágenes 

Autores: Guillermo Rivero Rodríguez y Boris Ballester Hernández"

*/

var imagen;
var objetosBogui = [];
var maxWidth = 600;
var maxHeight = 600;

$(document).ready(function() {
	document.getElementById("fileSelector").addEventListener("change", readImage, false);
});


function readImage() {
    if ( this.files && this.files[0] ) {
        var FR= new FileReader();
        FR.onload = function(e) {
		imagen = new Image();   
	    	imagen.src = e.target.result;
		console.log(e.target.result);
		imagen.onload = function() {
		     objetosBogui.push(new Bogui(imagen, 0));
		   };
        };       
        FR.readAsDataURL( this.files[0] );
    }
}

function Bogui(img, id) {

	//ATRIBUTOS
	this.ident = id;
	this.modo = "NTSC";
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
	this.reducirImagen = reducirImagen;
	this.RGBA2BW = RGBA2BW;
	this.crearHistograma = crearHistograma;
	this.descargarImagen = descargarImagen;

	//Crear ventana con el canvas
	var dialogoAux; 
	dialogoAux = document.createElement("div");
	dialogoAux.setAttribute("id", "dialogo"+ this.ident);
	dialogoAux.setAttribute("height", maxHeight);
	dialogoAux.setAttribute("width", maxWidth);
	document.getElementById('workspace').appendChild(dialogoAux);
	this.dialogo = jQuery(dialogoAux);
	this.imgCanvas = document.createElement("canvas");
	this.imgCanvas.setAttribute("id", "canvasID");
	this.imgCanvas.setAttribute("height", this.imagen.height);
	this.imgCanvas.setAttribute("width", this.imagen.width);
	this.dialogo.append(this.imgCanvas);
	this.dialogo.dialog();
	this.dialogo.dialog("option", "title", "Imagen: " + this.ident);
	//LLamar a la funcion que destruye el objeto al cerrar la ventana
	this.dialogo.bind("dialogclose",function(e){
		borrarObjetoBogui(id);
 	});

	//Dibujar imagen en el canvas
	this.ctx = this.imgCanvas.getContext('2d');
	this.ctx.drawImage(this.imagen, 0, 0);

	//Reducir imagen y ponerla en blanco y negro
	this.reducirImagen();
	this.RGBA2BW();
	//Ajustar tamaño de la ventana
	this.dialogo.dialog("option", "width", this.imgCanvas.width+80);
	this.dialogo.dialog("option", "height", this.imgCanvas.height+70);
	this.crearHistograma();
		
}

function descargarImagen(formato){

	var dataUrl;

	switch(formato){
	case "png":
		dataUrl = this.imgCanvas.toDataURL('image/png', 1); // obtenemos la imagen como png
		dataUrl=dataUrl.replace("image/png",'image/octet-stream'); // sustituimos el tipo por octet
		break;
	case "jpeg":
		dataUrl = this.imgCanvas.toDataURL('image/jpeg', 1);
		//dataUrl=dataUrl.replace("image/jpeg",'image/octet-stream'); // sustituimos el tipo por octet
		break;
	case "webp":
		dataUrl = this.imgCanvas.toDataURL('image/webp', 1);
		break;
	default:
		dataUrl = this.imgCanvas.toDataURL();
		dataUrl=dataUrl.replace("image/png",'image/octet-stream'); // sustituimos el tipo por octet
	}

	document.location.href = dataUrl; // para forzar al navegador a descargarlo
}

function crearHistograma(){

	var imageData = this.ctx.getImageData(0, 0, this.imgCanvas.width, this.imgCanvas.height);
   	var pixelData = imageData.data;

	//Inicializar Variables
	for(i = 0; i < this.histograma.length; i++) {
		this.histograma[i] = 0;
		this.histogramaAcumulativo[i] = 0; 
	}
	
	//Rellenar histograma Simple
   	for(j = 0; j < pixelData.length; j += 4) {
		this.histograma[pixelData[j]]++; 
	}
	//Rellenar histograma Acumulativo
	this.histogramaAcumulativo[0] = this.histograma[0]; 
	for(k = 1; k < this.histograma.length; k++) {
		this.histogramaAcumulativo[k] = this.histograma[k] + this.histogramaAcumulativo[k-1]; 
	}

	//Histograma Acumulativo
	var dialogoAuxAcu;
	dialogoAuxAcu = document.createElement("div");
	dialogoAuxAcu.setAttribute("id", "dialogo"+ this.ident);
	dialogoAuxAcu.setAttribute("height", maxHeight);
	dialogoAuxAcu.setAttribute("width", maxWidth);
	document.getElementById('workspace').appendChild(dialogoAuxAcu);
	this.dialogoHistogramaAcumulativo = jQuery(dialogoAuxAcu);
	
	var contenedorAuxAcu = document.createElement('div');
	contenedorAuxAcu.setAttribute("height", maxHeight);
	contenedorAuxAcu.setAttribute("width", maxWidth);
	this.contenedorHistogramaAcumulativo = jQuery(contenedorAuxAcu);
	
	this.contenedorHistogramaAcumulativo.highcharts({
        chart: {
            type: 'column'
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
            data: this.histogramaAcumulativo

        }]
    });
	 //APPEND
	this.dialogoHistogramaAcumulativo.dialog();
	this.dialogoHistogramaAcumulativo.dialog("option", "title", "Histograma: " + this.ident);
	this.dialogoHistogramaAcumulativo.append(this.contenedorHistogramaAcumulativo);

	//Histograma Simple

	var dialogoAux;
	dialogoAux = document.createElement("div");
	dialogoAux.setAttribute("id", "dialogo"+ this.ident);
	dialogoAux.setAttribute("height", maxHeight);
	dialogoAux.setAttribute("width", maxWidth);
	document.getElementById('workspace').appendChild(dialogoAux);
	this.dialogoHistograma = jQuery(dialogoAux);
	
	var contenedorAux = document.createElement('div');
	contenedorAux.setAttribute("height", maxHeight);
	contenedorAux.setAttribute("width", maxWidth);
	this.contenedorHistograma = jQuery(contenedorAux);
	
	this.contenedorHistograma.highcharts({
        chart: {
            type: 'column'
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
            data: this.histograma

        }]
    });
	 //APPEND
	this.dialogoHistograma.dialog();
	this.dialogoHistograma.dialog("option", "title", "Histograma: " + this.ident);
	this.dialogoHistograma.append(this.contenedorHistograma);

	/*
	this.dialogoHistograma.bind( "dialogresizestop", function( event, ui ) {
									console.log("CAMBIAR TAMAÑO");
									this.contenedorHistograma.setOptions({
														    chart: {
															width: this.dialogoHistograma.width,
															height: this.dialogoHistograma.height
														    }
														});
									} );
	*/

	//Se cierran los histogramas ya que no deben abrirse hasta que el usuario los invoque.
	this.dialogoHistograma.dialog( "close" );
	this.dialogoHistogramaAcumulativo.dialog( "close" );
}

function borrarObjetoBogui(id){
	var i = 0;
	for(i = 0; i < objetosBogui.length; i++){
		if(objetosBogui[i].ident == id ){
			objetosBogui.splice(i, 1);
		}
	}
}

function reducirImagen(){

	//Hacer un nuevo canvas
	var canvasCopy = document.createElement("canvas");
	var copyContext = canvasCopy.getContext("2d");

	// Determinar el ratio de conversion de la imagen
	var ratio = 1;
	if(this.imagen.width > maxWidth)
		ratio = maxWidth / this.imagen.width;
	else if(this.imagen.height > maxHeight)
		ratio = maxHeight / this.imagen.height;

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



