class Empleado {
    constructor(nombre, salario) {
        this._nombre = nombre;
        this._salario = salario;
    }

    obtenerDetalles() {
        return `Empleado:  nombre: ${this._nombre}, 
        Salario: ${this._salario}`;
    }
}

class Gerente extends Empleado {
    constructor(nombre, salario, departamento) {
        super(nombre, salario);
        this._departamento = departamento;
    }

    //Agregamos la sobreescritura
    obtenerDetalles() {
        return `Gerente: ${super.obtenerDetalles()}, 
        Departamento: ${this._departamento}`;
    }
}

function imprimir(tipo) {
    console.log(tipo.obtenerDetalles());
    if (tipo instanceof Gerente) {
        console.log('Es un objeto de tipo Gerente');
        console.log(tipo._departamento); //Accedemos a la propiedad del hijo
    }
    else if (tipo instanceof Empleado) {
    console.log('Es de tipo Empleado');
    console.log(tipo._departamento);  //No existe en la clase padre
    }
    else if (tipo instanceof Object) { //El orden siempre es jerárquico
        console.log('Es de tipo Object');//Clase padre de todas las clases
    }
}

let gerente1 = new Gerente("Juan", 5000, "Sistemas");
console.log(gerente1); //Objeto de la clase hija

let empleado1 = new Empleado("Carlos", 2000);
console.log(empleado1); //Objeto de la clase padre

imprimir(gerente1); 
imprimir(empleado1);