document.addEventListener('DOMContentLoaded', () => {
    // Botones y elementos del DOM
    const startButton = document.getElementById('startButton');
    const startAnimatedButton = document.getElementById('startAnimatedButton');
    const pauseButton = document.getElementById('pauseButton');
    const resumeButton = document.getElementById('resumeButton');
    const stopButton = document.getElementById('stopButton');

    const boardSizeInput = document.getElementById('boardSize');
    const animationSpeedInput = document.getElementById('animationSpeed');
    const speedValueSpan = document.getElementById('speedValue');
    const statusDiv = document.getElementById('status');
    const boardOutputDiv = document.getElementById('boardOutput');

    // Estado de la simulación
    let N_global;
    let animationDelay = parseInt(animationSpeedInput.value);
    const KNIGHT_ICON = "♞";
    
    let isPaused = false;
    let animationRunning = false;
    let stopRequested = false;
    let currentKnightPos = { x: -1, y: -1 }; // Para resaltar al pausar

    // Movimientos del caballo
    const moveX = [2, 1, -1, -2, -2, -1, 1, 2];
    const moveY = [1, 2, 2, 1, -1, -2, -2, -1];

    // --- Funciones de Utilidad ---
    animationSpeedInput.addEventListener('input', (event) => {
        animationDelay = parseInt(event.target.value);
        speedValueSpan.textContent = `${animationDelay} ms`;
    });

    async function controlledDelay(ms) {
        let elapsed = 0;
        const step = 10; // Verificar cada 10ms
        while (elapsed < ms) {
            if (stopRequested) {
                console.log("Delay interrumpido por stopRequest");
                throw new Error("SimulationStopped"); // Lanzar error para detener la recursión
            }
            if (isPaused) {
                // Marcar visualmente la pausa si hay una posición actual
                if (currentKnightPos.x !== -1) {
                    const cell = document.getElementById(`cell-${currentKnightPos.x}-${currentKnightPos.y}`);
                    if (cell) cell.classList.add('paused-knight');
                }
                await new Promise(resolve => { // Espera activa para reanudar
                    const checkResume = setInterval(() => {
                        if (!isPaused || stopRequested) {
                            clearInterval(checkResume);
                             if (currentKnightPos.x !== -1) { 
                                const cell = document.getElementById(`cell-${currentKnightPos.x}-${currentKnightPos.y}`);
                                if (cell) cell.classList.remove('paused-knight');
                             }
                            resolve();
                        }
                    }, 100);
                });
                if (stopRequested) throw new Error("SimulationStopped");
            }
            await new Promise(resolve => setTimeout(resolve, Math.min(step, ms - elapsed)));
            elapsed += step;
        }
    }

    function isSafe(x, y, board) {
        return (x >= 0 && x < N_global && y >= 0 && y < N_global && board[x][y] === -1);
    }

    function initializeHTMLBoard(N) {
        let tableHTML = "<table>";
        for (let i = 0; i < N; i++) {
            tableHTML += "<tr>";
            for (let j = 0; j < N; j++) {
                tableHTML += `<td id="cell-${i}-${j}"></td>`;
            }
            tableHTML += "</tr>";
        }
        tableHTML += "</table>";
        boardOutputDiv.innerHTML = tableHTML;
    }

    function updateBoardCell(x, y, value, isCurrent = false, isBacktracking = false) {
        const cellId = `cell-${x}-${y}`;
        const cell = document.getElementById(cellId);
        if (cell) {
            cell.classList.remove('current-knight', 'visited-knight', 'backtracking', 'paused-knight');
            
            if (isCurrent) {
                cell.textContent = KNIGHT_ICON;
                cell.classList.add('current-knight');
                currentKnightPos = { x, y }; 
            } else if (value !== -1) {
                cell.textContent = value;
                cell.classList.add('visited-knight');
            } else {
                cell.textContent = '';
            }

            if (isBacktracking) {
                cell.classList.add('backtracking');
                setTimeout(() => cell.classList.remove('backtracking'), animationDelay > 100 ? animationDelay / 2 : 50);
            }
        }
    }
    
    function clearPreviousKnightPosition(x, y, moveNumberOfCell){
        const cellId = `cell-${x}-${y}`;
        const cell = document.getElementById(cellId);
        if(cell) {
            cell.classList.remove('current-knight', 'paused-knight');
            if (moveNumberOfCell !== -1) {
                 cell.textContent = moveNumberOfCell;
                 cell.classList.add('visited-knight');
            } else {
                cell.textContent = '';
            }
        }
         if (currentKnightPos.x === x && currentKnightPos.y === y) {
            currentKnightPos = { x: -1, y: -1 }; 
        }
    }

    async function solveKTUtilAnimado(currX, currY, moveCount, board, N) {
        if (stopRequested) throw new Error("SimulationStopped");

        board[currX][currY] = moveCount;
        updateBoardCell(currX, currY, moveCount, true);
        await controlledDelay(animationDelay);

        if (moveCount === N * N) {
            updateBoardCell(currX, currY, moveCount, false); 
            return true;
        }

        for (let k = 0; k < 8; k++) {
            if (stopRequested) throw new Error("SimulationStopped");
            let nextX = currX + moveX[k];
            let nextY = currY + moveY[k];

            if (isSafe(nextX, nextY, board)) {
                clearPreviousKnightPosition(currX, currY, board[currX][currY]);
                
                if (await solveKTUtilAnimado(nextX, nextY, moveCount + 1, board, N)) {
                    return true;
                } else {
                    // Backtrack (si no fue por stopRequested)
                    if (stopRequested) throw new Error("SimulationStopped");
                    await controlledDelay(animationDelay > 100 ? animationDelay / 2 : 50);
                    
                    updateBoardCell(nextX, nextY, -1, false, true);
                    board[nextX][nextY] = -1;

                    updateBoardCell(currX, currY, board[currX][currY], true);
                    await controlledDelay(animationDelay > 100 ? animationDelay / 2 : 50);
                }
            }
        }
        return false;
    }

    function solveKTUtilRapido(currX, currY, moveCount, board, N) {
        if (moveCount === N * N) return true;
        for (let k = 0; k < 8; k++) {
            let nextX = currX + moveX[k];
            let nextY = currY + moveY[k];
            if (nextX >= 0 && nextX < N_global && nextY >= 0 && nextY < N_global && board[nextX][nextY] === -1) {
                board[nextX][nextY] = moveCount + 1;
                if (solveKTUtilRapido(nextX, nextY, moveCount + 1, board, N)) return true;
                else board[nextX][nextY] = -1;
            }
        }
        return false;
    }
    
    function formatBoardForHTMLWithNumbers(board, N) {
        let tableHTML = "<table>";
        for (let i = 0; i < N; i++) {
            tableHTML += "<tr>";
            for (let j = 0; j < N; j++) {
                tableHTML += `<td>${board[i][j] === -1 ? '' : board[i][j]}</td>`;
            }
            tableHTML += "</tr>";
        }
        tableHTML += "</table>";
        return tableHTML;
    }

    function resetSimulationState() {
        isPaused = false;
        animationRunning = false;
        stopRequested = false;
        currentKnightPos = { x: -1, y: -1 };

        startButton.disabled = false;
        startAnimatedButton.disabled = false;
        boardSizeInput.disabled = false;
        animationSpeedInput.disabled = false;

        pauseButton.disabled = true;
        resumeButton.disabled = true;
        stopButton.disabled = true;
        statusDiv.innerHTML = "Listo para iniciar.";
    }
    
    function uiStartAnimation() {
        animationRunning = true;
        stopRequested = false;
        isPaused = false;

        startButton.disabled = true;
        startAnimatedButton.disabled = true;
        boardSizeInput.disabled = true;
        animationSpeedInput.disabled = true;

        pauseButton.disabled = false;
        resumeButton.disabled = true; 
        stopButton.disabled = false;
    }

    async function runSimulation(isAnimated) {
        if (animationRunning) {
            alert("Una simulación ya está en curso. Deténgala primero.");
            return;
        }

        const N_input = parseInt(boardSizeInput.value);
        if (isNaN(N_input) || N_input < 1) {
            alert("Por favor, ingrese un tamaño de tablero válido (N >= 1).");
            return;
        }
        N_global = N_input;

        if (N_global > 6 && isAnimated) {
            if (!confirm(`La simulación ANIMADA para N=${N_global} puede ser MUY LENTA. Se recomienda N <= 6 para animación. ¿Continuar?`)) {
                return;
            }
        }
         if (N_global > 8 && !isAnimated) { 
             if (!confirm(`Resolver para N=${N_global} (sin animación) puede tardar o agotar la memoria. ¿Continuar?`)) {
                 return;
             }
        }
        if (N_global < 5 && N_global > 0) {
            alert(`Nota: No existen soluciones completas para el Tour del Caballo en tableros de tamaño ${N_global}x${N_global}. Se intentará de todas formas.`);
        }
        
        initializeHTMLBoard(N_global); 
        let board = Array(N_global).fill(null).map(() => Array(N_global).fill(-1));
        const startX = 0;
        const startY = 0;
        
        let startTime = performance.now();
        let solutionFound = false;

        if (isAnimated) {
            uiStartAnimation();
            statusDiv.innerHTML = `Visualizando N=${N_global}x${N_global}... (Comenzando en 0,0)`;
            try {
                solutionFound = await solveKTUtilAnimado(startX, startY, 1, board, N_global);
            } catch (e) {
                if (e.message === "SimulationStopped") {
                    statusDiv.innerHTML = "Simulación detenida por el usuario.";
                    solutionFound = false; 
                } else {
                    statusDiv.innerHTML = "Error en la simulación animada.";
                    console.error(e);
                }
            }
        } else { 
            startButton.disabled = true;
            startAnimatedButton.disabled = true; 
            statusDiv.innerHTML = `Calculando N=${N_global}x${N_global} (rápido)...`;
            board[startX][startY] = 1;
            solutionFound = solveKTUtilRapido(startX, startY, 1, board, N_global);
            if (solutionFound) {
                boardOutputDiv.innerHTML = formatBoardForHTMLWithNumbers(board, N_global);
            } else {
                 boardOutputDiv.innerHTML = "Estado final (rápido):<br>" + formatBoardForHTMLWithNumbers(board, N_global);
            }
        }
        
        let endTime = performance.now();
        let duration = (endTime - startTime) / 1000;

        if (!stopRequested) { 
            if (solutionFound) {
                statusDiv.innerHTML = `¡Solución encontrada para N=${N_global} en ${duration.toFixed(3)}s! ${isAnimated ? '(Animación completada)' : ''}`;
                if (isAnimated) { 
                    for(let r=0; r < N_global; r++) {
                        for(let c=0; c < N_global; c++) {
                            if(board[r][c] !== -1) {
                                updateBoardCell(r,c, board[r][c], false);
                            }
                        }
                    }
                }
            } else {
                 if (!isAnimated || (isAnimated && !solutionFound && !stopRequested)) { 
                    statusDiv.innerHTML = `No se encontró solución para N=${N_global} (${duration.toFixed(3)}s). ${isAnimated ? '(Animación completada)' : ''}`;
                 }
            }
        }
        
        if (isAnimated && !stopRequested) { 
            animationRunning = false; 
            pauseButton.disabled = true;
            resumeButton.disabled = true;
            stopButton.disabled = true; 
            startButton.disabled = false;
            startAnimatedButton.disabled = false;
            boardSizeInput.disabled = false;
            animationSpeedInput.disabled = false;
        } else if (!isAnimated) { 
            startButton.disabled = false;
            startAnimatedButton.disabled = false;
        }
    }

    startButton.addEventListener('click', () => runSimulation(false));
    startAnimatedButton.addEventListener('click', () => runSimulation(true));

    pauseButton.addEventListener('click', () => {
        if (animationRunning && !isPaused) {
            isPaused = true;
            pauseButton.disabled = true;
            resumeButton.disabled = false;
            statusDiv.innerHTML += " (Pausado)";
        }
    });

    resumeButton.addEventListener('click', () => {
        if (animationRunning && isPaused) {
            isPaused = false;
            pauseButton.disabled = false;
            resumeButton.disabled = true;
            statusDiv.innerHTML = statusDiv.innerHTML.replace(" (Pausado)", "");
        }
    });

    stopButton.addEventListener('click', () => {
        if (animationRunning) {
            stopRequested = true;
            isPaused = false; 
            statusDiv.innerHTML = "Deteniendo simulación...";

            setTimeout(() => {
                resetSimulationState();
                initializeHTMLBoard(N_global || parseInt(boardSizeInput.value)); // Limpiar tablero
                statusDiv.innerHTML = "Simulación detenida. Listo para iniciar.";
            }, 100);
        }
    });

    resetSimulationState(); 
});

