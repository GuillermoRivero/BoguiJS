function Bogui(img, id, name) {
	//ATRIBUTOS
	this.ident = id;
	this.modo = window.modoImagen;
	this.imagen = img;
	this.formato = quitarFormato(name)[2];
	this.nombre = evitarNombresRepetidos(quitarFormato(name)[1]);
	this.imgCanvas;
	this.regCanvas;
	this.ctx;
	this.regctx;
	this.click = false;
	
	this.histograma = new Array(256);
	this.histogramaAcumulativo = new Array(256);
	this.histogramaAcumulativoNormalizado = new Array(256);
	
	this.mouseXini = 0; //Variables para funciones que requieras capturar posiciones de raton
	this.mouseYini = 0;
	this.mouseXfin = 0; //Variables para funciones que requieras capturar posiciones de raton
	this.mouseYfin = 0;
	
	//METODOS

    //Creamos dialogo
	var dialog, form,idObjeto,content;
	idObjeto = "dialogo" + this.ident;
	$("#workspace").append("<div id=\""+idObjeto+"\"></div>");	
	this.dialogo = $( "#"+idObjeto ).dialog({
		title: this.nombre,
		resizable: false
	}).on("dialogclose",function(event){			
		var exp = /dialogo(\d+)/i
		var res = exp.exec(event.target.id);
		var idActual = res[1];
		borrarObjetoBogui(idActual);
		$(this).dialog( "close" );
		$(this).remove();	
 	}).on("dialogfocus",function(event){
		var exp = /dialogo(\d+)/i
		var res = exp.exec(event.target.id);
		var idActual = res[1];
		cambiarFoco(idActual);
	});

	//Creamos el contenedor de los canvas y añadimos la imagen
	var contenido = $("<div id=\"canvasContainer"+this.ident+"\"><canvas id=\"canvas"+this.ident+"\" ></canvas><canvas id=\"canvasreg"+this.ident+"\"></canvas></div><div id=\"position"+this.ident+"\" class=\"imageInfo\"><span id=\"colorBlock"+this.ident+"\" class=\"colorBlock\"> </span><span id=\"coordinates"+this.ident+"\"></span></div>");
	//CSS
	this.dialogo.append(contenido);
	
	$("#canvas"+this.ident).addClass("capaCanvas");
	$("#canvasreg"+this.ident).addClass("capaCanvasReg");
	
	this.imgCanvas = $("#canvas"+this.ident)[0];
	this.ctx = this.imgCanvas.getContext('2d');
	
	this.regCanvas = $("#canvasreg"+this.ident)[0];
	this.regctx = this.regCanvas.getContext("2d");
		
	//Ajustar tamaño de la ventana
	var canvasContainer = $("#canvasContainer"+this.ident);
	canvasContainer.addClass("canvasContainer");
    canvasContainer.height(this.imgCanvas.height);
	canvasContainer.width(this.imgCanvas.width);	
	
	this.regCanvas.height = this.imgCanvas.height;
	this.regCanvas.width = this.imgCanvas.width ;	

	//Ajustar tamaño de la ventana
	this.dialogo.dialog("option", "width", this.imgCanvas.width + 24); 
	
	//Listeners del canvas
	$(this.regCanvas).mousedown(function(e){
		var exp = /canvasreg(\d+)/i
		var res = exp.exec(e.target.id);
		var idActual = res[1];

		switch(window.herramientaActual){
			case "roi":	
						objetosBogui[obtenerPosArray(idActual)].click = true;
						var pos = findPos(this);
				        objetosBogui[obtenerPosArray(idActual)].mouseXini = e.pageX - pos.x;        
				        objetosBogui[obtenerPosArray(idActual)].mouseYini = e.pageY - pos.y;
			break;
			case "ics":	
						objetosBogui[obtenerPosArray(idActual)].click = true;
						var pos = findPos(this);
				        objetosBogui[obtenerPosArray(idActual)].mouseXini = e.pageX - pos.x;        
				        objetosBogui[obtenerPosArray(idActual)].mouseYini = e.pageY - pos.y;
			break;
			default:
        }
	}).mouseup(function(e){
		
		var exp = /canvasreg(\d+)/i
		var res = exp.exec(e.target.id);
		var idActual = res[1];

		switch(window.herramientaActual){
			case "roi":
				objetosBogui[obtenerPosArray(idActual)].click = false;
				var pos = findPos(this);
		        objetosBogui[obtenerPosArray(idActual)].mouseXfin = e.pageX - pos.x;
		        objetosBogui[obtenerPosArray(idActual)].mouseYfin = e.pageY - pos.y;
				dibujarRegionInteres(objetosBogui[obtenerPosArray(idActual)]);
			break;
			case "ics":
				objetosBogui[obtenerPosArray(idActual)].click = false;
				var pos = findPos(this);
		        objetosBogui[obtenerPosArray(idActual)].mouseXfin = e.pageX - pos.x;
		        objetosBogui[obtenerPosArray(idActual)].mouseYfin = e.pageY - pos.y;
				dibujarLineaICS(objetosBogui[obtenerPosArray(idActual)]);
			break;
			default:
        }
	}).mousemove(function(e) {

        var pos = findPos(this);
        var x = e.pageX - pos.x;
        var y = e.pageY - pos.y;

        var exp = /canvasreg(\d+)/i
		var res = exp.exec(e.target.id);
		var idActual = res[1];

		switch(window.herramientaActual){
			case "roi":
		        if(objetosBogui[obtenerPosArray(idActual)].click == true){
		        	var estado = 0;
			        objetosBogui[obtenerPosArray(idActual)].mouseXfin = e.pageX - pos.x;
			        objetosBogui[obtenerPosArray(idActual)].mouseYfin = e.pageY - pos.y;
					dibujarRegionInteres(objetosBogui[obtenerPosArray(idActual)], estado);
				}
			break;
			case "ics":
		        if(objetosBogui[obtenerPosArray(idActual)].click == true){
		        	var estado = 0;
			        objetosBogui[obtenerPosArray(idActual)].mouseXfin = e.pageX - pos.x;
			        objetosBogui[obtenerPosArray(idActual)].mouseYfin = e.pageY - pos.y;
					dibujarLineaICS(objetosBogui[obtenerPosArray(idActual)],estado);
				}
			break;
			default:
        }

        var p = objetosBogui[obtenerPosArray(idActual)].ctx.getImageData(x, y, 1, 1).data;
        var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
        var rgb = obtenerColorDesdeCoordenadas(objetosBogui[obtenerPosArray(idActual)],x,y);
		if(x >= 0 && y >= 0){
		    $("#colorBlock"+ objetosBogui[obtenerPosArray(idActual)].ident).css("background-color",hex);
			$("#coordinates"+ objetosBogui[obtenerPosArray(idActual)].ident).html("x=" + x + " y=" + y + " HEX=" + hex + " RGB=" + rgb);
		}
                
    });

	$('.ui-dialog :button').blur();
	$("#dialogo" + this.ident).parent().css("z-index",90)
}


