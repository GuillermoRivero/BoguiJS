function ajusteBrilloContrasteDialog(objetoBogui){
	var dialog, form;
	var valores = calcularBrilloContraste(objetoBogui);
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
				var newBrillo =  $( this ).find( '#sliderBrillo' ).slider( "value" );
				var newContraste = $( this ).find( '#sliderContraste' ).slider( "value" );
				ajusteBrilloContraste(objetoBogui, oldBrillo, oldContraste, newBrillo, newContraste);
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
}

function transformacionLinealTramosDialog(){
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
				transformacionLinealPuntosDialog(numTramos);
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

function transformacionLinealPuntosDialog(numTramos){
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

					while(error == false && counter <= numTramos){
						var a =  $( this ).find( '#a'+counter ).spinner( "value" );
						var b =  $( this ).find( '#b'+counter ).spinner( "value" );			
						if((a != null && b != null) && ( a <= puntoAnterior) ){
							puntos = null;
							error = true;							
						}else{
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
						errorDialog("Hay parametros incorrectos. El tramo debe ser progesivo");
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