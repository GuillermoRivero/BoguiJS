/* Libreria de tratamiento de imágenes 

Autores: Guillermo Rivero Rodríguez y Boris Ballester Hernández"

*/

var imagen;
var objetosBogui = [];

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
	this.RGBA2BW = RGBA2BW;

	dialogoAux = document.createElement("div");
	dialogoAux.setAttribute("id", "dialogo"+this.ident);
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



