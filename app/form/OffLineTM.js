window.SalvarOffline = function(){

    const formulario =  document.getElementById("form-denuncia");

    const dadosAseremSalvos = {

     /* localizao ainda sera usado para provavelmente para colocar o nome da imagem */
     localizacao: form.location.value,
     tamanho: form.size.value,
     observacao: form.description.value,
     lat: window.lat2,
     lon: window.lon2,
     data: window.Data,

    }

    /* salvar aquirvo locamente offline é tão legal (socoro)*/
    const requesicao = indexedDB.open("FormularioDB", 1);
    requesicao.onupgradeneeded = function (e) {
    const db = e.target.result;
    db.createObjectStore("imagens");
    };
    request.onsuccess = function (e) {
    const db = e.target.result;
    const texto = db.transaction("imagens", "readwrite");
    const aserArmazenado = texto.objectStore("imagens");
    aserArmazenado.put(window.Foto, "formOffline");
    };

    console.log("🔁 Armazenando denúncia offline...");
    console.log("Dados:", dados);

    /* fazer aparecer o negocio de esperando conção ...*/
}