function zoomDialog(objetoBogui){
	var dialog, form;
	
	$("body").append("<div id=\"dialog\"></div>");
	dialog = $( "#dialog" ).dialog({
		title: "Zoom:",
		modal: true,
		buttons: {
			Ok:function(ui) {				
				var nuevoTamX = objetoBogui.imgCanvas.width * $( this ).find( '#zoomXSlider' ).slider( "value" )  / 100;
				var nuevoTamY = objetoBogui.imgCanvas.height * $( this ).find( '#zoomYSlider' ).slider( "value" )  / 100;
				var metodo = $("#metodoInterpolacion").val();

				escalar(objetoBogui, nuevoTamX, nuevoTamY, metodo);

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
	
	var contenido = "<form><fieldset><table><tbody><tr><td><label for=\"metodosInterpolacion\">M&eacute;todo de interpolaci&oacute;n: </label></td><td><select id = \"metodosInterpolacion\">";
	var selectValues = "";
	Object.keys(window.zoomMethods).forEach(function (element) {
		selectValues = selectValues + "<option value = \""+element+"\">"+zoomMethods[element]+"</option>";
	});	
	contenido = contenido +	selectValues + "</select></td></tr><tr><td><label for=\"zoomXSpinner\">Zoom X(%):</label></td><td><input id=\"zoomXSpinner\" name=\"zoomXValue\" type=\"text\"></td></tr><tr ><td colspan=\"2\"><div id=\"zoomXSlider\"></div></td></tr><tr><td><label for=\"zoomYSpinner\">Zoom Y(%):</label></td><td><input id=\"zoomYSpinner\" name=\"zoomYValue\" type=\"text\"></td></tr><tr ><td colspan=\"2\"><div id=\"zoomYSlider\"></div></td></tr></tbody></table></fieldset></form>";
	
	dialog.append(contenido);		
	
	var zoomXSpinner = $( "#zoomXSpinner" ).spinner({
		min: 0,
		max: 500,
		step: 1,
		stop: (function (event, ui) {
			$( "#zoomXSlider" ).slider( "value", $(this).spinner('value') );
		}),
		spin: (function(event, ui ){
			$( "#zoomXSlider" ).slider( "value", ui.value );
		})
	}).on('input', function () {
		var val = this.value,
		$this = $(this),
		max = $this.spinner('option', 'max'),
		min = $this.spinner('option', 'min');
		if (!val.match(/^\d*$/)) val = 0; //we want only number, no alpha
		this.value = val > max ? max : val < min ? min : val;
	});	
	
	$( "#zoomXSlider" ).slider({
		range: "min",
		min: 0,
		autofocus: "autofocus",
		max: 255,
		slide: function( event, ui ) {
			zoomXSpinner.spinner( "value", ui.value );
		}
	});
	zoomXSpinner.spinner( "value", $( "#zoomXSlider" ).slider( "value" ));	
	
	var zoomYSpinner = $( "#zoomYSpinner" ).spinner({
		min: 0,
		max: 500,
		step: 1,
		stop: (function (event, ui) {
			$( "#zoomYSlider" ).slider( "value", $(this).spinner('value') );
		}),
		spin: (function(event, ui ){
			$( "#zoomYSlider" ).slider( "value", ui.value );
		})
	}).on('input', function () {
		var val = this.value,
		$this = $(this),
		max = $this.spinner('option', 'max'),
		min = $this.spinner('option', 'min');
		if (!val.match(/^\d*$/)) val = 0; //we want only number, no alpha
		this.value = val > max ? max : val < min ? min : val;
	});	
	
	$( "#zoomYSlider" ).slider({
		range: "min",
		min: 0,
		autofocus: "autofocus",
		max: 255,
		slide: function( event, ui ) {
			zoomYSpinner.spinner( "value", ui.value );
		}
	});
	zoomYSpinner.spinner( "value", $( "#zoomYSlider" ).slider( "value" ));	

	$("#metodosInterpolacion").selectmenu();
}

function rotacionDialog(objetoBogui){
	var dialog, form;

	$("body").append("<div id=\"dialog\"></div>");
	dialog = $( "#dialog" ).dialog({
		title: "Zoom:",
		modal: true,
		buttons: {
			Ok:function(ui) {	
				var angulo = $( this ).find( '#anguloSlider' ).slider( "value" );		
				var radiansAngle = angulo * (Math.PI/180);
				var metodo = $("#metodosInterpolacion").val();
				
				switch(angulo){
					case -270:
					case 90:
						console.log("exacto");
						rotarBasico(objetoBogui, 90);
						break;
					case -180:
					case 180:
					console.log("exacto");
						rotarBasico(objetoBogui, 180);
						break;
					case -90:
					case 270:
					console.log("exacto");
						rotarBasico(objetoBogui, 270);
						break;
					default:
						console.log(metodo);
						rotarInterpolar(objetoBogui, 0, 0, radiansAngle, metodo);
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
	

	var contenido = "<form><fieldset><table><tbody><tr><td><label for=\"metodosInterpolacion\">M&eacute;todo de interpolaci&oacute;n: </label></td><td><select id = \"metodosInterpolacion\">";
	var selectValues = "";
	Object.keys(window.zoomMethods).forEach(function (element) { //TODO: Cambiar por angle metods
		selectValues = selectValues + "<option value = \""+element+"\">"+zoomMethods[element]+"</option>";
	});	
	contenido = contenido +	selectValues + "</select><tr><td><label for=\"anguloSpinner\">&Aacute;ngulo:</label></td><td><input id=\"anguloSpinner\" name=\"anguloValue\" type=\"text\"></td></tr><tr ><td colspan=\"2\"><div id=\"anguloSlider\"></div></td></tr><tr><td><label for=\"anclajeXSpinner\">Anclaje X:</label></td><td><input id=\"anclajeXSpinner\" name=\"anclajeXValue\" type=\"text\"></td></tr><tr><td><label for=\"anclajeYSpinner\">Anclaje Y:</label></td><td><input id=\"anclajeYSpinner\" name=\"anclajeYValue\" type=\"text\"></td></tr></table></fieldset></form>";
	
	dialog.append(contenido);		
	
	var anguloSpinner = $( "#anguloSpinner" ).spinner({
		min: -360,
		max: 360,
		step: 1,
		stop: (function (event, ui) {
			$( "#anguloSlider" ).slider( "value", $(this).spinner('value') );
		}),
		spin: (function(event, ui ){
			$( "#anguloSlider" ).slider( "value", ui.value );
		})
	}).on('input', function () {
		var val = this.value,
		$this = $(this),
		max = $this.spinner('option', 'max'),
		min = $this.spinner('option', 'min');
		if (!val.match(/^-?\d*$/)) val = 0; //we want only number, no alpha
		this.value = val > max ? max : val < min ? min : val;
	});	
	
	$( "#anguloSlider" ).slider({
		range: "min",
		min: -360,
		autofocus: "autofocus",
		max: 360,
		slide: function( event, ui ) {
			anguloSpinner.spinner( "value", ui.value );
		}
	});
	anguloSpinner.spinner( "value", $( "#anguloSlider" ).slider( "value" ));

	var anclajeXSpinner = $( "#anclajeXSpinner" ).spinner({
		min: -1000,
		max: 1000,
		step: 1
	}).on('input', function () {
		var val = this.value,
		$this = $(this),
		max = $this.spinner('option', 'max'),
		min = $this.spinner('option', 'min');
		if (!val.match(/^-?\d*$/)) val = 0; //we want only number, no alpha
		this.value = val > max ? max : val < min ? min : val;
	});

	anclajeXSpinner.spinner( "value", 0);

	var anclajeYSpinner = $( "#anclajeYSpinner" ).spinner({
		min: -1000,
		max: 1000,
		value: 0,
		step: 1
	}).on('input', function () {
		var val = this.value,
		$this = $(this),
		max = $this.spinner('option', 'max'),
		min = $this.spinner('option', 'min');
		if (!val.match(/^-?\d*$/)) val = 0; //we want only number, no alpha
		this.value = val > max ? max : val < min ? min : val;
	});		

	anclajeYSpinner.spinner( "value", 0);
	$("#metodosInterpolacion").selectmenu();
}