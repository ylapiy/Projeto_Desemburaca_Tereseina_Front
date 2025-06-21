document.getElementById('email').addEventListener('click',()=>{
    const texto = document.getElementById('campodeemail')
    if(texto != ""){
    document.querySelector('.popupenvio').style.visibility = 'visible';
    document.querySelector('.popupenvio').style.display = 'flex';
    document.querySelector('.fundoescuro').style.visibility = 'visible';
    document.querySelector('.fundoescuro').style.display = 'flex';
    }
});

document.getElementById('fecharenvio').addEventListener('click',() =>{
    document.querySelector('.popupenvio').style.visibility = 'hidden';
    document.querySelector('.popupenvio').style.display = 'none';
    document.querySelector('.fundoescuro').style.visibility = 'hidden';
    document.querySelector('.fundoescuro').style.display = 'hidden';
    console.log(document.getElementById('campodeemail').value)
    document.getElementById('campodeemail').value = "";
    document.getElementById('formemai').mensagem.value = "";
});