function simularDigitalizacionDialog(objetoBoguiActual){
	var dialog, form, mayorMuestreo,menorMuestreo;
	menorMuestreo = 2;
	if(objetoBoguiActual.imgCanvas.width < objetoBoguiActual.imgCanvas.height){ 
		mayorMuestreo = objetoBoguiActual.imgCanvas.width;
	}else{
		mayorMuestreo = objetoBoguiActual.imgCanvas.height
	}
	
	$("body").append("<div id=\"dialog\"></div>");
	dialog = $( "#dialog" ).dialog({
		title: "Simular digitalizacion:",
		modal: true,
		buttons: {
			Ok:function(ui) {
				var dimensionMuestreo =  $( this ).find( '#sliderMuestreo' ).slider( "value" );
				var numeroBits = $( this ).find( '#sliderBits' ).slider( "value" );

				simulacionDigital(objetosBogui[objetoActual], dimensionMuestreo, numeroBits);
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

	dialog.append("<form><fieldset><table><tbody><tr><td><label for=\"dimensionSpinner\">Tama&ntilde;o de muestreo:</label></td><td><input id=\"muestreoSpinner\" name=\"muestreoValue\" type=\"text\"></td></tr><tr><td colspan=\"2\"><div id=\"sliderMuestreo\"></div></td></tr><tr><td><label for=\"bitsSpinner\">N&uacute;mero de bits:</label></td><td><input id=\"bitsSpinner\" name=\"bitsValue\" type=\"text\"></td></tr><tr><td colspan=\"2\"><div id=\"sliderBits\"></div></td></tr></tbody></table></fieldset></form>");

	form = dialog.find( "form" ).on( "submit", function( event ) {
		event.preventDefault();
	});		

	var muestreoSpinner = $( "#muestreoSpinner" ).spinner({
		min: 1,
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
		min: 1,
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
}

function imageCrossSectionDialog(){
	var dialog, form;

	$("body").append("<div id=\"dialog\"></div>");
	dialog = $( "#dialog" ).dialog({
		title: "Perfil (Image-Cross Section):",
		modal: true,
		buttons: {
			Ok:function(ui) {
				var cantidadSuavizado =  $( this ).find( '#sliderSuavizado' ).slider( "value" );
				var umbral = $( this ).find( '#sliderUmbral' ).slider( "value" );
				var pixeles = pixelesICS(objetosBogui[objetoActual]);
				graficaICSDialog(objetosBogui[objetoActual], pixeles, cantidadSuavizado, umbral);
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

	dialog.append("<form><fieldset><table><tbody><tr><td><label for=\"suavizadoSpinner\">Cantidad de suavizado:</label></td><td><input id=\"suavizadoSpinner\" name=\"suavizadoValue\" type=\"text\"></td></tr><tr><td colspan=\"2\"><div id=\"sliderSuavizado\"></div></td></tr><tr><td><label for=\"umbralSpinner\">Umbral:</label></td><td><input id=\"umbralSpinner\" name=\"umbralValue\" type=\"text\"></td><tr><td colspan=\"2\"><div id=\"sliderUmbral\"></div></td></tr></tbody></table></fieldset></form>");

	form = dialog.find( "form" ).on( "submit", function( event ) {
		event.preventDefault();
	});		

	var suavizadoSpinner = $( "#suavizadoSpinner" ).spinner({
		min: 0,
		max: 10,
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
		max: 10,
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
}
function graficaICSDialog(objetoBoguiActual, pixeles, cantidadSuavizado, umbral){ 

	var dialog,idObjeto,contenedorICS;
	idObjeto = "dialogoICS" + objetoBoguiActual.ident;
	//Histograma acumulativo
	if(!$( "#"+idObjeto ).length){
	
		$("#workspace").append("<div id=\"" +idObjeto+"\"></div>");
		dialog = $( "#"+idObjeto).dialog({
			title: "Image-Cross Section: " + objetoBoguiActual.nombre,
			width: window.anchoHistograma,
			height: window.altoHistograma,		
			resizable: false
		}).on("dialogclose",function(e){			
			$(this).dialog( "close" );
			$(this).remove();	
		});
	
		var imageData = objetoBoguiActual.ctx.getImageData(0, 0, objetoBoguiActual.imgCanvas.width, objetoBoguiActual.imgCanvas.height);
		var pixelData = imageData.data;
		var bytesPerPixel = 4;
		var x,y;
		var grafica = [];


		var arrayUmbralPos = [];
		var arrayUmbralNeg = [];

		for(i = 0; i < pixeles.length; i++){
			arrayUmbralPos.push(umbral);
			arrayUmbralNeg.push(-umbral);
		}

		for(i = 0; i < pixeles.length; i++){

			x = pixeles[i][0];
			y = pixeles[i][1];
			var startIdx = (y * bytesPerPixel * objetoBoguiActual.imgCanvas.width) + (x * bytesPerPixel);
			grafica.push(pixelData[startIdx]);	
		}

		var perfilSuavizado = [];
		
		var puntos;
		var i = 0;

		while(i < grafica.length-1){
			puntos = [];

			for(j = i-cantidadSuavizado; j <= i+cantidadSuavizado; j++){
				if( (j > 0) && (j < grafica.length)){
					puntos.push(grafica[j]);
				}

			}
			perfilSuavizado.push(calcularMedia(puntos));
			i++;		
		}

		var derivadaPerfil = [];

		for(i = 0; i < grafica.length-1; i++){
			derivadaPerfil.push(grafica[i+1]-grafica[i]);	
		}
		//TODO: Decidir si dejar 0 o el ultimo valor
		//derivadaGrafica.push(grafica[grafica.length-1]);
		derivadaPerfil.push(0);

		var derivadaPerfilSuavizado = [];

		for(i = 0; i < grafica.length-1; i++){
			derivadaPerfilSuavizado.push(perfilSuavizado[i+1]-perfilSuavizado[i]);	
		}
		//TODO: Decidir si dejar 0 o el ultimo valor
		//derivadaGrafica.push(grafica[grafica.length-1]);
		derivadaPerfilSuavizado.push(0);
		
		contenedorICS = $('<div/>').appendTo(dialog);
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
					name: 'Perfil Suavizado',
					data: perfilSuavizado,
					color: "#FF0000"
				},
				{
					name: 'Derivada perfil',
					data: derivadaPerfil,
					color: "#0000FF"
				},
				{
					name: 'Derivada perfil Suavizado',
					data: derivadaPerfilSuavizado,
					color: "#B22222"
				},
				{
					type: 'spline',
					name: 'Umbral Positivo',
					data: arrayUmbralPos,
					color: "#00FF00"
				},
				{
					type: 'spline',
					name: 'Umbral Negativo',
					data: arrayUmbralNeg,
					color: "#00FF00"
				}

			]
		});
		//TODO: arreglar tamaño highcharts
	}
}

function correccionGammaDialog(objetoBogui){
	var dialog, form;
	
	$("body").append("<div id=\"dialog\"></div>");
	dialog = $( "#dialog" ).dialog({
		title: "Correccion gamma:",
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
		dialogClass: 'no-close',
		resizable: false
	}).append("<form><fieldset><table><tbody><tr><td><label for=\"gammaText\">Valor de gamma:</label></td><td><input id=\"gammaText\" name=\"gammaValue\" type=\"text\"></td></tr></tbody></table></fieldset></form>");;

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

}


function especificarHistogramaDialog(){
	$("body").append("<div id=\"dialog\"></div>");
	dialog = $( "#dialog" ).dialog({
		title: "Especificacion histograma:",
		modal: true,
		buttons: {
			Ok:function(ui) {
				var objetoOrigen = $("#imagenesOrigen").val();
				var objetoReferencia = $("#imagenesReferencia").val();
				if(objetoReferencia != objetoOrigen){
					especificarHistograma(objetosBogui[objetoOrigen], objetosBogui[objetoReferencia]);
				}else{
					errorDialog("No puede aplicar esta funci&oacute;n para la misma imagen.")
				}
				
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
	
	var contenido = "<form><fieldset><table><tbody><tr><td><label for=\"imagenesOrigen\">Imagen origen: </label></td><td><select id = \"imagenesOrigen\">";
	var selectValues = "";
	for(i = 0; i<objetosBogui.length;i++){
		selectValues = selectValues + "<option value = \""+i+"\">"+objetosBogui[i].nombre+"</option>";
	}
	contenido = contenido +	selectValues + "</select></td></tr><tr><td><label for=\"imagenesReferencia\">Imagen referencia: </label></td><td><select id = \"imagenesReferencia\">"+selectValues+"</select></td></tr></tbody></table></fieldset></form>";
	dialog.append(contenido);		
	
	$("#imagenesOrigen").selectmenu();
	$("#imagenesReferencia").selectmenu();	
	$("#imagenesOrigen").val(objetoActual);
	$("#imagenesOrigen").selectmenu("refresh");
}

function mapaCambiosDialog(objetoBogui){
	var dialog, form;
	var oldBrillo = objetoBogui.brillo;
	var oldContraste = objetoBogui.contraste;
	
	$("body").append("<div id=\"dialog\"></div>");
	dialog = $( "#dialog" ).dialog({
		title: "Mapa de cambios:",
		modal: true,
		buttons: {
			Ok:function(ui) {				
				var umbral =  $( this ).find( '#sliderUmbral' ).slider( "value" );
				var objetoOrigen = $("#imagenesOrigen").val();
				var objetoReferencia = $("#imagenesReferencia").val();
				if(objetoReferencia != objetoOrigen){
					mapaCambios(objetosBogui[objetoOrigen], objetosBogui[objetoReferencia],umbral);
				}else{
					errorDialog("La imagen es la misma.")
				}
			
				$(this).dialog( "close" );
				$(this).remove();
			},
			Cancel: function() {
				$(this).dialog( "close" );
				$(this).remove();
			}
		},
		dialogClass: 'no-close' ,
		resizable: false
	});
	
	form = dialog.find( "form" ).on( "submit", function( event ) {
		event.preventDefault();
	});		
	
	var contenido = "<form><fieldset><table><tbody><tr><td><label for=\"imagenesOrigen\">Imagen origen: </label></td><td><select id = \"imagenesOrigen\">";
	var selectValues = "";
	for(i = 0; i<objetosBogui.length;i++){
		selectValues = selectValues + "<option value = \""+i+"\">"+objetosBogui[i].nombre+"</option>";
	}
	contenido = contenido +	selectValues + "</select></td></tr><tr><td><label for=\"imagenesReferencia\">Imagen referencia: </label></td><td><select id = \"imagenesReferencia\">"+selectValues+"</select></td></tr><tr><td><label for=\"umbralSpinner\">Umbral:</label></td><td><input id=\"umbralSpinner\" name=\"umbralValue\" type=\"text\"></td></tr><tr ><td colspan=\"2\"><div id=\"sliderUmbral\"></div></td></tr></tbody></table></fieldset></form>";
	
	dialog.append(contenido);		
	
	$("#imagenesOrigen").selectmenu();
	$("#imagenesReferencia").selectmenu();	
	$("#imagenesOrigen").val(objetoActual);
	$("#imagenesOrigen").selectmenu("refresh");
	
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

function imagenDiferenciaDialog(objetoBogui){
	var dialog, form;
	var oldBrillo = objetoBogui.brillo;
	var oldContraste = objetoBogui.contraste;

	$("body").append("<div id=\"dialog\"></div>");
	dialog = $( "#dialog" ).dialog({
		title: "Imagen diferencia:",
		modal: true,
		buttons: {
			Ok:function(ui) {
				var objetoOrigen = $("#imagenesOrigen").val();
				var objetoReferencia = $("#imagenesReferencia").val();
				if(objetoReferencia != objetoOrigen){
					imagenDiferencia(objetosBogui[objetoOrigen], objetosBogui[objetoReferencia]);
				}else{
					errorDialog("La imagen es la misma.")
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
		resizable: true
	});	

	form = dialog.find( "form" ).on( "submit", function( event ) {
		event.preventDefault();
	});		

	var contenido = "<form><fieldset><table><tbody><tr><td><label for=\"imagenesOrigen\">Imagen origen: </label></td><td><select id = \"imagenesOrigen\">";
	var selectValues = "";
	for(i = 0; i<objetosBogui.length;i++){
		selectValues = selectValues + "<option value = \""+i+"\">"+objetosBogui[i].nombre+"</option>";
	}
	contenido = contenido +	selectValues + "</select></td></tr><tr><td><label for=\"imagenesReferencia\">Imagen referencia: </label></td><td><select id = \"imagenesReferencia\">"+selectValues+"</select></td></tr></tbody></table></fieldset></form>";
	
	dialog.append(contenido);		
	
	$("#imagenesOrigen").selectmenu();
	$("#imagenesReferencia").selectmenu();	
	$("#imagenesOrigen").val(objetoActual);
	$("#imagenesOrigen").selectmenu("refresh");
}
