class GerenciadorLoja {
    constructor() {
        this.produtos = [];
        this.pedidos = [];
    }

    // 1. Cadastra um produto
    adicionarProduto(produto) {
        if (!produto.nome || produto.nome.trim() === "") {
            throw new Error("Nome do produto é obrigatório");
        }

        if (produto.preco <= 0) {
            throw new Error("Preço deve ser maior que zero");
        }

        if (produto.estoque < 0) {
            throw new Error("Estoque não pode ser negativo");
        }

        const novoProduto = {
            id: this.produtos.length + 1,
            nome: produto.nome,
            preco: produto.preco,
            estoque: produto.estoque,
            categoria: produto.categoria || "Geral"
        };

        this.produtos.push(novoProduto);

        return novoProduto;
    }

    // 2. Busca produto pelo ID
    buscarProduto(id) {
        return this.produtos.find(produto => produto.id === id) || null;
    }

    // 3. Busca produtos pelo nome
    buscarPorNome(nome) {
        const termo = nome.toLowerCase();

        return this.produtos.filter(produto =>
            produto.nome.toLowerCase().includes(termo)
        );
    }

    // 4. Busca produtos por categoria
    buscarPorCategoria(categoria) {
        return this.produtos.filter(
            produto => produto.categoria === categoria
        );
    }

    // 5. Atualiza o preço
    atualizarPreco(id, novoPreco) {
        const produto = this.buscarProduto(id);

        if (!produto) {
            throw new Error("Produto não encontrado");
        }

        if (novoPreco <= 0) {
            throw new Error("Preço inválido");
        }

        produto.preco = novoPreco;

        return produto;
    }

    // 6. Adiciona estoque
    adicionarEstoque(id, quantidade) {
        const produto = this.buscarProduto(id);

        if (!produto) {
            throw new Error("Produto não encontrado");
        }

        if (quantidade <= 0) {
            throw new Error("Quantidade inválida");
        }

        produto.estoque += quantidade;

        return produto.estoque;
    }

    // 7. Remove estoque
    removerEstoque(id, quantidade) {
        const produto = this.buscarProduto(id);

        if (!produto) {
            throw new Error("Produto não encontrado");
        }

        if (quantidade > produto.estoque) {
            throw new Error("Estoque insuficiente");
        }

        produto.estoque -= quantidade;

        return produto.estoque;
    }

    // 8. Verifica se existe estoque
    possuiEstoque(id, quantidade) {
        const produto = this.buscarProduto(id);

        if (!produto) {
            return false;
        }

        return produto.estoque >= quantidade;
    }

    // 9. Calcula subtotal
    calcularSubtotal(id, quantidade) {
        const produto = this.buscarProduto(id);

        if (!produto) {
            throw new Error("Produto não encontrado");
        }

        return produto.preco * quantidade;
    }

    // 10. Calcula desconto
    calcularDesconto(valor, percentual) {
        if (percentual < 0 || percentual > 100) {
            throw new Error("Percentual inválido");
        }

        return valor * (percentual / 100);
    }

    // 11. Calcula preço com desconto
    aplicarDesconto(valor, percentual) {
        const desconto = this.calcularDesconto(valor, percentual);

        return valor - desconto;
    }

    // 12. Calcula frete
    calcularFrete(valorCompra) {
        if (valorCompra >= 200) {
            return 0;
        }

        if (valorCompra >= 100) {
            return 10;
        }

        return 20;
    }

    // 13. Calcula total da compra
    calcularTotal(valorCompra, desconto = 0) {
        const valorComDesconto =
            this.aplicarDesconto(valorCompra, desconto);

        const frete = this.calcularFrete(valorComDesconto);

        return valorComDesconto + frete;
    }

    // 14. Cria um pedido
    criarPedido(cliente, itens) {
        if (!cliente || cliente.trim() === "") {
            throw new Error("Cliente é obrigatório");
        }

        if (!itens || itens.length === 0) {
            throw new Error("Pedido deve possuir itens");
        }

        let subtotal = 0;

        for (const item of itens) {
            const produto = this.buscarProduto(item.produtoId);

            if (!produto) {
                throw new Error("Produto não encontrado");
            }

            if (!this.possuiEstoque(item.produtoId, item.quantidade)) {
                throw new Error("Estoque insuficiente");
            }

            subtotal += produto.preco * item.quantidade;
        }

        const pedido = {
            id: this.pedidos.length + 1,
            cliente,
            itens,
            subtotal,
            frete: this.calcularFrete(subtotal),
            total: this.calcularTotal(subtotal),
            status: "PENDENTE"
        };

        this.pedidos.push(pedido);

        return pedido;
    }

    // 15. Finaliza um pedido
    finalizarPedido(id) {
        const pedido = this.pedidos.find(p => p.id === id);

        if (!pedido) {
            throw new Error("Pedido não encontrado");
        }

        if (pedido.status !== "PENDENTE") {
            throw new Error("Pedido não pode ser finalizado");
        }

        for (const item of pedido.itens) {
            this.removerEstoque(
                item.produtoId,
                item.quantidade
            );
        }

        pedido.status = "FINALIZADO";

        return pedido;
    }

    // 16. Cancela um pedido
    cancelarPedido(id) {
        const pedido = this.pedidos.find(p => p.id === id);

        if (!pedido) {
            throw new Error("Pedido não encontrado");
        }

        if (pedido.status === "FINALIZADO") {
            throw new Error("Pedido já finalizado");
        }

        pedido.status = "CANCELADO";

        return pedido;
    }

    // 17. Lista pedidos por status
    listarPedidosPorStatus(status) {
        return this.pedidos.filter(
            pedido => pedido.status === status
        );
    }

    // 18. Calcula faturamento
    calcularFaturamento() {
        return this.pedidos
            .filter(pedido => pedido.status === "FINALIZADO")
            .reduce((total, pedido) => total + pedido.total, 0);
    }

    // 19. Retorna produtos com estoque baixo
    produtosEstoqueBaixo(limite = 5) {
        return this.produtos.filter(
            produto => produto.estoque <= limite
        );
    }

    // 20. Retorna estatísticas da loja
    obterEstatisticas() {
        const produtos = this.produtos.length;
        const pedidos = this.pedidos.length;
        const finalizados = this.listarPedidosPorStatus("FINALIZADO").length;
        const cancelados = this.listarPedidosPorStatus("CANCELADO").length;

        return {
            produtos,
            pedidos,
            finalizados,
            cancelados,
            faturamento: this.calcularFaturamento()
        };
    }
}

module.exports = GerenciadorLoja;
