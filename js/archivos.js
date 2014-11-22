$(document).ready(function() {
	addFileSelectorOnChange();
});

function addFileSelectorOnChange(){
	$("#fileSelector").change(function (e) {
		if(this.disabled){
			return alert('File upload not supported!');
		} 
		var F = this.files;
    	if(F && F[0]){
			for(var i=0; i<F.length; i++){
				readImage( F[i] );
			}
			clearFileInput();
		}
	});
}

function clearFileInput(){
        var oldInput = document.getElementById("fileSelector");
 
        var newInput = document.createElement("input");
 
        newInput.type = "file";
        newInput.id = oldInput.id;
        newInput.style.cssText = oldInput.style.cssText;
        oldInput.parentNode.replaceChild(newInput, oldInput);
        addFileSelectorOnChange();
}

function readImage(file) {
  
    var reader = new FileReader();
    var image  = new Image();
  
    reader.readAsDataURL(file);  
    reader.onload = function(_file) {
        image.src    = _file.target.result;              // url.createObjectURL(file);
        image.onload = function() {
                objetosBogui.push(new Bogui(image, numeroObjetos, file.name));
                cambiarFoco(numeroObjetos);
                numeroObjetos++;
        };
        image.onerror= function() {
            alert('Invalid file type: '+ file.type);
        };      
    };    
}

function descargarImagen(objetoBoguiActual,nombre,formato){

	var dataUrl;
	var link = document.createElement('a');
   	
	switch(formato){
		case "PNG":
			dataUrl = objetoBoguiActual.imgCanvas.toDataURL('image/png', 1); // obtenemos la imagen como png
			dataUrl = dataUrl.replace("image/png",'image/octet-stream'); // sustituimos el tipo por octet
			link.download = nombre + ".png";
			break;
		case "JPEG":
			dataUrl = objetoBoguiActual.imgCanvas.toDataURL('image/jpeg', 1);
			dataUrl = dataUrl.replace("image/jpeg",'image/octet-stream'); // sustituimos el tipo por octet
			link.download = nombre + ".jpeg";
			break;
		case "WEBP":
			dataUrl = objetoBoguiActual.imgCanvas.toDataURL('image/webp', 1);
			dataUrl = dataUrl.replace("image/webp",'image/octet-stream'); // sustituimos el tipo por octet
			link.download = nombre + ".webp";
			break;
	}
	link.href = dataUrl;
   	link.click();
}