function actualizarAtributos(objetoBoguiActual){
	calcularHistogramaSimple(objetoBoguiActual);
	calcularHistogramaAcumulativo(objetoBoguiActual);
	calcularHistogramaAcumuladoNormalizado(objetoBoguiActual);
	
	var brightContrastValues = calcularBrilloContraste(objetoBoguiActual);
	objetoBoguiActual.brillo = brightContrastValues[0];
	objetoBoguiActual.contraste = brightContrastValues[1];

	objetoBoguiActual.entropia = calcularEntropia(objetoBoguiActual);

	var limitesColor = calcularLimitesColor(objetoBoguiActual);
	objetoBoguiActual.minGris = limitesColor[0];
	objetoBoguiActual.maxGris = limitesColor[1];
}

function actualizarCanvas(objetoBoguiActual, canvas){

	objetoBoguiActual.imgCanvas.height = canvas.height;
	objetoBoguiActual.imgCanvas.width = canvas.width;
	objetoBoguiActual.ctx = objetoBoguiActual.imgCanvas.getContext("2d");

	$("#canvas"+ objetoBoguiActual.ident).addClass("capaCanvas");

	objetoBoguiActual.regCanvas.width = canvas.width;
	objetoBoguiActual.regCanvas.height = canvas.height;
	objetoBoguiActual.regctx = objetoBoguiActual.regCanvas.getContext("2d");	

	cambiarDimensionDialog(objetoBoguiActual);
}

function cambiarDimensionDialog(objetoBoguiActual){
	var canvasContainer = $("#canvasContainer"+objetoBoguiActual.ident);
    canvasContainer.height(objetoBoguiActual.imgCanvas.height);
	canvasContainer.width(objetoBoguiActual.imgCanvas.width);	

	//Ajustar tamaño de la ventana
	objetoBoguiActual.dialogo.dialog("option", "width", objetoBoguiActual.imgCanvas.width + 24); 
}

