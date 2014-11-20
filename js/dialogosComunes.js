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
			dialogClass: 'no-close',
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

function cambiarDimensionDialog(){
	var dialog, form;
	$("body").append("<div id=\"dialog\"></div>");
	dialog = $( "#dialog" ).dialog({
		title: "Configuración del tamaño de las imágenes",
		height: 250,
		width: 350,
		modal: true,
		buttons: {
			Ok:function(ui) {
				var alto =  $( this ).find( '#sliderAlto' ).slider( "value" );
				var ancho = $( this ).find( '#sliderAncho' ).slider( "value" );
				if (window.localStorage) { //Si el navegador soporta localStorage
					localStorage.setItem("maxWidth",ancho);
					localStorage.setItem("maxHeight",alto);		
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

	dialog.append("<form><fieldset><p><label for=\"altoSpinner\">Alto imagen:</label><input id=\"altoSpinner\" name=\"altoValue\" type=\"text\"></p><div id=\"altoSlider\"></div><p><label for=\"anchoSpinner\">Ancho de imagen:</label><input id=\"anchoSpinner\" name=\"anchoValue\" type=\"text\"></p><div id=\"anchoSlider\"></div></fieldset></form>");

	form = dialog.find( "form" ).on( "submit", function( event ) {
		event.preventDefault();
	});		

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
	}).on('input', function () {
		var val = this.value,
		$this = $(this),
		max = $this.spinner('option', 'max'),
		min = $this.spinner('option', 'min');
		if (!val.match(/^\d*$/)) val = min; //we want only number, no alpha
		this.value = val > max ? max : val < min ? min : val;
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
	}).on('input', function () {
		var val = this.value,
		$this = $(this),
		max = $this.spinner('option', 'max'),
		min = $this.spinner('option', 'min');
		if (!val.match(/^\d*$/)) val = min; //we want only number, no alpha
		this.value = val > max ? max : val < min ? min : val;
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