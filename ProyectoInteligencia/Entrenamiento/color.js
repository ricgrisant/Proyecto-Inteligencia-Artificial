
$(document).ready(function(){
	var entrenamiento = new Array();

	$(".colorPanel").css('background-color', colorAleat());

	//Se cambia el color de la imagen al darle click al cuadro
  $(".colorPanel").click(function(){
    $(this).css('background-color', colorAleat());
  });

  //Se cambia el color de la imagen despues de dar click a cada color y se guarda con su etiqueta
  $(".btnR").click(function() {
    info($(this).attr("name"));
  });

  $(".btnV").click(function(){
    info($(this).attr("name"));
  });

  $(".btnAz").click(function(){
    info($(this).attr("name"));
  });

  $(".btnAm").click(function(){
    info($(this).attr("name"));
  });

  $(".btnN").click(function(){
    info($(this).attr("name"));
  });

  $(".btnG").click(function(){
    info($(this).attr("name"));
  });

  $(".btnC").click(function(){
    info($(this).attr("name"));
  });

  $(".btnRsd").click(function() {
    info($(this).attr("name"));
  });

  $(".btnM").click(function() {
    info($(this).attr("name"));
  });

  $(".btnFin").click(function() {
    //Se terminara el proceso de entrenamiento y se dara la informacion en json para ser almacenada
    download(JSON.stringify(entrenamiento), 'resultadoAI.txt', 'text/plain');
  });

  //Funcion que obtiene etiqueta de el boton y el color que se eligio

  function info(name) {
    guardar(matchColorEtiq(name));
    console.log(entrenamiento);
    $(".colorPanel").css('background-color', colorAleat());
  }

  //Se guarda en un array los datos
	function guardar(match)
	{
		entrenamiento.push(match);
	}

});

//Funcion que crea rgb aleatoriamente
function colorAleat()
{
	var r = Math.floor((Math.random() * 256));
	var g = Math.floor((Math.random() * 256));
	var b = Math.floor((Math.random() * 256));

	return 'rgb(' +r+',' +g+','+b+')';
}

function matchColorEtiq(etiqueta)
{
  var c = $(".colorPanel").css("background-color");
  var rgb = c.replace(/^rgba?\(|\s+|\)$/g,'').split(',');
  var resultado = {
    r : rgb[0],
    g : rgb[1],
    b : rgb[2],
    label : etiqueta
  }
  return resultado;
}

function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}


