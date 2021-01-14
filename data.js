var blockInfo = document.getElementById("blockInfo");
var illustration = document.getElementById("illustration");
var jourCourant = document.getElementById("jourCourant");
var semaine = document.getElementById("semaine");


async function recupMeteoJour(position) {

    var titreVille = await recupVille(position);

    let url = 'https://api.openweathermap.org/data/2.5/onecall?lat='
        + position.coords.latitude + '&lon='
        + position.coords.longitude + '&exclude=minutely,alerts&appid=bea2c2ef5da3e6bbecace5807f66ff95&units=metric';

    const response = await fetch(url);
    if (response.status != 200) {
        console.log("catch api pas bon");
    } else {

        const data = await response.json();

        let { current } = data;

        let temp = current["temp"];
        let weather = current["weather"]["0"]["main"];

        let temperature = document.createElement("p");
        let descriptionImageMeteo = document.createElement("p");
        let nomVille = document.createElement("p");
        let imageMeteo = document.createElement("img");

        //ajout de l'icone correspondant à la description du temps
        let pathIcon = iconWeather(weather);
        imageMeteo.innerHTML = '<img id = "mainImage" src ="' + pathIcon + '" alt = " ' + weather + '" />';
        illustration.innerHTML = imageMeteo.innerHTML;

        //ajout du nom de la ville
        nomVille.textContent = titreVille;
        blockInfo.innerHTML = nomVille.innerHTML;

        //ajout de la température
        temperature.textContent = Math.floor(temp) + "°C";
        blockInfo.innerHTML += temperature.innerHTML;

        //ajout de la description de la météo
        descriptionImageMeteo.textContent = weather;
        blockInfo.innerHTML += descriptionImageMeteo.innerHTML;

    }

}

function iconWeather(weather) {

    let icon = "";

    switch (weather) {
        case "Clear": icon = "./ressources/svg/001-sunny.svg";
            break;
        case "Clouds": icon = "./ressources/svg/020-cloudy.svg";
            break;
        case "Rain": icon = "./ressources/svg/004-rain.svg";
            break;
        case "Thunderstorm": icon = "./ressources/svg/021-thunderstorm.svg";
            break;
        case "Snow": icon = "./ressources/svg/007-snow.svg";
            break;
        case "Mist": icon = "./ressources/svg/019-fog.svg";
            break;
        case "Drizzle": icon = "./ressources/svg/026-umbrella.svg";
            break;
        case "Fog": icon = icon = "./ressources/svg/019-fog.svg";
            break;
    }

    console.log(icon);

    return icon;
}

async function recupVille(position) {

    let url = 'https://api.openweathermap.org/data/2.5/weather?lat='
        + position.coords.latitude + '&lon='
        + position.coords.longitude + '&appid=bea2c2ef5da3e6bbecace5807f66ff95&units=metric';

    const response = await fetch(url);

    if (response.status != 200) {
        console.log("catch api pas bon");
    } else {

        const data = await response.json();

        let { name } = data;

        console.log("ville : " + name);

        return name;

    }
}

async function recup3Heures(position) {

    let url = 'https://api.openweathermap.org/data/2.5/onecall?lat='
        + position.coords.latitude + '&lon='
        + position.coords.longitude + '&exclude=minutely,alerts&appid=bea2c2ef5da3e6bbecace5807f66ff95&units=metric';

    const response = await fetch(url);

    if (response.status != 200) {
        console.log("catch api pas bon");
    } else {

        const data = await response.json();

        let { hourly } = data;
        let { temp } = data;

        jourCourant.innerHTML = "";

        for (i = 1; i <= 21; i = i + 3) {

            var creneau = document.createElement("div");
            var creneauH = document.createElement("div");
            var creneauT = document.createElement("div");
    

            time = hourly[i]["dt"];
            temp = hourly[i]["temp"];
            var heure = convertUnix(time);

            creneauH.innerHTML = "<div>" + heure + "h </div>";
            
            creneauT.innerHTML = "<div>" + Math.floor(temp) + "°C </div>";

            creneau.innerHTML = creneauH.innerHTML;
            creneau.innerHTML += creneauT.innerHTML;
            
            jourCourant.append(creneau);

            console.log("3 heures : " + heure);
            console.log("3 heures : " + temp);

        }
    }
}

