const urlParams = new URLSearchParams(window.location.search);
const pdfPath = urlParams.get('book'); // Obtém o nome do livro na URL

const canvas = document.getElementById('pdfCanvas');
const ctx = canvas.getContext('2d');
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const backToShelfBtn = document.getElementById('backToShelf');
const bookInfo = document.getElementById('bookInfo');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');

let pdfDoc = null;
let currentPage = 1;
let totalPages = 0;

// Função para atualizar a barra de progresso
function updateProgressBar(currentPage, totalPages) {
    const progressPercent = (currentPage / totalPages) * 100;
    progressFill.style.width = `${progressPercent}%`;
    progressText.textContent = `${Math.round(progressPercent)}% lido`;
}

// Atualiza o progresso no localStorage e barra de progresso
function updateProgress() {
    localStorage.setItem(`progress-${pdfPath}`, currentPage);
    updateProgressBar(currentPage, totalPages);
}

// Renderiza uma página do PDF
async function renderPage(pageNum) {
    const page = await pdfDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale: 2 });

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const renderContext = {
        canvasContext: ctx,
        viewport: viewport,
    };

    await page.render(renderContext).promise;

    // Atualiza botões de navegação
    prevPageBtn.disabled = pageNum <= 1;
    nextPageBtn.disabled = pageNum >= totalPages;

    // Atualiza informações do livro
    bookInfo.textContent = `Livro: ${pdfPath} | Página ${pageNum} de ${totalPages}`;

    // Atualiza a barra de progresso
    updateProgress();

    // Rola a página para o topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Carrega o PDF e define as páginas
async function loadPDF() {
    pdfDoc = await pdfjsLib.getDocument(pdfPath).promise;
    totalPages = pdfDoc.numPages;

    // Verifica se há uma página salva no localStorage
    const savedPage = parseInt(localStorage.getItem(`progress-${pdfPath}`)) || 1;
    currentPage = savedPage;

    // Renderiza a página atual
    renderPage(currentPage);
}

// Vai para uma página específica
function goToPage(offset) {
    const newPage = currentPage + offset;
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        renderPage(currentPage);
    }
}

// Evento de clique no botão "Voltar à Estante"
backToShelfBtn.addEventListener('click', () => {
    window.location.href = 'index.html';
});

// Eventos de clique nos botões
prevPageBtn.addEventListener('click', () => goToPage(-1));
nextPageBtn.addEventListener('click', () => goToPage(1));

// Navegação com as setas do teclado
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        goToPage(-1);
    } else if (event.key === 'ArrowRight') {
        goToPage(1);
    }
});

// Inicia o carregamento do PDF
loadPDF();
