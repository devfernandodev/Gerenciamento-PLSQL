// Função para mostrar a seção específica
function mostrarSecao(secao) {
    document.querySelectorAll('main > section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(secao).style.display = 'block';
}

// Eventos dos botões de navegação
document.getElementById('btnMostrarForm').addEventListener('click', () => {
    mostrarSecao('produtos');
});

document.getElementById('btnMostrarLista').addEventListener('click', () => {
    mostrarSecao('lista-produtos');
});
document.getElementById('formProduto').addEventListener('submit', function(event) {
    event.preventDefault();
    const nome = document.getElementById('nome').value;
    const categoria = document.getElementById('categoria').value;
    const preco = document.getElementById('preco').value;
    const quantidadeEstoque = document.getElementById('quantidade_estoque').value;
    const quantidadeMinima = document.getElementById('quantidade_minima').value;

    fetch('http://localhost:3000/api/produtos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nome,
            categoria,
            preco: preco.toString(),
            quantidade_estoque: quantidadeEstoque.toString(),
            quantidade_minima: quantidadeMinima.toString()
        })
    })
    .then(response => response.json())
    .then(data => {
        Toastify({
            text: "Produto inserido com sucesso!",
            duration: 3000, 
            close: true,
            gravity: "top", 
            position: "right",
            backgroundColor: "#4CAF50",
            stopOnFocus: true,
        }).showToast();

        document.getElementById('formProduto').reset();
        fetchProdutos(); // Atualizar a lista de produtos após a inserção
        mostrarSecao('lista-produtos'); // Voltar para a lista de produtos após registrar
    })
    .catch(error => {
        Toastify({
            text: "Erro ao registrar o produto.",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            backgroundColor: "#FF4500",
            stopOnFocus: true,
        }).showToast();

        console.error('Erro:', error);
    });
});

// Função para buscar e exibir os produtos
function fetchProdutos() {
    fetch('http://localhost:3000/api/produtos')
    .then(response => response.json())
    .then(data => {
        const produtosDiv = document.getElementById('produtos-lista');
        produtosDiv.innerHTML = '';
        data.forEach(produto => {
            const produtoDiv = document.createElement('div');
            produtoDiv.classList.add('produto-info');
            produtoDiv.textContent = `${produto.NOME} - ${produto.CATEGORIA} - R$${produto.PRECO} - Estoque: ${produto.QUANTIDADE_ESTOQUE} - Mínimo: ${produto.QUANTIDADE_MINIMA}`;
            produtosDiv.appendChild(produtoDiv);
        });
    })
    .catch(error => {
        console.error('Erro:', error);
    });
}

// Chamar a função para buscar e exibir os produtos ao carregar a página
window.onload = function() {
    fetchProdutos();
    mostrarSecao('produtos'); // Mostrar a seção do formulário inicialmente
};

