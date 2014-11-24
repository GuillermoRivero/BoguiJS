function fnExtend (from, to) {
    var prop;
 
    // si @from es un Object literal
    if (({}).toString.call(from) == "[object Object]") {
 
        // creamos la propiedad [objects] en la función
        arguments.callee.objects = arguments.callee.objects || [];
 
        // verificamos si @from hace referencia a un objeto ya creado
        if (arguments.callee.objects.filter(function(item) {
            return item === from;
        }).length) return from;
             
        // guarda la referencia del objeto para comprobar si ya fue creado
        arguments.callee.objects.push(from);
    }
 
    // determinamos si es un objeto primitivo o una función
    if (from == null || typeof from != "object") return from;
 
    // determinamos si el objeto es una instancia de alguno de los siguientes prototipos
    if (from.constructor == Date || from.constructor == RegExp || from.constructor == Function ||
        from.constructor == String || from.constructor == Number || from.constructor == Boolean) {
        return new from.constructor(from);
    }
 
    // si el constructor del objeto no es ninguno de los anteriores
    if (from.constructor != Object && from.constructor != Array) return from;
 
    // iteramos recursivamente las propiedades del objeto
    to = to || new from.constructor();
    for (prop in from) {
        to[prop] = typeof to[prop] == "undefined" ? arguments.callee(from[prop], null) : to[prop];
    }
    return to;
}

// Converts canvas to an image
function convertCanvasToImage(canvas) {
    var image = new Image();
    image.src = canvas.toDataURL("image/png");
    return image;
}

function cloneCanvas(oldCanvas) {

    //create a new canvas
    var newCanvas = document.createElement('canvas');
    var context = newCanvas.getContext('2d');

    //set dimensions
    newCanvas.width = oldCanvas.height;
    newCanvas.height = oldCanvas.width;

    //apply the old canvas to the new one
    //context.drawImage(oldCanvas, 0, 0);

    //return the new canvas
    return newCanvas;
}