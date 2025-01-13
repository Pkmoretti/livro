async function renderPDF(pdfPath, canvasId) {
    const pdf = await pdfjsLib.getDocument(pdfPath).promise;
    const page = await pdf.getPage(1);
    const canvas = document.getElementById(canvasId);
    const context = canvas.getContext('2d');
    const viewport = page.getViewport({ scale: 0.5 });

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const renderContext = {
        canvasContext: context,
        viewport: viewport
    };

    await page.render(renderContext).promise;
}

function openBook(bookPath) {
    window.location.href = `reader.html?book=${bookPath}`;
}

// Dados dos livros
const books = [
    { id: "book1", pdf: "book1.pdf", title: "Livro 1" },
    { id: "book2", pdf: "book2.pdf", title: "Livro 2" },
    { id: "book3", pdf: "book3.pdf", title: "Livro 3" },
    { id: "book4", pdf: "book4.pdf", title: "Livro 4" },
    { id: "book5", pdf: "book5.pdf", title: "Livro 5" },
    { id: "book6", pdf: "book6.pdf", title: "Livro 6" },
];

// Seleciona a prateleira
const shelf = document.getElementById("shelf");

// Gera a estrutura para cada livro
books.forEach((book) => {
    const bookDiv = document.createElement("div");
    bookDiv.className = "book";
    bookDiv.setAttribute("data-pdf", book.pdf);
    bookDiv.setAttribute("onclick", `openBook('${book.pdf}')`);

    // Cria o canvas
    const canvas = document.createElement("canvas");
    canvas.id = `canvas-${book.id}`;

    // Cria o contêiner de progresso
    const progressContainer = document.createElement("div");
    progressContainer.className = "progress-container";

    const progressBar = document.createElement("div");
    progressBar.className = "progress-bar";
    progressBar.id = `progress-bar-${book.id}`;
    progressContainer.appendChild(progressBar);

    // Cria o texto de progresso
    const progressText = document.createElement("div");
    progressText.className = "progressText";
    progressText.id = `progressText-${book.id}`;
    progressText.textContent = "0% lido";

    // Adiciona os elementos ao livro
    bookDiv.appendChild(canvas);
    bookDiv.appendChild(progressContainer);
    bookDiv.appendChild(progressText);

    // Adiciona o livro à prateleira
    shelf.appendChild(bookDiv);
});

// Renderiza a primeira página de cada PDF
books.forEach(async (book) => {
    const canvasId = `canvas-${book.id}`;
    await renderPDF(book.pdf, canvasId);

    // Obtém o progresso absoluto (número de páginas lidas) do localStorage
    const paginasLidas = localStorage.getItem(`progress-${book.pdf}`) || 0;

    // Obtém o número total de páginas do PDF
    const pdf = await pdfjsLib.getDocument(book.pdf).promise;
    const totalPaginas = pdf.numPages;

    // Calcula a porcentagem de leitura
    const porcentagem = ((paginasLidas / totalPaginas) * 100).toFixed(0);

    // Atualiza o texto de progresso
    const progressTextElement = document.getElementById(`progressText-${book.id}`);
    progressTextElement.textContent = `${porcentagem}% lido`;

    // Atualiza visualmente a barra de progresso
    const progressBar = document.getElementById(`progress-bar-${book.id}`);
    if (progressBar) {
        progressBar.style.width = `${porcentagem}%`;
    }
});

