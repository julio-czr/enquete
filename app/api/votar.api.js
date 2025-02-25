async function carregarEnquete() {
    // obter id da enquete pela URL
    const params = new URLSearchParams(window.location.search);
    const enqueteId = params.get('id');

    if (enqueteId) {
        try {
            //requisição obter os dados da enquete 
            const response = await fetch(`http://localhost:3000/enquete/${enqueteId}`);
            const enquete = (await response.json())[0];
            console.log(enquete);

            const titulo = document.getElementById("tituloEnquete");
            titulo.textContent = enquete.nome;

            const datas = document.getElementById("datasEnquete");
            datas.textContent = `${enquete.dataInicial.replace(/(\d{4})-(\d{2})-(\d{2})T.*/, "$3/$2/$1")} a ${enquete.dataFim.replace(/(\d{4})-(\d{2})-(\d{2})T.*/, "$3/$2/$1")}`;

            // Limpando as opções
            const opcoes = document.getElementById("opcoesEnquete");
            opcoes.innerHTML="";

            //adicionando as opções
            enquete.opcoes.forEach(opcao => {
                console.log(opcao.opcao)
                const divOpcao = document.createElement("div");
                divOpcao.classList.add("opcao");

                const botao = document.createElement("button");
                botao.textContent = `${opcao.opcao} - Votos: ${opcao.votos}`;
                botao.onclick = async () => {
                    await votar(opcao.id);
                }
                divOpcao.appendChild(botao);
                opcoes.appendChild(divOpcao);


                const dataInicial = new Date(enquete.dataInicial);
                const dataFim = new Date(enquete.dataFim);
                const hoje = new Date();

                console.log(dataInicial);
                console.log(dataInicial<hoje && dataFim>hoje);
                if(!(dataInicial<hoje && dataFim>hoje)){
                    botao.disabled = true;
                    botao.style="color:grey";
                }

        });
        
        
        } catch (error) {
            console.error("Erro ao carregar os dados da enquete", error);
        }
    } else {
        console.error("ID da enquete não encontrado na URL");
    }
}carregarEnquete();

async function votar(opcaoId) {
    await fetch("http://localhost:3000/votar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ opcaoId })
    });
    carregarEnquete();
}

