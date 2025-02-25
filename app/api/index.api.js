async function cadastrarEnquete () {
    const nome = document.getElementById("nome").value;
    const dataInicial = document.getElementById("dataInicial").value;
    const dataFim = document.getElementById("dataFim").value;

    const opcoes = Array.from(document.getElementsByClassName("opcaoInput"))
        .map(input => input.value.trim())
        .filter(opcao => opcao !== "");


    const response = await fetch("http://localhost:3000/add-enquete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, dataInicial, dataFim, opcoes })
    });

    const result = await response.json();
    document.getElementById("mensagem").textContent = result.message;
    carregarEnquetes();
};

// adiciona opçoes
function adicionarOpcao() {
    const container = document.getElementById("opcoesContainer");
    const input = document.createElement("input");
    input.className = "opcaoInput"
    container.appendChild(input);
    container.appendChild(document.createElement("br"));
}

async function carregarEnquetes() {
    try {
        const response = await fetch("http://localhost:3000/enquetes");
        const enquetes = await response.json();
        console.log(enquetes);
        //apagar enquetes do html
        const lista = document.getElementById("listaEnquetes");
        lista.innerHTML = "";

        enquetes.forEach(enquete => {
            //cria div para cada enquete
            const divEnquete = document.createElement("div");
            divEnquete.className = "enquete"
            
            const titulo = document.createElement("h2");
            titulo.innerHTML = `${enquete.nome}`;

            const datas = document.createElement("h4");
            datas.innerHTML=`${enquete.dataInicial.replace(/(\d{4})-(\d{2})-(\d{2})T.*/, "$3/$2/$1")} a ${enquete.dataFim.replace(/(\d{4})-(\d{2})-(\d{2})T.*/, "$3/$2/$1")}`;

            const votar = document.createElement("button");
            votar.textContent = "Votar"
            votar.addEventListener("click", () => {
                window.location.href = `votacao.html?id=${enquete.id}`;
            });

            const editarButton = document.createElement("button");
            editarButton.textContent = "Editar"
            editarButton.addEventListener("click", () => {
                window.location.href = `edicao.html?id=${enquete.id}`;
            });

            const excluirButton = document.createElement("button");
            excluirButton.textContent = "Excluir"
            excluirButton.onclick = async () => {
                await excluir(enquete.id);
            };
            
            
            divEnquete.appendChild(titulo);
            divEnquete.appendChild(datas);
            divEnquete.appendChild(votar);
            divEnquete.appendChild(document.createElement("br"));
            divEnquete.appendChild(editarButton);
            divEnquete.appendChild(document.createElement("br"));
            divEnquete.appendChild(excluirButton);
            lista.appendChild(divEnquete);
        });
    } catch (error) {
        console.error("erro enquetes", error);
    }
}carregarEnquetes();

async function excluir(enqueteId) {
    await fetch("http://localhost:3000/excluir", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enqueteId })
    
})
    carregarEnquetes();
}



