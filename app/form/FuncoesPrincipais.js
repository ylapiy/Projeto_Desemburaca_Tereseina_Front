export function PreparandoEnvioOFF(){

    const formulario =  document.getElementById("form-denuncia");
    var categoria = null
    if(formulario.size.value == "small"){categoria = 1}else{if(formulario.size.value == "medium"){categoria = 2}else{if(formulario.size.value == "large"){categoria = 3}}}

    const dadosAseremSalvos = {
        
     /* localizao ainda sera usado para provavelmente para colocar o nome da imagem */
     data: window.Data,
     categoria: categoria,
     observacao: formulario.description.value,
     nome : window.Nome,
     lat: window.lat2,
     lon: window.lon2,
  
    };

    const Imagem = window.Foto;

    /* salvar aquirvo locamente offline é tão legal (socoro)*/
    const requesicao = indexedDB.open("FormularioDB", 1);
    requesicao.onupgradeneeded = function (e) {
    const db = e.target.result;
    db.createObjectStore("FormOFF");
    };
    requesicao.onsuccess = function (e) {
    const db = e.target.result;
    const texto = db.transaction("FormOFF", "readwrite");
    const aserArmazenado = texto.objectStore("FormOFF");
    aserArmazenado.put({Foto : Imagem, Dados : dadosAseremSalvos}, "SalvalmentoOFF");
    };

    console.log("🔁 Armazenando denúncia offline...");
    console.log("Dados :", dadosAseremSalvos)

    Window.DadosSalvos = dadosAseremSalvos
};

export function tentarEnviar(){
    const requesicao = indexedDB.open("FormularioDB", 1);
    const butao = document.querySelector('.submit-btn');

    requesicao.onsuccess = function (e) {
    const db = e.target.result;
    const texto = db.transaction("FormOFF", "readwrite");
    const salvo = texto.objectStore("FormOFF");

    const Carregamento = salvo.get("SalvalmentoOFF");

    Carregamento.onsuccess = function () {
      const resultado = Carregamento.result;

      if (resultado) {
        console.log("🔁 Dados offline recuperados:", resultado);
        console.log("dados :", 
        resultado.Dados.data,
        resultado.Dados.categoria,
        resultado.Dados.observacao,
        resultado.Dados.nome,
        resultado.Dados.lon,
        resultado.Dados.lat,
        resultado.Dados.Bairro,
        resultado.Dados.Rua
        );

        window.dadosOfflineRecuperados = resultado;

        /*puxar as apis aqui e ai dale*/
        RevesaoGeografica(resultado.Dados.lon,resultado.Dados.lat).then(() => {
        console.log(window.Bairro,window.Rua)
        PostBancoDeDados(resultado.Dados.data,resultado.Dados.categoria,resultado.Dados.observacao,resultado.Dados.nome,resultado.Dados.lon,resultado.Dados.lat,window.Bairro,window.Rua) 
        DriveUploader(resultado.Foto).then(() => {butao.disabled = false;butao.textContent = "Enviar Denúncia";
        document.querySelector('.popupenvio').style.visibility = 'visible';
        document.querySelector('.popupenvio').style.display = 'flex';
        document.querySelector('.fundoescuro').style.visibility = 'visible';
        document.querySelector('.fundoescuro').style.display = 'flex';
        LimpezadeForm()
        })
        })

        const limpeza = salvo.delete("SalvalmentoOFF");
        limpeza.onsuccess = function () {
          console.log("🧹 Dados offline apagados com sucesso.");
        };
        limpeza.onerror = function () {
        console.warn("⚠️ Erro ao tentar apagar os dados offline.");
        };

      } else {
        console.log("ℹ️ Nenhum dado offline encontrado.");
      }

    };
  };
};

