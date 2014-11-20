function informacionDialog(objetoBoguiActual){
	var dialog, form;
	idObjeto = "dialogoInformacion"+ objetoBoguiActual.ident;
	dialogoInformacion = jQuery('<div/>', {
	    id: idObjeto,
		dialogClass: "no-close",
	}).appendTo('body');

	dialog = dialogoInformacion.dialog({
		title: "Informacion de la imagen: " + objetoBoguiActual.nombre,
		buttons: {
			Ok:function(ui) {
				$(this).dialog( "close" );
				$(this).remove();
			}
		},
		dialogClass: "no-close",
		dialogClass: "informacion"
	});

	dialog.on("dialogclose",function(e){			
		$(this).dialog( "close" );
		$(this).remove();	
 	});
	
	dialog.append("<table><tbody><tr><td><label>Nombre:</label></td><td><span id=\"nameValue"+ objetoBoguiActual.ident +"\"></span></td></tr><tr><td><label>Modo de color:</label></td><td><span id=\"modoValue"+ objetoBoguiActual.ident +"\"></span></td></tr><tr><td><label>Brillo:</label></td><td><span id=\"brilloValue"+ objetoBoguiActual.ident +"\"></span></td></tr><tr><td><label>Contraste:</label></td><td><span id=\"contrasteValue"+ objetoBoguiActual.ident +"\"></span></td></tr><tr><td><label>Entrop&iacute;a:</label></td><td><span id=\"entropiaValue"+ objetoBoguiActual.ident +"\"></span></td></tr><tr><td><label>Valor m&iacute;nimo de gris:</label></td><td><span id=\"minGris"+ objetoBoguiActual.ident +"\"></span></td></tr><tr><td><label>Valor m&aacute;ximo de gris:</label></td><td><span id=\"maxGris"+ objetoBoguiActual.ident +"\"></span></td></tr><tr><td><label>Formato:</label></td><td><span id=\"formatoValue"+ objetoBoguiActual.ident +"\"></span></td></tr><tr><td><label>Tama&ntilde;o:</label></td><td><span id=\"sizeValue"+ objetoBoguiActual.ident +"\"></span></td></tr></tbody></table>");
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
	
	dialog.dialog({ resizable: false });
	dialog.dialog();	
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
		dialogClass: 'no-close' 
	});
}

function histogramaSimpleDialog(objetoBoguiActual){

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
	//APPEND
	objetoBoguiActual.dialogoHistograma.dialog();
	objetoBoguiActual.dialogoHistograma.dialog("option", "title", "Histograma: " + objetoBoguiActual.nombre);
	objetoBoguiActual.dialogoHistograma.dialog("option", "resizable", false);
	objetoBoguiActual.dialogoHistograma.dialog("option", "width", window.anchoHistograma); 
	objetoBoguiActual.dialogoHistograma.dialog("option", "height", window.altoHistograma);
}

function histogramaAcumulativoDialog(objetoBoguiActual){
	calcularHistogramaAcumulativo(objetoBoguiActual);
	
	objetoBoguiActual.dialogoHistogramaAcumulativo = jQuery('<div/>', {
	    	id: "dialogoHistogramaAcumulativo" + objetoBoguiActual.ident
	}).appendTo('body');

	
	objetoBoguiActual.contenedorHistogramaAcumulativo = jQuery('<div/>').appendTo(objetoBoguiActual.dialogoHistogramaAcumulativo);
	objetoBoguiActual.contenedorHistogramaAcumulativo.attr("autofocus", "autofocus");
	
	objetoBoguiActual.contenedorHistogramaAcumulativo.highcharts({
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

	objetoBoguiActual.dialogoHistogramaAcumulativo.dialog();
	objetoBoguiActual.dialogoHistogramaAcumulativo.dialog("option", "title", "Histograma: " + objetoBoguiActual.nombre);
	objetoBoguiActual.dialogoHistogramaAcumulativo.dialog("option", "resizable", false);
	
	objetoBoguiActual.dialogoHistogramaAcumulativo.dialog("option", "width", window.anchoHistograma); 
	objetoBoguiActual.dialogoHistogramaAcumulativo.dialog("option", "height", window.altoHistograma);
}