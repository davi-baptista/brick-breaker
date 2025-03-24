// Obtendo o contexto do canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Configurações da bola
const bola = {
    x: canvas.width / 2,
    y: canvas.height - 30,
    raio: 5,
    velocidadeX: 3,
    velocidadeY: -3
};

// Configurações da raquete
const raquete = {
    altura: 10,
    largura: 75,
    x: 0,
    velocidade: 7
};
raquete.x = (canvas.width - raquete.largura) / 2;

// Configurações dos tijolos
const tijolosConfig = {
    linhas: 3,
    colunas: 5,
    largura: 75,
    altura: 20,
    padding: 10,
    offsetTopo: 30,
    offsetEsquerda: 30
};

// Criando array de tijolos
const tijolos = [];
for (let c = 0; c < tijolosConfig.colunas; c++) {
    tijolos[c] = [];
    for (let r = 0; r < tijolosConfig.linhas; r++) {
        tijolos[c][r] = { x: 0, y: 0, status: 1 };
    }
}

// Controle do teclado
let setaDireita = false;
let setaEsquerda = false;

document.addEventListener("keydown", (e) => {
    if (e.key === "Right" || e.key === "ArrowRight") setaDireita = true;
    if (e.key === "Left" || e.key === "ArrowLeft") setaEsquerda = true;
});

document.addEventListener("keyup", (e) => {
    if (e.key === "Right" || e.key === "ArrowRight") setaDireita = false;
    if (e.key === "Left" || e.key === "ArrowLeft") setaEsquerda = false;
});

// Função para desenhar a bola
function desenharBola() {
    ctx.beginPath();
    ctx.arc(bola.x, bola.y, bola.raio, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

// Função para desenhar a raquete
function desenharRaquete() {
    ctx.beginPath();
    ctx.rect(raquete.x, canvas.height - raquete.altura, raquete.largura, raquete.altura);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

// Função para desenhar os tijolos
function desenharTijolos() {
    for (let c = 0; c < tijolosConfig.colunas; c++) {
        for (let r = 0; r < tijolosConfig.linhas; r++) {
            if (tijolos[c][r].status === 1) {
                const tijoloX = c * (tijolosConfig.largura + tijolosConfig.padding) + tijolosConfig.offsetEsquerda;
                const tijoloY = r * (tijolosConfig.altura + tijolosConfig.padding) + tijolosConfig.offsetTopo;
                tijolos[c][r].x = tijoloX;
                tijolos[c][r].y = tijoloY;
                ctx.beginPath();
                ctx.rect(tijoloX, tijoloY, tijolosConfig.largura, tijolosConfig.altura);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

// Função para detectar colisões
function detectarColisoes() {
    // Colisão com tijolos
    for (let c = 0; c < tijolosConfig.colunas; c++) {
        for (let r = 0; r < tijolosConfig.linhas; r++) {
            const tijolo = tijolos[c][r];
            if (tijolo.status === 1) {
                if (bola.x > tijolo.x && 
                    bola.x < tijolo.x + tijolosConfig.largura && 
                    bola.y > tijolo.y && 
                    bola.y < tijolo.y + tijolosConfig.altura) {
                    bola.velocidadeY = -bola.velocidadeY;
                    tijolo.status = 0;
                }
            }
        }
    }
}

// Função principal do jogo
function desenhar() {
    // Limpar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    desenharBola();
    desenharRaquete();
    desenharTijolos();
    detectarColisoes();

    // Movimento da bola
    if (bola.x + bola.velocidadeX > canvas.width - bola.raio || bola.x + bola.velocidadeX < bola.raio) {
        bola.velocidadeX = -bola.velocidadeX;
    }
    if (bola.y + bola.velocidadeY < bola.raio) {
        bola.velocidadeY = -bola.velocidadeY;
    } else if (bola.y + bola.velocidadeY > canvas.height - bola.raio) {
        if (bola.x > raquete.x && bola.x < raquete.x + raquete.largura) {
            bola.velocidadeY = -bola.velocidadeY;
        } else {
            // Game over
            document.location.reload();
        }
    }

    // Movimento da raquete
    if (setaDireita && raquete.x < canvas.width - raquete.largura) {
        raquete.x += raquete.velocidade;
    }
    if (setaEsquerda && raquete.x > 0) {
        raquete.x -= raquete.velocidade;
    }

    bola.x += bola.velocidadeX;
    bola.y += bola.velocidadeY;

    requestAnimationFrame(desenhar);
}

// Iniciar o jogo
desenhar();