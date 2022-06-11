interface Veiculo {
    nome: string;
    placa: string;
    entrada:Date | string;
}


(function (){
    const $ = (query: string): HTMLInputElement | null => document.querySelector(query);


        function calcTempo(mil:number){
            const min= Math.floor(mil / 600000);
            const sec = Math.floor(mil % 600000 / 1000);

            return `${min}m e ${sec}s`
        }
    function patio(){
        //Responsavel de guardar as informações
        function ler() : Veiculo []{
            return localStorage.patio ? JSON.parse(localStorage.patio) : [];
        }

        function salvar (veiculos: Veiculo []){
            localStorage.setItem("patio",JSON.stringify(veiculos))
        }

        function adicionar(veiculo: Veiculo, salva?:boolean){
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${veiculo.nome}</td>
                <td>${veiculo.placa}</td>
                <td>${veiculo.entrada}</td>
                <td>
                    <button class="delete" data-placa="${veiculo.placa}">Delete</button>
                </td>
            `;

            // Add Event Listener para o evento de click 
            row.querySelector(".delete").addEventListener("click", function(){
                //Junto com uma função para pegar o dataset do nome placa
                remover(this.dataset.placa);
            })

            $("#patio")?.appendChild(row);

            if(salva) salvar([...ler(), veiculo])
        }

        // envia a placa pra essa função em formato String
        function remover(placa : string){
            //Encontrar todos os veiculos salvos
            const {entrada,nome} = ler().find(veiculo => veiculo.placa === placa);

            const tempo = calcTempo(new Date().getTime() - new Date(entrada).getTime());
            
            if(confirm(`O veiculo ${nome} permaneceu por ${tempo}. Deseja encerrar?` )) return;

            salvar(ler().filter(veiculo => veiculo.placa !== placa));
            render();
        
        }   
        
        function render(){
            $("#patio")!.innerHTML = "";
            const patio = ler()

            if(patio.length) {
                patio.forEach(veiculo => adicionar(veiculo))
            }
        }
        return { ler, adicionar, remover, salvar, render};
    }

    patio().render();


    $("#cadastrar")?.addEventListener("click", ()=>{
        const nome = $("#nome")?.value;
        const placa = $("#placa")?.value;

        if(!nome || !placa) {
            alert("Os campos nome e placa são obrigatórios")
            return;
        }

        patio().adicionar({nome, placa, entrada : new Date().toISOString() }, true);
    });
})();