export function LeituraDefoto(Entrada){
 
            const arquivoFoto = Entrada.target.files[0];
            if (!arquivoFoto) {return;  resetTodos()};

            resetTodos();
            const butao = document.querySelector('.submit-btn');
            const linkajuda = document.getElementById("linkajuda")
          
                EXIF.getData(arquivoFoto, function() {
                    const Metadados = EXIF.getAllTags(this);

                    var lat2 = 0;
                    var lon2 = 0;
            
                    const Data = Metadados.DateTimeOriginal;
                    const NomeFoto = arquivoFoto.name;

                    let possuiData = !!Data;
                    let possuiGPS = Metadados.GPSLatitude && Metadados.GPSLongitude &&
                        Array.isArray(Metadados.GPSLatitude) &&
                        Array.isArray(Metadados.GPSLongitude);

                    if (possuiData && possuiGPS) {
                        try {
                            var lat2 = TransformaCordenada(Metadados.GPSLatitude, Metadados.GPSLatitudeRef);
                            var lon2 = TransformaCordenada(Metadados.GPSLongitude, Metadados.GPSLongitudeRef);
                            
                             window.lat2 = lat2;
                             window.lon2 = lon2;
                             window.Data = Data;
                             window.Foto = arquivoFoto;
                             window.Nome = NomeFoto;

                            verificaTeresina(lon2,lat2).then((estaDentro) => {
                                if (estaDentro) {
                                    if(navigator.onLine){
                                        butao.textContent = "Enviar Denuncia"; 
                                        linkajuda.style.visibility = "hidden"
                                    }else{
                                        butao.textContent = "Salvar Denuncia"; linkajuda.style.visibility = "hidden";}
                                } else {
                                    butao.disabled = true;
                                    butao.textContent = `Imagem Invalida - Imagem Fora da Area de Teresina`;
                                    linkajuda.style.visibility = "visible"
                                }
                                }).catch((e) => {
                                    butao.disabled = true;
                                    butao.textContent = `Imagem Inválida -  Localização Incerta`;
                                    linkajuda.style.visibility = "visible"
                                });

                           if(lat2 === null || lon2 === null){
                            butao.disabled = true;
                                 butao.textContent = `Imagem Invalida - Imagem Sem Dados De GPS`;
                                 linkajuda.style.visibility = "visible"
                            }

                            } catch (e) {
                                butao.disabled = true;
                                butao.textContent = `Imagem Inválida - Erro nos Dados de GPS`;}
                                linkajuda.style.visibility = "visible"
                             } else {
                                butao.disabled = true;
                                butao.textContent = possuiData
                                ? `Imagem Inválida - Sem Dados de GPS`
                                : `Imagem Inválida - Sem Dados de Data`;
                                linkajuda.style.visibility = "visible"

                }              
            })
};

export function TransformaCordenada(cordenadas, hemisferio,) {
    const degrees = cordenadas[0].numerator / cordenadas[0].denominator;
    const minutes = cordenadas[1].numerator / cordenadas[1].denominator;
    const seconds = cordenadas[2].numerator / cordenadas[2].denominator;

    if ([degrees, minutes, seconds].some(n => isNaN(n))) return null;

    let decimal = degrees + minutes / 60 + seconds / 3600;
    if (hemisferio === "S" || hemisferio === "W") {
        decimal *= -1;
    }

    return decimal.toFixed(5); 
};

export function resetTodos() {
  window.lat2 = null;
  window.lon2 = null;
  window.Data = null;
  window.Foto = null;
  window.Rua = null;
  window.Bairro = null;
  window.timeoutAnimacao = null;
    document.getElementById("linkajuda").style.visibility = "hidden"
    const butao = document.querySelector('.submit-btn');
    if (butao) {
    butao.disabled = false;
    butao.textContent = 'Enviar Denuncia';
    }
};

export function LimpezadeForm(){
   const formulario = document.getElementById('form-denuncia')
      formulario.location.value = ""
      formulario.size.value = ""
      formulario.description.value = ""
      document.getElementById('camera').value = ""; 
      document.getElementById('iconephoto').innerText = "📁 Colocar Foto da Galeria";
      document.getElementById('photo').value = ""; 
      document.getElementById('iconecamera').innerText = "📷 Usar Câmera";


}

