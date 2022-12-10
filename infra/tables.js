class Tables {
    init(conexao) {
        this.conexao = conexao;
        this.createAddress();
    }

    createAddress() {
        const sql = 'CREATE TABLE IF NOT EXISTS address (id INTEGER PRIMAY KEY AUTO_INCRMENT NOT NULL, street VARCHAR(60) NOT NULL, distrcit VARCHAR(60) NOT NULL, cep VARCHAR(20) NOT NULL, point_references VARCHAR(60) NOT NULL)'
        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("tabela de endereços criada com sucesso");
            }
        })
    }
}