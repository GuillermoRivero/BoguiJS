function espejoHorizontal(objetoBoguiActual){
 
        var imageData = objetoBoguiActual.ctx.getImageData(0, 0, objetoBoguiActual.imgCanvas.width, objetoBoguiActual.imgCanvas.height);
        var imageDataAux = objetoBoguiActual.ctx.getImageData(0, 0, objetoBoguiActual.imgCanvas.width, objetoBoguiActual.imgCanvas.height);
        var pixelData = imageData.data;
        var pixelDataAux = imageDataAux.data;
 
        var bytesPerPixel = 4;
 
        for(var y = 0; y < objetoBoguiActual.imgCanvas.height; y++) {
                for(var x = 0; x < objetoBoguiActual.imgCanvas.width; x++) {
 
                        var startIdx = (y * bytesPerPixel * objetoBoguiActual.imgCanvas.width) + (x * bytesPerPixel);
                        var startIdxAux = ((y) * bytesPerPixel * objetoBoguiActual.imgCanvas.width) + ((objetoBoguiActual.imgCanvas.width - x) * bytesPerPixel);
                       
                        pixelDataAux[startIdxAux] = pixelData[startIdx];
                        pixelDataAux[startIdxAux+1] = pixelData[startIdx+1];
                        pixelDataAux[startIdxAux+2] = pixelData[startIdx+2];
                }
        }
 
        objetosBogui.push(new Bogui(objetoBoguiActual.imagen, numeroObjetos,objetoBoguiActual.nombre+objetoBoguiActual.formato));
        objetosBogui[ obtenerPosArray( numeroObjetos)].imgCanvas = objetoBoguiActual.imgCanvas;
        objetosBogui[obtenerPosArray( numeroObjetos)].ctx.putImageData(imageDataAux, 0, 0);
        cambiarFoco(numeroObjetos);
        numeroObjetos++;
 
 
}
 

function espejoVertical(objetoBoguiActual){
 
        var imageData = objetoBoguiActual.ctx.getImageData(0, 0, objetoBoguiActual.imgCanvas.width, objetoBoguiActual.imgCanvas.height);
        var imageDataAux = objetoBoguiActual.ctx.getImageData(0, 0, objetoBoguiActual.imgCanvas.width, objetoBoguiActual.imgCanvas.height);
        var pixelData = imageData.data;
        var pixelDataAux = imageDataAux.data;
 
        var bytesPerPixel = 4;
 
        for(var y = 0; y < objetoBoguiActual.imgCanvas.height; y++) {
                for(var x = 0; x < objetoBoguiActual.imgCanvas.width; x++) {
 
                        var startIdx = (y * bytesPerPixel * objetoBoguiActual.imgCanvas.width) + (x * bytesPerPixel);
                        var startIdxAux = ((objetoBoguiActual.imgCanvas.height - y) * bytesPerPixel * objetoBoguiActual.imgCanvas.width) + ((x) * bytesPerPixel);
                       
                        pixelDataAux[startIdxAux] = pixelData[startIdx];
                        pixelDataAux[startIdxAux+1] = pixelData[startIdx+1];
                        pixelDataAux[startIdxAux+2] = pixelData[startIdx+2];
                }
        }
 
        objetosBogui.push(new Bogui(objetoBoguiActual.imagen, numeroObjetos,objetoBoguiActual.nombre+objetoBoguiActual.formato));
        objetosBogui[ obtenerPosArray( numeroObjetos)].imgCanvas = objetoBoguiActual.imgCanvas;
        objetosBogui[obtenerPosArray( numeroObjetos)].ctx.putImageData(imageDataAux, 0, 0);
        cambiarFoco(numeroObjetos);
        numeroObjetos++;       
 
}


