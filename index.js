const sezioneOrario = document.getElementById("orario")
const sezioneGiornata = document.getElementById("giornata")
const aggiungiPost = document.getElementById("aggiungi")
const grandeDiv = document.getElementById("grandeDiv")
const annullaBtn = document.getElementById("annulla")
const pensieri = document.getElementById("pensieri")
const uploadImage = document.getElementById("uploadImmagine")
const urlImage = document.getElementById("urlImmagine")
const dettagli = document.getElementsByClassName("dettagli")
const dettaglibtn = document.getElementsByClassName("dettagliBtn")
const scritte = document.getElementsByClassName("scritte")

const MESI = ["January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"]
const GIORNI_SETTIMANALI = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
var xmlContent


//Legge il file xml ed inserisce il documento nella variabile "xmlContent", accessibile anche all'esterno
document.addEventListener('DOMContentLoaded', () => {
    let url = 'info.xml'
    fetch(url).then(response=>response.text()).then(data=> {
        let parser = new DOMParser()
        let xml = parser.parseFromString(data, 'application/xml')
        console.log(xml)
        xmlContent = xml
        inserisciOrario()
        aggiornaPensieri()
    })
})

//Intervallo che richiama la stampa dell'ora ogni 500ms, ciò permette il funzionamento dell'orologio
/*setInterval(() => {
    inserisciOrario()
}, 500)*/

//Stampa il contenuto dei nodi che indicano l'ora, i minuti, i secondi, il giorno, il mese e l'anno corrente
function inserisciOrario() {
    orario = xmlContent.getElementsByTagName("datoOra")
    giornata = xmlContent.getElementsByTagName("datoGiorno")

    modificaOra(orario, giornata)

    sezioneOrario.innerText = orario[0].firstChild.nodeValue + ":" + orario[1].firstChild.nodeValue + ":" + orario[2].firstChild.nodeValue
    sezioneGiornata.innerText = giornata[0].firstChild.nodeValue + ", " + giornata[1].firstChild.nodeValue + " " + giornata[2].firstChild.nodeValue + " " + giornata[3].firstChild.nodeValue
}

/*Funzione che viene richiamata ogni 500ms dal "setInterval" presente sopra, il suo compito è quello di modificare l'ora:
    - Inserisce l'ora, i minuti, i secondi, il giorno, il mese e l'anno corrente nei rispettivi nodi del file xml
*/
function modificaOra(orario, giornata) {
    data = new Date()

    orario[2].firstChild.nodeValue = (data.getSeconds() < 10) ? "0" + data.getSeconds() : data.getSeconds()
    orario[1].firstChild.nodeValue = (data.getMinutes() < 10) ? "0" + data.getMinutes() : data.getMinutes()
    orario[0].firstChild.nodeValue = (data.getHours() < 10) ? "0" + data.getHours() : data.getHours()

    giornata[3].firstChild.nodeValue = data.getFullYear()
    giornata[2].firstChild.nodeValue = MESI[data.getMonth()]
    giornata[1].firstChild.nodeValue = (data.getDate() < 10) ? "0" + data.getDate() : data.getDate()
    giornata[0].firstChild.nodeValue = GIORNI_SETTIMANALI[data.getDay()]
}

/*Event listener per il bottone che aggiunge i pensieri:
    - Crea un div
    - Ci inserisce gli input per inserire titolo e contenuto del pensiero e i bottoni "Add" e "Cancel"
*/
aggiungiPost.addEventListener("click", function() {
    newDiv = document.createElement("div")
    newDiv.id = "aggiungiDiv"

    newDiv.innerHTML = `<textarea id="titoloAggiungi" maxlength = "34" placeholder="Titolo"></textarea>
                        <textarea id="contenutoAggiungi" maxlength = "170" placeholder="Contenuto"></textarea><br>
                        <button id="postAggiunto" onclick="aggiungiPensiero()">Add</button>
                        <button id="annulla" onclick="esciDaAggiungi()">Cancel</button>`

    grandeDiv.style.display = "block"
    grandeDiv.appendChild(newDiv)
})

/*Il suo scopo è quello di uscire dal pop up che si crea quando si aggiunge o si legge un pensiero*/
function esciDaAggiungi() {
    const element = document.getElementById("aggiungiDiv")
    element.remove()

    grandeDiv.style.display = "none"
}

/*Questa funzione viene richiamata per stampare i pensieri, quindi quando se ne aggiunge o se ne toglie uno:
    - Esegue un ciclo "for" passando tutti i nodi con il tag <pensiero> e li stampa nel div apposito
*/
function aggiornaPensieri() {
    var pensieriXml = xmlContent.getElementsByTagName("pensiero")
    pensieri.innerHTML = ""

    for(i = 0; i < pensieriXml.length; i++) {
        pensieri.innerHTML += `<div id="singoloPensiero" onclick="leggiPensiero(${i})"> PENSIERO DELLE
            <p id = "giornoPensiero">${pensieriXml[i].getAttribute("giornoSet") + " " + pensieriXml[i].getAttribute("giorno") + " " 
                + pensieriXml[i].getAttribute("mese") + " " + pensieriXml[i].getAttribute("anno")}</p>
            <p id = "oraPensiero">${pensieriXml[i].getAttribute("ora") + ":" + pensieriXml[i].getAttribute("minuto") + ":"
                + pensieriXml[i].getAttribute("secondo")}</p>
        </div>`
    }
}

