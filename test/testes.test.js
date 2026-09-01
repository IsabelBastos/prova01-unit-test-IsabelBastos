const GerenciadorLoja = require("../src/testes");

describe("GerenciadorLoja", () => {

    let loja;

    beforeEach(() => {
        loja = new GerenciadorLoja();
    });

    // 1. adicionarProduto
    test("deve adicionar um produto", () => {
        const produto = loja.adicionarProduto({
            nome: "Notebook",
            preco: 3000,
            estoque: 10,
            categoria: "Eletrônicos"
        });

        expect(produto.id).toBe(1);
        expect(produto.nome).toBe("Notebook");
        expect(loja.produtos).toHaveLength(1);
    });

    // 2. buscarProduto
    test("deve buscar produto pelo ID", () => {
        loja.adicionarProduto({
            nome: "Mouse",
            preco: 100,
            estoque: 5
        });

        const produto = loja.buscarProduto(1);

        expect(produto.nome).toBe("Mouse");
    });

    // 3. buscarPorNome
    test("deve buscar produto pelo nome", () => {
        loja.adicionarProduto({
            nome: "Teclado Gamer",
            preco: 250,
            estoque: 5
        });

        const resultado = loja.buscarPorNome("teclado");

        expect(resultado).toHaveLength(1);
        expect(resultado[0].nome).toBe("Teclado Gamer");
    });

    // 4. buscarPorCategoria
    test("deve buscar produtos por categoria", () => {
        loja.adicionarProduto({
            nome: "Monitor",
            preco: 900,
            estoque: 4,
            categoria: "Eletrônicos"
        });

        const resultado = loja.buscarPorCategoria("Eletrônicos");

        expect(resultado).toHaveLength(1);
    });

    // 5. atualizarPreco
    test("deve atualizar o preço do produto", () => {
        loja.adicionarProduto({
            nome: "Mouse",
            preco: 100,
            estoque: 5
        });

        const produto = loja.atualizarPreco(1, 150);

        expect(produto.preco).toBe(150);
    });

    // 6. adicionarEstoque
    test("deve adicionar estoque", () => {
        loja.adicionarProduto({
            nome: "Mouse",
            preco: 100,
            estoque: 5
        });

        const estoque = loja.adicionarEstoque(1, 3);

        expect(estoque).toBe(8);
    });

    // 7. removerEstoque
    test("deve remover estoque", () => {
        loja.adicionarProduto({
            nome: "Mouse",
            preco: 100,
            estoque: 10
        });

        const estoque = loja.removerEstoque(1, 4);

        expect(estoque).toBe(6);
    });

    // 8. possuiEstoque
    test("deve verificar se possui estoque suficiente", () => {
        loja.adicionarProduto({
            nome: "Mouse",
            preco: 100,
            estoque: 10
        });

        expect(loja.possuiEstoque(1, 5)).toBe(true);
        expect(loja.possuiEstoque(1, 15)).toBe(false);
    });

    // 9. calcularSubtotal
    test("deve calcular o subtotal", () => {
        loja.adicionarProduto({
            nome: "Mouse",
            preco: 100,
            estoque: 10
        });

        expect(loja.calcularSubtotal(1, 3)).toBe(300);
    });

    // 10. calcularDesconto
    test("deve calcular o desconto", () => {
        expect(loja.calcularDesconto(200, 10)).toBe(20);
    });

    // 11. aplicarDesconto
    test("deve aplicar desconto", () => {
        expect(loja.aplicarDesconto(200, 10)).toBe(180);
    });

    // 12. calcularFrete
    test("deve calcular o frete", () => {
        expect(loja.calcularFrete(50)).toBe(20);
        expect(loja.calcularFrete(150)).toBe(10);
        expect(loja.calcularFrete(250)).toBe(0);
    });

    // 13. calcularTotal
    test("deve calcular o total da compra", () => {
        expect(loja.calcularTotal(100)).toBe(110);
    });

    // 14. criarPedido
    test("deve criar um pedido", () => {
        loja.adicionarProduto({
            nome: "Mouse",
            preco: 100,
            estoque: 10
        });

        const pedido = loja.criarPedido("Isabel", [
            { produtoId: 1, quantidade: 2 }
        ]);

        expect(pedido.id).toBe(1);
        expect(pedido.cliente).toBe("Isabel");
        expect(pedido.status).toBe("PENDENTE");
        expect(pedido.subtotal).toBe(200);
    });

    // 15. finalizarPedido
    test("deve finalizar um pedido", () => {
        loja.adicionarProduto({
            nome: "Mouse",
            preco: 100,
            estoque: 10
        });

        const pedido = loja.criarPedido("Isabel", [
            { produtoId: 1, quantidade: 2 }
        ]);

        loja.finalizarPedido(pedido.id);

        expect(pedido.status).toBe("FINALIZADO");
        expect(loja.buscarProduto(1).estoque).toBe(8);
    });

    // 16. cancelarPedido
    test("deve cancelar um pedido", () => {
        loja.adicionarProduto({
            nome: "Mouse",
            preco: 100,
            estoque: 10
        });

        const pedido = loja.criarPedido("Isabel", [
            { produtoId: 1, quantidade: 1 }
        ]);

        loja.cancelarPedido(pedido.id);

        expect(pedido.status).toBe("CANCELADO");
    });

    // 17. listarPedidosPorStatus
    test("deve listar pedidos por status", () => {
        loja.adicionarProduto({
            nome: "Mouse",
            preco: 100,
            estoque: 10
        });

        const pedido = loja.criarPedido("Isabel", [
            { produtoId: 1, quantidade: 1 }
        ]);

        loja.cancelarPedido(pedido.id);

        const cancelados = loja.listarPedidosPorStatus("CANCELADO");

        expect(cancelados).toHaveLength(1);
    });

    // 18. calcularFaturamento
    test("deve calcular o faturamento dos pedidos finalizados", () => {
        loja.adicionarProduto({
            nome: "Mouse",
            preco: 100,
            estoque: 10
        });

        const pedido = loja.criarPedido("Isabel", [
            { produtoId: 1, quantidade: 2 }
        ]);

        loja.finalizarPedido(pedido.id);

        expect(loja.calcularFaturamento()).toBe(200);
    });

    // 19. produtosEstoqueBaixo
    test("deve retornar produtos com estoque baixo", () => {
        loja.adicionarProduto({
            nome: "Mouse",
            preco: 100,
            estoque: 3
        });

        loja.adicionarProduto({
            nome: "Teclado",
            preco: 200,
            estoque: 20
        });

        const produtos = loja.produtosEstoqueBaixo();

        expect(produtos).toHaveLength(1);
        expect(produtos[0].nome).toBe("Mouse");
    });

    // 20. obterEstatisticas
    test("deve retornar as estatísticas da loja", () => {
        loja.adicionarProduto({
            nome: "Mouse",
            preco: 100,
            estoque: 10
        });

        const pedido = loja.criarPedido("Isabel", [
            { produtoId: 1, quantidade: 2 }
        ]);

        loja.finalizarPedido(pedido.id);

        const estatisticas = loja.obterEstatisticas();

        expect(estatisticas.produtos).toBe(1);
        expect(estatisticas.pedidos).toBe(1);
        expect(estatisticas.finalizados).toBe(1);
        expect(estatisticas.cancelados).toBe(0);
        expect(estatisticas.faturamento).toBe(200);
    });

});