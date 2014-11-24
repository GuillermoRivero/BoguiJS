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