export async function verificaTeresina(longitude, latitude) {

    try {
    const ponto = turf.point([longitude, latitude]);
    const Teresina = teresinaGeoJson.features[0];
    const dentro = turf.booleanPointInPolygon(ponto, Teresina);

    console.log(dentro ? "✅ Dentro" : "❌ Fora da área");
    return dentro;
    } catch (e) {
    console.error("Erro em verificaTeresina");
    return false;
    }
    
};

export function loopDeAnim(contador,texto){
                     const butao = document.querySelector('.submit-btn');
                     if(butao.disabled == false){butao.textContent = "Enviar Denúncia";return;}

                     switch (contador){
                        case 0 :
                        butao.textContent = texto+""
                        contador++
                        console.log(contador)
                        break;
                        case 1 :
                        butao.textContent = texto+"."
                        contador++
                        console.log(contador)
                        break;
                        case 2 :
                        butao.textContent = texto+".."
                        contador++
                        console.log(contador)
                        break;
                        case 3 :
                        butao.textContent = texto+"..."
                        contador = 0
                        console.log(contador)
                        break;
                    }window.timeoutAnimacao = setTimeout(() => loopDeAnim(contador,texto), 1500)
                    
};

export async function RevesaoGeografica(lon, lat){

try{
  
  const response = await fetch(`https://projetodesemburacateresinaapi-production-1abf.up.railway.app/reversao-geografica?lat=${lat}&lon=${lon}`);

  if(!response.ok){throw new Error ('Reversão geografica eu vou lhe pegar')};

  const Dados = await response.json();

  const Bairro = Dados.bairro || 'Bairro não encontrado'
  const Rua = Dados.rua || 'Rua não encontrada'

  window.Bairro = Bairro;
  window.Rua = Rua;

  console.log('Rua:',Rua )
  console.log('Bairro',Bairro)

}catch(e){

  console.log('Erro ao se conectar a Api de reversão geografica : ',e )

}


};

export async function DriveUploader(Foto){


const ImagemFoto = Foto
const formData = new FormData()

formData.append('file',ImagemFoto)
try{
const resposta = await fetch('https://projetodesemburacateresinaapi-production-1abf.up.railway.app/upload',{
  method:'POST',
  body:formData
})

if(!resposta.ok){console.log('Socorro MDS')}else{

console.log('Deu CERTO, OLHA O DRIVE')
}


}catch (e){console.log('Erro: ', e )}
};

export async function PostBancoDeDados(data,categoria,observacao,imagem,lon,lat,rua,bairro) {

const dataFormatada = normalizarDataParaPostgres(data);

if (!dataFormatada) {
  reply.code(400).send({ error: 'Data inválida extraída da imagem.' });
  return;
}

const NovaEntrada = {

    "data": dataFormatada,
    "categoria": categoria,
    "observacao": observacao,
    "imagem": imagem,
    "longitude": lon,
    "latitude": lat,
    "rua": rua,
    "bairro": bairro
}

  try {

    const resposta = await fetch('https://projetodesemburacateresinaapi-production-1abf.up.railway.app/registro',{
      method:'POST',headers : {'Content-Type' :'application/json'},
      body: JSON.stringify(NovaEntrada)
    })

    if(!resposta.ok){console.log('Socorro MDS')}else{
    console.log('Deu CERTO, OLHA O BANCO')
    } 
    


  }catch(e){console.log('Erro:' ,e)}
};

function normalizarDataParaPostgres(dataString) {
  if (!dataString) return null;
  const corrigida = dataString.replace(/^(\d{4}):(\d{2}):(\d{2})/, '$1-$2-$3');

  const data = new Date(corrigida);

  return data.toISOString().slice(0, 19).replace('T', ' ');
}




