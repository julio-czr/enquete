async function carregarEnquete() {
    const params = new URLSearchParams(window.location.search);
    const enqueteId = params.get('id');

    if (enqueteId) {
        try {
            const response = await fetch(`http://localhost:3000/enquete/${enqueteId}`);
            const enquete = (await response.json())[0];
            console.log(enquete);

            const nome = document.getElementById("nome");
            nome.value = enquete.nome;

            const dataInicial = document.getElementById("dataInicial");
            dataInicial.value= enquete.dataInicial.replace(/(\d{4})-(\d{2})-(\d{2})T.*/, "$1-$2-$3");

            const dataFim =document.getElementById("dataFim"); 
            dataFim.value= enquete.dataFim.replace(/(\d{4})-(\d{2})-(\d{2})T.*/, "$1-$2-$3");

        

        } catch (error) {
            console.error("Erro carregar enquete", error);
        }
    } else {
        console.error("ID não encontrado na URL");
    }
}carregarEnquete();

async function editarEnquete () {

    const params = new URLSearchParams(window.location.search);
    const enqueteId = params.get('id');

    const nome = document.getElementById("nome").value;
    const dataInicial = document.getElementById("dataInicial").value;
    const dataFim = document.getElementById("dataFim").value;


    const response = await fetch("http://localhost:3000/editar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enqueteId, nome, dataInicial, dataFim })
    });

    const result = await response.json();
    document.getElementById("mensagem").textContent = result.message;


};