function transpuesta(objetoBoguiActual){

        var imageData = objetoBoguiActual.ctx.getImageData(0, 0, objetoBoguiActual.imgCanvas.width, objetoBoguiActual.imgCanvas.height);

        var canvasAux = $('<canvas/>')[0];      
        canvasAux.height =      objetoBoguiActual.imgCanvas.width;
        canvasAux.width = objetoBoguiActual.imgCanvas.height;       
        var ctxAux = canvasAux.getContext("2d");

        //var imageDataAux = ctxAux.getImageData(0,0,canvasAux.width, canvasAux.height);
        var imageDataAux = ctxAux.createImageData(canvasAux.width, canvasAux.height);
        var pixelData = imageData.data;
        var pixelDataAux = imageDataAux.data;

        var bytesPerPixel = 4;

        for(var y = 0; y < objetoBoguiActual.imgCanvas.height; y++) { 
                for(var x = 0; x < objetoBoguiActual.imgCanvas.width; x++) {

                        var startIdx = (y * bytesPerPixel * objetoBoguiActual.imgCanvas.width) + (x * bytesPerPixel);
                        var startIdxAux = ((x) * bytesPerPixel * canvasAux.width) + ((y) * bytesPerPixel);
                        
                        pixelDataAux[startIdxAux] = pixelData[startIdx];
                        pixelDataAux[startIdxAux+1] = pixelData[startIdx+1];
                        pixelDataAux[startIdxAux+2] = pixelData[startIdx+2];
                        pixelDataAux[startIdxAux+3] = pixelData[startIdx+3];

                }
        }

        objetosBogui.push(new Bogui(objetoBoguiActual.imagen, numeroObjetos,objetoBoguiActual.nombre + objetoBoguiActual.formato));
        var nuevoObjetoBogui = objetosBogui[obtenerPosArray(numeroObjetos)];
        actualizarCanvas(nuevoObjetoBogui, canvasAux);
        nuevoObjetoBogui.ctx.putImageData(imageDataAux,0,0);
        cambiarFoco(numeroObjetos);
        numeroObjetos++;1
        
}

