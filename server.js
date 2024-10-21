const express = require('express');
const bodyParser = require('body-parser');
const oracledb = require('oracledb');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.post('/api/produtos', async (req, res) => {
    const { nome, categoria, preco, quantidade_estoque, quantidade_minima } = req.body;
    let connection;
    try {
        console.log('Recebendo dados:', req.body);
        connection = await oracledb.getConnection({
            user: 'GESTAO',
            password: 'hr',
            connectString: 'localhost/XEPDB1'
        });

        const result = await connection.execute(
            `BEGIN
                inserir_produto(:id_produto, :nome, :categoria, :preco, :quantidade_estoque, :quantidade_minima);
            END;`,
            {
                id_produto: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
                nome,
                categoria,
                preco: parseFloat(preco),
                quantidade_estoque: parseInt(quantidade_estoque),
                quantidade_minima: parseInt(quantidade_minima)
            }
        );
        console.log('Resultado:', result);

        await connection.commit();
        console.log('Transação confirmada.');

        res.status(200).json({ message: 'Produto inserido com sucesso!', id_produto: result.outBinds.id_produto });
    } catch (err) {
        console.error('Erro no servidor:', err);
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) {
            await connection.close();
        }
    }
});

app.get('/api/produtos', async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection({
            user: 'GESTAO',
            password: 'hr',
            connectString: 'localhost/XEPDB1'
        });

        const result = await connection.execute(
            `SELECT nome, categoria, preco, quantidade_estoque, quantidade_minima FROM produtos`
        );

        // Converter os resultados para um formato de objeto
        const produtos = result.rows.map(row => ({
            NOME: row[0],
            CATEGORIA: row[1],
            PRECO: row[2],
            QUANTIDADE_ESTOQUE: row[3],
            QUANTIDADE_MINIMA: row[4]
        }));

        console.log('Produtos:', produtos);

        res.status(200).json(produtos);
    } catch (err) {
        console.error('Erro no servidor:', err);
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) {
            await connection.close();
        }
    }
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
