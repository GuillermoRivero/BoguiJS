function ajusteBrilloContraste(objetoBoguiActual, viejoBrillo, viejoContraste, nuevoBrillo, nuevoContraste){
	var a, b;
	var funcionTransferencia = new Array(256);
	if(viejoContraste != 0){
		a = nuevoContraste / viejoContraste; 
	}else{
		a = nuevoContraste / 0.001;
	}
	b = nuevoBrillo-a * viejoBrillo; 
	for (i = 0; i < funcionTransferencia.length; i++) {
		funcionTransferencia[i] = ((a * i) + b);
		if (funcionTransferencia[i] > 255)
			funcionTransferencia[i] = 255;
		if (funcionTransferencia[i] < 0)
			funcionTransferencia[i] = 0;
	}
	aplicarFuncionTransferencia(objetoBoguiActual, funcionTransferencia);
}

function transformacionLinearPorTramos(objetoBoguiActual, tramos){
	
	var tramoActual = 1;
	var funcionTransferencia = new Array(256);
	var profundidadBits = 256;

	for(pixel = 0; pixel < profundidadBits; pixel++){
		if(pixel > tramos[tramoActual][0]){
			tramoActual++;
		}
        a = (tramos[tramoActual][1] - tramos[tramoActual-1][1]) / (tramos[tramoActual][0] - tramos[tramoActual-1][0]);
        b = tramos[tramoActual][1] - a * tramos[tramoActual][0];
        funcionTransferencia[pixel] = (a * pixel) + b;
	    
	}

	aplicarFuncionTransferencia(objetoBoguiActual, funcionTransferencia);
	
}
