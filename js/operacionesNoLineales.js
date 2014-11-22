//Imagen diferencia
function imagenDiferencia(objetoBoguiActual, objetoBoguiResta){
	var imageData1 = objetoBoguiActual.ctx.getImageData(0, 0, objetoBoguiActual.imgCanvas.width, objetoBoguiActual.imgCanvas.height);
	var pixelData1 = imageData1.data;
	var bytesPerPixel = 4;

	//Comprobar que objetoBoguiResta es menor que objetoBoguiActual
	var imageData2 = objetoBoguiResta.ctx.getImageData(0, 0, objetoBoguiResta.imgCanvas.width, objetoBoguiResta.imgCanvas.height);
	var pixelData2 = imageData2.data;

	for(var y = 0; y < objetoBoguiActual.imgCanvas.height; y++) { 
		for(var x = 0; x < objetoBoguiActual.imgCanvas.width; x++) {
			var startIdx = (y * bytesPerPixel * objetoBoguiActual.imgCanvas.width) + (x * bytesPerPixel);
			pixelData1[startIdx] = Math.abs(pixelData1[startIdx] - pixelData2[startIdx]);
			pixelData1[startIdx+1] = Math.abs(pixelData1[startIdx+1] - pixelData2[startIdx+2]);
			pixelData1[startIdx+2] = Math.abs(pixelData1[startIdx+2] - pixelData2[startIdx+2]);
		}
	}

	objetosBogui.push(new Bogui(objetoBoguiActual.imagen, numeroObjetos,objetoBoguiActual.nombre+objetoBoguiActual.formato));
	objetosBogui[obtenerPosArray(numeroObjetos)].imgCanvas = objetoBoguiActual.imgCanvas;
	objetosBogui[obtenerPosArray( numeroObjetos)].ctx.putImageData(imageData1, 0, 0);
	cambiarFoco(numeroObjetos);
	numeroObjetos++;

}

//Mapa de cambios
function mapaCambios(objetoBoguiActual, objetoBoguiResta, umbral){

	var imageData1 = objetoBoguiActual.ctx.getImageData(0, 0, objetoBoguiActual.imgCanvas.width, objetoBoguiActual.imgCanvas.height);
	var pixelData1 = imageData1.data;
	var bytesPerPixel = 4;
	
	var imageData2 = objetoBoguiResta.ctx.getImageData(0, 0, objetoBoguiResta.imgCanvas.width, objetoBoguiResta.imgCanvas.height);
	var pixelData2 = imageData2.data;
	
	for(var y = 0; y < objetoBoguiActual.imgCanvas.height; y++) { 
		for(var x = 0; x < objetoBoguiActual.imgCanvas.width; x++) {
			var startIdx = (y * bytesPerPixel * objetoBoguiActual.imgCanvas.width) + (x * bytesPerPixel);
			
			if(Math.abs(pixelData1[startIdx] - pixelData2[startIdx]) < umbral){
				pixelData1[startIdx] = pixelData1[startIdx];
				pixelData1[startIdx+1] = pixelData1[startIdx+1];
				pixelData1[startIdx+2] = pixelData1[startIdx+2];
			}else{
				//SE PONEN LOS PIXELES EN ROJO
				pixelData1[startIdx] = 255;
				pixelData1[startIdx+1] = 0;
				pixelData1[startIdx+2] = 0;
				//pixelData1[startIdx+3] = 100; //TODO: Mala visibilidad, cambiar a un color
			}
		}
	}
	
	objetosBogui.push(new Bogui(objetoBoguiActual.imagen, numeroObjetos,objetoBoguiActual.nombre+objetoBoguiActual.formato));
	objetosBogui[obtenerPosArray(numeroObjetos)].imgCanvas = objetoBoguiActual.imgCanvas;
	objetosBogui[obtenerPosArray( numeroObjetos)].ctx.putImageData(imageData1, 0, 0);
	cambiarFoco(numeroObjetos);
	numeroObjetos++;
	
}

