/* Libreria de tratamiento de imágenes 

Autores: Guillermo Rivero Rodríguez y Boris Ballester Hernández"

EL TAMAÑO DE TRABAJO DE IMAGEN, FORMATO DE DESCARGA Y MODO DE IMAGEN VIENEN DADOS POR EL FICHERO DE CONFIGURACION, PARA USARLOS
	-window.maxHeight
	-window.maxWidth
	-window.modoImagen
	-window.formatoDescarga
*/




var imagen;
var nombre;
var output = [];
var objetosBogui = [];
var herramientaActual = "puntero";
var objetoActual = 0;
//var posicionObjetoActual = 0;
var numeroObjetos = 0;
var altoHistograma = 470;
var anchoHistograma = 500;
var tiempo = new Date();

$('.ui-dialog').wrap('#workspace');
$('.ui-widget-overlay').wrap('#workspace');


$(document).ready(function() {
	//Añadimos el evento para las imagenes
	//$("#fileSelector").on("change", readImage);
	$("#fileSelector").change(function (e) {
    if(this.disabled) return alert('File upload not supported!');
    var F = this.files;
    	if(F && F[0]) for(var i=0; i<F.length; i++) readImage( F[i] );
	});

	
	// Hover para los botones de la barra
	$( "#tools li" ).hover(
		function() {
			$( this ).addClass( "ui-state-hover" );
		},
		function() {
			$( this ).removeClass( "ui-state-hover" );
		}
	);	
	//Habilitamos tooltips del menu
	$( "#bars" ).tooltip();	
	
	//Añadimos la opciones del menu
	$("#fileButton, #fileMenu").click(function() {
		$("#fileSelector").click();
	});	

	$("#workspace").on("dragover", function(event) {
	    event.preventDefault();  
    	event.stopPropagation();
	    $(this).addClass('overlay');	
		$('#dropContent').addClass('visible');
		$('#dropContent').removeClass('hidden');

			
	});

	$("#workspace").on("dragleave", function(event) {
	    event.preventDefault();  
	    event.stopPropagation();
	    
		
	    $(this).removeClass('overlay');	
		$('#dropContent').removeClass('visible');
		$('#dropContent').addClass('hidden');		
	});
	
	$("#workspace").on("drop", function(event) {
	    event.preventDefault();  
	    event.stopPropagation();
	    
	    var files = event.originalEvent.dataTransfer.files;
	    for(i = 0; i < files.length;i++){
	    	readImage(files[i]);
	    }

		$(this).removeClass('overlay');	
		$('#dropContent').removeClass('visible');
		$('#dropContent').addClass('hidden');				
	});

	
	$("#ecualizacion").click(function() {
		if(typeof objetosBogui[objetoActual] == 'undefined'){
			mostrarError("No se puede ejecutar el comando sin una imagen seleccionada"); 
		}else{
			ecualizarHistograma(objetosBogui[objetoActual]);
		}
		
	});

	$("#diferenciaImagen").click(function() {
		if(typeof objetosBogui[objetoActual] == 'undefined'){
			mostrarError("No se puede ejecutar el comando sin una imagen seleccionada"); 
		}else{
			if(typeof objetosBogui[objetoActual] == 'undefined'){
				mostrarError("No se puede ejecutar el comando sin una imagen seleccionada"); 
				}else{
				var dialog, form;
				var valores = calcularBrilloContraste(objetosBogui[objetoActual]);
				var oldBrillo = valores[0];
				var oldContraste = valores[1];
				
				$("body").append("<div id=\"dialog\"></div>");
				dialog = $( "#dialog" ).dialog({
					title: "Imagen diferencia:",
					height: 250,
					width: 350,
					modal: true,
					buttons: {
						Ok:function(ui) {
							//COGEMOS LOS VALORES
							var objetoReferencia = document.getElementById("imagenesReferencia").value;					
							diferencia(objetosBogui[objetoActual],objetosBogui[objetoReferencia]);
							$(this).dialog( "close" );
							$(this).remove();
						},
						Cancel: function() {
							$(this).dialog( "close" );
							$(this).remove();
						}
					},
					dialogClass: 'no-close' 
				});
				
				form = dialog.find( "form" ).on( "submit", function( event ) {
					event.preventDefault();
				});		
				
				
				var contenido = "<form><fieldset><p><label>Imagen de referencia: </label><select id = \"imagenesReferencia\">"
				for(i = 0; i<objetosBogui.length;i++)
				{
					contenido = contenido + "<option value = \""+i+"\">"+objetosBogui[i].nombre+"</option>";
				}
				contenido = contenido + "</select></p></fieldset></form>";
				dialog.append(contenido);					
			}
		}
		
	});

	$("#mapaCambios").click(function() {
		if(typeof objetosBogui[objetoActual] == 'undefined'){
			mostrarError("No se puede ejecutar el comando sin una imagen seleccionada"); 
		}else{
			var dialog, form;
			var valores = calcularBrilloContraste(objetosBogui[objetoActual]);
			var oldBrillo = valores[0];
			var oldContraste = valores[1];
			
			$("body").append("<div id=\"dialog\"></div>");
			dialog = $( "#dialog" ).dialog({
				title: "Mapa de cambios:",
				height: 250,
				width: 350,
				modal: true,
				buttons: {
					Ok:function(ui) {
						//COGEMOS LOS VALORES
						var objetoReferencia = document.getElementById("imagenesReferencia").value;					
						var umbral =  $( this ).find( '#sliderUmbral' ).slider( "value" );
						mapaCambios(objetosBogui[objetoActual],objetosBogui[objetoReferencia],umbral);
						$(this).dialog( "close" );
						$(this).remove();
					},
					Cancel: function() {
						$(this).dialog( "close" );
						$(this).remove();
					}
				},
				dialogClass: 'no-close' 
			});
			
			form = dialog.find( "form" ).on( "submit", function( event ) {
				event.preventDefault();
			});		

			
			var contenido = "<form><fieldset><p><label>Imagen de referencia: </label><select id = \"imagenesReferencia\">"
			for(i = 0; i<objetosBogui.length;i++)
			{
				contenido = contenido + "<option value = \""+i+"\">"+objetosBogui[i].nombre+"</option>";
			}
			contenido = contenido + "</select></p><p><label for=\"umbralSpinner\">Umbral:</label><input id=\"umbralSpinner\" name=\"umbralValue\" type=\"text\"></p><div id=\"sliderUmbral\"></div></p></fieldset></form>";
			dialog.append(contenido);
			
			var umbralSpinner = $( "#umbralSpinner" ).spinner({
				min: 0,
				max: 255,
				step: 1,
				stop: (function (event, ui) {
					$( "#sliderUmbral" ).slider( "value", $(this).spinner('value') );
				}),
				spin: (function(event, ui ){
					$( "#sliderUmbral" ).slider( "value", ui.value );
				})
				}).on('input', function () {
				var val = this.value,
				$this = $(this),
				max = $this.spinner('option', 'max'),
				min = $this.spinner('option', 'min');
				if (!val.match(/^\d*$/)) val = 0; //we want only number, no alpha
				this.value = val > max ? max : val < min ? min : val;
			});	
			
			$( "#sliderUmbral" ).slider({
				range: "min",
				min: 0,
				autofocus: "autofocus",
				max: 255,
				slide: function( event, ui ) {
					umbralSpinner.spinner( "value", ui.value );
				}
			});
			umbralSpinner.spinner( "value", $( "#sliderUmbral" ).slider( "value" ));						
		}
	});	
	
	$("#especificacion").click(function() {
		if(typeof objetosBogui[objetoActual] == 'undefined'){
			mostrarError("No se puede ejecutar el comando sin una imagen seleccionada"); 
		}else{
			$("body").append("<div id=\"dialog\"></div>");
			dialog = $( "#dialog" ).dialog({
				title: "Especificación histograma:",
				height: 170,
				width: 350,
				modal: true,
				buttons: {
					Ok:function(ui) {
						var objetoReferencia = document.getElementById("imagenesReferencia").value;
						especificarHistograma(objetosBogui[objetoActual], objetosBogui[objetoReferencia]);
						$(this).dialog( "close" );
						$(this).remove();
					},
					Cancel: function() {
						$(this).dialog( "close" );
						$(this).remove();
					}
				},
				dialogClass: 'no-close' 
			});
			
			form = dialog.find( "form" ).on( "submit", function( event ) {
				event.preventDefault();
			});					
			
			var contenido = "<form><fieldset><p><label>Imagen de referencia: </label><select id = \"imagenesReferencia\">"
			for(i = 0; i<objetosBogui.length;i++)
			{
				contenido = contenido + "<option value = \""+i+"\">"+objetosBogui[i].nombre+"</option>";
			}
			contenido = contenido +	"</select></p></fieldset></form>";
			dialog.append(contenido);
			
		}
		
	});
	
	$("#ajusteBrilloContraste").click(function() {
		var dialog, form;
		var valores = calcularBrilloContraste(objetosBogui[objetoActual]);
		var oldBrillo = valores[0];
		var oldContraste = valores[1];
		
		$("body").append("<div id=\"dialog\"></div>");
		dialog = $( "#dialog" ).dialog({
			title: "Ajuste lineal de brillo y contraste:",
			height: 250,
			width: 350,
			modal: true,
			buttons: {
			Ok:function(ui) {
				  //COGEMOS LOS VALORES
				  var newBrillo =  $( this ).find( '#sliderBrillo' ).slider( "value" );
				  var newContraste = $( this ).find( '#sliderContraste' ).slider( "value" );
				  //EJECUTAR BRILLO Y CONTRASTE
				  
				  cambiarBrilloContraste(objetosBogui[objetoActual], oldBrillo, oldContraste, newBrillo, newContraste);
				  $(this).dialog( "close" );
				  $(this).remove();
			},
			Cancel: function() {
				  $(this).dialog( "close" );
				  $(this).remove();
			}
			},
			dialogClass: 'no-close' 
		});
		
		dialog.append("<form><fieldset><p><label for=\"brilloSpinner\">Brillo:</label><input id=\"brilloSpinner\" name=\"brightValue\" type=\"text\"></p><div id=\"sliderBrillo\"></div><p><label for=\"contrasteSpinner\">Contraste:</label><input id=\"contrasteSpinner\" name=\"contrastValue\" type=\"text\"></p><div id=\"sliderContraste\"></div></fieldset></form>");

		form = dialog.find( "form" ).on( "submit", function( event ) {
		  event.preventDefault();
		});		
		
		var brilloSpinner = $( "#brilloSpinner" ).spinner({
			min: -255,
			max: 255,
			step: 1,
			start: oldBrillo,
			stop: (function (event, ui) {
				$( "#sliderBrillo" ).slider( "value", $(this).spinner('value') );
			}),
			spin: (function(event, ui ){
				$( "#sliderBrillo" ).slider( "value", ui.value );
			})
		}).on('input', function () {
			 var val = this.value,
				 $this = $(this),
				 max = $this.spinner('option', 'max'),
				 min = $this.spinner('option', 'min');
				 if (!val.match(/^-?\d*$/)) val = 0; //we want only number, no alpha
			 this.value = val > max ? max : val < min ? min : val;
		 });	
			
		$( "#sliderBrillo" ).slider({
		  range: "min",
		  value: oldBrillo,
		  min: -255,
		  autofocus: "autofocus",
		  max: 255,
		  slide: function( event, ui ) {
			brilloSpinner.spinner( "value", ui.value );
		  }
		});
		brilloSpinner.spinner( "value", $( "#sliderBrillo" ).slider( "value" ));

		var contrasteSpinner = $( "#contrasteSpinner" ).spinner({
			min: 0,
			max: 128,
			step: 1,
			start: oldContraste,
			stop: (function (event, ui) {
				$( "#sliderContraste" ).slider( "value", $(this).spinner('value') );
			}),
			spin: (function(event, ui ){
			$( "#sliderContraste" ).slider( "value", ui.value );
			})
		}).on('input', function () {
			 var val = this.value,
				 $this = $(this),
				 max = $this.spinner('option', 'max'),
				 min = $this.spinner('option', 'min');
				 if (!val.match(/^\d*$/)) val = 0; //we want only number, no alpha
			 this.value = val > max ? max : val < min ? min : val;
		 });	
	
		$( "#sliderContraste" ).slider({
		  range: "min",
		  value: oldContraste,
		  min: 0,
		  autofocus: "autofocus",
		  max: 128,
		  slide: function( event, ui ) {
			contrasteSpinner.spinner( "value", ui.value );
		  }
		});
		contrasteSpinner.spinner( "value", $( "#sliderContraste" ).slider( "value" ));
		

		dialog.dialog();
	});		

	$("#transformacionTramos").click(function() {
		if(typeof objetosBogui[objetoActual] == 'undefined'){
			mostrarError("No se puede ejecutar el comando sin una imagen seleccionada"); 
		}else{
			var dialog, form;
			
			$("body").append("<div id=\"dialog\"></div>");
			dialog = $( "#dialog" ).dialog({
				title: "Transformacion lineal por tramos:",
				height: 200,
				width: 350,
				modal: true,
				buttons: {
					Ok:function() {
						//COGEMOS LOS VALORES
						var numTramos =  $( this ).find( '#tramosSlider' ).slider( "value" );
						$(this).dialog( "close" );
						$(this).remove();
						transformacionLinealTramosDialog(numTramos);
					},
					Cancel: function() {
						$(this).dialog( "close" );
						$(this).remove();
					}
				},
				dialogClass: 'no-close' 	
			});
			
			dialog.append("<form><fieldset><p><label for=\"tramosSpinner\">Numero de tramos:</label><input id=\"tramosSpinner\" name=\"tramosValue\" type=\"text\"></p><div id=\"tramosSlider\"></div></fieldset></form>");;
			
			form = dialog.find( "form" ).on( "submit", function( event ) {
				event.preventDefault();
			});		
			
			var tramosSpinner = $( "#tramosSpinner" ).spinner({
				min: 1,
				max: 254,
				step: 1,
				start: 1,
				stop: (function (event, ui) {
					$( "#tramosSlider" ).slider( "value", $(this).spinner('value') );
				}),
				spin: (function(event, ui ){
					$( "#tramosSlider" ).slider( "value", ui.value );
				})
				}).on('input', function () {
				var val = this.value,
				$this = $(this),
				max = $this.spinner('option', 'max'),
				min = $this.spinner('option', 'min');
				if (!val.match(/^\d*$/)) val = 1; //we want only number, no alpha
				this.value = (val > max) ? max : val;
			});	
			
			$( "#tramosSlider" ).slider({
				range: "min",
				value: 1,
				min: 1,
				autofocus: "autofocus",
				max: 254,
				slide: function( event, ui ) {
					tramosSpinner.spinner( "value", ui.value );
				}
			});
			tramosSpinner.spinner( "value", $( "#tramosSlider" ).slider( "value" ));
			
			dialog.dialog();
		}
	});		
	
	$("#instaDownloadButton").click(function() {
		if(typeof objetosBogui[objetoActual] == 'undefined'){
			mostrarError("Debe seleccionar una imagen para descargar");
		}else{
			descargarImagen(objetosBogui[objetoActual], window.formatoDescarga);
		}	
	});		
	
	$("#saveImage").click(function() {
		if(typeof objetosBogui[objetoActual] == 'undefined'){
			mostrarError("Debe seleccionar una imagen para descargar");
			}else{
			descargarImagen(objetosBogui[objetoActual], window.formatoDescarga);
		}	
	});			
	
	$("#downloadButton").click(function() {
		if(typeof objetosBogui[objetoActual] == 'undefined'){
			mostrarError("Debe seleccionar una imagen para descargar");
		}else{
			//TODO: dialogo para seleccionar formato y nombre y demas
			descargarImagen(objetosBogui[objetoActual], window.formatoDescarga);
		}
	});		

	$("#roi").click(function() {
		if(typeof objetosBogui[objetoActual] == 'undefined'){
			mostrarError("No se puede ejecutar el comando sin una imagen seleccionada"); 
		}else{
			resetearRegionInteres();
			herramientaActual = "roi";
		}
	});	

	$("#puntero").click(function() {
		if(typeof objetosBogui[objetoActual] == 'undefined'){
			mostrarError("No se puede ejecutar el comando sin una imagen seleccionada"); 
		}else{
			herramientaActual = "puntero";
			//Se limpia el canvas y se resetea la posicion guardada del click
			resetearRegionInteres();
		}
	});	

	$("#recortar").click(function() {
		if(typeof objetosBogui[objetoActual] == 'undefined'){
			mostrarError("No se puede ejecutar el comando sin una imagen seleccionada"); 
		}else{
			if(herramientaActual != "roi"){
				mostrarError("Debe tener seleccionada la herramienta \"Región de interés\" para poder recortar"); 	
			}else{
				recortar(objetosBogui[objetoActual]);
			}
		}
	});	
	
	$("#histograma").click(function() {
		if(typeof objetosBogui[objetoActual] == 'undefined'){
			mostrarError("No se puede ejecutar el comando sin una imagen seleccionada"); 
		}else{
			crearHistogramaSimple(objetosBogui[objetoActual]);
		}
	});	
	
	$("#histogramaAcumulativo").click(function() {
		if(typeof objetosBogui[objetoActual] == 'undefined'){
			mostrarError("No se puede ejecutar el comando sin una imagen seleccionada"); 
		}else{
			crearHistogramaAcumulativo(objetosBogui[objetoActual]);
			
		}
	});	
		
	$("#correccionGamma").click(function() {
		if(typeof objetosBogui[objetoActual] == 'undefined'){
			mostrarError("No se puede ejecutar el comando sin una imagen seleccionada"); 
		}else{
			var dialog, form;
			
			$("body").append("<div id=\"dialog\"></div>");
			dialog = $( "#dialog" ).dialog({
				title: "Correccion gamma:",
				height: 200,
				width: 350,
				modal: true,	
				buttons: {
				Ok:function() {
					  //COGEMOS LOS VALORES
						var gamma =  $( "#gammaText" ).val();
						var error = false;
										
						if(gamma == null )
						{
							error = true;
						}
						
						if(error == false)
						{
								gamma = eval(gamma);
								correccionGamma(objetosBogui[objetoActual], gamma);
								$(this).dialog( "close" );
								$(this).remove();
						}else
						{
							mostrarError("El valor gamma no es correcto");
						}
				},
				Cancel: function() {
					  $(this).dialog( "close" );
					  $(this).remove();
				}
				},
				dialogClass: 'no-close' 	
			});
			
			dialog.append("<form><fieldset><p><label for=\"gammaText\">Valor de gamma:</label><input id=\"gammaText\" name=\"gammaValue\" type=\"text\"></p></fieldset></form>");;

			form = dialog.find( "form" ).on( "submit", function( event ) {
			  event.preventDefault();
			});		
			
			$( "#gammaText" ).on('input', function () {
				 var val = this.value,
					 $this = $(this);
					 var min = 0;
					 if (!val.match(/^(\d*(\.\d*)?)((\.|\/)(\d*(\.\d*)?))?$/)) val = 1; //we want only number, no alpha
				 this.value = (val < min) ? min : val;
			 });	
			 
			$("#gammaText").val("1")
			dialog.dialog();
			
		}	
	});			

	$("#informacion").click(function() {
		if(typeof objetosBogui[objetoActual] == 'undefined'){
			mostrarError("No se puede ejecutar el comando sin una imagen seleccionada"); 
		}else{
			mostrarInformacion(objetosBogui[objetoActual]);
		}
	});	

	$("#ics").click(function() {
		if(typeof objetosBogui[objetoActual] == 'undefined'){
			mostrarError("No se puede ejecutar el comando sin una imagen seleccionada"); 
		}else{
			resetearRegionInteres();
			herramientaActual = "ics";
		}
	});	 

	$("#imageCrossSection").click(function() {
		if(typeof objetosBogui[objetoActual] == 'undefined'){
			mostrarError("No se puede ejecutar el comando sin una imagen seleccionada"); 
		}else{
			
			if(herramientaActual != "ics"){
				mostrarError("Debe tener seleccionada la herramienta \"Región de interés\" para poder recortar"); 	
			}else{
				var pixeles = calcularPixelesICS(objetosBogui[objetoActual]);
				crearGraficaICS(objetosBogui[objetoActual], pixeles);
			}

		}
	});	 


	$("#informacionImagen").click(function() {
		if(typeof objetosBogui[objetoActual] == 'undefined'){
			mostrarError("No se puede ejecutar el comando sin una imagen seleccionada"); 
			}else{
			mostrarInformacion(objetosBogui[objetoActual]);
		}
	});	    	
	
	$(window).load(function()
	{
		centerContent();
	});
	
	$(window).resize(function()
	{
		centerContent();
	});
	
	//TODO: Guardar Imagen, Guardar Imagen Como, Abrir Imagen Como
});


