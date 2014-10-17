/* Libreria de tratamiento de imágenes 

Autores: Guillermo Rivero Rodríguez y Boris Ballester Hernández"

*/

var imagen;
var objetosBogui = [];
var maxWidth = 600;
var maxHeight = 600;

$(document).ready(function() {
	//canvas = document.getElementById("canvas");
	//context = canvas.getContext("2d");
	document.getElementById("fileSelector").addEventListener("change", readImage, false);
	
});


function readImage() {
    if ( this.files && this.files[0] ) {
        var FR= new FileReader();
        FR.onload = function(e) {
           imagen = new Image();
           imagen.onload = function() {
             objetosBogui.push(new Bogui(imagen, 0));
           };
    imagen.src = e.target.result;
        };       
        FR.readAsDataURL( this.files[0] );
    }
}

function Bogui(img, id) {

	this.ident = id;
	
	this.modo = "PAL";
	this.imagen = img;
	
	var dialogoAux; 

	this.reducirImagen = reducirImagen;

	this.RGBA2BW = RGBA2BW;

	dialogoAux = document.createElement("div");
	dialogoAux.setAttribute("id", "dialogo"+this.ident);
	dialogoAux.setAttribute("height", maxHeight);
	dialogoAux.setAttribute("width", maxWidth);
	document.getElementById('workspace').appendChild(dialogoAux);
	
	this.imgCanvas;
	this.ctx;
	
	this.dialogo = jQuery(dialogoAux);
	this.imgCanvas = document.createElement("canvas");
	this.imgCanvas.setAttribute("id", "canvasID");
	this.imgCanvas.setAttribute("height", this.imagen.height);
	this.imgCanvas.setAttribute("width", this.imagen.width);
	
	this.dialogo.append(this.imgCanvas);
	this.dialogo.dialog();

	this.dialogo.bind("dialogclose",function(e){
		//No puedo pasar this.ident ya que no pertenece a la 
		borrarObjetoBogui(id);
 	});

	this.ctx = this.imgCanvas.getContext('2d');
	this.ctx.drawImage(this.imagen, 0, 0);

	
	this.reducirImagen();
	this.RGBA2BW();
}

function borrarObjetoBogui(id){

console.log("Buscar el objeto con la id '" + id + "' y borrarlo.");
var i = 0;
	for(i = 0; i < objetosBogui.length; i++){
		if(objetosBogui[i].ident == id ){
			objetosBogui.splice(i, 1);
		}
	}

}


function reducirImagen(){

  var canvasCopy = document.createElement("canvas");
  var copyContext = canvasCopy.getContext("2d");

  // Create original image

  // Determine new ratio based on max size
  var ratio = 1;
  if(this.imagen.width > maxWidth)
    ratio = maxWidth / this.imagen.width;
  else if(this.imagen.height > maxHeight)
    ratio = maxHeight / this.imagen.height;

  // Draw original image in second canvas
  canvasCopy.width = this.imagen.width;
  canvasCopy.height = this.imagen.height;
  copyContext.drawImage(this.imagen, 0, 0);

  // Copy and resize second canvas to first canvas
  this.imgCanvas.width = this.imagen.width * ratio;
  this.imgCanvas.height = this.imagen.height * ratio;
  this.ctx.drawImage(canvasCopy, 0, 0, canvasCopy.width, canvasCopy.height, 0, 0, this.imgCanvas.width, this.imgCanvas.height);

}

function RGBA2BW(){

	var imageData = this.ctx.getImageData(0, 0, this.imagen.width, this.imagen.height);
   	var pixelData = imageData.data;
   	var bytesPerPixel = 4;

   	for(var y = 0; y < this.imagen.height; y++) {
      		for(var x = 0; x < this.imagen.width; x++) {
			 var startIdx = (y * bytesPerPixel * this.imagen.width) + (x * bytesPerPixel);

			 var red = pixelData[startIdx];
			 var green = pixelData[startIdx + 1];
			 var blue = pixelData[startIdx + 2];
			 //Cambiar para NTSC Y PAL Y PONER LOS VALORES DEL GUION
			 var grayScale = (red * 0.3) + (green * 0.59) + (blue * .11);  

			 pixelData[startIdx] = grayScale;
			 pixelData[startIdx + 1] = grayScale;
			 pixelData[startIdx + 2] = grayScale;
	      	}
	   }

   this.ctx.putImageData(imageData, 0, 0);


};