/*Va ad inserire nel file xml come figlio di "<pensieri>" un nuovo nodo che avrà come attributi:
    - Contenuto (il contenuto del pensiero)
    - Titolo (il titolo del pensiero)
    - GiornoSet (il giorno della settimana in cui è stato creato il pensiero)
    - Giorno (il numero del mese in cui è stato creato il pensiero)
    - Mese (il mese in cui è stato creato il pensiero)
    - Anno (l'anno in cui è stato creato il pensiero)
    - Ora (l'ora in cui è stato creato il pensiero)
    - Minuto (il minuto in cui è stato creato il pensiero)
    - Secondo (il secondo in cui è stato creato il pensiero)
    - Infine esce dal pop up e va ad aggiornare la sezione dei pensieri stampati
*/
function aggiungiPensiero() {
    orario = xmlContent.getElementsByTagName("datoOra")
    giornata = xmlContent.getElementsByTagName("datoGiorno")

    titolo = document.getElementById("titoloAggiungi").value
    contenuto = document.getElementById("contenutoAggiungi").value

    ora = orario[0].firstChild.nodeValue
    minuto = orario[1].firstChild.nodeValue
    secondo = orario[2].firstChild.nodeValue
    giornoSettimana = giornata[0].firstChild.nodeValue
    giorno = giornata[1].firstChild.nodeValue
    mese = giornata[2].firstChild.nodeValue
    anno = giornata[3].firstChild.nodeValue

    nuovoNodo = xmlContent.createElement("pensiero")
    nuovoNodo.setAttribute("contenuto", contenuto)
    nuovoNodo.setAttribute("titolo", titolo)
    nuovoNodo.setAttribute("giornoSet", giornoSettimana.substring(0, 3) + ",")
    nuovoNodo.setAttribute("giorno", giorno)
    nuovoNodo.setAttribute("mese", mese)
    nuovoNodo.setAttribute("anno", anno)
    nuovoNodo.setAttribute("ora", ora)
    nuovoNodo.setAttribute("minuto", minuto)
    nuovoNodo.setAttribute("secondo", secondo)

    xmlContent.getElementsByTagName("pensieri")[0].appendChild(nuovoNodo)

    esciDaAggiungi()
    aggiornaPensieri()
    console.log(xmlContent)
}

/*Funzione richiamata per quando vuoi leggere un pensiero già scritto
    - Viene creato un div
    - Si aggiungono poi tutti gli attributi del nodo con i pulsanti "Cancel" e "Delete"
*/
function leggiPensiero(i) {
    newDiv = document.createElement("div")
    newDiv.id = "aggiungiDiv"

    newDiv.innerHTML = `
        <div class="tempoPensiero">
            <p id = "giornoPensiero" style="font-size: 1.5vh; text-align: center">${pensieriXml[i].getAttribute("giornoSet") + " " + pensieriXml[i].getAttribute("giorno") + " " 
                + pensieriXml[i].getAttribute("mese") + " " + pensieriXml[i].getAttribute("anno")}</p>
            <p id = "oraPensiero" style="font-size: 5vh; text-align: center">${pensieriXml[i].getAttribute("ora") + ":" + pensieriXml[i].getAttribute("minuto") + ":"
                + pensieriXml[i].getAttribute("secondo")}</p>
        </div>

        <div class="contenutoPensiero">
            <p style="font-size: 2.5vh">${pensieriXml[i].getAttribute("titolo")}</p><br><hr><br><p style="font-size: 2vh">${pensieriXml[i].getAttribute("contenuto")}</p>
            <button id="annulla" onclick="esciDaAggiungi()">Cancel</button>
            <button id="postAggiunto" onclick="eliminaPensiero(${i})">Delete</button>
        </div>`

    grandeDiv.style.display = "block"
    grandeDiv.appendChild(newDiv)
}

/*Funzione richiamata per eliminare un pensiero:
    - Gli viene passato come parametro l'indice identificativo del nodo
    - Si elimina quel nodo dal nodoGenitore <pensieri>
    - Infine si esce dal pop up e si aggiornano i pensieri stampati
*/
function eliminaPensiero(i) {
    var pensieroEliminato = xmlContent.getElementsByTagName("pensiero")[i]

    pensieroEliminato.parentNode.removeChild(pensieroEliminato)

    esciDaAggiungi()
    aggiornaPensieri()
}

function mostraDettagli(i) {
    if(dettagli[i].offsetHeight == 0) {
        dettaglibtn[i].style.borderBottomRightRadius = 0
        dettaglibtn[i].style.borderBottomLeftRadius = 0
        dettagli[i].style.transition = .8 + "s"
        dettagli[i].style.height = 83 + "%"
        scritte[i].style.display = "block"
    } else {
        dettaglibtn[i].style.borderBottomRightRadius = 20 + "px"
        dettaglibtn[i].style.borderBottomLeftRadius = 20 + "px"
        dettagli[i].style.transition = 0 + "s"
        dettagli[i].style.height = 0
        scritte[i].style.display = "none"
    }
}