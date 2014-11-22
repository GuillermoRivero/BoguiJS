function informacionDialog(objetoBoguiActual){
	var dialog, form,idObjeto,content;
	idObjeto = "dialogoInformacion"+ objetoBoguiActual.ident;
	if(!$( "#"+idObjeto ).length){
		$("body").append("<div id=\""+idObjeto+"\"></div>");
		dialog = $( "#"+idObjeto ).dialog({
			title: "Informacion de la imagen: " + objetoBoguiActual.nombre,
			buttons: {
				Ok:function(ui) {
					$(this).dialog( "close" );
					$(this).remove();
				}
			},
			dialogClass: "no-close",
			dialogClass: "informacion",
			resizable: false 		
		}).append("<table><tbody><tr><td><label>Nombre:</label></td><td><span id=\"nameValue"+ objetoBoguiActual.ident +"\"></span></td></tr><tr><td><label>Modo de color:</label></td><td><span id=\"modoValue"+ objetoBoguiActual.ident +"\"></span></td></tr><tr><td><label>Brillo:</label></td><td><span id=\"brilloValue"+ objetoBoguiActual.ident +"\"></span></td></tr><tr><td><label>Contraste:</label></td><td><span id=\"contrasteValue"+ objetoBoguiActual.ident +"\"></span></td></tr><tr><td><label>Entrop&iacute;a:</label></td><td><span id=\"entropiaValue"+ objetoBoguiActual.ident +"\"></span></td></tr><tr><td><label>Valor m&iacute;nimo de gris:</label></td><td><span id=\"minGris"+ objetoBoguiActual.ident +"\"></span></td></tr><tr><td><label>Valor m&aacute;ximo de gris:</label></td><td><span id=\"maxGris"+ objetoBoguiActual.ident +"\"></span></td></tr><tr><td><label>Formato:</label></td><td><span id=\"formatoValue"+ objetoBoguiActual.ident +"\"></span></td></tr><tr><td><label>Tama&ntilde;o:</label></td><td><span id=\"sizeValue"+ objetoBoguiActual.ident +"\"></span></td></tr></tbody></table>");
		
		dialog.on("dialogclose",function(e){			
			$(this).dialog( "close" );
			$(this).remove();	
		});
		

		$("#nameValue"+ objetoBoguiActual.ident).html(objetoBoguiActual.nombre);
		$("#modoValue"+ objetoBoguiActual.ident).html(objetoBoguiActual.modo);
		$("#brilloValue"+ objetoBoguiActual.ident).html(calcularBrilloContraste(objetoBoguiActual)[0]);
		$("#contrasteValue"+ objetoBoguiActual.ident).html(calcularBrilloContraste(objetoBoguiActual)[1]);
		$("#entropiaValue"+ objetoBoguiActual.ident).html(calcularEntropia(objetoBoguiActual));
		$("#minGris"+ objetoBoguiActual.ident).html(calcularLimitesColor(objetoBoguiActual)[0]);
		$("#maxGris"+ objetoBoguiActual.ident).html(calcularLimitesColor(objetoBoguiActual)[1]);
		$("#formatoValue"+ objetoBoguiActual.ident).html(objetoBoguiActual.formato);
		$("#sizeValue"+ objetoBoguiActual.ident).html(objetoBoguiActual.imgCanvas.width+"X"+objetoBoguiActual.imgCanvas.height);	
	}
}

function errorDialog(mensaje){
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
		dialogClass: 'no-close',
		resizable: false
	});
}

function savedConfigurationDialog(){
	$("body").append("<div id=\"dialog-message\"><div class=\"izq\"><img src=\"../images/saved.png\" alt=\"Configuración Guardada!\"></div><div class=\"dcha\"><p>Tu configuraci&oacute;n ha sido guardada.</p></div></div>");
	$("#dialog-message").dialog({
		title: "Configuración guardada",
		modal: true,
		buttons: {
			Ok: function() {
			  $(this).dialog( "close" );
			  $(this).remove();
			}
		},
		dialogClass: 'no-close',
		resizable: false
	});
}

