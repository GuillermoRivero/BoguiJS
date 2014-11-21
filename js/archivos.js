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

function abrirImagenURL(){ //TODO: Arreglar cross-origin
	var dialog, form,content;

	$("body").append("<div id=\"dialog-message\"></div>");
	dialog = $( "#dialog-message" ).dialog({
		title: "Abrir imagen desde URL",
		modal: true,
		buttons: {
			Ok:function(ui) {
				var URL = $("#enlaceImagen").val();	
				var img = $('<img  />').load(function () {
		        	objetosBogui.push(new Bogui(img, numeroObjetos, URL));
			        cambiarFoco(numeroObjetos);
			        numeroObjetos++;
			    }).error(function () {
			        errorDialog("Imagen no valida");
			    }).attr('src', URL);

				$(this).dialog( "close" );
				$(this).remove();
			}
		},
		dialogClass: "no-close",
		resizable: false 		
	}).append("<table><tbody><tr><td><label>URL:</label></td><td><input id=\"enlaceImagen\" type=\"text\"></td></tr>");
	 
	 
}

function abrirImagenWebCam(){
//Este objeto guardará algunos datos sobre la cámara
	var dialog, form,content, contexto ;
	window.URL = window.URL || window.webkitURL;
	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia ||
	function() {
	    alert('Su navegador no soporta navigator.getUserMedia().');
	};
	var checkFoto = false;

	//Este objeto guardará algunos datos sobre la cámara
	window.datosVideo = {
	    'StreamVideo': null,
	    'url': null
	}
	navigator.getUserMedia({
				    'audio': false,
				    'video': true
				}, function(streamVideo) {
				    datosVideo.StreamVideo = streamVideo;
				    datosVideo.url = window.URL.createObjectURL(streamVideo);
				    $('#camara').attr('src', datosVideo.url);

				}, function() {
				    alert('No fue posible obtener acceso a la cámara.');
				});


	$("body").append("<div id=\"dialog-webcam\"></div>");
	dialog = $( "#dialog-webcam" ).dialog({
		title: "Abrir imagen desde URL",
		height: 360,
		width: 700,
		modal: true,
		buttons: {

			Foto:function(ui) {

				var camara, foto, w, h;

			    camara = $('#camara');
			    foto = $('#foto');
			    w = camara.width();
			    h = camara.height();
			    foto.attr({
			        'width': w,
			        'height': h
			    });

			    console.log(camara);

			    contexto = foto[0].getContext('2d');
			    contexto.drawImage(camara[0], 0, 0, w, h);
			    checkFoto = true;
				
			},

			Guardar:function(ui) {

				if(checkFoto == true){
					var canvas = $('#foto')[0];
					var dataURL = canvas.toDataURL();
				    var image  = new Image();
			        image.src    = dataURL;            // url.createObjectURL(file);
			        image.onload = function() {
			                objetosBogui.push(new Bogui(image, numeroObjetos, "webCam.png"));
			                cambiarFoco(numeroObjetos);
			                numeroObjetos++;
			        };

			        image.onerror= function() {
			            alert('Invalid file type: '+ file.type);
			        };  
							  
					$(this).dialog( "close" );
					$(this).remove();
				}else{
					errorDialog("Debe sacar una foto antes de guardarla");
				}
			}
		},
		resizable: false 		
		}).append("<div class=\"contenedor\"><video id=\"camara\" autoplay controls></video><canvas id=\"foto\" ></canvas></div>").on("dialogclose",function(e){			
			$(this).dialog( "close" );
			$(this).remove();	
		});

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