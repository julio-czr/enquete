const db = require("./connect.js");

const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});


// criar nova enquete com opções
app.post("/add-enquete", (req, res) => {
    const { nome, dataInicial, dataFim, opcoes } = req.body;

    if (!nome || !dataInicial || !dataFim || !opcoes || opcoes.length < 1) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios e deve haver pelo menos uma opção." });
    }

    db.query(
        "INSERT INTO enquete (nome, dataInicial, dataFim) VALUES (?, ?, ?)",
        [nome, dataInicial, dataFim],
        (err, result) => {
            if (err) {
                console.error("Erro ao inserir enquete:", err);
                return res.status(500).json({ error: "Erro ao criar enquete" });
            }

            const enqueteId = result.insertId;
            const values = opcoes.map(opcao => [enqueteId, opcao, 0]);

            db.query("INSERT INTO opcoes (enquete_id, opcao, votos) VALUES ?", [values], (err) => {
                if (err) {
                    console.error("Erro ao inserir opções:", err);
                    return res.status(500).json({ error: "Erro ao adicionar opções" });
                }
                res.json({ message: "Enquete criada com sucesso!" });
            });
        }
    );
});

// listar enquetes 
app.get("/enquetes", (req, res) => {
    const query = `
    SELECT id, nome, dataInicial, dataFim        
        FROM enquete;
        
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Erro ao buscar enquetes:", err);
            return res.status(500).json({ error: "Erro ao buscar enquetes" });
        }

        // Agrupa os resultados por enquete
        const enquetesMap = {};
        results.forEach(row => {
            if (!enquetesMap[row.id]) {
                enquetesMap[row.id] = {
                    id: row.id,
                    nome: row.nome,
                    dataInicial: row.dataInicial,
                    dataFim: row.dataFim
                    };
            }
        });

        res.json(Object.values(enquetesMap));
    });
});

app.get("/enquete/:id", (req, res) => {
    const enqueteId = req.params.id;
    const query = `
        SELECT 
            e.id AS enqueteId, e.nome, e.dataInicial, e.dataFim, 
            o.id AS opcaoId, o.opcao, o.votos
        FROM enquete e 
        LEFT JOIN opcoes o ON e.id = o.enquete_id
        WHERE e.id = ?
    `;

    db.query(query, [enqueteId],(err, results) => {
        if (err) {
            console.error("Erro ao buscar enquete:", err);
            return res.status(500).json({ error: "Erro ao buscar enquete" });
        }

        const enquetesMap = {};
        results.forEach(row => {
            if (!enquetesMap[row.enqueteId]) {
                enquetesMap[row.enqueteId] = {
                    id: row.enqueteId,
                    nome: row.nome,
                    dataInicial: row.dataInicial,
                    dataFim: row.dataFim,
                    opcoes: []
                };
            }
            if (row.opcaoId) {
                enquetesMap[row.enqueteId].opcoes.push({
                    id: row.opcaoId,
                    opcao: row.opcao,
                    votos: row.votos
                });
            }
        });

        res.json(Object.values(enquetesMap));
    });
});

// votar em opção
app.post("/votar", (req, res) => {
    const { opcaoId } = req.body;
    if (!opcaoId) {
        return res.status(400).json({ error: "ID da opção é obrigatório" });
    }

    const query = "UPDATE opcoes SET votos = votos + 1 WHERE id = ?";
    db.query(query, [opcaoId], (err) => {
        if (err) {
            console.error("Erro ao registrar voto:", err);
            return res.status(500).json({ error: "Erro ao registrar voto" });
        }
        res.json({ message: "Voto registrado com sucesso!" });
    });
});

// excluir enquete
app.delete("/excluir", (req, res) => {
    const {enqueteId} = req.body;

    db.query("DELETE FROM enquete WHERE id = ?", [enqueteId], (err) => {
        if (err) {
            console.error("Erro ao excluir enquete:", err);
        }
        res.json({ message: "Enquete excluída com sucesso!" });
    });
});
;

// editar enquete
app.post("/editar", (req, res) => {
    const { enqueteId,nome, dataInicial, dataFim } = req.body;

    if (!nome || !dataInicial || !dataFim ) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }

    const query=" UPDATE enquete SET nome = ?, dataInicial = ?, dataFim = ? WHERE id = ?";

    db.query(query, [nome, dataInicial, dataFim, enqueteId], (err) => {
            if (err) {
                console.error("Erro ao editar enquete:", err);
                return res.status(500).json({ error: "Erro ao editar enquete" });
            }
            res.json({ message: "Enquete editada com sucesso!" });
        }
    );
});


















