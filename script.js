
/* =========================================================
   AÑO NUEVO ROMÁNTICO
   Cuenta regresiva + música + amanecer + fuegos artificiales
   Zona horaria: Tarija, Bolivia (America/La_Paz)
   ========================================================= */


/* =========================================================
   1. CONFIGURACIÓN
   ========================================================= */

// MODO DE PRUEBA: la celebración comienza después de 15 segundos.
const MODO_PRUEBA = false;
const TIEMPO_PRUEBA = 15000;

// Medianoche de Tarija: 1 de enero de 2027 a las 00:00.
// Bolivia utiliza UTC-4.
const FECHA_ANO_NUEVO = Date.UTC(2027, 0, 1, 4, 0, 0);

const RUTA_MUSICA_ESPERA = "music/espera.mp3";
const RUTA_MUSICA_CELEBRACION = "music/celebracion.mp3";

const MENSAJE_AMOR = `Feliz Año Nuevo, mi amor, mi Camila. ❤️🥹🎆

Mi niña hermosa, no sabes cuánto deseo que este nuevo año nos regale muchísimos momentos juntos, porque si hay algo que tengo claro en mi corazón, es que quiero seguir compartiendo mi vida contigo. Quiero estar a tu lado cada segundo, cada minuto, cada día, cada año y cada década que la vida nos permita. Quiero seguir enamorándome de ti, seguir conociéndote, abrazarte cuando estés triste, celebrar tus alegrías y recordarte, incluso en tus días más difíciles, lo inmensamente importante que eres para mí.

Sé que no todo ha sido fácil para nosotros, mi amor. Hemos pasado por momentos que nos han dolido, hemos tenido dificultades y días en los que nuestro corazón no ha estado tan tranquilo como quisiera. Pero, a pesar de todo, hay algo que sigue naciendo dentro de mí cada vez que pienso en nuestro futuro: las ganas de seguir adelante contigo. No quiero que los momentos difíciles sean más grandes que todos los sueños que todavía nos quedan por cumplir. Quiero que aprendamos, que sanemos lo que nos duele y que encontremos juntos la manera de superar cada obstáculo, tomados de la mano, recordando que nuestro amor también merece nuevas oportunidades y momentos bonitos. ❤️

Mi Camila, sueño con el día en que pueda abrazarte a medianoche, darte un beso y desearte feliz Año Nuevo mirándote directamente a los ojos, sin una pantalla que nos separe. Sueño con compartir contigo muchísimos años más, con construir recuerdos, cumplir sueños y llegar a viejitos recordando todo lo que vivimos. Quiero que pasen los años y que todavía seas tú la persona a la que busque con la mirada, la que quiera abrazar al final de un día difícil y a quien desee contarle todas las cosas bonitas que me sucedan.

Si pudiera pedir un deseo para este nuevo año, pediría que la vida nos dé la oportunidad de seguir escribiendo nuestra historia, que nunca nos falten motivos para sonreír juntos y que tengamos la fuerza para superar los días difíciles sin olvidar todo lo bonito que podemos construir. Porque yo no quiero compartir contigo solamente los momentos felices; también quiero acompañarte cuando las cosas no salgan bien, crecer contigo y demostrarte con mis acciones que mi amor no se queda solamente en palabras.

Te amo muchísimo, mi niña. Y si algo deseo con toda mi alma es que, cuando llegue otro Año Nuevo, después de tantos meses y tantas experiencias, podamos volver a mirarnos y decir: «Amor, lo logramos, seguimos aquí, juntos». Y que esa misma ilusión nos acompañe durante muchos años más, hasta contar décadas a tu lado.

Feliz Año Nuevo, mi vida. Gracias por existir, por formar parte de mi historia y por ocupar un lugar en mi corazón que nadie más podría ocupar. No sé qué nos traerá este nuevo año, pero sé que, mientras exista la oportunidad de construir un futuro juntos, mi deseo será seguir eligiéndote, cuidándote y amándote cada día un poquito más.

Hoy, mañana, en cada segundo, en cada minuto y en todos los años que todavía nos esperan, mi corazón desea seguir encontrando un hogar en ti. Te amo, mi Camila, y deseo de todo corazón que este sea un año más de nuestra historia, pero no el último, sino uno de los muchísimos que todavía nos quedan por vivir juntos. ❤️♾️💋💖........TE AMO.......💖`;

const VELOCIDAD_ESCRITURA = 65;


