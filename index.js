
let casaPersonaje;
let intervalo;
let seg = document.getElementById("tiempo").innerHTML;

function borrarMensaje() {
    document.getElementById("resultado").innerText = "";
}

function llamarApi() {

    document.getElementById("llamar-api").setAttribute("disabled", "");

    fetch('https://api.gameofthronesquotes.xyz/v1/random')
        .then(response => {
            if (response.ok) {
                return response.json(); // Parse the response data as JSON 
            } else {
                throw new Error('API request failed');
            }
        })
        .then(data => {
            // Process the response data here 
            let name = data.character.slug;
            document.getElementById("nombre").innerText = name.charAt(0).toUpperCase() + name.slice(1);;

            if (data.character.house.name == null) {
                casaPersonaje = "sin casa";
            } else {
                casaPersonaje = data.character.house.name;
            }
            intervalo = setInterval(mostrar, 1000);
        })
        .catch(error => {
            // Handle any errors here 
            console.error(error); // Example: Logging the error to the console 
        });

}
function mostrar(){
    if(seg>=0){
        document.getElementById("tiempo").innerHTML = seg;
        seg--;
    }else{
        clearInterval(intervalo)
    }
}

function unselect() {
    document.querySelectorAll('[name=opcion]').forEach((x) => x.checked = false);
}

function grabarMejorMarca(){
    let puntos = parseInt(document.getElementById("puntos").innerText);

    let mejorMArca = parseInt(document.getElementById("mejor-marca").innerText);

    if(puntos > mejorMArca) {
        document.getElementById("mejor-marca").innerText = puntos;
    }

    document.getElementById("puntos").innerText = 0;
}

function enviarRespuesta() {

    let puntos = parseInt(document.getElementById("puntos").innerText);
    let respuesta = document.querySelector('input[name="opcion"]:checked').value;

    unselect();

    if (casaPersonaje === respuesta) {
        document.getElementById("puntos").innerText = puntos + 100;
        document.getElementById("resultado").innerText = "Adivinaste!!!";
        llamarApi();
    } else {
        document.getElementById("resultado").innerText = "Perdiste";
        document.getElementById("llamar-api").removeAttribute("disabled");
        grabarMejorMarca();
    }
    
    setTimeout(borrarMensaje, 2000);

}