//Especificar histograma
function especificarHistograma(objetoBoguiActual, objetoBoguiOrigen){

	var indiceFuente = 0;
	var indiceDestino = 0;
	var funcionTransferencia = new Array(256);

	histogramaOrigenAcumuladoNormalizadoFuente = calcularHistogramaAcumuladoNormalizado(objetoBoguiActual);
	histogramaOrigenAcumuladoNormalizadoDestino = calcularHistogramaAcumuladoNormalizado(objetoBoguiOrigen);

	while(indiceFuente < funcionTransferencia.length){
		if(histogramaOrigenAcumuladoNormalizadoDestino[indiceDestino] > histogramaOrigenAcumuladoNormalizadoFuente[indiceFuente]){
			funcionTransferencia[indiceFuente] = indiceDestino;
			indiceFuente++;
		}else{
			funcionTransferencia[indiceFuente] = funcionTransferencia[indiceFuente-1];
			indiceDestino++;
		}
		if(indiceDestino == 255){
			indiceFuente++;
		}
	}

	aplicarFuncionTransferencia(objetoBoguiActual, funcionTransferencia);
}

//Ecualizar histograma
function ecualizarHistograma(objetoBoguiActual){

	ancho = objetoBoguiActual.imgCanvas.width;
	alto = objetoBoguiActual.imgCanvas.height;

	var histogramaAcumuladoNormalizado = calcularHistogramaAcumuladoNormalizado(objetoBoguiActual);

	var funcionTransferencia = new Array(256);

	for (i = 0; i < 256; i++){
		funcionTransferencia[i]=(255/*/(ancho*alto)*/)*histogramaAcumuladoNormalizado[i];
	}

	aplicarFuncionTransferencia(objetoBoguiActual, funcionTransferencia);

}


function calcularHistogramaAcumuladoNormalizado(objetoBoguiActual){
	//calcular primero histograma origen
	calcularHistogramaSimple(objetoBoguiActual);
	var histograma = objetoBoguiActual.histograma;
	//normalizacion
	var numeroPixeles = 0;
	for(i = 0; i < histograma.length; i++){
		numeroPixeles = numeroPixeles + histograma[i];
	}
	var histogramaNormalizado = new Array(256);
	for(i = 0; i < histograma.length; i++){
		histogramaNormalizado[i] = histograma[i]/numeroPixeles;
	}
	//Histograma origen acumulado normalizado
	var histogramaAcumuladoNormalizado = new Array(256);
	histogramaAcumuladoNormalizado[0] = histogramaNormalizado[0];
	for(i = 1; i < histograma.length; i++){
		histogramaAcumuladoNormalizado[i] = histogramaNormalizado[i] + histogramaAcumuladoNormalizado[i-1]
	}
	return histogramaAcumuladoNormalizado;
}

//Correccion gamma
function correccionGamma(objetoBoguiActual, gamma){

	calcularHistogramaSimple(objetoBoguiActual);

	var funcionTransferencia = new Array(256);

	for (i = 0; i < objetoBoguiActual.histograma.length; i++){
			funcionTransferencia[i] = objetoBoguiActual.histograma[i];
	}
	//Normalizar
	for (i = 0; i < funcionTransferencia.length; i++){
			funcionTransferencia[i] = i/255
	}
	for (i = 0; i < funcionTransferencia.length; i++){
			funcionTransferencia[i] = Math.pow(funcionTransferencia[i],gamma);
	}
	for (i = 0; i < funcionTransferencia.length; i++){
			funcionTransferencia[i] = 255 * funcionTransferencia[i];
	}

	aplicarFuncionTransferencia(objetoBoguiActual, funcionTransferencia);
}

//Image-Cross Section
function pixelesICS(objetoBoguiActual){
	var x, y;
	var dx, dy;
	var p;
	var incE, incNE;
	var stepx, stepy;
	var pixeles = [];

	dx = (objetoBoguiActual.mouseXfin - objetoBoguiActual.mouseXini);
	dy = (objetoBoguiActual.mouseYfin - objetoBoguiActual.mouseYini);

	// determinar que punto usar para empezar, cual para terminar 
	if (dy < 0) { 
		dy = -dy; 
		stepy = -1; 
	} 
	else {
		stepy = 1;
	}

	if (dx < 0) {  
		dx = -dx;  
		stepx = -1; 
	}else{
		stepx = 1;
	}

	x = objetoBoguiActual.mouseXini;
	y = objetoBoguiActual.mouseYini;

	// se cicla hasta llegar al extremo de la línea 
	if(dx>dy){
		p = 2*dy - dx;
		incE = 2*dy;
		incNE = 2*(dy-dx);
		while (x != objetoBoguiActual.mouseXfin){
			x = x + stepx;
			if (p < 0){
			p = p + incE;
			}
			else {
			y = y + stepy;
			p = p + incNE;
			}
			pixeles.push([x,y]);
		}
	}else{
		p = 2*dx - dy;
		incE = 2*dx;
		incNE = 2*(dx-dy);
		while (y != objetoBoguiActual.mouseYfin){
			y = y + stepy;
			if (p < 0){
				p = p + incE;
			}else {
				x = x + stepx;
				p = p + incNE;
			}
			pixeles.push([x,y]);
		}
	}
	return pixeles;
}