/* =========================================================
   2. ELEMENTOS DEL HTML
   ========================================================= */

const pantallaContador = document.getElementById("pantalla-contador");
const pantallaCelebracion = document.getElementById("pantalla-celebracion");

const diasElemento = document.getElementById("dias");
const horasElemento = document.getElementById("horas");
const minutosElemento = document.getElementById("minutos");
const segundosElemento = document.getElementById("segundos");

const mensajeAmorElemento = document.getElementById("mensaje-amor");

const musicaEspera = document.getElementById("musica-espera");
const musicaCelebracion = document.getElementById("musica-celebracion");

const botonSonido = document.getElementById("boton-sonido");


// Crear el lienzo automáticamente si no existe.
let lienzoFuegos = document.getElementById("lienzo-fuegos");

if (!lienzoFuegos) {
    lienzoFuegos = document.createElement("canvas");
    lienzoFuegos.id = "lienzo-fuegos";
    document.body.appendChild(lienzoFuegos);
}

const contextoFuegos = lienzoFuegos.getContext("2d");

// El lienzo no bloquea los clics.
// La carta y el contador deben quedar por encima.
Object.assign(lienzoFuegos.style, {
    position: "fixed",
    inset: "0",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: "5"
});


/* =========================================================
   3. ESTADO DE LA PÁGINA
   ========================================================= */

let anoNuevoIniciado = false;
let musicaActual = null;
let animacionCartaIniciada = false;

let temporizadorCarta = null;
let indiceCaracter = 0;
let caracteresMensaje = [];

let anchoLienzo = 0;
let altoLienzo = 0;
let escalaLienzo = 1;

let ultimoFotograma = 0;
let tiempoAcumuladoFuegos = 0;

const fuegos = [];
const particulas = [];

let generadorAleatorio = 0;
let indiceColorFuegos = 0;
let temporizadorPrueba = null;

const COLORES_FUEGOS = [
    "#ff304f",
    "#ffffff",
    "#ff4fa3",
    "#ffd166",
    "#b388ff",
    "#54e8ff",
    "#8cff66",
    "#ff8c42"
];


/* =========================================================
   4. PREPARAR LAS CANCIONES
   ========================================================= */

function prepararMusica() {
    if (musicaEspera) {
        musicaEspera.src = RUTA_MUSICA_ESPERA;
        musicaEspera.loop = true;
        musicaEspera.preload = "auto";
        musicaEspera.volume = 0.8;
    }

    if (musicaCelebracion) {
        musicaCelebracion.src = RUTA_MUSICA_CELEBRACION;
        musicaCelebracion.loop = true;
        musicaCelebracion.preload = "auto";
        musicaCelebracion.volume = 0.8;

        musicaCelebracion.pause();
        musicaCelebracion.currentTime = 0;
    }
}


/* =========================================================
   5. REPRODUCCIÓN DE MÚSICA
   ========================================================= */

async function reproducirMusica(audio) {
    if (!audio) return false;

    try {
        await audio.play();

        musicaActual = audio;
        actualizarBotonSonido();

        return true;
    } catch (error) {
        // Algunos navegadores requieren una interacción del usuario.
        actualizarBotonSonido();

        return false;
    }
}


function actualizarBotonSonido() {
    if (!botonSonido) return;

    const estaSonando = musicaActual &&
        !musicaActual.paused &&
        !musicaActual.ended;

    botonSonido.hidden = Boolean(estaSonando);

    const textoBoton = botonSonido.querySelector("span:last-child");

    if (textoBoton) {
        textoBoton.textContent = "Activar música";
    } else if (!estaSonando) {
        botonSonido.textContent = "🔊 Activar música";
    }
}


async function iniciarMusicaEspera() {
    if (anoNuevoIniciado || !musicaEspera) return;

    musicaActual = musicaEspera;
    await reproducirMusica(musicaEspera);
}


async function cambiarMusicaCelebracion() {
    if (musicaEspera) {
        musicaEspera.pause();
        musicaEspera.currentTime = 0;
    }

    if (!musicaCelebracion) {
        musicaActual = null;
        actualizarBotonSonido();
        return;
    }

    musicaActual = musicaCelebracion;
    await reproducirMusica(musicaCelebracion);
}


