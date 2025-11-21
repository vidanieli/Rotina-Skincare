let cardContainer = document.querySelector(".card-container");
let dados = [];

// Carrega os dados do JSON e armazena na variável 'dados'
async function carregarDados() {
    let resposta = await fetch("data.json"); 
    dados = await resposta.json();
}

// Função auxiliar para remover acentos e converter para minúsculas
function normalizarTexto(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

// Função chamada pelo botão "Buscar"
function iniciarBusca() {
    const imagemContainer = document.querySelector(".imagem-centro");
    const inputBusca = document.getElementById("buscaInput");
    // Normaliza o termo da busca para ser sem acento e minúsculo
    const termoBusca = normalizarTexto(inputBusca.value);

    // Se o campo de busca estiver vazio, limpa a tela e não mostra nada.
    if (termoBusca.trim() === '') {
        cardContainer.innerHTML = "";
        if (imagemContainer) {
            imagemContainer.style.display = "flex"; // Mostra a imagem se a busca for limpa
        }
        return;
    }

    // Filtra os dados com base no termo pesquisado
    const dadosFiltrados = dados.filter(dado => {
        const nome = normalizarTexto(dado.nome);
        const comoFunciona = normalizarTexto(dado.como_funciona);
        const usoRecomendado = normalizarTexto(dado.uso_recomendado);
        // Verifica se alguma tag (convertida para minúscula) inclui o termo da busca
        const tagsIncluemTermo = dado.tags.some(tag => normalizarTexto(tag).includes(termoBusca));

        return nome.includes(termoBusca) || comoFunciona.includes(termoBusca) || usoRecomendado.includes(termoBusca) || tagsIncluemTermo;
    });

    // Esconde a imagem para mostrar os resultados
    if (imagemContainer) {
        imagemContainer.style.display = "none";
    }

    // Renderiza apenas os cards que passaram no filtro
    renderizarCards(dadosFiltrados);
}

function renderizarCards(dados) {
    cardContainer.innerHTML = ""; // Limpa os cards existentes

    if (dados.length === 0) {
        cardContainer.innerHTML = "<p>Nenhum resultado encontrado.</p>";
        return;
    }

    for (let dado of dados) {
        let article = document.createElement("article");
        article.classList.add("card");
        article.innerHTML = `
        <h2>${dado.nome}</h2>
        <p><strong>Passo:</strong> ${dado.passo} | <strong>Quando:</strong> ${dado.quando} | <strong>Frequência:</strong> ${dado.frequencia}</p>
        <p><strong>Como funciona:</strong> ${dado.como_funciona}</p>
        <p><strong>Uso recomendado:</strong> ${dado.uso_recomendado}</p>
        <a href="${dado.link}" target="_blank">Saiba mais</a>
        `;
        cardContainer.appendChild(article);
    }
 }

// Quando o conteúdo da página carregar, chama a função para obter os dados.
document.addEventListener("DOMContentLoaded", carregarDados);

// Função para limpar a busca e voltar ao estado inicial
function voltarParaInicio() {
    const imagemContainer = document.querySelector(".imagem-centro");
    const inputBusca = document.getElementById("buscaInput");
    inputBusca.value = ""; // Limpa o campo de busca
    cardContainer.innerHTML = ""; // Limpa os cards da tela
    // Mostra a imagem novamente ao voltar para o início
    if (imagemContainer) {
        imagemContainer.style.display = "flex";
    }
}