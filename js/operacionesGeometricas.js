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
                                        var startIdxAux = ((canvasAux.height-1-y) * bytesPerPixel * canvasAux.width) + ((canvasAux.width- 1 - x) * bytesPerPixel);
                                        
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