var contadorPagina = 1;
var contenidoBusca = null;
var tipoBusqueda = null;
var peticion = false;
var peliculasGrafic = [];

var datosRecibidos = null;

function peticionAJAXmoderna() {
    peticion = true;
    contenidoBusca = document.getElementById("buscador").value;
    if (contenidoBusca == '') {
        contenidoBusca = "harry";
    }

    let url = "http://www.omdbapi.com/?apikey=7ab4a05e&s="+contenidoBusca+"&page="+contadorPagina+"&type="+tipoBusqueda;

    fetch(url, {method : "GET" })
    .then((res) => res.json())
   .then((datos) => {

        if (datos.totalResults == undefined) {
            let h2 = document.createElement("h2");
            h2.innerHTML = "No results found";
            document.getElementById("peliculas").appendChild(h2);
        }
        peticion = false;
        datosRecibidos = datos;
        añadirPelis();
    })
   .catch((err) => console.log("error: " + err));
}


function borrarpelis() {
    let milista = document.getElementById("peliculas");
    milista.innerHTML = "";
    contadorPagina = 1;
}

function añadirPelis() {

if (!peticion) {

        if (datosRecibidos.totalResults > 1) {
            datosRecibidos.Search.forEach(pelicula => {

                let padre = document.getElementById("peliculas");
                var div = document.createElement("div");
                padre.appendChild(div);

                let img = document.createElement("img");
                img.src = pelicula.Poster;

                img.addEventListener("error", (e)=>{
                    e.target.src = "./imagenes/imagenNoEncontrada.jpg";
                    e.target.alt = pelicula.Title;
                });

                div.appendChild(img);
            


                mostrarDetalle(img,pelicula);
                peliculasGrafic.push(pelicula);
                });

                contadorPagina++;
            }
        }
}





function mostrarDetalle(img, pelicula) {

let element = document.getElementById("detalle");
img.addEventListener("click", (e)=> {
    e.stopPropagation();
    let url = "http://www.omdbapi.com/?apikey=7ab4a05e&t="+pelicula.Title;

    fetch(url, {method : "GET" })
    .then((res) => res.json())
   .then((datos) => {

    var tabla = document.getElementById("tabladetalle");

    if (datos.Title == undefined) {
        let h2 = document.createElement("h2");
        h2.innerHTML = "No results found";
        tabla.appendChild(h2)
    }else {


    let claves = Object.keys(datos);  


    let trtitulo = document.createElement("tr");


    let tdtit = document.createElement("td");
    tdtit.setAttribute("id","titulo");
    tdtit.setAttribute("colspan",4);
    let tit = document.createElement("h2");
    tit.innerText = datos.Title;
    tdtit.appendChild(tit);

    trtitulo.appendChild(tdtit);
    
    let tdcross = document.createElement("td");
    tdcross.style.textAlign = "end";
    let icross = document.createElement("i");
    icross.setAttribute("class","fas fa-times");
    tdcross.appendChild(icross);
    trtitulo.appendChild(tdcross);
    

    tabla.appendChild(trtitulo);




    for (let j = 1;j<claves.length;j++) {
        var tr = document.createElement("tr");

            for(let i=0; i< 2; i++){
                if (claves[j] != undefined) {
                    if (claves[j] != "Poster" && claves[j] != "Ratings") {
                        let tdlabel = document.createElement("td");
                        tdlabel.innerHTML = claves[j]+":";
                        let tdtext = document.createElement("td");
                        tdtext.innerHTML = datos[claves[j]];
                        
                        tdtext.style.color = "wheat";
                        tr.appendChild(tdlabel);
                        tr.appendChild(tdtext);
                    if (i == 0) {
                        j++
                    }
                    if (j == 2 && i == 1) {
                        let tdimg = document.createElement("td");
                        tdimg.setAttribute("rowspan",13)
                        let img = document.createElement("img");
                        img.src = datos.Poster;

                        img.addEventListener("error", (e)=>{
                            e.target.src = "./imagenes/imagenNoEncontrada.jpg";
                            e.target.alt = pelicula.Title;
                        });

                        tdimg.appendChild(img);
                        tr.appendChild(tdimg);
                    
                }
            }else {j++}}else {
                j++;
            }
        }
        tabla.appendChild(tr);
    }

    }
    element.style.opacity = "100%";
    element.style.zIndex = "99";
    element.style.transition = "all 1s";   


    
})
.catch((err) => console.log("error: " + err));
});
}


function generarInforme(arrayPelis,opcion) {

    arrayPelis.forEach((pelicula)=> {
    let url = "http://www.omdbapi.com/?apikey=7ab4a05e&t="+pelicula.Title;

    fetch(url, {method : "GET" })
    .then((res) => res.json())
   .then((datos) => {

    //Ver películas más valoradas por imdbRating (5), películas con mayor recaudación (5) o películas más votadas (5)
    //switch de opcion y mostrarlos; 

   })
    .catch((err) => console.log("error: " + err));
})

}













window.onload = ()=> {

    peticionAJAXmoderna();
    
    
    window.addEventListener("scroll", ()=> {
        let ventana = window.innerHeight;
        //document.body.offsetHeight siempre marca 0 con lo que el contenedor de peliculas arregla el fallo
        let documento = document.getElementById("peliculas").offsetHeight;
        let endOfPage = ventana + window.pageYOffset >= (documento*0.6);

        if (endOfPage) {
            if (!peticion) {
            peticionAJAXmoderna();
            }
        }
    });
    
    
    document.getElementById("buscador").addEventListener("input", (e)=> {
        if (e.target.value.length >= 3) {
            tipoBusqueda = null;
            borrarpelis();
            peticionAJAXmoderna();
        }
    });

    let element = document.getElementById("detalle");
    let tabla = document.getElementById("tabladetalle");
    element.addEventListener("click", (e)=> {

        let cross = document.getElementsByClassName("fas fa-times")[0];

         if (e.target == cross) {
        element.style.opacity = "0%";
        element.style.zIndex = "0";
        setTimeout(()=>{tabla.innerHTML = ""},1000);
        }else if (e.target.closest("#tabladetalle")) {

        }else {
            element.style.opacity = "0%";
            element.style.zIndex = "0";
            setTimeout(()=>{tabla.innerHTML = ""},1000); 
        }
    });


    document.getElementById("movies").addEventListener("click",()=> {
        borrarpelis();
        tipoBusqueda = "movie";
        peticionAJAXmoderna();
    });  
    document.getElementById("series").addEventListener("click",()=> {
        borrarpelis();
        tipoBusqueda = "series";
        peticionAJAXmoderna();
    });
    document.getElementById("episodes").addEventListener("click",()=> {
        borrarpelis();
        tipoBusqueda = "episodes";
        peticionAJAXmoderna();
    });


    document.getElementById("generar").addEventListener("click",()=> {
        let grafico = document.getElementById("grafico");
        
        console.log(peliculasGrafic);



        grafico.style.opacity = "100%";
        grafico.style.zIndex = "99";
        grafico.style.transition = "all 1s";
    });

}

