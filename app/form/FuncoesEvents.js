import {PreparandoEnvioOFF,tentarEnviar,LeituraDefoto,RevesaoGeografica, DriveUploader,PostBancoDeDados,loopDeAnim,LimpezadeForm} from './FuncoesPrincipais.js'

window.esperandoConc =  localStorage.getItem('SerReiniciar')
window.lat2 = null;
window.lon2 = null;
window.Data = null;
window.Foto = null;
window.Rua = null;
window.Bairro = null;
window.timeoutAnimacao = null;

console.log(localStorage.getItem('SerReiniciar'))
console.log(window.esperandoConc)

/*  script para verificar se a imagem tem tudo certinho, data, gps e depois se internet ta on ne,
    agora se tu me perguntar, pq um site opção de selavar offline, eu te respondo, boa pergunta! Não mas, a
    agora é serio, é pq mesmo sentdo um site agora isso foi pensado pra posteriomenter virar aplicativo
    então na realidade faz sentido (eu acho) */

document.getElementById('form-denuncia').addEventListener('submit', (Entrada) => {  
            Entrada.preventDefault()
            const arquivo = document.getElementById('photo');
            const camera = document.getElementById('camera');
            const butao = document.querySelector('.submit-btn');
            const formulario = document.getElementById('form-denuncia')
            var categoria = null

            if(formulario.size.value == "small"){categoria = 1}else{if(formulario.size.value == "medium"){categoria = 2}else{if(formulario.size.value== "large"){categoria = 3}}}

            console.log("Arquivo selecionado:", arquivo.files.length);
            console.log("Camera selecionada:", camera.files.length);

            if(arquivo.files.length || camera.files.length){
                if(butao.textContent == "Enviar Denuncia"){
                    console.log('enviando denuncia')
                    butao.textcontent = "Enviando Denuncia, aguarde"
                    console.log('Situação da conc:', window.esperandoConc)
                    butao.disabled = true; 

                    RevesaoGeografica(window.lon2,window.lat2).then(() => {
                    butao.disabled = true; 
                    console.log(window.Data,categoria,formulario.description.value,window.Nome,window.lon2,window.lat2,window.Bairro,window.Rua)
                    PostBancoDeDados(window.Data,categoria,formulario.description.value,window.Nome,window.lon2,window.lat2,window.Bairro,window.Rua) 
                    DriveUploader(window.Foto).then(() => {butao.disabled = false;butao.textcontent = "Enviar Denúncia";
                    document.querySelector('.popupenvio').style.visibility = 'visible';
                    document.querySelector('.popupenvio').style.display = 'flex';
                    document.querySelector('.fundoescuro').style.visibility = 'visible';
                    document.querySelector('.fundoescuro').style.display = 'flex';
                    LimpezadeForm();
                    ;}) 
                    
                    var contador = 0
                    loopDeAnim(contador,"Enviando Denuncia, aguarde") 

                    })

                }else{
                    window.esperandoConc = true;
                    butao.disabled = true;
                    console.log('salvando denuncia')
                    console.log('Esperando conc:', window.esperandoConc)

                    localStorage.setItem('SerReiniciar',window.esperandoConc );
                    console.log(localStorage.getItem('SerReiniciar'))

                    PreparandoEnvioOFF()

                    var contador = 0
                    loopDeAnim(contador,"Denuncia Salva, esperando conexão com a internet para finalizar a denuncia")
                }

            }else{
                document.querySelector('.popupfaltaImage').style.visibility = 'visible';
                document.querySelector('.popupfaltaImage').style.display = 'flex';
                document.querySelector('.fundoescuro').style.visibility = 'visible';
                document.querySelector('.fundoescuro').style.display = 'flex';
                return;
            }
});
        
document.getElementById('photo').addEventListener('change', (Entrada) => {

             const camera = document.getElementById('iconecamera')
             camera.innerText =  "📷 Usar Câmera"
             document.getElementById('camera').value = ""; 

             const arquivo = document.getElementById('iconephoto')
             arquivo.innerText = "Colocar Foto da Galeria - ✔️"
             LeituraDefoto(Entrada)  
});
        
document.getElementById('camera').addEventListener('change', (Entrada) => {
            const camera = document.getElementById('iconecamera')
            camera.innerText =  "📷 Usar Câmera - ✔️ "

            const arquivo = document.getElementById('iconephoto')
            document.getElementById('photo').value = ""; 
            arquivo.innerText = "Colocar Foto da Galeria"
            LeituraDefoto(Entrada)
});

document.getElementById('fecharenvio').addEventListener('click',() =>{
    document.querySelector('.popupenvio').style.visibility = 'hidden';
    document.querySelector('.popupenvio').style.display = 'none';
    document.querySelector('.fundoescuro').style.visibility = 'hidden';
    document.querySelector('.fundoescuro').style.display = 'hidden';
});

document.getElementById('fecharimagem').addEventListener('click',() =>{
    document.querySelector('.popupfaltaImage').style.visibility = 'hidden';
    document.querySelector('.popupfaltaImage').style.display = 'none';
    document.querySelector('.fundoescuro').style.visibility = 'hidden';
    document.querySelector('.fundoescuro').style.display = 'hidden';
});

window.addEventListener('online', () => {
            const arquivo = document.getElementById('photo');
            const camera = document.getElementById('camera');
            const formulario = document.getElementById('form-denuncia')
            const butao = document.querySelector('.submit-btn');
        
            if (window.timeoutAnimacao) {
             clearTimeout(window.timeoutAnimacao); 
             window.timeoutAnimacao = null;         
            }

            const dados = Object.fromEntries(new FormData(formulario).entries());
            var categoria = null
            if(dados.size == "small"){categoria = 1}else{if(dados.size == "medium"){categoria = 2}else{if(dados.size == "large"){categoria = 3}}}

            if (window.esperandoConc === true) {
            
            window.esperandoConc = false
            localStorage.setItem('SerReiniciar',window.esperandoConc);

            try {
            butao.disabled = true;
                var contador = 0
                loopDeAnim(contador,"Enviando Denuncia, aguarde")  
                tentarEnviar();

            } catch (erro) {

            console.error(erro);
            }

            butao.textContent = "Enviar Denuncia";
            }
});

window.addEventListener('offline', () => {
            const butao = document.querySelector('.submit-btn');
            butao.textContent = "Salvar Denuncia"; 
});

window.addEventListener('onload', () =>{
    const butao = document.querySelector('.submit-btn');
    if(localStorage.getItem(SerReiniciar) === false){tentarEnviar();}else{butao.disabled = true;var contador = 0;oopDeAnim(contador,"Denuncia Salva, esperando conecção com a internter para finalizar a denuncia")
    }

});

document.addEventListener('DOMContentLoaded', () => {
           const butao = document.querySelector('.submit-btn');
           if(navigator.onLine){
            Window.esperandoConc = false;
            butao.textContent = "Enviar Denuncia"; 
           }else{
            butao.textContent = "Salvar Denuncia"; 
           }
});
