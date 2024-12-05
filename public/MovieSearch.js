var contadorPagina = 1;
var contenidoBusca = null;
var tipoBusqueda = null;
var peticion = false;
var peliculasGrafic = [];

var datosRecibidos = null;

var opcionGrafico = "valoradas";
var soluciones = [];
var mejores;
var chart;


function peticionAJAXmoderna() {
    document.getElementById("reload").style.opacity = 1;
    document.getElementById("reload").style.zIndex = 99;
    peticion = true;
    contenidoBusca = document.getElementById("buscador").value;
    if (contenidoBusca == '') {
        contenidoBusca = "harry";
    }

    let url = "https://www.omdbapi.com/?apikey=7ab4a05e&s="+contenidoBusca+"&page="+contadorPagina+"&type="+tipoBusqueda;

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
        document.getElementById("reload").style.opacity = 0;
        document.getElementById("reload").style.zIndex = 0;
    })
   .catch((err) => console.log("error: " + err));
}


function borrarpelis() {
    let milista = document.getElementById("peliculas");
    milista.innerHTML = "";
    contadorPagina = 1;
    peliculasGrafic = [];
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
    document.body.style.overflow = "hidden";
    e.stopPropagation();
    let url = "https://www.omdbapi.com/?apikey=7ab4a05e&t="+pelicula.Title;

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


function generarInforme() {
    soluciones = [];
    peliculasGrafic.mejores = [];
    contador = 0;

    peliculasGrafic.forEach((pelicula)=> {
        document.getElementById("reload").style.opacity = 1;
    document.getElementById("reload").style.zIndex = 99;
    let url = "https://www.omdbapi.com/?apikey=7ab4a05e&i="+pelicula.imdbID;
    peticion = true;

    fetch(url, {method : "GET" })
    .then((res) => res.json())
   .then((datos) => {
    peticion = false;
    var titulo = [];
    switch (opcionGrafico) {
        case "valoradas":
            titulo = [datos.Title,parseFloat(datos.imdbRating)];
            soluciones.push(titulo);
          
            break;
        case "recaudacion":
            if (datos.BoxOffice != "N/A") {
            titulo = [datos.Title,parseFloat(datos.BoxOffice.split("$")[1].replace(/,/g, "."))];
            soluciones.push(titulo);
            }
            break;
        case "votadas":
            titulo = [datos.Title,parseFloat(datos.imdbVotes.replace(/,/g, "."))];
            soluciones.push(titulo);
            break;
    }


    soluciones = soluciones.sort((a,b) => b[1] - a[1]);

    mejores = soluciones.slice(0,5);
    
    contador++;


    if (contador == peliculasGrafic.length) {
        let ol = document.getElementById("listatexto");
        for (let mejor of mejores) {
            let li = document.createElement("li");


            switch (opcionGrafico) {
                case "valoradas":
            li.innerHTML = mejor[0]+": "+mejor[1]+"/10";
                    
                    break;
                case "recaudacion":
                    li.innerHTML = mejor[0]+": "+mejor[1]+"$";
                    break;
                case "votadas":
            li.innerHTML = mejor[0]+": "+mejor[1]+" votes";
                    
                    break;
                }

            ol.appendChild(li);
            
        }
    }
        switch (opcionGrafico) {
        case "valoradas":
            pintargrafico(0);
            break;
        case "recaudacion":
            pintargrafico(1);
            break;
        case "votadas":
            pintargrafico(2);
            break;
        }
    
        


        document.getElementById("reload").style.opacity = 0;
        document.getElementById("reload").style.zIndex = 0;
   })
    .catch((err) => console.log("error: " + err));

})

}



function pintargrafico(numero) {

        var data = [];
        data[numero] = google.visualization.arrayToDataTable([
            ["Movie", opcionGrafico, { role: "style" } ],
            [mejores[0][0], mejores[0][1], "green"],
            [mejores[1][0], mejores[1][1], "blue"],
            [mejores[2][0], mejores[2][1], "red"],
            [mejores[3][0], mejores[3][1], "pink"],
            [mejores[4][0], mejores[4][1], "violet"]
          ]);

          var view = new google.visualization.DataView(data[numero]);

          view.setColumns([0, 1,
            { calc: "stringify",
              sourceColumn: 1,
              type: "string",
              role: "annotation" },
            2]);


            var options = {
                title: "Best Movies",
                width: "100%",
                height: 400,
                bar: {groupWidth: "80%"},
                legend: { position: "none" },
                vAxis: {title: "Movies"},
                hAxis: {title: "Values"},
                animation: {duration: 500, easing: 'out'}
              };

              
              chart.draw(view, options);


}








google.charts.load('current', {'packages':['corechart']});
window.onload = ()=> {

    
    
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
        document.body.style.overflow = "";
        element.style.opacity = "0%";
        element.style.zIndex = "0";
        setTimeout(()=>{tabla.innerHTML = ""},1000);
        }else if (e.target.closest("#tabladetalle")) {

        }else {
            document.body.style.overflow = "";
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
        
        document.getElementById("graficoSeleccionado").innerHTML = "Most Rated";
        opcionGrafico = "valoradas";
        generarInforme();
        chart = new google.visualization.BarChart(document.getElementById("barchart_values"));



        document.body.style.overflow = "hidden";
        grafico.style.opacity = "100%";
        grafico.style.zIndex = "99";
        grafico.style.transition = "all 1s";
    });


    let lista = document.getElementById("listatexto");
    document.getElementById("valoradas").addEventListener("click",()=> {
        document.getElementById("graficoSeleccionado").innerHTML = "Most Rated";
        lista.innerHTML = "";
        opcionGrafico = "valoradas";
        generarInforme();
    });

    document.getElementById("recaudacion").addEventListener("click",()=> {
        document.getElementById("graficoSeleccionado").innerHTML = "Highest grossing";
        lista.innerHTML = "";
        opcionGrafico = "recaudacion";
        generarInforme();
    });

    document.getElementById("votadas").addEventListener("click",()=> {
        document.getElementById("graficoSeleccionado").innerHTML = "Most voted";
        lista.innerHTML = "";
        opcionGrafico = "votadas";
        generarInforme();
    });



    let graf = document.getElementById("grafico");
    graf.addEventListener("click", (e)=> {

        let cross1 = document.getElementsByClassName("fas fa-times")[0];

         if (e.target == cross1) {
        document.body.style.overflow = "";
        graf.style.opacity = "0%";
        graf.style.zIndex = "0";
        }else if (e.target.closest("#graficocontent")) {

        }else {
            document.body.style.overflow = "";
            graf.style.opacity = "0%";
            graf.style.zIndex = "0";
        }
    });

}

