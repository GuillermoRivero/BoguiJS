//CONFIGURACION POR DEFECTO
var modoImagen = "PAL";
var formatoDescarga = "PNG";
/*
TO DO:
	AÑADIR VARIABLES DE TAMAÑO DE TRABAJO
	COLORES PARA EL CSS??? 
*/

// Atajo para $( document ).ready()
$(function() {
	if (window.localStorage) { //Si el navegador soporta localStorage
		if(localStorage.getItem("modoImagen") !== null ){ //Comprobamos si hemos guardado la configuracion personalizada
			//Actualizamos las variables
			modoImagen = localStorage.getItem("modoImagen");
		    formatoDescarga = localStorage.getItem("formatoDescarga");
		}
	}

	$("#"+modoImagen).toggleClass('checked');
	$("#"+formatoDescarga).toggleClass('checked');

	$("#PAL").click(function() {
		$("#"+modoImagen).toggleClass('checked');
		modoImagen = "PAL";
		$("#"+modoImagen).toggleClass('checked');
	});		
	
	$("#NTSC").click(function() {
		$("#"+modoImagen).toggleClass('checked');
		modoImagen = "NTSC";
		$("#"+modoImagen).toggleClass('checked');
	});		
	
	$("#WEBP").click(function() {
		$("#"+formatoDescarga).toggleClass('checked');
		formatoDescarga = "WEBP";
		$("#"+formatoDescarga).toggleClass('checked');
	});		
	
	$("#JPEG").click(function() {
		$("#"+formatoDescarga).toggleClass('checked');
		formatoDescarga = "JPEG";
		$("#"+formatoDescarga).toggleClass('checked');
	});	
	
	$("#PNG").click(function() {
		$("#"+formatoDescarga).toggleClass('checked');
		formatoDescarga = "PNG";
		$("#"+formatoDescarga).toggleClass('checked');
	});			

	$("#saveConfig").click(function() {
		if (window.localStorage) { //Si el navegador soporta localStorage
			localStorage.setItem("modoImagen",modoImagen);
			localStorage.setItem("formatoDescarga",formatoDescarga);
			$("body").append("<div id=\"dialog-message\">Your configuration has been saved</div>");
			$( "#dialog-message" ).dialog({
			  title: "Message",
			  modal: true,
			  buttons: {
				Ok: function() {
				  $(this).dialog( "close" );
				  $(this).remove();
				}
			  }
			});
		}else{
			$("body").append("<div id=\"dialog-message\">Your browser doesn't support LocalStorage</div>");
			$("#dialog-message").dialog({
			  title: "Error",
			  modal: true,
			  buttons: {
				Ok: function() {
				  $(this).dialog( "close" );
				  $(this).remove();
				}
			  }
			});

		}
	});		
	
	$("#defaultConfig").click(function() {
		if(window.localStorage !== null){
			localStorage.clear();
		}
		modoImagen = "PAL";
		formatoDescarga = "PNG";		
	});				
	
	$(document).tooltip();
	// Hover states on the static widgets
	$( "#tools li" ).hover(
		function() {
			$( this ).addClass( "ui-state-hover" );
		},
		function() {
			$( this ).removeClass( "ui-state-hover" );
		}
	);	
	
	$("#fileButton").click(function() {
		$("#fileSelector").click();
	});	
	
	$("#saveButton").click(function() {
		$("#saveConfig").click();
	});		
});

/*

<script type="text/javascript">
function performClick(elemId) {
   var elem = document.getElementById(elemId);
   if(elem && document.createEvent) { // sanity check
      var evt = document.createEvent("MouseEvents");
      evt.initEvent("click", true, false);
      node.dispatchEvent(evt);
   }
}
</script>
<a href="#" onclick="performClick('theFile');">Open file dialog</a>
<input type="file" id="theFile" />*/