function histogramaSimpleDialog(objetoBoguiActual){
	var dialog,idObjeto;
	idObjeto = "dialogoHistogramaSimple" + objetoBoguiActual.ident;
	calcularHistogramaSimple(objetoBoguiActual);
	if(!$( "#"+idObjeto ).length){
		//Histograma Simple
		$("body").append("<div id=\"" +idObjeto+"\"></div>");
		dialog = $( "#"+idObjeto).dialog({
			title: "Histograma: " + objetoBoguiActual.nombre,
			width: window.anchoHistograma,
			height: window.altoHistograma,
			resizable: false
		}).on("dialogclose",function(e){			
			$(this).dialog( "close" );
			$(this).remove();	
		});
		
		dialog.highcharts({
			chart: {
				type: 'column',
			width: window.anchoHistograma - 50,
			height: window.altoHistograma - 70
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
	}
}

function histogramaAcumulativoDialog(objetoBoguiActual){
	var dialog,idObjeto;
	idObjeto = "dialogoHistogramaAcumulativo" + objetoBoguiActual.ident;
	calcularHistogramaAcumulativo(objetoBoguiActual);
	//Histograma acumulativo
	if(!$( "#"+idObjeto ).length){
		$("body").append("<div id=\"" +idObjeto+"\"></div>");
		dialog = $( "#"+idObjeto).dialog({
			title: "Histograma acumulativo: " + objetoBoguiActual.nombre,
			width: window.anchoHistograma,
			height: window.altoHistograma,
			resizable: false
		}).on("dialogclose",function(e){			
			$(this).dialog( "close" );
			$(this).remove();	
		});

		dialog.highcharts({
			chart: {
				type: 'column',
				width: window.anchoHistograma - 50,
				height: window.altoHistograma - 70
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
	}	

}

function cambiarDimensionImagenesDialog(){
	var dialog, form;
	$("body").append("<div id=\"dialog\"></div>");
	dialog = $( "#dialog" ).dialog({
		title: "Configuración del tamaño de las imágenes",
		height: 250,
		width: 420,
		modal: true,
		buttons: {
			Ok:function(ui) {
				window.maxHeight =  $( this ).find( '#altoSlider' ).slider( "value" );
				window.maxWidth = $( this ).find( '#anchoSlider' ).slider( "value" );
				if (window.localStorage) { //Si el navegador soporta localStorage
					localStorage.setItem("maxWidth",window.maxWidth);
					localStorage.setItem("maxHeight",window.maxHeight);		
				}
				
				$(this).dialog( "close" );
				$(this).remove();
			},
			Cancel: function() {
				$(this).dialog( "close" );
				$(this).remove();
			}
		},
		dialogClass: 'no-close',
		resizable: false
	});

	dialog.append("<form><fieldset><p><label for=\"altoSpinner\">Altura de las im&aacute;genes:</label><input id=\"altoSpinner\" name=\"altoValue\" type=\"text\"></p><div id=\"altoSlider\"></div><p><label for=\"anchoSpinner\">Ancho de las im&aacute;genes:</label><input id=\"anchoSpinner\" name=\"anchoValue\" type=\"text\"></p><div id=\"anchoSlider\"></div></fieldset></form>");

	var altoSpinner = $( "#altoSpinner" ).spinner({
		min: 100,
		max: 500,
		step: 10,
		start: window.maxHeight,
		stop: (function (event, ui) {
			$( "#altoSlider" ).slider( "value", $(this).spinner('value') );
		}),
		spin: (function(event, ui ){
			$( "#altoSlider" ).slider( "value", ui.value );
		})
	}).bind("keydown", function (event) {
		event.preventDefault();
	}).focus(function () {
		$(this).blur();
	});

	$( "#altoSlider" ).slider({
		range: "min",
		value: window.maxHeight,
		min: 100,
		autofocus: "autofocus",
		max: 500,
		slide: function( event, ui ) {
			altoSpinner.spinner( "value", ui.value );
		}
	});
	altoSpinner.spinner( "value", $( "#altoSlider" ).slider( "value" ));

	var anchoSpinner = $( "#anchoSpinner" ).spinner({
		min: 100,
		max: 500,
		step: 10,
		start: window.maxWidth,
		stop: (function (event, ui) {
			$( "#anchoSlider" ).slider( "value", $(this).spinner('value') );
		}),
		spin: (function(event, ui ){
			$( "#anchoSlider" ).slider( "value", ui.value );
		})
	}).bind("keydown", function (event) {
		event.preventDefault();
	}).focus(function () {
		$(this).blur();
	});

	$( "#anchoSlider" ).slider({
		range: "min",
		value: window.maxWidth,
		min: 0,
		autofocus: "autofocus",
		max: 500,
		slide: function( event, ui ) {
			anchoSpinner.spinner( "value", ui.value );
		}
	});
	anchoSpinner.spinner( "value", $( "#anchoSlider" ).slider( "value" ));

}

function cambiarDimensionHistogramasDialog(){
	var dialog, form;
	$("body").append("<div id=\"dialog\"></div>");
	dialog = $( "#dialog" ).dialog({
		title: "Configuración del tamaño de los histogramas",
		height: 250,
		width: 420,
		modal: true,
		buttons: {
			Ok:function(ui) {
				window.altoHistograma =  $( this ).find( '#altoSlider' ).slider( "value" );
				window.anchoHistograma = $( this ).find( '#anchoSlider' ).slider( "value" );
				if (window.localStorage) { //Si el navegador soporta localStorage
					localStorage.setItem("anchoHistograma",window.anchoHistograma);
					localStorage.setItem("altoHistograma",window.altoHistograma );		
				}
				$(this).dialog( "close" );
				$(this).remove();
			},
			Cancel: function() {
				$(this).dialog( "close" );
				$(this).remove();
			}
		},
		dialogClass: 'no-close',
		resizable: false
	});

	dialog.append("<form><fieldset><p><label for=\"altoSpinner\">Altura de los histogramas:</label><input id=\"altoSpinner\" name=\"altoValue\" type=\"text\"></p><div id=\"altoSlider\"></div><p><label for=\"anchoSpinner\">Ancho de los histogramas:</label><input id=\"anchoSpinner\" name=\"anchoValue\" type=\"text\"></p><div id=\"anchoSlider\"></div></fieldset></form>");

	var altoSpinner = $( "#altoSpinner" ).spinner({
		min: 100,
		max: 500,
		step: 10,
		start: window.altoHistograma,
		stop: (function (event, ui) {
			$( "#altoSlider" ).slider( "value", $(this).spinner('value') );
		}),
		spin: (function(event, ui ){
			$( "#altoSlider" ).slider( "value", ui.value );
		})
	}).bind("keydown", function (event) {
		event.preventDefault();
	}).focus(function () {
		$(this).blur();
	});

	$( "#altoSlider" ).slider({
		range: "min",
		value: window.altoHistograma,
		min: 100,
		autofocus: "autofocus",
		max: 500,
		slide: function( event, ui ) {
			altoSpinner.spinner( "value", ui.value );
		}
	});
	altoSpinner.spinner( "value", $( "#altoSlider" ).slider( "value" ));

	var anchoSpinner = $( "#anchoSpinner" ).spinner({
		min: 100,
		max: 500,
		step: 10,
		start: window.anchoHistograma,
		stop: (function (event, ui) {
			$( "#anchoSlider" ).slider( "value", $(this).spinner('value') );
		}),
		spin: (function(event, ui ){
			$( "#anchoSlider" ).slider( "value", ui.value );
		})
	}).bind("keydown", function (event) {
		event.preventDefault();
	}).focus(function () {
		$(this).blur();
	});

	$( "#anchoSlider" ).slider({
		range: "min",
		value: window.anchoHistograma,
		min: 0,
		autofocus: "autofocus",
		max: 500,
		slide: function( event, ui ) {
			anchoSpinner.spinner( "value", ui.value );
		}
	});
	anchoSpinner.spinner( "value", $( "#anchoSlider" ).slider( "value" ));

}

function configuracionActualDialog(){
	var dialog, form,content;
	$("body").append("<div id=\"dialog-message\"></div>");
	dialog = $( "#dialog-message" ).dialog({
		title: "Configuración actual",
		modal: true,
		buttons: {
			Ok:function(ui) {
				$(this).dialog( "close" );
				$(this).remove();
			}
		},
		dialogClass: "no-close",
		dialogClass: "informacion",
		resizable: false 		
	}).append("<table><tbody>	<tr><td><label>Modo de imagen:</label></td><td><span id=\"modoImagenConfig\"></span></td></tr><tr><td><label>Formato de descarga:</label></td><td><span id=\"formatoDescargaConfig\"></span></td></tr><tr><td><label>Tamaño imágenes:</label></td><td><span id=\"imageSizeConfig\"></span></td></tr><tr><td><label>Tamaño histogramas:</label></td><td><span id=\"histogramSizeConfig\"></span></td></tr></tbody></table>");


	$("#modoImagenConfig").html(window.modoImagen);
	$("#formatoDescargaConfig").html(window.formatoDescarga);
	$("#imageSizeConfig").html(window.maxWidth+"X"+window.maxHeight+" píxeles");
	$("#histogramSizeConfig").html(window.anchoHistograma+"X"+window.altoHistograma+" píxeles");
	
}

function guardarComoDialog(objetoBoguiActual){
	var dialog, form,content;
	$("body").append("<div id=\"dialog-message\"></div>");
	dialog = $( "#dialog-message" ).dialog({
		title: "Guardar imagen como",
		modal: true,
		buttons: {
			Ok:function(ui) {
				var formato = $("#formatoDescargaSelect").val();
				var nombre = $("#nombreText").val();
				descargarImagen(objetoBoguiActual, nombre, formato);			
				$(this).dialog( "close" );
				$(this).remove();
			}
		},
		dialogClass: "no-close",
		dialogClass: "saveImageAs",
		resizable: false 		
	}).append("<table><tbody><tr><td><label>Nombre:</label></td><td><input id=\"nombreText\" type=\"text\"></td></tr><tr><td><label>Formato de descarga:</label></td><td><select id=\"formatoDescargaSelect\"><option value = \"PNG\">PNG</option><option value = \"WEBP\">WEBP</option><option value = \"JPEG\">JPEG</option></select></td></tr></tbody></table>");
	 $("#formatoDescargaSelect").val(window.formatoDescarga);
}

/*
function abrirImagenURLDialog(){ //TODO: Arreglar cross-origin
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

function abrirImagenWebCamDialog(){
//Este objeto guardará algunos datos sobre la cámara
	var dialog, form,content, contexto ;
	window.URL = window.URL || window.webkitURL;
	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia ||
	function() {
	    errorDialog("Su navegador no permite obtener una imagen desde la WebCam");
	};

	if(navigator.getUserMedia){
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
					    errorDialog("No fue posible obtener acceso a la cámara.");
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
		}).on("dialogclose",function(e){			
			$(this).dialog( "close" );
			$(this).remove();	
		}).append("<div class=\"contenedor\"><video id=\"camara\" autoplay controls></video><canvas id=\"foto\" ></canvas></div>");

	}
}*/