function centerContent()
{
	var container = $('#workspace');
	var content = $('#dropContent');
	content.css("left", (container.width()-(content.width()))/2);
	content.css("top", (container.height()-(content.height()))/2);

}

function mostrarInformacion(objetoBoguiActual){

	var dialog, form;
	
	idObjeto = "dialogoInformacion"+ objetoBoguiActual.ident;

	dialogoInformacion = jQuery('<div/>', {
	    id: idObjeto,
	}).appendTo('body');


	dialog = dialogoInformacion.dialog({
		title: "Informacion de la imagen: " + objetoBoguiActual.nombre,
		width: 400,
		buttons: {
			Ok:function(ui) {
				$(this).dialog( "close" );
				$(this).remove();
			}
		}
	});

	dialog.on("dialogclose",function(e){			
		$(this).dialog( "close" );
		$(this).remove();	
 	});
	
	dialog.append("<table><tbody><tr><td><label>Nombre:</label></td><td><span id=\"nameValue"+ objetoBoguiActual.ident +"\"></span></td></tr><tr><td><label>Modo de color:</label></td><td><span id=\"modoValue"+ objetoBoguiActual.ident +"\"></span></td></tr><tr><td><label>Brillo:</label></td><td><span id=\"brilloValue"+ objetoBoguiActual.ident +"\"></span></td></tr><tr><td><label>Contraste:</label></td><td><span id=\"contrasteValue"+ objetoBoguiActual.ident +"\"></span></td></tr><tr><td><label>Entropia:</label></td><td><span id=\"entropiaValue"+ objetoBoguiActual.ident +"\"></span></td></tr><tr><td><label>Valor mínimo de gris:</label></td><td><span id=\"minGris"+ objetoBoguiActual.ident +"\"></span></td></tr><tr><td><label>Valor máximo de gris:</label></td><td><span id=\"maxGris"+ objetoBoguiActual.ident +"\"></span></td></tr><tr><td><label>Formato:</label></td><td><span id=\"formatoValue"+ objetoBoguiActual.ident +"\"></span></td></tr><tr><td><label>Tamaño:</label></td><td><span id=\"sizeValue"+ objetoBoguiActual.ident +"\"></span></td></tr></tbody></table>");
	$("#nameValue"+ objetoBoguiActual.ident).html(objetoBoguiActual.nombre);
	$("#modoValue"+ objetoBoguiActual.ident).html(objetoBoguiActual.modo);
	$("#brilloValue"+ objetoBoguiActual.ident).html(calcularBrilloContraste(objetoBoguiActual)[0]);
	$("#contrasteValue"+ objetoBoguiActual.ident).html(calcularBrilloContraste(objetoBoguiActual)[1]);
	$("#entropiaValue"+ objetoBoguiActual.ident).html(calcularEntropia(objetoBoguiActual));
	$("#minGris"+ objetoBoguiActual.ident).html(calcularLimitesColor(objetoBoguiActual)[0]);
	$("#maxGris"+ objetoBoguiActual.ident).html(calcularLimitesColor(objetoBoguiActual)[1]);
	$("#formatoValue"+ objetoBoguiActual.ident).html(objetoBoguiActual.formato);
	$("#sizeValue"+ objetoBoguiActual.ident).html(objetoBoguiActual.imgCanvas.width+"X"+objetoBoguiActual.imgCanvas.height);
	
	form = dialog.find( "form" ).on( "submit", function( event ) {
		event.preventDefault();
	});		
	
	dialog.dialog();	
}