if (botonSonido) {
    botonSonido.addEventListener("click", async () => {
        const audio = anoNuevoIniciado
            ? musicaCelebracion
            : musicaEspera;

        if (!audio) return;

        // Detener la otra canción antes de reproducir esta.
        if (musicaEspera && audio !== musicaEspera) {
            musicaEspera.pause();
        }

        if (musicaCelebracion && audio !== musicaCelebracion) {
            musicaCelebracion.pause();
        }

        if (!audio.paused) {
            audio.pause();
            actualizarBotonSonido();
            return;
        }

        await reproducirMusica(audio);
    });
}


/* =========================================================
   6. CONTADOR REGRESIVO
   ========================================================= */

function actualizarContador() {
    const diferencia = FECHA_ANO_NUEVO - Date.now();

    if (diferencia <= 0) {
        if (!MODO_PRUEBA && !anoNuevoIniciado) {
            iniciarCelebracion();
        }

        if (!MODO_PRUEBA) {
            if (diasElemento) diasElemento.textContent = "000";
            if (horasElemento) horasElemento.textContent = "00";
            if (minutosElemento) minutosElemento.textContent = "00";
            if (segundosElemento) segundosElemento.textContent = "00";
        }

        return;
    }

    const dias = Math.floor(
        diferencia / (1000 * 60 * 60 * 24)
    );

    const horas = Math.floor(
        (diferencia / (1000 * 60 * 60)) % 24
    );

    const minutos = Math.floor(
        (diferencia / (1000 * 60)) % 60
    );

    const segundos = Math.floor(
        (diferencia / 1000) % 60
    );

    if (diasElemento) {
        diasElemento.textContent = String(dias).padStart(3, "0");
    }

    if (horasElemento) {
        horasElemento.textContent = String(horas).padStart(2, "0");
    }

    if (minutosElemento) {
        minutosElemento.textContent = String(minutos).padStart(2, "0");
    }

    if (segundosElemento) {
        segundosElemento.textContent = String(segundos).padStart(2, "0");
    }
}


/* =========================================================
   7. TRANSICIÓN A AÑO NUEVO
   ========================================================= */

async function iniciarCelebracion() {
    if (anoNuevoIniciado) return;

    anoNuevoIniciado = true;

    if (temporizadorPrueba !== null) {
        clearTimeout(temporizadorPrueba);
        temporizadorPrueba = null;
    }

    document.body.classList.add("ano-nuevo");

    if (pantallaContador) {
        pantallaContador.hidden = true;
    }

    if (pantallaCelebracion) {
        pantallaCelebracion.hidden = false;
        pantallaCelebracion.style.display = "flex";
    }

    if (musicaEspera) {
        musicaEspera.pause();
        musicaEspera.currentTime = 0;
    }

    // Iniciar los fuegos sin bloquear el resto de la celebración.
    iniciarFuegosArtificiales();

    // Cambiar a la canción de celebración.
    cambiarMusicaCelebracion();

    // Escribir la carta progresivamente.
    iniciarEscrituraCarta();

    actualizarBotonSonido();
}


/* =========================================================
   8. ESCRITURA PROGRESIVA DE LA CARTA
   ========================================================= */

function iniciarEscrituraCarta() {
    if (animacionCartaIniciada || !mensajeAmorElemento) return;

    animacionCartaIniciada = true;
    indiceCaracter = 0;
    caracteresMensaje = Array.from(MENSAJE_AMOR);

    mensajeAmorElemento.textContent = "";
    mensajeAmorElemento.style.whiteSpace = "pre-line";

    escribirSiguienteCaracter();
}


function escribirSiguienteCaracter() {
    if (!mensajeAmorElemento) return;

    if (indiceCaracter >= caracteresMensaje.length) {
        temporizadorCarta = null;
        return;
    }

    mensajeAmorElemento.textContent += caracteresMensaje[indiceCaracter];

    indiceCaracter++;

    temporizadorCarta = setTimeout(
        escribirSiguienteCaracter,
        VELOCIDAD_ESCRITURA
    );
}


/* =========================================================
   9. PREPARAR EL LIENZO DE LOS FUEGOS
   ========================================================= */

function ajustarLienzo() {
    if (!lienzoFuegos || !contextoFuegos) return;

    anchoLienzo = window.innerWidth;
    altoLienzo = window.innerHeight;

    escalaLienzo = Math.min(
        window.devicePixelRatio || 1,
        1.5
    );

    lienzoFuegos.width = Math.round(
        anchoLienzo * escalaLienzo
    );

    lienzoFuegos.height = Math.round(
        altoLienzo * escalaLienzo
    );

    lienzoFuegos.style.width = `${anchoLienzo}px`;
    lienzoFuegos.style.height = `${altoLienzo}px`;

    contextoFuegos.setTransform(
        escalaLienzo,
        0,
        0,
        escalaLienzo,
        0,
        0
    );
}


