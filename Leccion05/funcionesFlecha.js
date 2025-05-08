


function miFuncion() {
    console.log("Hola Mundo desde una función normal");
}
miFuncion();

let myFuncion = function () {
    console.log("Hola Mundo desde una función anónima");
}

//Ahora vamos a crear una función flecha
let miFuncionFlecha = () => {
    console.log("Hola Mundo desde una función flecha");
}
//Hay mas variantes para funciones flecha que vamos a ir viendo
miFuncionFlecha();

//lo hacemos en una línea
const saludar = () => console.log('Hola Mundo desde una función flecha en una línea');

saludar();

//otro ejemplo
const saludar2 = () => {
    return 'Hola Mundo desde la función flecha dos'
}

console.log(saludar2());

//Simplificamos la función anterior
const saludar3 = () => 'Hola Mundo desde la función flecha tres';

console.log(saludar3());

//Continuamos con otro ejemplo
const regresaObjeto = () => ({ nombre: 'Juan', apellido: 'Pérez' });

console.log(regresaObjeto());

//Funciones flecha que reciben parámetros
const funcionParametros = ( mensaje ) => console.log( mensaje );

funcionParametros('Hola Mundo desde una función flecha con parámetros');

//Una función clásica
const funcionParametrosClasica = function( mensaje ) {
    console.log( mensaje );
}

funcionParametrosClasica('Hola Mundo desde una función clásica');

//Se pueden omitir los paréntesis en la funcion flecha de la siguiente manera 
const funcionConParametros = mensaje => console.log( mensaje );

funcionConParametros('Otra forma de trabajar con función flecha');

//Ahora vemos funciones flecha con varios parámetros
//Podemos abrir la función y tener más cosas dentro de ella
const funcionConParametros2 = ( op1, op2 ) => {
    let resultado = op1 + op2;
    return resultado;
}
console.log(funcionConParametros2(5, 10));