function calcularBrilloContraste(objetoBoguiActual){
		var brillo = 0;
		var contraste = 0;
		var total = 0;
		
		//BRILLO
		for (i = 0; i < objetoBoguiActual.histograma.length; i++) {
			brillo += objetoBoguiActual.histograma[i] * i;
			total = total + objetoBoguiActual.histograma[i];
		}

		brillo = brillo/total;

		//CONTRASTE
		for (i = 0; i < objetoBoguiActual.histograma.length; i++){
			contraste += objetoBoguiActual.histograma[i] * Math.pow( (brillo-i) ,2 );
		}

		contraste = Math.sqrt(contraste/total);
		return [brillo, contraste];
}

function calcularLimitesColor(objetoBoguiActual){
	calcularHistogramaSimple(objetoBoguiActual);
	valorMinimo = 0;
	valorMaximo = 255;
	while(objetoBoguiActual.histograma[valorMinimo] == 0){
		valorMinimo++;
	}
	while(objetoBoguiActual.histograma[valorMaximo] == 0){
		valorMaximo--;
	}
	return [valorMinimo, valorMaximo];
}

function reducirImagen(objetoBoguiActual){

	// Determinar el ratio de conversion de la imagen
	var ratio = 1;
	if(objetoBoguiActual.imagen.width > window.maxWidth)
		ratio = window.maxWidth / objetoBoguiActual.imagen.width;
	else if(objetoBoguiActual.imagen.height > window.maxHeight)
		ratio = window.maxHeight / objetoBoguiActual.imagen.height;

	objetoBoguiActual.imgCanvas.height = objetoBoguiActual.imagen.height * ratio;
	objetoBoguiActual.imgCanvas.width = objetoBoguiActual.imagen.width * ratio;	
	objetoBoguiActual.regCanvas.height = objetoBoguiActual.imagen.height * ratio;
	objetoBoguiActual.regCanvas.width = objetoBoguiActual.imagen.width * ratio;	
	
	objetoBoguiActual.ctx.drawImage(objetoBoguiActual.imagen, 0, 0,objetoBoguiActual.imgCanvas.width ,objetoBoguiActual.imgCanvas.height);

	cambiarDimensionDialog(objetoBoguiActual);
	RGBA2BW(objetoBoguiActual);
}

function calcularHistogramaSimple(objetoBoguiActual){
	var imageData = objetoBoguiActual.ctx.getImageData(0, 0, objetoBoguiActual.imgCanvas.width, objetoBoguiActual.imgCanvas.height);
   	var pixelData = imageData.data;

	//Inicializar Variables
	for(i = 0; i < objetoBoguiActual.histograma.length; i++) {
		objetoBoguiActual.histograma[i] = 0;
	}
	
	//Rellenar histograma Simple
   	for(j = 0; j < pixelData.length; j += 4) {
		objetoBoguiActual.histograma[pixelData[j]]++; 
	}
}

function calcularHistogramaAcumulativo(objetoBoguiActual){
	//Inicializar Variables
	for(i = 0; i < objetoBoguiActual.histograma.length; i++) {
		objetoBoguiActual.histogramaAcumulativo[i] = 0; 
	}

	//Rellenar histograma Acumulativo
	objetoBoguiActual.histogramaAcumulativo[0] = objetoBoguiActual.histograma[0]; 
	for(k = 1; k < objetoBoguiActual.histograma.length; k++) {
		objetoBoguiActual.histogramaAcumulativo[k] = objetoBoguiActual.histograma[k] + objetoBoguiActual.histogramaAcumulativo[k-1]; 
	}
}

function calcularEntropia(objetoBoguiActual){
	var total = 0;
	var entropia = 0;
	for (i = 0; i < objetoBoguiActual.histograma.length; i++){
		total += objetoBoguiActual.histograma[i];
	}
	//console.log(Math.log(0.5)/Math.LN2);

	for (i = 0; i < objetoBoguiActual.histograma.length; i++){

		probabilidad = objetoBoguiActual.histograma[i] / total;

		if(probabilidad != 0){
			entropia += probabilidad * (Math.log(probabilidad)/Math.LN2); //TODO: Comprobar logaritmo en base 2 Probar binarizando

		}
	}		
	return -entropia;
}