function convertUnix(t) {
    var dt = new Date(t * 1000);
    var hr = dt.getHours();
    return hr;
}

function getDay(t) {
    var dt = new Date(t * 1000);
    var day = dt.getDay();

    switch (day) {
        case 0: day = "Lun";
            break;
        case 1: day = "Mar";
            break;
        case 2: day = "Mer";
            break;
        case 3: day = "Jeu";
            break;
        case 4: day = "Ven";
            break;
        case 5: day = "Sam";
            break;
        case 6: day = "Dim";
            break;
    }
    return day;

}

async function recup7Jours(position) {

    let url = 'https://api.openweathermap.org/data/2.5/onecall?lat='
        + position.coords.latitude + '&lon='
        + position.coords.longitude + '&exclude=minutely,alerts&appid=bea2c2ef5da3e6bbecace5807f66ff95&units=metric';

    const response = await fetch(url);

    if (response.status != 200) {
        console.log("catch api pas bon");
    } else {

        const data = await response.json();
        let { daily } = data;

        semaine.innerHTML = "";


        for (i = 0; i <= 6; i++) {

            console.log(i);

            let pathIcon = iconWeather(description);

            var jourIcon = document.createElement("img");
            var jour = document.createElement("div"); 
            var jourJ = document.createElement("div");        
            var jourT = document.createElement("div");
            
    

            var day = daily[i]["dt"];
            var temp = daily[i]["temp"]["day"];
            var description = daily[i]["weather"]["0"]["main"];

            day = getDay(day);

            console.log(pathIcon);

            jourJ.innerHTML = "<div>" + day + "</div>";         
            jourT.innerHTML = "<div>" + Math.floor(temp) + "°C </div>";
            jourIcon.innerHTML = '<img class = "smallImg" src ="' + pathIcon + '" alt = " ' + description + '" />';

            jour.innerHTML = jourJ.innerHTML;
            jour.innerHTML += jourT.innerHTML;
            jour.innerHTML += jourIcon.innerHTML;
            
            semaine.append(jour);

            console.log("7 jours : jours" + day);
            console.log("7 jours : température" + temp);
            console.log("7 jours : description météo" + description);

        }
    }
}


let villeChoisie;

if ("geolocation" in navigator) {
    navigator.geolocation.watchPosition((position) => {

        recupMeteoJour(position);
        recup3Heures(position);
        recup7Jours(position);

    }, erreur, options);

    var options = {
        enableHighAccuracy: true
    }
}
else {
    villeChoisie = "Paris";
    recevoirTemperature(villeChoisie);
}



function erreur() {
    villeChoisie = "Paris";
    recevoirTemperature(villeChoisie);
}

function recevoirTemperature(ville) {
    const url = 'https://api.openweathermap.org/data/2.5/weather?q=Paris&appid=dc8c9152e8adaad0ec8bf635818c0d42&units=metric';

    let requete = new XMLHttpRequest(); // Nous créons un objet qui nous permettra de faire des requêtes
    requete.open('GET', url); // Nous récupérons juste des données
    requete.responseType = 'json'; // Nous attendons du JSON
    requete.send(); // Nous envoyons notre requête

    // Dès qu'on reçoit une réponse, cette fonction est executée
    requete.onload = function () {
        if (requete.readyState === XMLHttpRequest.DONE) {
            if (requete.status === 200) {
                let reponse = requete.response;
                // console.log(reponse);
                let temperature = reponse.main.temp;
                let ville = reponse.name;
                // console.log(temperature);
                document.querySelector('#temperature_label').textContent = temperature;
                document.querySelector('#ville').textContent = ville;
            }
            else {
                alert('Un problème est intervenu, merci de revenir plus tard.');
            }
        }
    }
}

