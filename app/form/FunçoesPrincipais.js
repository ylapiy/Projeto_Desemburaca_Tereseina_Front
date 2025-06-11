function PreparandoEnvioOFF(){

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

function tentarEnviar(){
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

function LeituraDefoto(Entrada){
 
            const arquivoFoto = Entrada.target.files[0];
            if (!arquivoFoto) {return;  resetTodos()};

            resetTodos();
            const butao = document.querySelector('.submit-btn');
          
                EXIF.getData(arquivoFoto, function() {
                    const Metadados = EXIF.getAllTags(this);

                    var lat2 = 0;
                    var lon2 = 0;
            
                    const Data = Metadados.DateTimeOriginal;

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

function TransformaCordenada(cordenadas, hemisferio,) {
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

function resetTodos() {
    window.lat2 = null;
    window.lon2 = null;
    window.Data = null;
    window.Foto = null;
    const butao = document.querySelector('.submit-btn');
    if (butao) {
      butao.disabled = false;
      butao.textContent = 'Enviar Denuncia';
    }
};

async function verificaTeresina(longitude, latitude) {

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