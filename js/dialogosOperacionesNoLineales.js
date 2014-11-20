function simularDigitalizacionDialog(objetoBoguiActual){
	var dialog, form, mayorMuestreo,menorMuestreo;
	
	menorMuestreo = 2;
	if(objetoBoguiActual.imgCanvas.width < objetoBoguiActual.imgCanvas.height){ //TODO: Comprobar si trabajamos sobre la original o sobre la reducida
		mayorMuestreo = objetoBoguiActual.imagen.width;
	}else{
		mayorMuestreo = objetoBoguiActual.imagen.height
	}
	
	$("body").append("<div id=\"dialog\"></div>");
	dialog = $( "#dialog" ).dialog({
		title: "Ajuste lineal de brillo y contraste:",
		height: 250,
		width: 370,
		modal: true,
		buttons: {
			Ok:function(ui) {
				var dimensionMuestreo =  $( this ).find( '#sliderDimension' ).slider( "value" );
				var numeroBits = $( this ).find( '#sliderBits' ).slider( "value" );
				//TODO: Simular digitalizacion
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

	dialog.append("<form><fieldset><p><label for=\"dimensionSpinner\">Tama&ntilde;o de muestreo:</label><input id=\"muestreoSpinner\" name=\"muestreoValue\" type=\"text\"></p><div id=\"sliderMuestreo\"></div><p><label for=\"bitsSpinner\">N&uacute;mero de bits:</label><input id=\"bitsSpinner\" name=\"bitsValue\" type=\"text\"></p><div id=\"sliderBits\"></div></fieldset></form>");

	form = dialog.find( "form" ).on( "submit", function( event ) {
		event.preventDefault();
	});		

	var muestreoSpinner = $( "#muestreoSpinner" ).spinner({
		min: 2,
		max: mayorMuestreo,
		step: 1,
		start: 2,
		stop: (function (event, ui) {
			$( "#sliderMuestreo" ).slider( "value", $(this).spinner('value') );
		}),
		spin: (function(event, ui ){
			$( "#sliderMuestreo" ).slider( "value", ui.value );
		})
	}).on('input', function () {
		var val = this.value,
		$this = $(this),
		max = $this.spinner('option', 'max'),
		min = $this.spinner('option', 'min');
		if (!val.match(/^-?\d*$/)) val = 2; //we want only number, no alpha
		this.value = val > max ? max : val < min ? min : val;
	});	

	$( "#sliderMuestreo" ).slider({
		range: "min",
		value: 0,
		min: 2,
		autofocus: "autofocus",
		max: mayorMuestreo,
		slide: function( event, ui ) {
			muestreoSpinner.spinner( "value", ui.value );
		}
	});
	muestreoSpinner.spinner( "value", $( "#sliderMuestreo" ).slider( "value" ));

	var bitsSpinner = $( "#bitsSpinner" ).spinner({
		min: 1,
		max: 8,
		step: 1,
		start: 1,
		stop: (function (event, ui) {
			$( "#sliderBits" ).slider( "value", $(this).spinner('value') );
		}),
		spin: (function(event, ui ){
			$( "#sliderBits" ).slider( "value", ui.value );
		})
	}).on('input', function () {
		var val = this.value,
		$this = $(this),
		max = $this.spinner('option', 'max'),
		min = $this.spinner('option', 'min');
		if (!val.match(/^\d*$/)) val = 1; //we want only number, no alpha
		this.value = val > max ? max : val < min ? min : val;
	});	

	$( "#sliderBits" ).slider({
		range: "min",
		value: 1,
		min: 1,
		autofocus: "autofocus",
		max: 8,
		slide: function( event, ui ) {
			bitsSpinner.spinner( "value", ui.value );
		}
	});
	bitsSpinner.spinner( "value", $( "#sliderBits" ).slider( "value" ));
	dialog.dialog({ resizable: false });
	dialog.dialog();	
}

function imageCrossSectionDialog(){
	var dialog, form;

	$("body").append("<div id=\"dialog\"></div>");
	dialog = $( "#dialog" ).dialog({
		title: "Perfil (Image-Cross Section):",
		height: 250,
		width: 350,
		modal: true,
		buttons: {
			Ok:function(ui) {
				var cantidadSuavizado =  $( this ).find( '#sliderSuavizado' ).slider( "value" );
				var umbral = $( this ).find( '#sliderUmbral' ).slider( "value" );
				var pixeles = pixelesICS(objetoBoguiActual);//TODO: aplicar umbral y cantidad de suavizado
				graficaICSDialog(objetoBoguiActual, pixeles);
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

	dialog.append("<form><fieldset><p><label for=\"suavizadoSpinner\">Cantidad de suavizado:</label><input id=\"suavizadoSpinner\" name=\"suavizadoValue\" type=\"text\"></p><div id=\"sliderSuavizado\"></div><p><label for=\"umbralSpinner\">Umbral:</label><input id=\"umbralSpinner\" name=\"umbralValue\" type=\"text\"></p><div id=\"sliderUmbral\"></div></fieldset></form>");

	form = dialog.find( "form" ).on( "submit", function( event ) {
		event.preventDefault();
	});		

	var suavizadoSpinner = $( "#suavizadoSpinner" ).spinner({
		min: 0,
		max: 255,
		step: 1,
		start: 0,
		stop: (function (event, ui) {
			$( "#sliderSuavizado" ).slider( "value", $(this).spinner('value') );
		}),
		spin: (function(event, ui ){
			$( "#sliderSuavizado" ).slider( "value", ui.value );
		})
	}).on('input', function () {
		var val = this.value,
		$this = $(this),
		max = $this.spinner('option', 'max'),
		min = $this.spinner('option', 'min');
		if (!val.match(/^-?\d*$/)) val = 0; //we want only number, no alpha
		this.value = val > max ? max : val < min ? min : val;
	});	

	$( "#sliderSuavizado" ).slider({
		range: "min",
		value: 0,
		min: 0,
		autofocus: "autofocus",
		max: 255,
		slide: function( event, ui ) {
			suavizadoSpinner.spinner( "value", ui.value );
		}
	});
	suavizadoSpinner.spinner( "value", $( "#sliderSuavizado" ).slider( "value" ));

	var umbralSpinner = $( "#umbralSpinner" ).spinner({
		min: 0,
		max: 255,
		step: 1,
		start: 0,
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
		value: 0,
		min: 0,
		autofocus: "autofocus",
		max: 255,
		slide: function( event, ui ) {
			umbralSpinner.spinner( "value", ui.value );
		}
	});
	umbralSpinner.spinner( "value", $( "#sliderUmbral" ).slider( "value" ));
	dialog.dialog({ resizable: false });
	dialog.dialog();	
}
function graficaICSDialog(objetoBoguiActual, pixeles){

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
		derivadaGrafica.push(grafica[i+1]-grafica[i]);	
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
	    width: window.anchoHistograma - 50,
	    height: window.altoHistograma - 70
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
            min: -255,
	    	max: 255,
	    	tickInterval: 15,
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
	dialogoICS.dialog("option", "height", window.altoHistograma);
	dialogoICS.dialog({ resizable: false });
}

function correccionGammaDialog(objetoBogui){
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
								
				if(gamma == null ){
					error = true;
				}
				
				if(error == false){
						gamma = eval(gamma);
						correccionGamma(objetosBogui[objetoActual], gamma);
						$(this).dialog( "close" );
						$(this).remove();
				}else{
					errorDialog("El valor gamma no es correcto");
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
	dialog.dialog({ resizable: false });
	dialog.dialog();
}


function especificarHistogramaDialog(objetoBogui){
	$("body").append("<div id=\"dialog\"></div>");
	dialog = $( "#dialog" ).dialog({
		title: "Especificación histograma:",
		height: 170,
		width: 350,
		modal: true,
		buttons: {
			Ok:function(ui) {
				var objetoReferencia = objetosBogui[document.getElementById("imagenesReferencia").value];
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
	for(i = 0; i<objetosBogui.length;i++){
		contenido = contenido + "<option value = \""+i+"\">"+objetosBogui[i].nombre+"</option>";
	}
	contenido = contenido +	"</select></p></fieldset></form>";
	dialog.append(contenido);		
}

function mapaCambiosDialog(objetoBogui){
	var dialog, form;
	var valores = calcularBrilloContraste(objetoBogui);
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
				var objetoReferencia = objetosBogui[document.getElementById("imagenesReferencia").value];					
				var umbral =  $( this ).find( '#sliderUmbral' ).slider( "value" );
				mapaCambios(objetoBogui, objetoReferencia ,umbral);
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
	for(i = 0; i<objetosBogui.length;i++){
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
	dialog.dialog({ resizable: false });
}

function imagenDiferenciaDialog(objetoBogui){
	var dialog, form;
	var valores = calcularBrilloContraste(objetoBogui);
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
				var objetoReferencia = objetosBogui[document.getElementById("imagenesReferencia").value];
				imagenDiferencia(objetoBogui,objetoReferencia);
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
	dialog.dialog({ resizable: false });
}