function transformacionLinealTramosDialog(numTramos){
		var dialog, form;
		
		$("body").append("<div id=\"dialog\"></div>");
		dialog = $( "#dialog" ).dialog({
			title: "Especifique los tramos:",
			height: 515,
			width: 700,
			modal: true,
			buttons: {
			Ok:function() {
				    var error = false;
					var puntoAnterior = -1;
					var counter = 0;
					var puntos = [];

					while(error == false && counter <= numTramos)
					{
						var a =  $( this ).find( '#a'+counter ).spinner( "value" );
						var b =  $( this ).find( '#b'+counter ).spinner( "value" );			
						if((a != null && b != null) && ( a <= puntoAnterior) )
						{
							puntos = null;
							error = true;							
						}else
						{
							puntoAnterior = a;
							counter = counter+1;
							puntos.push([a,b]);	
						}
					}
					
					if(error == false)
					{
						transformacionLinearPorTramos(objetosBogui[objetoActual], puntos);
						$(this).dialog( "close" );
						$(this).remove();
					}else
					{
						mostrarError("Hay parametros incorrectos. El tramo debe ser progesivo");
					}

			},
			Cancel: function() {
				  $(this).dialog( "close" );
				  $(this).remove();
			}
			},
			dialogClass: 'no-close' 	
		});
		
		var tramos = "<form class=\"quarter floatleft\"><fieldset><table><tbody>";
		
		for(i=0; i <= numTramos; i++){
				tramos = tramos + "<tr><td><label>Punto "+(i+1)+":</label></td><td><input id=\"a"+i+"\" name=\"a"+i+"\" type=\"text\"></td><td><input id=\"b"+i+"\" name=\"b"+i+"\" type=\"text\"></td></tr>";
		}
		
		dialog.append(tramos+"</tbody></table></form>");;
		dialog.append("<div id=\"graficaTramos\" class=\"threequarter floatleft\"></div>");
		form = dialog.find( "form" ).on( "submit", function( event ) {
		  event.preventDefault();
		});			
		
	    $('#graficaTramos').highcharts({
       	chart: {
            type: 'scatter'
        },
        title: {
            text: 'Tramos'
        },
        subtitle: {
            text: 'Especificacion de los tramos del usuario.'
        },
        xAxis: {
            min: 0,
            max: 255            
        },
        yAxis: {
            min: 0,
            max: 255,        
			title: null,
            tickInterval: 15
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            series: {
                lineWidth: 1,
            }
        },
        series: [{
            data: []
        }]	
		});		
	
		for(i=0; i <= numTramos; i++){
			var tramoASpinner = $( "#a"+i ).spinner({
				min: 0,
				max: 255,
				step: 1,
				start: 0,
				change: function (event, ui) {
					actualizarGraficaTramos(numTramos);
				}		
			}).on('input', function () {
				 var val = this.value,
					 $this = $(this),
					 max = $this.spinner('option', 'max'),
					 min = $this.spinner('option', 'min');
					 if (!val.match(/^\d*$/)) val = 0; //we want only number, no alpha
				 this.value = (val > max) ? max : val;
			 });	
			 
			var tramoBSpinner = $( "#b"+i ).spinner({
				min: 0,
				max: 255,
				step: 1,
				start: 0,
				change: function (event, ui) {
					actualizarGraficaTramos(numTramos);
				}
			}).on('input', function () {
				 var val = this.value,
					 $this = $(this),
					 max = $this.spinner('option', 'max'),
					 min = $this.spinner('option', 'min');
					 if (!val.match(/^\d*$/)) val = 0; //we want only number, no alpha
				 this.value = (val > max) ? max : val;
			 });				 
			 
		}

		//AÑADIMOS LOS PRIMEROS PUNTOS
		$("#a0").spinner( "value",0 );
		$("#a0").spinner( "disable" );
		$("#b0").spinner( "value",0 );

		
		$("#a"+numTramos).spinner( "value",255 );
		$("#a"+numTramos).spinner( "disable" );
		$("#b"+numTramos).spinner( "value",255);
	
		
	
		actualizarGraficaTramos(numTramos);
		dialog.dialog();
}

