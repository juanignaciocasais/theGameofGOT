
let casaPersonaje;
let intervalo;
let sigueJuego = false;
let seg;
let personajes = [];
let personaje;

obtenerPersonajes();

function obtenerPersonajes() {

    fetch('https://api.gameofthronesquotes.xyz/v1/characters')
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('API request failed');
            }
        })
        .then(data => {

            data.forEach((data) => {

                if (data.slug == 'baelish') {
                    personajes.push({ nombre: 'petyr', casa: data.house.name });
                } else if (data.house == null) {
                    personajes.push({ nombre: data.slug, casa: 'sin casa' });
                } else {
                    personajes.push({ nombre: data.slug, casa: data.house.name });
                }
            });
        })
        .catch(error => {
            console.error(error);
        });
}

function borrarMensaje() {
    document.getElementById("resultado").innerText = "";
}

function empezarJuego() {
    grabarMejorMarca();
    document.getElementById("iniciar-juego").setAttribute("disabled", "");

    sigueJuego = true;
    seg = 59;
    document.getElementById("tiempo").innerText = seg;
    intervalo = setInterval(mostrar, 1000);
    cicloJuego();
}

function cicloJuego() {

    let personaje = obtenerPersonajeRandom();
    personajes = eliminarPersonajeDelArray(personaje);

    casaPersonaje = personaje.casa;
    imprimirPersonaje(personaje);
}

function imprimirPersonaje(personaje) {
    document.getElementById("nombre").innerText = personaje.nombre.charAt(0).toUpperCase() + personaje.nombre.slice(1);
}

function mostrar() {
    if (seg > 0 && sigueJuego) {
        seg--;
        document.getElementById("tiempo").innerHTML = seg;
    } else {
        clearInterval(intervalo)
        detenerJuego();
        if (seg <= 0) {
            document.getElementById("resultado").innerText = "Se acabo el tiempo, volvé a jugar!";
            document.getElementById("nombre").innerText = "";
            setTimeout(borrarMensaje, 2000);
        }
    }
}

function grabarMejorMarca() {
    let puntos = parseInt(document.getElementById("puntos").innerText);

    let mejorMarca = parseInt(document.getElementById("mejor-marca").innerText);

    if (puntos > mejorMarca) {
        document.getElementById("mejor-marca").innerText = puntos;
    }

    document.getElementById("puntos").innerText = 0;
}

function enviarRespuesta(eleccion) {

    if (!sigueJuego) {
        document.getElementById("resultado").innerText = "Debes iniciar el juego...";
        setTimeout(borrarMensaje, 2000);
        return;
    }

    if (casaPersonaje === eleccion) {
        actualizarPuntos();
        validarUltimoAcierto();
    } else {
        document.getElementById("resultado").innerText = "Perdiste, volvé a jugar!";
        detenerJuego();
    }
}

function obtenerPersonajeRandom() {

    return personajes[Math.floor(Math.random() * personajes.length)];
}

function eliminarPersonajeDelArray(personaje) {

    return personajes.filter(p => p != personaje);
}

function detenerJuego() {
    document.getElementById("iniciar-juego").removeAttribute("disabled");
    document.getElementById("tiempo").innerHTML = 60
    document.getElementById("nombre").innerHTML = ""

    sigueJuego = false;
    personajes = [];

    obtenerPersonajes();
}

function actualizarPuntos() {
    let puntos = parseInt(document.getElementById("puntos").innerText);
    document.getElementById("puntos").innerText = puntos + 100;
}

function validarUltimoAcierto() {
    let mensaje = "Adivinaste!"

    if (personajes.length <= 1) {
        mensaje = "Ganaste!";
        sigueJuego = false;
    }

    document.getElementById("resultado").innerText = mensaje;

    if (sigueJuego) {
        cicloJuego();
        setTimeout(borrarMensaje, 2000);
    } else {
        detenerJuego();
    }
}