window.addEventListener("resize", ajustarLienzo);


/* =========================================================
   10. CREAR UN FUEGO ARTIFICIAL
   Fuegos laterales y un solo color por explosión.
   ========================================================= */

function crearFuegoArtificial() {
    if (!contextoFuegos || anchoLienzo <= 0 || altoLienzo <= 0) {
        return;
    }

    // Alternar entre los laterales para dejar libre el centro.
    const ladoIzquierdo = Math.random() < 0.5;

    const origenX = ladoIzquierdo
        ? anchoLienzo * (0.06 + Math.random() * 0.16)
        : anchoLienzo * (0.78 + Math.random() * 0.16);

    const destinoY = altoLienzo * (
        0.16 + Math.random() * 0.30
    );

    // Un único color para todas las partículas de esta explosión.
    const color = COLORES_FUEGOS[
        indiceColorFuegos % COLORES_FUEGOS.length
    ];

    indiceColorFuegos++;

    fuegos.push({
        x: origenX,
        y: altoLienzo + 5,

        destinoX: origenX + (
            Math.random() - 0.5
        ) * anchoLienzo * 0.08,

        destinoY: destinoY,

        velocidadY: 4 + Math.random() * 2.5,

        color: color,

        estela: []
    });
}


/* =========================================================
   11. EXPLOSIÓN DE PARTÍCULAS
   ========================================================= */

function explotarFuego(fuego) {
    const cantidad = anchoLienzo < 600 ? 55 : 85;

    for (let i = 0; i < cantidad; i++) {
        const angulo = (
            Math.PI * 2 * i
        ) / cantidad;

        const velocidad = 1.5 + Math.random() * 4;

        particulas.push({
            x: fuego.x,
            y: fuego.y,

            velocidadX: Math.cos(angulo) * velocidad,
            velocidadY: Math.sin(angulo) * velocidad,

            gravedad: 0.04 + Math.random() * 0.025,
            friccion: 0.985,

            vida: 1,
            decaimiento: 0.007 + Math.random() * 0.006,

            radio: 1.2 + Math.random() * 1.5,

            color: fuego.color
        });
    }
}


/* =========================================================
   12. DIBUJAR LOS FUEGOS ARTIFICIALES
   ========================================================= */

function dibujarFuegos(delta) {
    if (!contextoFuegos) return;

    contextoFuegos.clearRect(
        0,
        0,
        anchoLienzo,
        altoLienzo
    );

    const factorTiempo = Math.min(delta / 16.67, 2.5);

    // Mover los cohetes y dibujar sus estelas.
    for (let i = fuegos.length - 1; i >= 0; i--) {
        const fuego = fuegos[i];

        fuego.y -= fuego.velocidadY * factorTiempo;

        fuego.x += (
            fuego.destinoX - fuego.x
        ) * 0.015 * factorTiempo;

        fuego.estela.push({
            x: fuego.x,
            y: fuego.y
        });

        if (fuego.estela.length > 8) {
            fuego.estela.shift();
        }

        contextoFuegos.beginPath();

        fuego.estela.forEach((punto, indice) => {
            if (indice === 0) {
                contextoFuegos.moveTo(punto.x, punto.y);
            } else {
                contextoFuegos.lineTo(punto.x, punto.y);
            }
        });

        contextoFuegos.strokeStyle = fuego.color;
        contextoFuegos.lineWidth = 2;
        contextoFuegos.shadowBlur = 8;
        contextoFuegos.shadowColor = fuego.color;
        contextoFuegos.stroke();

        // La cabeza conserva el mismo color del cohete.
        contextoFuegos.beginPath();

        contextoFuegos.arc(
            fuego.x,
            fuego.y,
            2,
            0,
            Math.PI * 2
        );

        contextoFuegos.fillStyle = fuego.color;
        contextoFuegos.fill();

        if (fuego.y <= fuego.destinoY) {
            explotarFuego(fuego);
            fuegos.splice(i, 1);
        }
    }

    // Dibujar y actualizar las partículas.
    for (let i = particulas.length - 1; i >= 0; i--) {
        const p = particulas[i];

        p.x += p.velocidadX * factorTiempo;
        p.y += p.velocidadY * factorTiempo;

        p.velocidadX *= Math.pow(p.friccion, factorTiempo);
        p.velocidadY *= Math.pow(p.friccion, factorTiempo);

        p.velocidadY += p.gravedad * factorTiempo;

        p.vida -= p.decaimiento * factorTiempo;

        if (p.vida <= 0) {
            particulas.splice(i, 1);
            continue;
        }

        contextoFuegos.globalAlpha = Math.max(0, p.vida);
        contextoFuegos.fillStyle = p.color;
        contextoFuegos.shadowBlur = 10;
        contextoFuegos.shadowColor = p.color;

        contextoFuegos.beginPath();

        contextoFuegos.arc(
            p.x,
            p.y,
            p.radio,
            0,
            Math.PI * 2
        );

        contextoFuegos.fill();
    }

    contextoFuegos.globalAlpha = 1;
    contextoFuegos.shadowBlur = 0;
}