function actualizarGraficaTramos(numTramos){	
	var puntoAnterior = 0;
	var counter = 0;
	var puntos = [];
	
	while(counter <= numTramos)
	{
		var a =  $( "#dialog" ).find( '#a'+counter ).spinner( "value" );
		var b =  $( "#dialog" ).find( '#b'+counter ).spinner( "value" );	
		
		if((a != null && b != null) && ( a >= puntoAnterior) )
		{
			puntoAnterior = a;
			puntos.push([a,b]);
		}
		counter = counter+1;
	}
	$("#graficaTramos").highcharts().series[0].setData(puntos);
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



function clearFileInput(){
        var oldInput = document.getElementById("fileSelector");
 
        var newInput = document.createElement("input");
 
        newInput.type = "file";
        newInput.id = oldInput.id;
        newInput.style.cssText = oldInput.style.cssText;
        oldInput.parentNode.replaceChild(newInput, oldInput);
        $("#fileSelector").on("change", readImage);
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
	this.dialogoHistograma;
	this.contenedorHistograma;
	this.dialogoHistogramaAcumulativo;
	this.contenedorHistogramaAcumulativo;
	this.mouseXini = 0; //Variables para funciones que requieras capturar posiciones de raton
	this.mouseYini = 0;
	this.mouseXfin = 0; //Variables para funciones que requieras capturar posiciones de raton
	this.mouseYfin = 0;
	
	//METODOS

	
	this.imgCanvas = document.createElement("canvas");
	this.imgCanvas.setAttribute("id", "canvas"+this.ident);
	this.imgCanvas.setAttribute("height", this.imagen.height);
	this.imgCanvas.setAttribute("width", this.imagen.width);
	this.imgCanvas.setAttribute("class", "capaCanvas");

	
	//Crear ventana con el canvas
	this.dialogo = $('<div/>', {
	    id: "dialogo" + this.ident,
		title: this.nombre,
	   	height: window.maxHeight,
		width: window.maxWidth	
	}).appendTo('#workspace');



	var canvasContainer = $("<div id=\"canvasContainer"+this.ident+"\" class=\"canvasContainer\"></div>");
	canvasContainer.append(this.imgCanvas);

	this.dialogo.dialog({ resizable: false });
	
	this.dialogo.on("dialogclose",function(e){			
		var exp = /dialogo(\d+)/i
		var res = exp.exec(e.target.id);
		var idActual = res[1];
		borrarObjetoBogui(idActual);
		$(this).dialog( "close" );
		$(this).remove();	
 	});
	
	this.dialogo.on( "dialogfocus", function( e, ui ) {
						var exp = /dialogo(\d+)/i
						var res = exp.exec(e.target.id);
						var idActual = res[1];
						cambiarFoco(idActual);
						} );

	//Dibujar imagen en el canvas
	this.ctx = this.imgCanvas.getContext('2d');
	this.ctx.drawImage(this.imagen, 0, 0);

	//Reducir imagen y ponerla en blanco y negro
	reducirImagen(this);
	RGBA2BW(this);



	this.regCanvas = document.createElement("canvas");
	this.regCanvas.setAttribute("id", "canvasreg"+this.ident);
	this.regCanvas.setAttribute("height", this.imgCanvas.height);
	this.regCanvas.setAttribute("width", this.imgCanvas.width);
	this.regCanvas.setAttribute("z-index", 1);
	this.regCanvas.setAttribute("class", "capaCanvas");

	
	canvasContainer.append(this.regCanvas);
	canvasContainer.append("<div style=\"clear:both\"></div>");
	canvasContainer.css("height",this.imgCanvas.height+"px");
	canvasContainer.css("width",this.imgCanvas.width+"px");
	
	$('.ui-dialog :button').blur();//REMOVE FOCUS
	
	this.dialogo.append(canvasContainer);
	this.dialogo.append("<div id=\"position"+this.ident+"\"><span id=\"coordinates"+this.ident+"\">x= - y= - value= - </span></div>");
	//Ajustar tamaño de la ventana
	this.dialogo.dialog("option", "width", this.imgCanvas.width + 24); 
	this.dialogo.css("overflow","hidden");
	

	//Listeners del canvas
	$(this.regCanvas).mousedown(function(e){

		
		var exp = /canvasreg(\d+)/i
		var res = exp.exec(e.target.id);
		var idActual = res[1];

		switch(herramientaActual){
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
	});

	$(this.regCanvas).mouseup(function(e){
		
		var exp = /canvasreg(\d+)/i
		var res = exp.exec(e.target.id);
		var idActual = res[1];

		switch(herramientaActual){
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
	});

	$(this.regCanvas).mousemove(function(e) {

        var pos = findPos(this);
        var x = e.pageX - pos.x;
        var y = e.pageY - pos.y;

        var exp = /canvasreg(\d+)/i
		var res = exp.exec(e.target.id);
		var idActual = res[1];

		switch(herramientaActual){
			case "roi":
		        if(objetosBogui[obtenerPosArray(idActual)].click == true){
		        	var estado = 0;
			        objetosBogui[obtenerPosArray(idActual)].mouseXfin = e.pageX - pos.x;
			        objetosBogui[obtenerPosArray(idActual)].mouseYfin = e.pageY - pos.y;
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
			        objetosBogui[obtenerPosArray(idActual)].mouseXfin = e.pageX - pos.x;
		        	objetosBogui[obtenerPosArray(idActual)].mouseYfin = e.pageY - pos.y;
					dibujarLineaICS(objetosBogui[obtenerPosArray(idActual)]);
				}
			break;
			default:
        }

        var p = objetosBogui[obtenerPosArray(idActual)].ctx.getImageData(x, y, 1, 1).data;
        var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
        var rgb = obetenerColorDesdeCoordenadas(objetosBogui[obtenerPosArray(idActual)],x,y);
		if(x >= 0 && y >= 0){
			$("#coordinates"+ objetosBogui[obtenerPosArray(idActual)].ident).html("x=" + x + " y=" + y + " Hex=" + hex + " RGB=" + rgb);
		}
                

    });		
}

function resetearRegionInteres(){
	for(var i = 0; i < objetosBogui.length; i++){
				objetosBogui[i].regCanvas.width = objetosBogui[i].regCanvas.width;
				objetosBogui[i].mouseXini = 0;
				objetosBogui[i].mouseYini = 0;		
				objetosBogui[i].mouseXfin = 0;
				objetosBogui[i].mouseYfin = 0;
			}
}

function dibujarRegionInteres(objetoBoguiActual, estado){

	objetoBoguiActual.regCanvas.width = objetoBoguiActual.regCanvas.width;
	objetoBoguiActual.regctx = objetoBoguiActual.regCanvas.getContext("2d");

	objetoBoguiActual.regctx.rect(objetoBoguiActual.mouseXini, objetoBoguiActual.mouseYini, objetoBoguiActual.mouseXfin - objetoBoguiActual.mouseXini , objetoBoguiActual.mouseYfin - objetoBoguiActual.mouseYini);
	objetoBoguiActual.regctx.lineWidth="1";
	objetoBoguiActual.regctx.setLineDash([5,2]);

	objetoBoguiActual.regctx.strokeStyle="#39b1cc";
	objetoBoguiActual.regctx.stroke();
}




function calcularPixelesICS(objetoBoguiActual){
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
  } 
  else {
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
  }
  else{
    p = 2*dx - dy;
    incE = 2*dx;
    incNE = 2*(dx-dy);
    while (y != objetoBoguiActual.mouseYfin){
      y = y + stepy;
      if (p < 0){
        p = p + incE;
      }
      else {
        x = x + stepx;
        p = p + incNE;
      }
      pixeles.push([x,y]);
    }
  }
  return pixeles;
}

function calcularMedia(puntos){
	var total = 0;
	for(i = 0; i < puntos.length; i++){
		total += puntos[i];
	}
	return (total/puntos.length);
}

function crearGraficaICS(objetoBoguiActual, pixeles){

	var imageData = objetoBoguiActual.ctx.getImageData(0, 0, objetoBoguiActual.imgCanvas.width, objetoBoguiActual.imgCanvas.height);
	var pixelData = imageData.data;
	var bytesPerPixel = 4;
	var x,y;
	var grafica = [];

	for(i = 0; i < pixeles.length; i++){

		x = pixeles[i][0];
		y = pixeles[i][1];
		var startIdx = (y * bytesPerPixel * objetoBoguiActual.imgCanvas.width) + (x * bytesPerPixel);
		grafica.push(pixelData[startIdx]);	
	}

	var derivadaGrafica = [];

	for(i = 0; i < grafica.length-1; i++){
		derivadaGrafica.push(Math.abs(grafica[i+1]-grafica[i]));	
	}

	//TODO: Decidir si dejar 0 o el ultimo valor
	//derivadaGrafica.push(grafica[grafica.length-1]);
	derivadaGrafica.push(0);
	

	var derivadaGraficaSuavizada = [];
	var cantidadSuavizado = 3;
	var puntos;
	var i = 0;
	while(i < derivadaGrafica.length-1){
		console.log("i " + i);
		puntos = [];

		for(j = i-cantidadSuavizado; j <= i+cantidadSuavizado; j++){
			console.log("j " + j);
			if( (j > 0) && (j < derivadaGrafica.length)){
				puntos.push(derivadaGrafica[j]);
			}

		}
		derivadaGraficaSuavizada.push(calcularMedia(puntos));
		i++;		
	}


	dialogoICS = $('<div/>', {
	    	id: "dialogoICS" + objetoBoguiActual.ident,

	}).appendTo('body');

	dialogoICS.on("dialogclose",function(e){			
		$(this).dialog( "close" );
		$(this).remove();	
 	});

	contenedorICS = $('<div/>').appendTo(dialogoICS);
	contenedorICS.attr("autofocus", "autofocus");
	
	contenedorICS.highcharts({
        chart: {
            type: 'column',
	    width: anchoHistograma - 50,
	    height: altoHistograma - 70
        },
        title: {
            text: 'Image-Cross Section'
        },
        xAxis: {
            min: 0,
            max: pixeles.length,
            title: {
                text: 'Pixel'
            }
        },
        yAxis: {
            min: 0,
	    	max: 255,
            title: {
                text: 'Valor de gris'
            }
        },
        tooltip: {
                formatter: function() {
                    var tooltip;
	            	if (this.series.name == 'Media') {
	                	tooltip = '<table>'+'<tr><td style="color:'+this.series.color+'; padding:0; font-weight:bold;">'+this.series.name+': </td>' +
	                '<td style="padding:0"><b>'+this.x+'</b></td></tr>'
	            	}else{
	            		tooltip = '<table><tr><td style="color:'+this.series.color+'}; padding:0"; font-weight:bold;>'+ 'Nivel de Gris'+': </td>' + '<td style="padding:0"><b>'+this.key+' </b></td></tr>'+
	            				  '<tr><td style="color:'+this.series.color+'; padding:0"; font-weight:bold;>'+this.series.name+': </td>' + '<td style="padding:0"><b>'+this.y+' </b></td></tr></table>'
	            	}
	            	return tooltip;
                },
                useHTML: true
        },

        plotOptions: {
            column: {
                pointPadding: 0,
                borderWidth: 0
            }
        },
        series: [
        	{
            name: 'Perfil',
            data: grafica,
	    	color: "#39b1cc"
        	},
        	{
            name: 'Perfil Derivado',
            data: derivadaGrafica,
	    	color: "#FF0000"
        	},
        	{
            name: 'Perfil Derivado Suavizado',
            data: derivadaGraficaSuavizada,
	    	color: "#0000FF"
        	}
		]
    });
	//APPEND
	dialogoICS.dialog();
	dialogoICS.dialog("option", "title", "Image-Cross Section: " + objetoBoguiActual.nombre);
	dialogoICS.dialog("option", "resizable", false);
	dialogoICS.dialog("option", "width", anchoHistograma); 
	dialogoICS.dialog("option", "height", altoHistograma);
}






function dibujarLineaICS(objetoBoguiActual, estado){

	objetoBoguiActual.regCanvas.width = objetoBoguiActual.regCanvas.width;
	objetoBoguiActual.regctx = objetoBoguiActual.regCanvas.getContext("2d");

	if(objetoBoguiActual.regctx.mouseXini > objetoBoguiActual.regctx.mouseXfin){
		aux = objetoBoguiActual.regctx.mouseXini;
		objetoBoguiActual.regctx.mouseXini = objetoBoguiActual.regctx.mouseXfin;
		objetoBoguiActual.regctx.mouseXfin = aux;
	}

	if(objetoBoguiActual.regctx.mouseYini > objetoBoguiActual.regctx.mouseYfin){
		aux = objetoBoguiActual.regctx.mouseYini;
		objetoBoguiActual.regctx.mouseYini = objetoBoguiActual.regctx.mouseYfin;
		objetoBoguiActual.regctx.mouseYfin = aux;
	}

	//objetoBoguiActual.regctx.rect(objetoBoguiActual.mouseXini, objetoBoguiActual.mouseYini, objetoBoguiActual.mouseXfin - objetoBoguiActual.mouseXini , objetoBoguiActual.mouseYfin - objetoBoguiActual.mouseYini);
	objetoBoguiActual.regctx.beginPath();
	objetoBoguiActual.regctx.moveTo(objetoBoguiActual.mouseXini, objetoBoguiActual.mouseYini);
	objetoBoguiActual.regctx.lineTo(objetoBoguiActual.mouseXfin, objetoBoguiActual.mouseYfin);
	objetoBoguiActual.regctx.lineWidth="1";
	objetoBoguiActual.regctx.setLineDash([5,2]);

	objetoBoguiActual.regctx.strokeStyle="#39b1cc";
	objetoBoguiActual.regctx.stroke();
}

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

function obtenerPosArray(id){

	var i = 0;
	for(i = 0; i < objetosBogui.length; i++){
		if(objetosBogui[i].ident == id ){
			return i;	
		}
	}

}

function mostrarError(mensaje){
	$("body").append("<div id=\"dialog-message\"><div class=\"izq\"><img src=\"../images/error.png\" alt=\"Error\"></div><div class=\"dcha\"><p>"+mensaje+"</p></div></div>");
	$("#dialog-message").dialog({
		title: "Error",
		modal: true,
		buttons: {
		Ok: function() {
		  $(this).dialog( "close" );
		  $(this).remove();
		}
		},
		dialogClass: 'no-close' 
	});

}

function cambiarFoco(foco){
	
	var i = 0;
	for(i = 0; i < objetosBogui.length; i++){
		if(objetosBogui[i].ident == foco ){
			objetoActual = i;	
		}
	}
}

function descargarImagen(objetoBoguiActual, formato){

	var dataUrl;
	var link = document.createElement('a');
   	
	switch(formato){
	case "png":
		dataUrl = objetoBoguiActual.imgCanvas.toDataURL('image/png', 1); // obtenemos la imagen como png
		dataUrl = dataUrl.replace("image/png",'image/octet-stream'); // sustituimos el tipo por octet
		link.download = objetoBoguiActual.nombre + ".png";
		break;
	case "jpeg":
		dataUrl = objetoBoguiActual.imgCanvas.toDataURL('image/jpeg', 1);
		dataUrl = dataUrl.replace("image/jpeg",'image/octet-stream'); // sustituimos el tipo por octet
		link.download = objetoBoguiActual.nombre + ".jpeg";
		break;
	case "webp":
		dataUrl = objetoBoguiActual.imgCanvas.toDataURL('image/webp', 1);
		dataUrl = dataUrl.replace("image/webp",'image/octet-stream'); // sustituimos el tipo por octet
		link.download = objetoBoguiActual.nombre + ".webp";
		break;
	default:
		dataUrl = objetoBoguiActual.imgCanvas.toDataURL();
		dataUrl = dataUrl.replace("image/png",'image/octet-stream'); // sustituimos el tipo por octet
		link.download = objetoBoguiActual.nombre + ".png";
	}
	link.href = dataUrl;
   	link.click();
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

function crearHistogramaSimple(objetoBoguiActual){

	calcularHistogramaSimple(objetoBoguiActual);
	//Histograma Simple
	objetoBoguiActual.dialogoHistograma = $('<div/>', {
	    	id: "dialogoHistogramaSimple" + objetoBoguiActual.ident,

	}).appendTo('body');

	objetoBoguiActual.dialogoHistograma.on("dialogclose",function(e){			
		$(this).dialog( "close" );
		$(this).remove();	
 	});

	objetoBoguiActual.contenedorHistograma = $('<div/>').appendTo(objetoBoguiActual.dialogoHistograma);
	objetoBoguiActual.contenedorHistograma.attr("autofocus", "autofocus");
	
	objetoBoguiActual.contenedorHistograma.highcharts({
        chart: {
            type: 'column',
	    width: anchoHistograma - 50,
	    height: altoHistograma - 70
        },
        title: {
            text: 'Histograma'
        },
        xAxis: {
            min: 0,
            max: 255,
            title: {
                text: 'Intensidad'
            }
        },
        yAxis: {
            min: 0,
	    	max: Math.max.apply(Math, objetoBoguiActual.histograma),
            title: {
                text: 'Cantidad de Pixeles'
            }
        },
        tooltip: {
                formatter: function() {
                    var tooltip;
	            	if (this.series.name == 'Media') {
	                	tooltip = '<table>'+'<tr><td style="color:'+this.series.color+'; padding:0; font-weight:bold;">'+this.series.name+': </td>' +
	                '<td style="padding:0"><b>'+this.x+'</b></td></tr>'
	            	}else{
	            		tooltip = '<table><tr><td style="color:'+this.series.color+'}; padding:0"; font-weight:bold;>'+ 'Nivel de Gris'+': </td>' + '<td style="padding:0"><b>'+this.key+' </b></td></tr>'+
	            				  '<tr><td style="color:'+this.series.color+'; padding:0"; font-weight:bold;>'+this.series.name+': </td>' + '<td style="padding:0"><b>'+this.y+' </b></td></tr></table>'
	            	}
	            	return tooltip;
                },
                useHTML: true
        },

        plotOptions: {
            column: {
                pointPadding: 0,
                borderWidth: 0
            }
        },
        series: [{
            name: 'Histograma Simple',
            data: objetoBoguiActual.histograma,
	    	color: "#39b1cc"
        	},
        	{
            name: 'Media',
            data: [[calcularBrilloContraste(objetoBoguiActual)[0], Math.max.apply(Math, objetoBoguiActual.histograma)]],
	    	color: "#E70000"
        	}
		]
    });
	//APPEND
	objetoBoguiActual.dialogoHistograma.dialog();
	objetoBoguiActual.dialogoHistograma.dialog("option", "title", "Histograma: " + objetoBoguiActual.nombre);
	objetoBoguiActual.dialogoHistograma.dialog("option", "resizable", false);
	objetoBoguiActual.dialogoHistograma.dialog("option", "width", anchoHistograma); 
	objetoBoguiActual.dialogoHistograma.dialog("option", "height", altoHistograma);
}

function calcularHistogramaAcumulativo(objetoBoguiActual){
	calcularHistogramaSimple(objetoBoguiActual);
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

function crearHistogramaAcumulativo(objetoBoguiActual){
	calcularHistogramaAcumulativo(objetoBoguiActual);
	
	objetoBoguiActual.dialogoHistogramaAcumulativo = jQuery('<div/>', {
	    	id: "dialogoHistogramaAcumulativo" + objetoBoguiActual.ident
	}).appendTo('body');

	
	objetoBoguiActual.contenedorHistogramaAcumulativo = jQuery('<div/>').appendTo(objetoBoguiActual.dialogoHistogramaAcumulativo);
	objetoBoguiActual.contenedorHistogramaAcumulativo.attr("autofocus", "autofocus");
	
	objetoBoguiActual.contenedorHistogramaAcumulativo.highcharts({
        chart: {
            type: 'column',
	    width: anchoHistograma - 50,
	    height: altoHistograma - 70
        },
        title: {
            text: 'Histograma Acumulativo'
        },
        xAxis: {
            min: 0,
            title: {
                text: 'Intensidad'
            }
        },
        yAxis: {
            min: 0,
	    max: Math.max.apply(Math, objetoBoguiActual.histogramaAcumulativo),
            title: {
                text: 'Cantidad de Pixeles'
            }
        },
        tooltip: {
                formatter: function() {
                    var tooltip;
	            	if (this.series.name == 'Media') {
	                	tooltip = '<table>'+'<tr><td style="color:'+this.series.color+'; padding:0; font-weight:bold;">'+this.series.name+': </td>' +
	                '<td style="padding:0"><b>'+this.x+'</b></td></tr>'
	            	}else{
	            		tooltip = '<table><tr><td style="color:'+this.series.color+'}; padding:0"; font-weight:bold;>'+ 'Nivel de Gris'+': </td>' + '<td style="padding:0"><b>'+this.key+' </b></td></tr>'+
	            				  '<tr><td style="color:'+this.series.color+'; padding:0"; font-weight:bold;>'+this.series.name+': </td>' + '<td style="padding:0"><b>'+this.y+' </b></td></tr></table>'
	            	}
	            	return tooltip;
                },
                useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0,
                borderWidth: 0
            }
        },
        series: [{
            name: 'Histograma Acumulativo',
            data: objetoBoguiActual.histogramaAcumulativo,
	    	color: "#39b1cc"
			},
			{
            name: 'Media',
            data: [[calcularBrilloContraste(objetoBoguiActual)[0], Math.max.apply(Math, objetoBoguiActual.histogramaAcumulativo)]],
	    	color: "#E70000"
        	}
        ]
    });

	objetoBoguiActual.dialogoHistogramaAcumulativo.dialog();
	objetoBoguiActual.dialogoHistogramaAcumulativo.dialog("option", "title", "Histograma: " + objetoBoguiActual.nombre);
	objetoBoguiActual.dialogoHistogramaAcumulativo.dialog("option", "resizable", false);
	
	objetoBoguiActual.dialogoHistogramaAcumulativo.dialog("option", "width", anchoHistograma); 
	objetoBoguiActual.dialogoHistogramaAcumulativo.dialog("option", "height", altoHistograma);
}

function borrarObjetoBogui(id){
	var i = 0;
	for(i = 0; i < objetosBogui.length; i++){
		if(objetosBogui[i].ident == id ){
			objetosBogui.splice(i, 1);
		}
	}
	if(objetosBogui.length > 0){
		objetosBogui[0].dialogo.dialog( "moveToTop" );
		objetoActual = 0;
	}else{
		objetoActual = null;
	}
}

function reducirImagen(objetoBoguiActual){

	//Hacer un nuevo canvas
	var canvasCopy = document.createElement("canvas");
	var copyContext = canvasCopy.getContext("2d");

	// Determinar el ratio de conversion de la imagen
	var ratio = 1;
	if(objetoBoguiActual.imagen.width > window.maxWidth)
		ratio = window.maxWidth / objetoBoguiActual.imagen.width;
	else if(objetoBoguiActual.imagen.height > window.maxHeight)
		ratio = window.maxHeight / objetoBoguiActual.imagen.height;

	//Dibujar la imagen original en el segundo canvas
	canvasCopy.width = objetoBoguiActual.imagen.width;
	canvasCopy.height = objetoBoguiActual.imagen.height;
	copyContext.drawImage(objetoBoguiActual.imagen, 0, 0);
	//Copiar y cambiar de tamño el segundo canvas en el primer canvas
	objetoBoguiActual.imgCanvas.width = objetoBoguiActual.imagen.width * ratio;
	objetoBoguiActual.imgCanvas.height = objetoBoguiActual.imagen.height * ratio;
	objetoBoguiActual.ctx.drawImage(canvasCopy, 0, 0, canvasCopy.width, canvasCopy.height, 0, 0, objetoBoguiActual.imgCanvas.width, objetoBoguiActual.imgCanvas.height);

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

function obetenerColorDesdeCoordenadas(objetoBoguiActual, posx, posy){

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

function recortar(objetoBoguiActual){ 
	if(typeof objetoBoguiActual == 'undefined'){
		mostrarError("No se puede ejecutar el comando sin una imagen seleccionada");
	}else{

		if((objetoBoguiActual.mouseXini == objetoBoguiActual.mouseXfin) || (objetoBoguiActual.mouseYini == objetoBoguiActual.mouseYfin)){
				mostrarError("Debe seleccionar un area no nula para recortar"); 	
		}else{
			var canvasCopy = document.createElement("canvas");
			var copyContext = canvasCopy.getContext("2d");

			var imageData = objetoBoguiActual.ctx.getImageData( objetoBoguiActual.mouseXini,  objetoBoguiActual.mouseYini,  objetoBoguiActual.mouseXfin -  objetoBoguiActual.mouseXini ,  objetoBoguiActual.mouseYfin -  objetoBoguiActual.mouseYini);

			canvasCopy.width = objetoBoguiActual.mouseXfin -  objetoBoguiActual.mouseXini;
			canvasCopy.height = objetoBoguiActual.mouseYfin -  objetoBoguiActual.mouseYini;

			copyContext.putImageData(imageData, 0,0);

			var savedData = new Image();
			savedData.src = canvasCopy.toDataURL("image/png", 1);
			//Cargar la matriz de datos en el canvas
			objetosBogui.push(new Bogui(savedData, numeroObjetos, objetoBoguiActual.nombre+objetoBoguiActual.formato));
			cambiarFoco(numeroObjetos);
			numeroObjetos++;
		}
	}
}

function calcularBrilloContraste(objetoBoguiActual){
	if(typeof objetoBoguiActual == 'undefined'){
		mostrarError("No se puede ejecutar el comando sin una imagen seleccionada"); 
	}else{
		calcularHistogramaSimple(objetoBoguiActual);
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
}

function cambiarBrilloContraste(objetoBoguiActual, viejoBrillo, viejoContraste, nuevoBrillo, nuevoContraste){
	if(typeof objetoBoguiActual == 'undefined'){
			mostrarError("No se puede ejecutar el comando sin una imagen seleccionada"); 
	}else{

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
}

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

function calcularEntropia(objetoBoguiActual){
	if(typeof objetoBoguiActual == 'undefined'){
		mostrarError("No se puede ejecutar el comando sin una imagen seleccionada"); 
	}else{

		calcularHistogramaSimple(objetoBoguiActual);
		var total = 0;
		var entropia = 0;
	 	for (i = 0; i < objetoBoguiActual.histograma.length; i++){
	 		total += objetoBoguiActual.histograma[i];
	 	}

	    for (i = 0; i < objetoBoguiActual.histograma.length; i++){

			probabilidad = objetoBoguiActual.histograma[i] / total;

			if(probabilidad != 0){
			    entropia += probabilidad * Math.log(probabilidad, 2);
			}
		}		
		return -entropia;			
	}
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

	objetosBogui.push(new Bogui(objetoBoguiActual.imagen, numeroObjetos,objetoBoguiActual.nombre+objetoBoguiActual.formato));
	objetosBogui[ obtenerPosArray( numeroObjetos)].imgCanvas = objetoBoguiActual.imgCanvas;
	objetosBogui[obtenerPosArray( numeroObjetos)].ctx.putImageData(imageData, 0, 0);
	cambiarFoco(numeroObjetos);
	numeroObjetos++;

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

function diferencia(objetoBoguiActual, objetoBoguiResta){


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

function mapaCambios(objetoBoguiActual, objetoBoguiResta, umbral){

	var imageData1 = objetoBoguiActual.ctx.getImageData(0, 0, objetoBoguiActual.imgCanvas.width, objetoBoguiActual.imgCanvas.height);
	var pixelData1 = imageData1.data;
	var bytesPerPixel = 4;
	
	//Comprobar que objetoBoguiResta es menor que objetoBoguiActual
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
				//SE PONEN LOS PIXELES EN ALFA
				pixelData1[startIdx+3] = 100;
			}
		}
	}
	
	objetosBogui.push(new Bogui(objetoBoguiActual.imagen, numeroObjetos,objetoBoguiActual.nombre+objetoBoguiActual.formato));
	objetosBogui[obtenerPosArray(numeroObjetos)].imgCanvas = objetoBoguiActual.imgCanvas;
	objetosBogui[obtenerPosArray( numeroObjetos)].ctx.putImageData(imageData1, 0, 0);
	cambiarFoco(numeroObjetos);
	numeroObjetos++;
	
}