function rotarBasico(objetoBoguiActual, grados){

        var imageData = objetoBoguiActual.ctx.getImageData(0, 0, objetoBoguiActual.imgCanvas.width, objetoBoguiActual.imgCanvas.height);

        var canvasAux = $('<canvas/>')[0];      
           
        var ctxAux;
        

        //var imageDataAux = ctxAux.getImageData(0,0,canvasAux.width, canvasAux.height);
        

        switch(grados){
                case 90:
                        canvasAux.height = objetoBoguiActual.imgCanvas.width;
                        canvasAux.width = objetoBoguiActual.imgCanvas.height;    
                        ctxAux = canvasAux.getContext("2d");
                        var imageDataAux = ctxAux.createImageData(canvasAux.width, canvasAux.height);
                        var pixelData = imageData.data;
                        var pixelDataAux = imageDataAux.data;
                        var bytesPerPixel = 4;

                        for(var y = 0; y < objetoBoguiActual.imgCanvas.height; y++) { 
                                for(var x = 0; x < objetoBoguiActual.imgCanvas.width; x++) {

                                        var startIdx = (y * bytesPerPixel * objetoBoguiActual.imgCanvas.width) + (x * bytesPerPixel);
                                        var startIdxAux = ((x) * bytesPerPixel * canvasAux.width) + ((canvasAux.width - 1 - y) * bytesPerPixel);
                                        
                                        pixelDataAux[startIdxAux] = pixelData[startIdx];
                                        pixelDataAux[startIdxAux+1] = pixelData[startIdx+1];
                                        pixelDataAux[startIdxAux+2] = pixelData[startIdx+2];
                                        pixelDataAux[startIdxAux+3] = pixelData[startIdx+3];

                                }
                        }
                        


                break;

                case 180:
                        canvasAux.height = objetoBoguiActual.imgCanvas.height;
                        canvasAux.width = objetoBoguiActual.imgCanvas.width;    
                        ctxAux = canvasAux.getContext("2d");
                        var imageDataAux = ctxAux.createImageData(canvasAux.width, canvasAux.height);
                        var pixelData = imageData.data;
                        var pixelDataAux = imageDataAux.data;
                        var bytesPerPixel = 4;

                        for(var y = 0; y < objetoBoguiActual.imgCanvas.height; y++) { 
                                for(var x = 0; x < objetoBoguiActual.imgCanvas.width; x++) {

                                        var startIdx = (y * bytesPerPixel * objetoBoguiActual.imgCanvas.width) + (x * bytesPerPixel);
                                        var startIdxAux = ((canvasAux.height-1-y) * bytesPerPixel * canvasAux.width) + ((canvasAux.width - 1 - x) * bytesPerPixel);
                                        
                                        pixelDataAux[startIdxAux] = pixelData[startIdx];
                                        pixelDataAux[startIdxAux+1] = pixelData[startIdx+1];
                                        pixelDataAux[startIdxAux+2] = pixelData[startIdx+2];
                                        pixelDataAux[startIdxAux+3] = pixelData[startIdx+3];

                                }
                        }
                        
                
                break;

                case 270:
                        canvasAux.height = objetoBoguiActual.imgCanvas.width;
                        canvasAux.width = objetoBoguiActual.imgCanvas.height;    
                        ctxAux = canvasAux.getContext("2d");
                        var imageDataAux = ctxAux.createImageData(canvasAux.width, canvasAux.height);
                        var pixelData = imageData.data;
                        var pixelDataAux = imageDataAux.data;
                        var bytesPerPixel = 4;

                        for(var y = 0; y < objetoBoguiActual.imgCanvas.height; y++) { 
                                for(var x = 0; x < objetoBoguiActual.imgCanvas.width; x++) {

                                        var startIdx = (y * bytesPerPixel * objetoBoguiActual.imgCanvas.width) + (x * bytesPerPixel);
                                        var startIdxAux = ((canvasAux.height-1-x) * bytesPerPixel * canvasAux.width) + ((y) * bytesPerPixel);
                                        
                                        pixelDataAux[startIdxAux] = pixelData[startIdx];
                                        pixelDataAux[startIdxAux+1] = pixelData[startIdx+1];
                                        pixelDataAux[startIdxAux+2] = pixelData[startIdx+2];
                                        pixelDataAux[startIdxAux+3] = pixelData[startIdx+3];

                                }
                        }
                
                break;


                default:
                        canvasAux.height = objetoBoguiActual.imgCanvas.height;
                        canvasAux.width = objetoBoguiActual.imgCanvas.width;    
                        ctxAux = canvasAux.getContext("2d");
                        var imageDataAux = ctxAux.createImageData(canvasAux.width, canvasAux.height);
                        var pixelData = imageData.data;
                        var pixelDataAux = imageDataAux.data;
                        var bytesPerPixel = 4;

                        for(var y = 0; y < objetoBoguiActual.imgCanvas.height; y++) { 
                                for(var x = 0; x < objetoBoguiActual.imgCanvas.width; x++) {

                                        var startIdx = (y * bytesPerPixel * objetoBoguiActual.imgCanvas.width) + (x * bytesPerPixel);
                                        var startIdxAux = ((y) * bytesPerPixel * canvasAux.width) + ((x) * bytesPerPixel);
                                        
                                        pixelDataAux[startIdxAux] = pixelData[startIdx];
                                        pixelDataAux[startIdxAux+1] = pixelData[startIdx+1];
                                        pixelDataAux[startIdxAux+2] = pixelData[startIdx+2];
                                        pixelDataAux[startIdxAux+3] = pixelData[startIdx+3];

                                }
                        }


                break;
        }
        

        objetosBogui.push(new Bogui(objetoBoguiActual.imagen, numeroObjetos,objetoBoguiActual.nombre + objetoBoguiActual.formato));
        var nuevoObjetoBogui = objetosBogui[obtenerPosArray(numeroObjetos)];
        actualizarCanvas(nuevoObjetoBogui, canvasAux);
        nuevoObjetoBogui.ctx.putImageData(imageDataAux,0,0);
        cambiarFoco(numeroObjetos);
        numeroObjetos++;1
        
}

function calcularFactor(ini, fin){
        return (fin/ini*1.0)
}