function evitarNombresRepetidos(nombre){

	var exp = /(.*)\(.+\)/g
	var nombreAux = nombre;
	
	if(nombre.match(exp)){
		var res = exp.exec(nombre);
		nombreAux = res[1];
	}
	var nuevoNombre = nombreAux;
	var repetido = true;

	var numeroRepeticiones = 1;
	while(repetido == true){
		repetido = false;
		for(i = 0; i < objetosBogui.length; i++){
			if(objetosBogui[i].nombre == nuevoNombre){
				repetido = true;
				nuevoNombre = nombreAux +"("+numeroRepeticiones+")"
				numeroRepeticiones++;
			}
		}
	}
	return nuevoNombre;
}

function quitarFormato(cadena){
	var exp = /(.*)(\..*)/g
	var res = exp.exec(cadena);
	if(res == null){
		return cadena;
	}
	else{
		return res;	
	}
}

//Metodos para la posicion, color y nivel de intesidad
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

function obtenerColorDesdeCoordenadas(objetoBoguiActual, posx, posy){

	var imageData = objetoBoguiActual.ctx.getImageData(0, 0, objetoBoguiActual.imagen.width, objetoBoguiActual.imagen.height);
	var pixelData = imageData.data;
	var bytesPerPixel = 4;
	var startIdx = (posy * bytesPerPixel * objetoBoguiActual.imagen.width) + (posx * bytesPerPixel);

	return [pixelData[startIdx], pixelData[startIdx + 1], pixelData[startIdx + 2]];
}

function RGBA2BW(objetoBoguiActual){

	//Obtener la matriz de datos.
	var imageData = objetoBoguiActual.ctx.getImageData(0, 0, objetoBoguiActual.imagen.width, objetoBoguiActual.imagen.height);
   	var pixelData = imageData.data;
   	var bytesPerPixel = 4;

	//Modificar los valores RGB para pasarlos a B&W
   	for(var y = 0; y < objetoBoguiActual.imagen.height; y++) {
      		for(var x = 0; x < objetoBoguiActual.imagen.width; x++) {
			 var startIdx = (y * bytesPerPixel * objetoBoguiActual.imagen.width) + (x * bytesPerPixel);

			 var red = pixelData[startIdx];
			 var green = pixelData[startIdx + 1];
			 var blue = pixelData[startIdx + 2];
			 //Cambiar para NTSC Y PAL Y PONER LOS VALORES DEL GUION
			
			 var grayScale;

			 switch(objetoBoguiActual.modo){
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
	objetoBoguiActual.ctx.putImageData(imageData, 0, 0);

}

function aplicarFuncionTransferencia(objetoBoguiActual, funcionTransferencia){

	var imageData = objetoBoguiActual.ctx.getImageData(0, 0, objetoBoguiActual.imgCanvas.width, objetoBoguiActual.imgCanvas.height);
	var pixelData = imageData.data;
	var bytesPerPixel = 4;

	for(var y = 0; y < objetoBoguiActual.imgCanvas.height; y++) { 
		for(var x = 0; x < objetoBoguiActual.imgCanvas.width; x++) {
			var startIdx = (y * bytesPerPixel * objetoBoguiActual.imgCanvas.width) + (x * bytesPerPixel);

			pixelData[startIdx] = funcionTransferencia[pixelData[startIdx]];
			pixelData[startIdx+1] = funcionTransferencia[pixelData[startIdx+1]];
			pixelData[startIdx+2] = funcionTransferencia[pixelData[startIdx+2]];
		}
	}

	nuevoObjeto = createBoguiFromCanvas(objetoBoguiActual, objetoBoguiActual.imgCanvas, imageData);
	addBogui(nuevoObjeto);
}

function createBoguiFromCanvas(objetoBoguiActual, canvas, imageData){
	objetoNuevo = new Bogui(objetoBoguiActual.imagen, numeroObjetos, objetoBoguiActual.nombre+objetoBoguiActual.formato);
    actualizarCanvas(objetoNuevo, canvas);
    objetoNuevo.ctx.putImageData(imageData,0,0);
    actualizarAtributos(objetoNuevo);
    cambiarFoco(numeroObjetos);
    numeroObjetos++;
    return objetoNuevo;
}


function addBogui(objetoBoguiActual){
	objetosBogui.push(objetoBoguiActual);	
	cambiarFoco(numeroObjetos);
	numeroObjetos++;
}