/* =========================================================
   13. ANIMACIÓN CONTINUA DE LOS FUEGOS
   ========================================================= */

function animarFuegos(tiempoActual) {
    if (!anoNuevoIniciado) {
        generadorAleatorio = 0;
        return;
    }

    if (!ultimoFotograma) {
        ultimoFotograma = tiempoActual;
    }

    const delta = tiempoActual - ultimoFotograma;
    ultimoFotograma = tiempoActual;

    tiempoAcumuladoFuegos += delta;

    const intervalo = anchoLienzo < 600 ? 650 : 500;

    if (tiempoAcumuladoFuegos >= intervalo) {
        crearFuegoArtificial();

        tiempoAcumuladoFuegos = 0;

        if (Math.random() > 0.65) {
            crearFuegoArtificial();
        }
    }

    dibujarFuegos(delta);

    requestAnimationFrame(animarFuegos);
}


function iniciarFuegosArtificiales() {
    if (!contextoFuegos || generadorAleatorio) return;

    generadorAleatorio = 1;

    ajustarLienzo();

    ultimoFotograma = 0;
    tiempoAcumuladoFuegos = 0;

    fuegos.length = 0;
    particulas.length = 0;

    // Varias explosiones iniciales para que se vean enseguida.
    crearFuegoArtificial();
    crearFuegoArtificial();
    crearFuegoArtificial();
    crearFuegoArtificial();

    requestAnimationFrame(animarFuegos);
}


/* =========================================================
   14. INICIAR LA PÁGINA
   ========================================================= */

function iniciarPagina() {
    prepararMusica();
    ajustarLienzo();

    if (MODO_PRUEBA) {
        // En la prueba mostramos el contador durante 15 segundos.
        if (pantallaContador) {
            pantallaContador.hidden = false;
        }

        if (pantallaCelebracion) {
            pantallaCelebracion.hidden = true;
        }

        actualizarContador();

        iniciarMusicaEspera();

        temporizadorPrueba = setTimeout(() => {
            iniciarCelebracion();
        }, TIEMPO_PRUEBA);

        return;
    }

    // Funcionamiento normal con la fecha real.
    if (Date.now() >= FECHA_ANO_NUEVO) {
        iniciarCelebracion();
    } else {
        if (pantallaContador) {
            pantallaContador.hidden = false;
        }

        if (pantallaCelebracion) {
            pantallaCelebracion.hidden = true;
        }

        actualizarContador();

        iniciarMusicaEspera();

        setInterval(actualizarContador, 250);
    }
}


/* =========================================================
   15. ACTUALIZAR EL BOTÓN CUANDO CAMBIA EL AUDIO
   ========================================================= */

if (musicaEspera) {
    musicaEspera.addEventListener("play", actualizarBotonSonido);
    musicaEspera.addEventListener("pause", actualizarBotonSonido);
    musicaEspera.addEventListener("ended", actualizarBotonSonido);
}

if (musicaCelebracion) {
    musicaCelebracion.addEventListener("play", actualizarBotonSonido);
    musicaCelebracion.addEventListener("pause", actualizarBotonSonido);
    musicaCelebracion.addEventListener("ended", actualizarBotonSonido);
}


/* =========================================================
   16. INICIAR TODO
   ========================================================= */

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciarPagina);
} else {
    iniciarPagina();
}
