var objetosBogui = [];
var objetoActual = 0;
var numeroObjetos = 0;

function obtenerPosArray(id){
	var i = 0;
	for(i = 0; i < objetosBogui.length; i++){
		if(objetosBogui[i].ident == id ){
			return i;	
		}
	}
}

function cambiarFoco(foco){
	var i = 0;
	for(i = 0; i < objetosBogui.length; i++){
		if(objetosBogui[i].ident == foco ){
			objetoActual = i;	
			$("#imgSelected").html(objetosBogui[objetoActual].nombre);
		}
	}
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
		$("#imgSelected").html("");
	}
}

