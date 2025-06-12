export function PreparandoEnvioOFF(){

    const formulario =  document.getElementById("form-denuncia");

    const dadosAseremSalvos = {
        
     /* localizao ainda sera usado para provavelmente para colocar o nome da imagem */
     localizacao: formulario.location.value,
     tamanho: formulario.size.value,
     observacao: formulario.description.value,
     lat: window.lat2,
     lon: window.lon2,
     data: window.Data,
    
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
    /* fazer aparecer o negocio de esperando internet...*/
};

export function tentarEnviar(){
    const requesicao = indexedDB.open("FormularioDB", 1);

    requesicao.onsuccess = function (e) {
    const db = e.target.result;
    const texto = db.transaction("FormOFF", "readonly");
    const salvo = texto.objectStore("FormOFF");

    const Dados = salvo.get("SalvalmentoOFF");

    Dados.onsuccess = function () {
      const resultado = Dados.result;

      if (resultado) {
        console.log("🔁 Dados offline recuperados:", resultado);

        window.dadosOfflineRecuperados = resultado;

        /*puxar as apis aqui e ai dale*/

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
                                    }else{
                                        butao.textContent = "Salvar Denuncia"; }
                                } else {
                                    butao.disabled = true;
                                    butao.textContent = `Imagem Invalida - Imagem Fora da Area de Teresina`;
                                }
                                }).catch((e) => {
                                    butao.disabled = true;
                                    butao.textContent = `Imagem Inválida -  LocalizaçãoIncerta`;
                                });

                           if(lat2 === null || lon2 === null){
                            butao.disabled = true;
                                 butao.textContent = `Imagem Invalida - Imagem Sem Dados De GPS`;
                            }

                            } catch (e) {
                                butao.disabled = true;
                                butao.textContent = `Imagem Inválida - Erro nos Dados de GPS`;}
                             } else {
                                butao.disabled = true;
                                butao.textContent = possuiData
                                ? `Imagem Inválida - Sem Dados de GPS`
                                : `Imagem Inválida - Sem Dados de Data`;

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
    window.Nome = null;
    window.Bairro = null;
    window.Rua = null;
    const butao = document.querySelector('.submit-btn');
    if (butao) {
      butao.disabled = false;
      butao.textContent = 'Enviar Denuncia';
    }
};

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

export function loopDeEnvio(contador){
                     const butao = document.querySelector('.submit-btn');
                     if(butao.disabled == false){butao.textContent = "Enviar Denúncia";return;}

                     switch (contador){
                        case 0 :
                        butao.textContent = "Enviando Denuncia, aguarde"
                        contador++
                        console.log(contador)
                        break;
                        case 1 :
                        butao.textContent = "Enviando Denuncia, aguarde."
                        contador++
                        console.log(contador)
                        break;
                        case 2 :
                        butao.textContent = "Enviando Denuncia, aguarde.."
                        contador++
                        console.log(contador)
                        break;
                        case 3 :
                        butao.textContent = "Enviando Denuncia, aguarde..."
                        contador = 0
                        console.log(contador)
                        break;
                    }setTimeout(() => loopDeEnvio(contador), 1500)
                  
};

export async function RevesaoGeografica(lon, lat){

const API_KEY = 'pk.7ac70b80805183e2466b163c071075dc'
const url = `https://us1.locationiq.com/v1/reverse.php?key=${API_KEY}&lat=${lat}&lon=${lon}&format=json`;

try{
const resposta = await fetch(url, { headers: {'User-Agent': 'GeoAPI/1.0 (browser)'}})

if(!resposta.ok){throw new Error ('Reversão geografica eu vou lhe pegar')}

const Dados = await resposta.json()
const endereco = Dados.address

const Bairro = endereco.suburb || 'Bairro não encontrado'
const Rua = endereco.road || 'Rua não encontrada'

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

export async function GetBancoDeDados(){



};