//TODO: Acabar simulacionDigital

function simulacionDigital(objetoBoguiActual, desplazamiento, bits){


	var imageData = objetoBoguiActual.ctx.getImageData(0, 0, objetoBoguiActual.imgCanvas.width, objetoBoguiActual.imgCanvas.height);
	var pixelData = imageData.data;
	var bytesPerPixel = 4;
	color = 0;

	for(var y = 0; y < objetoBoguiActual.imgCanvas.height; y = y + desplazamiento) { 
		for(var x = 0; x < objetoBoguiActual.imgCanvas.width; x++) {

			if((x+desplazamiento)%desplazamiento == 0){
				var colorTotal = 0;
				var numeroPixeles = 0;

				for(y1 = y; y1 < y + desplazamiento; y1++){
					for(x1 = x; x1 < x + desplazamiento; x1++){
						
						if((x1<objetoBoguiActual.imgCanvas.width) && (y1<objetoBoguiActual.imgCanvas.height)  ){
							var pixelArraySimple = (y1 * bytesPerPixel * objetoBoguiActual.imgCanvas.width) + (x1 * bytesPerPixel);
							colorTotal += pixelData[pixelArraySimple];
							numeroPixeles++;
						}
					}
				}

				color = (colorTotal/numeroPixeles);
			}

			for(i = 0; i < desplazamiento; i++){

				var startIdx = ((y+i) * bytesPerPixel * objetoBoguiActual.imgCanvas.width) + (x * bytesPerPixel);
				pixelData[startIdx] = color;
				pixelData[startIdx+1] = color;
				pixelData[startIdx+2] = color;
			}

		}
	}

	var original = 256;
	var destino = (Math.pow(2,bits)-1);
	var rango = (original/destino);
	
	
	for(var y = 0; y < objetoBoguiActual.imgCanvas.height; y++) { 
		for(var x = 0; x < objetoBoguiActual.imgCanvas.width; x++) {

			var startIdx = (y * bytesPerPixel * objetoBoguiActual.imgCanvas.width) + (x * bytesPerPixel);


			var lugar = Math.floor(pixelData[startIdx]/rango);
			var redondear;

			if(pixelData[startIdx]%rango >= rango/2){
				//console.log("REDONDEO ARRIBA");
				redondear = rango;
			}else{
				redondear = 0;
				//console.log("REDONDEO ABAJO");
			}
			
			
			pixelData[startIdx] = (rango*lugar) + redondear;
			pixelData[startIdx+1] = (rango*lugar) + redondear;
			pixelData[startIdx+2] = (rango*lugar) + redondear;
		}
	}
	/*
	for(var y = 0; y < objetoBoguiActual.imgCanvas.height; y++) { 
		for(var x = 0; x < objetoBoguiActual.imgCanvas.width; x++) {
			var contadorColor = 0;
			var startIdx = (y * bytesPerPixel * objetoBoguiActual.imgCanvas.width) + (x * bytesPerPixel);

			for(avance = 0; avance < pixelData[startIdx]; avance += rango){
				contadorColor++;
			}
			
			
			pixelData[startIdx] = (rango*contadorColor)-rango;
			pixelData[startIdx+1] = (rango*contadorColor)-rango;
			pixelData[startIdx+2] = (rango*contadorColor)-rango;
		}
	}
	*/

	objetosBogui.push(new Bogui(objetoBoguiActual.imagen, numeroObjetos,objetoBoguiActual.nombre+objetoBoguiActual.formato));
	objetosBogui[ obtenerPosArray( numeroObjetos)].imgCanvas = objetoBoguiActual.imgCanvas;
	objetosBogui[obtenerPosArray( numeroObjetos)].ctx.putImageData(imageData, 0, 0);
	cambiarFoco(numeroObjetos);
	numeroObjetos++;
}

//Otros metodos
function calcularMedia(puntos){
	var total = 0;
	for(i = 0; i < puntos.length; i++){
		total += puntos[i];
	}
	return (total/puntos.length);
}
