function zoomDialog(objetoBogui){
	var dialog, form;
	var zoomX, zoomY;

	$("body").append("<div id=\"dialog\"></div>");
	dialog = $( "#dialog" ).dialog({
		title: "Zoom:",
		height: 350,
		width: 350,
		modal: true,
		buttons: {
			Ok:function(ui) {

				var nuevoTamX = objetoBogui.imgCanvas.width * $( this ).find( '#zoomXSlider' ).slider( "value" )  / 100;
				var nuevoTamY = objetoBogui.imgCanvas.height * $( this ).find( '#zoomYSlider' ).slider( "value" )  / 100;
				var metodo = $("#metodoInterpolacion").val();
				console.log(metodo);


				escalar(objetoBogui, nuevoTamX, nuevoTamY, metodo);


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

	dialog.append("<form><fieldset><p><label for=\"zoomXSpinner\">Zoom X (%):</label><input id=\"zoomXSpinner\" name=\"zoomXValue\" type=\"text\"></p><div id=\"zoomXSlider\"></div>    <p><label for=\"zoomYSpinner\">Zoom Y (%):</label><input id=\"zoomYSpinner\" name=\"zoomYValue\" type=\"text\"></p><div id=\"zoomYSlider\"></div>   <p><label for=\"metodoInterpolacion\">Metodo de interpolación: </label></p><select id = \"metodoInterpolacion\"><option value =\"vmp\">Vecino más próximo</option><option value =\"media\">Bilineal</option>  </fieldset></form>");
	
	var zoomXSpinner = $( "#zoomXSpinner" ).spinner({
		min: 0,
		max: 500,
		step: 1,
		start: 100,
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
		if (!val.match(/^-?\d*$/)) val = 0; //we want only number, no alpha
		this.value = val > max ? max : val < min ? min : val;
	}).keypress(function(e){
		if(e.which == 13){
			$(this).blur();

		}
	});

	$( "#zoomXSlider" ).slider({
		range: "min",
		value: 100,
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
		start: 100,
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
		if (!val.match(/^-?\d*$/)) val = 0; //we want only number, no alpha
		this.value = val > max ? max : val < min ? min : val;
	}).keypress(function(e){
		if(e.which == 13){
			$(this).blur();

		}
	});

	$( "#zoomYSlider" ).slider({
		range: "min",
		value: 100,
		min: 0,
		autofocus: "autofocus",
		max: 255,
		slide: function( event, ui ) {
			zoomYSpinner.spinner( "value", ui.value );
		}
	});
	zoomYSpinner.spinner( "value", $( "#zoomYSlider" ).slider( "value" ));
	
}