function escalar(objetoBoguiActual, pixelX, pixelY, modo){

        var imageData = objetoBoguiActual.ctx.getImageData(0, 0, objetoBoguiActual.imgCanvas.width, objetoBoguiActual.imgCanvas.height);
        var canvasAux = $('<canvas/>')[0]; 

        canvasAux.height = pixelY;
        canvasAux.width = pixelX;  

        var factorX = calcularFactor(canvasAux.width, objetoBoguiActual.imgCanvas.width);
        var factorY = calcularFactor(canvasAux.height, objetoBoguiActual.imgCanvas.height);

        var ctxAux = canvasAux.getContext("2d");

        //var imageDataAux = ctxAux.getImageData(0,0,canvasAux.width, canvasAux.height);
        var imageDataAux = ctxAux.createImageData(canvasAux.width, canvasAux.height);
        var pixelData = imageData.data;
        var pixelDataAux = imageDataAux.data;

        var bytesPerPixel = 4;

        for(var y = 0; y < canvasAux.height; y++) { 
                for(var x = 0; x < canvasAux.width; x++) {

                        var pixelOriginalX = parseInt(x * factorX);
                        var pixelOriginalY = parseInt(y * factorY);

                        var pesoX = (x * factorX)-parseInt(x * factorX);
                        var pesoY = (y * factorY)-parseInt(y * factorY);
                        var color = 100;
                        var alfa = 255;

                        switch(modo){

                        case "vmp":
                                //VECINO MAS PROXIMO

                                var pixelCercanoX = {};
                                var pixelCercano;

                                if(pesoX < 0.5){
                                    pixelCercanoX['pixel'] = "izquierda";
                                    pixelCercanoX['valor'] = pesoX;
                                         
                                }else{
                                    pixelCercanoX['pixel'] = "derecha";
                                    pixelCercanoX['valor'] = 1-pesoX;      
                                }

                                var pixelCercanoY = {};

                                if(pesoY < 0.5){
                                    pixelCercanoY['pixel'] = "arriba";
                                    pixelCercanoY['valor'] = pesoY;
                                         
                                }else{
                                    pixelCercanoY['pixel'] = "abajo";
                                    pixelCercanoY['valor'] = 1-pesoY;      
                                }
                                
                                if(pixelOriginalY == 0){
                                        pixelCercanoY['pixel'] = "abajo";
                                        pixelCercanoY['valor'] = 1-pesoY;  
                                }
                                if(pixelOriginalX == 0){
                                        pixelCercanoX['pixel'] = "derecha";
                                        pixelCercanoX['valor'] = 1-pesoX;  
                                }
                                if(pixelOriginalY == objetoBoguiActual.imgCanvas.height-1){
                                        pixelCercanoY['pixel'] = "arriba";
                                        pixelCercanoY['valor'] = pesoY; 
                                }
                                if(pixelOriginalX == objetoBoguiActual.imgCanvas.width-1){
                                        pixelCercanoX['pixel'] = "izquierda";
                                        pixelCercanoX['valor'] = pesoX; 
                                }

                                if(pixelCercanoY.valor < pixelCercanoX.valor){
                                        pixelCercano = pixelCercanoY.pixel;
                                }else{
                                        pixelCercano = pixelCercanoX.pixel;     
                                }

                                switch(pixelCercano){
                                        case "arriba":
                                        color = pixelData[((pixelOriginalY-1) * bytesPerPixel * objetoBoguiActual.imgCanvas.width) + (pixelOriginalX * bytesPerPixel)];
                                        break;
                                        case "abajo":
                                        color = pixelData[((pixelOriginalY+1) * bytesPerPixel * objetoBoguiActual.imgCanvas.width) + (pixelOriginalX * bytesPerPixel)];
                                        break;
                                        case "izquierda":
                                        color = pixelData[(pixelOriginalY * bytesPerPixel * objetoBoguiActual.imgCanvas.width) + ((pixelOriginalX-1) * bytesPerPixel)];
                                        break;
                                        case "derecha":
                                        color = pixelData[(pixelOriginalY * bytesPerPixel * objetoBoguiActual.imgCanvas.width) + ((pixelOriginalX+1) * bytesPerPixel)];
                                        break;
                                }
                                //TODO:Arreglar error que hace que no se seleccionen los pixeles correctos.
                        break;

                        case "media":
                        
                                //MEDIA DE LOS 4 COLORES
                                var media = 0;
                                var numeroColores = 0;
                                alfa = 0;


                                if(pixelOriginalY > 0){
                                        var colorArriba = pixelData[((pixelOriginalY-1) * bytesPerPixel * objetoBoguiActual.imgCanvas.width) + (pixelOriginalX * bytesPerPixel)];
                                        var alfaArriba = pixelData[(((pixelOriginalY-1) * bytesPerPixel * objetoBoguiActual.imgCanvas.width) + (pixelOriginalX * bytesPerPixel))+3];
                                        alfa += (alfaArriba * ((1-pesoY)/2));
                                        media += (colorArriba * ((1-pesoY)/2));
                                        numeroColores++;
                                }
                                if(pixelOriginalY < objetoBoguiActual.imgCanvas.height-1){
                                        var colorAbajo = pixelData[((pixelOriginalY+1) * bytesPerPixel * objetoBoguiActual.imgCanvas.width) + (pixelOriginalX * bytesPerPixel)];
                                        var alfaAbajo = pixelData[(((pixelOriginalY+1) * bytesPerPixel * objetoBoguiActual.imgCanvas.width) + (pixelOriginalX * bytesPerPixel))+3];
                                        alfa += (alfaAbajo * ((pesoY)/2));
                                        media += (colorAbajo * ((pesoY)/2));
                                        numeroColores++;
                                }
                                if(pixelOriginalX > 0){
                                        var colorIzquierda = pixelData[(pixelOriginalY * bytesPerPixel * objetoBoguiActual.imgCanvas.width) + ((pixelOriginalX-1) * bytesPerPixel)];
                                        var alfaIzquierda = pixelData[((pixelOriginalY * bytesPerPixel * objetoBoguiActual.imgCanvas.width) + ((pixelOriginalX-1) * bytesPerPixel))+3];
                                        alfa += (alfaIzquierda * (1-pesoX/2));
                                        media += (colorIzquierda * (1-pesoX/2));
                                        numeroColores++;
                                }
                                if(pixelOriginalX < objetoBoguiActual.imgCanvas.width-1){
                                        var colorDerecha = pixelData[(pixelOriginalY * bytesPerPixel * objetoBoguiActual.imgCanvas.width) + ((pixelOriginalX+1) * bytesPerPixel)];
                                        var alfaDerecha = pixelData[((pixelOriginalY * bytesPerPixel * objetoBoguiActual.imgCanvas.width) + ((pixelOriginalX+1) * bytesPerPixel))+3];
                                        alfa += (alfaDerecha * ((pesoX)/2));
                                        media += (colorDerecha * ((pesoX)/2));
                                        numeroColores++;
                                }
                                //TODO: Corregir error que hace que las imagenes se vean mas oscuras de lo que deben
                                color =  media/numeroColores;
                                alfa = alfa/numeroColores;

                                break;

                        }
                        
                        var startIdxAux = ((y) * bytesPerPixel * canvasAux.width) + ((x) * bytesPerPixel);
                        
                        pixelDataAux[startIdxAux] = color;
                        pixelDataAux[startIdxAux+1] = color;
                        pixelDataAux[startIdxAux+2] = color;
                        pixelDataAux[startIdxAux+3] = 255;

                }
        }

        objetosBogui.push(new Bogui(objetoBoguiActual.imagen, numeroObjetos,objetoBoguiActual.nombre + objetoBoguiActual.formato));
        var nuevoObjetoBogui = objetosBogui[obtenerPosArray(numeroObjetos)];
        actualizarCanvas(nuevoObjetoBogui, canvasAux);
        nuevoObjetoBogui.ctx.putImageData(imageDataAux,0,0);
        cambiarFoco(numeroObjetos);
        numeroObjetos++;1
        
}