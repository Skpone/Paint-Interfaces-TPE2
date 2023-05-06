"use strict";

// ------------------------------------------
// elementos HTML
// ------------------------------------------

const CANVAS = document.querySelector('#canvas');
const TOOLS = document.querySelector('.tools');

const COLOR = TOOLS.querySelector('#color');
const LINEWIDTH = TOOLS.querySelector('#lineWidth');
const PENCIL = TOOLS.querySelector('#pencil'); 
const ERASER = TOOLS.querySelector('#eraser');
const CLEANBUTTON = TOOLS.querySelector('#clean-out');
const IMAGELOADER = TOOLS.querySelector("#imageLoader");
const DOWNLOADRAW = TOOLS.querySelector('#download-draw');
const FILTERS = TOOLS.querySelector('#filters'); //select de filtros
const FILTERBUTTON = TOOLS.querySelector('#filter-button');

const CTX = CANVAS.getContext('2d', { willReadFrequently: true }); //seteamos willReadFrecuently para operaciones con "getImageData" mas rapidas


// ------------------------------------------
// variables de control
// ------------------------------------------
let lineWidth = 3; //valor del trazo por defecto
let color = '#000'; //valor del color por defecto
let pen = null;
let imagen = new Imagen(CTX, CANVAS.width, CANVAS.height, null); //instanciamos nuestro objeto imagen, sin ningun archivo por defecto


// ------------------------------------------
// funciones
// ------------------------------------------

function draw(e) {
    pen.draw();
    pen.moveTo(e.offsetX,e.offsetY); 
}


function cleanCanvas() {
    IMAGELOADER.value = ""; //necesario poner valor del imageLoader en vacío por si se requiere subir la misma imagen luego
    CTX.clearRect(0,0,CANVAS.width,CANVAS.height);
}

function drawImage(file) {
    cleanCanvas();
    CTX.globalCompositeOperation = "source-over"; //si es que me quedo el eraser activado, volvemos a la propiedad default del canvas para que se pueda ver la imagen subida

    imagen.setNewImage(file);
    imagen.drawImage();
}

function downloadDraw() {
    let link = document.createElement("a");//creamos un link, un elemento html anchor
    //le asignamos el link que genera el canvas del dibujo hecho con "toDataURL"
    link.href = CANVAS.toDataURL();
    //nombre de la imagen: fecha actual
    link.download = `${new Date()}.jpg`;
    link.click();//redirigijimos a descargar el archivo
}

function filter() {
    let filterValue = FILTERS.value; //filtro que se elegió
    
    switch (filterValue) {
        case "negative": {
            imagen.filterNegative();
        } break;
        case "brightness": {
            imagen.filterBrightness();
        } break;
        case "binarization": {
            imagen.filterBinarization();
        } break;
        case "sepia": {
            imagen.filterSepia();
        } break;
        case "saturation": {
            imagen.filterSaturation();
        } break;
        case "blur": {
            imagen.filterBlur();
        } break;
        case "original": {
            imagen.filterOriginal();
            break;
        }
    }
}

// ------------------------------------------
// eventos
// ------------------------------------------

COLOR.addEventListener('input', () => {//vez q se modifica el input se cambia el valor del color para dibujar
    color = COLOR.value;
})
LINEWIDTH.addEventListener('input', () => {//vez q se modifica el input se cambia el ancho del trazo
    lineWidth = LINEWIDTH.value;
})

PENCIL.addEventListener('click', () => {
    CTX.globalCompositeOperation = "source-over";//propiedad default del canvas para dibujar (seteamos siempre en caso de que este activado el eraser)
})
ERASER.addEventListener('click', () => {
    CTX.globalCompositeOperation = "destination-out";//propiedad que nos sirve para hacer un trazo negro transparente (cumpliendo la funcion de borrar)
})

CANVAS.addEventListener('mousedown', (e) => {
    pen = new Pencil(e.offsetX, e.offsetY, color, CTX, lineWidth);
    CANVAS.addEventListener('mousemove', draw);
})
CANVAS.addEventListener('mouseup', () => {
    CANVAS.removeEventListener('mousemove', draw);
})
//si el mouse sale del canvas con mousedown, quitamos el evento con la funcion que dibuja 
CANVAS.addEventListener('mouseleave', () => {
    CANVAS.removeEventListener('mousemove', draw);
})

CLEANBUTTON.addEventListener('click', () => {
    cleanCanvas();
})
IMAGELOADER.addEventListener('input', () => { //cuando se suba un archivo al input
    let file = IMAGELOADER.files[0]; //obtenemos el file subido
    drawImage(file);
})
DOWNLOADRAW.addEventListener('click', () => {
    downloadDraw();
})
FILTERBUTTON.addEventListener('click', () => {
    filter();
})

