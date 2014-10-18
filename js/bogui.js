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
	this.modo = "PAL";
	this.imagen = img;
	this.imgCanvas;
	this.ctx;
	this.histograma = new Array(256);
	this.histogramaAcumulativo = new Array(256);
	var dialogoAux; 
	this.dialogoHistograma;
	//METODOS
	this.reducirImagen = reducirImagen;
	this.RGBA2BW = RGBA2BW;
	this.crearHistograma = crearHistograma;
	this.mostrarHistograma = mostrarHistograma;
	/*TODO: Crear funciones para mostrar y ocultar el div de los histogramas*/

	//Crear ventana con el canvas
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
	console.log(this.histograma.length);
	this.mostrarHistograma();
}

function crearHistograma(){

	var imageData = this.ctx.getImageData(0, 0, this.imagen.width, this.imagen.height);
   	var pixelData = imageData.data;

	for(i = 0; i < this.histograma.length; i++) {
		this.histograma[i] = 0;
		this.histogramaAcumulativo[i] = 0; 
	}
	//TODO: Los histogramas se estan creando de manera incorrecta, hay que arreglarlo
	/*
   	for(j = 0; j < pixelData.length; j += 4) {
		if(pixelData[j] != 0)
		this.histograma[pixelData[j]]++; 
	}

	for(k = 1; k < this.histograma.length; k++) {
		this.histogramaAcumulativo[k] = this.histograma[k] + this.histograma[k-1]; 
	}*/
}

function mostrarHistograma(){

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
	var contenedor = jQuery(contenedorAux);
	


	//this.dialogoHistograma.append(

	contenedor.highcharts({
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
                pointPadding: 0.1,
                borderWidth: 0
            }
        },
        series: [{
            name: 'Histograma Simple',
            data: this.histograma

        },
	{
            name: 'Histograma Acumulativo',
            data: this.histogramaAcumulativo

        }]
    });
	 //APPEND
	this.dialogoHistograma.dialog();
	this.dialogoHistograma.dialog("option", "title", "Histograma: " + this.ident);
	this.dialogoHistograma.append(contenedor);
	

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



