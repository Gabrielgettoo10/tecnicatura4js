'use strict';
// Veamos como evitar este error

try {
    let x = 10; // Lo traemos con alt + flecha abajo o hacia arriba
    //miFuncion(); // Capturamos el error de la función
    throw 'Mi Error'; //Maneja tipo String
} 
catch ( error ) { //Catchamos el error
    console.log( typeof(error) ); 
}
finally {
    console.log('Termina la revisipon de errores');
}

// La ejecución ahora continua...
console.log('Continuamos...'); //Esto no se llega a ver porque esta bloqueado

let resultado = -5;

try {
    y = 5;
    if( isNaN(resultado)) throw'No es un número'; 
    else if(resultado === '') throw 'Es una cadena vacia';
    else if(resultado >= 0) throw 'Es un número positivo';
    else if(resultado < 0) throw 'Es un número negativo';
}
catch(error) {
    console.log(error);
    console.log(error.name);
    console.log(error.message);
} 
finally {
    console.log('Termina la revisión de errores 2');
}





