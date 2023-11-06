
let casaPersonaje;
let intervalo;
let sigueJuego;
let seg;
let personajes = [];
let personaje;

function borrarMensaje() {
    document.getElementById("resultado").innerText = "";
}

function desactivarSpinner() {
    document.getElementById("spinner").setAttribute("visibility", "hidden");
}

function empezarJuego(){
    personajes = [];
    llamarApi()
    sigueJuego = true;
    seg = 59
    document.getElementById("tiempo").innerText = seg;
    intervalo = setInterval(mostrar, 1000);
}


function llamarApi() {
    document.getElementById("spinner").setAttribute("visibility", "unset");
    setTimeout(desactivarSpinner, 1000);
    document.getElementById("iniciar-juego").setAttribute("disabled", "");
    document.getElementById("enviar-respuesta").removeAttribute("disabled");
    document.getElementById("nombre").setAttribute("display", "none");
    document.getElementById("nombre").innerText = "";
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

            personaje = data;

            personaje = validarPersonaje(personaje);

            let name = data.character.slug;
            document.getElementById("nombre").innerText = name.charAt(0).toUpperCase() + name.slice(1);
            
            if (personaje.character.house.name == null) {
                casaPersonaje = "sin casa";
            } else {
                casaPersonaje = personaje.character.house.name;
            }
        })
        .catch(error => {
            // Handle any errors here 
            console.error(error); // Example: Logging the error to the console 
        });
        document.getElementById("nombre").setAttribute("display", "block");
}

function mostrar(){
    if(seg >= 0 && sigueJuego){
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
        document.getElementById("resultado").innerText = "Adivinaste!";
        llamarApi();
        sigueJuego = true;
        setTimeout(borrarMensaje, 2000);
    } else {
        detenerJuego();
    }
}

function validarPersonaje(personaje) {
    console.log(personajes);
    if (!personajes.includes(personaje.character.slug)) {
        console.log("OK");
        personajes.push(personaje.character.slug)
    } else {
        console.log("REPETIDOOO");
        llamarApi();
    }

    return personaje;
}

function detenerJuego(){
    document.getElementById("resultado").innerText = "Perdiste, volvé a jugar!";
    document.getElementById("iniciar-juego").removeAttribute("disabled");
    document.getElementById("enviar-respuesta").setAttribute("disabled", "");
    grabarMejorMarca();

    sigueJuego = false;
}