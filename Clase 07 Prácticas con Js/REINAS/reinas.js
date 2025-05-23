function resolverNReinas() {
  const n = parseInt(document.getElementById('nValue').value);
  const tablero = Array.from({ length: n }, () => Array(n).fill(0));
  const resultado = document.getElementById('resultado');
  const divTablero = document.getElementById('tablero');
  
  resultado.textContent = '';
  divTablero.innerHTML = '';

  function esSeguro(fila, col) {
    for (let i = 0; i < fila; i++) {
      if (tablero[i][col]) return false;
    }
    for (let i = fila, j = col; i >= 0 && j >= 0; i--, j--) {
      if (tablero[i][j]) return false;
    }
    for (let i = fila, j = col; i >= 0 && j < n; i--, j++) {
      if (tablero[i][j]) return false;
    }
    return true;
  }

  function resolver(fila) {
    if (fila === n) return true;
    for (let col = 0; col < n; col++) {
      if (esSeguro(fila, col)) {
        tablero[fila][col] = 1;
        if (resolver(fila + 1)) return true;
        tablero[fila][col] = 0;
      }
    }
    return false;
  }

  if (!resolver(0)) {
    resultado.textContent = 'No se encontró solución.';
    return;
  }

  // Mostrar tablero
  divTablero.style.gridTemplateColumns = `repeat(${n}, 40px)`;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const celda = document.createElement('div');
      celda.classList.add('celda');
      celda.classList.add((i + j) % 2 === 0 ? 'blanca' : 'negra');
      if (tablero[i][j] === 1) celda.textContent = '♛';
      divTablero.appendChild(celda);
    }
  }

  const indices = tablero.map(fila => fila.findIndex(val => val === 1));
  resultado.textContent = `Índices de columnas por fila: [${indices.join(', ')}]`;
}

  
