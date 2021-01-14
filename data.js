var blockInfo = document.getElementById("blockInfo");
var illustration = document.getElementById("illustration");
var jourCourant = document.getElementById("jourCourant");
var semaine = document.getElementById("semaine");


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

async function recupMeteoJour(position) {

    var titreVille = await recupVille(position);

    let url = 'https://api.openweathermap.org/data/2.5/onecall?lat='
        + position.coords.latitude + '&lon='
        + position.coords.longitude + '&exclude=minutely,alerts&appid=bea2c2ef5da3e6bbecace5807f66ff95&units=metric';

    const response = await fetch(url);
    if (response.status != 200) {
        console.log("catch api pas bon");
    } else {
        blockInfo.innerHTML = "";
        //Variables issues de la réponse JSON
        const data = await response.json();
        let { current } = data;
        let temp = current["temp"];
        let weather = current["weather"]["0"]["main"];

        //Création du div principal
        let divDayInfo = document.createElement("div");
        //Création des sous-div
        let imageMeteo = document.createElement("img");
        let nomVille = document.createElement("div");
        let temperature = document.createElement("div");
        let descImageMeteo = document.createElement("div");
        

        //ajout de l'icone correspondant à la description du temps
        let pathIcon = iconWeather(weather);

        //Ecriture de valeurs dans chaque sous-div
        imageMeteo.innerHTML = '<img id = "mainImage" src ="' + pathIcon + '" alt = " ' + weather + '" />';
        nomVille.innerHTML = '<div id="flexItem">'+titreVille+'</div>';
        temperature.innerHTML = '<div id="flexItem">'+Math.floor(temp) + '°C</div>';
        descImageMeteo.innerHTML = '<div id="flexItem">'+weather+'</div>';

        //Insertion de chaque sous-div dans le div principal
        divDayInfo.innerHTML = nomVille.innerHTML;
        divDayInfo.innerHTML += temperature.innerHTML;
        divDayInfo.innerHTML += descImageMeteo.innerHTML;

        console.log(divDayInfo.innerHTML);
        //Ajout du div principal dans la page HTML
        illustration.innerHTML = imageMeteo.innerHTML;
        blockInfo.append(divDayInfo);

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

            creneauH.innerHTML = "<div class='flexItem'>" + heure + "h </div>";
            
            creneauT.innerHTML = "<div class='flexItem'>" + Math.floor(temp) + "°C </div>";

            creneau.innerHTML = creneauH.innerHTML;
            creneau.innerHTML += creneauT.innerHTML;
            
            jourCourant.append(creneau);

            console.log("3 heures : " + heure);
            console.log("3 heures : " + temp);

        }
    }
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

            jourJ.innerHTML = "<div class='flexItem'>" + day + "</div>";         
            jourT.innerHTML = "<div class='flexItem'>" + Math.floor(temp) + "°C </div>";
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

if ("geolocation" in navigator) {
    navigator.geolocation.watchPosition((position) => {
        recupMeteoJour(position);
        recup3Heures(position);
        recup7Jours(position);
    });
}
