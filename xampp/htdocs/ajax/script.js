function verpreview(event){
    if(evt){
        var url = evt.target.value;

    }else{
        evt = window.event;
        let url = evt.srcElement.value;
    }
    posx = evt.clientX;
    posy = evt.clientY;

    xhr = new XMLHttpRequest();

    xhr.onreadystatechange = vercontenido;
    xhr.open("GET",url,true);
    xhr.send(null);
    return false
}

function vercontenido(){
    if(xhr.readyState == 4){
        if(xhr.status == 200){
            let contenido = xhr.responseText;
            let pre = document.getElementById("preview");
            pre.style.left = posx + "px";
            pre.style.top = posy + "px";
            pre.innerHTML = contenido;
            pre.style.visibility = "visible";
        }
    }
}