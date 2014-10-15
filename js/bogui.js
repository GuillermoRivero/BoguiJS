/* Libreria de tratamiento de imágenes 

Autores: Guillermo Rivero Rodríguez y Boris Ballester Hernández"

*/

var img;
var canvas;
var context;

$(document).ready(function() {
	canvas = document.getElementById("canvas");
	context = canvas.getContext("2d");
	document.getElementById("fileSelector").addEventListener("change", readImage, false);
});


function readImage() {
    if ( this.files && this.files[0] ) {
        var FR= new FileReader();
        FR.onload = function(e) {
           img = new Image();
           img.onload = function() {
             context.drawImage(img, 0, 0);
           };
    img.src = e.target.result;
        };       
        FR.readAsDataURL( this.files[0] );
    }
}




