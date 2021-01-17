const blockInfo = document.getElementById("blockInfo");
const illustration = document.getElementById("illustration");
const jourCourant = document.getElementById("jourCourant");
const semaine = document.getElementById("semaine");

async function getResponse(url) {
    const response = await fetch(url);
    if (response.status != 200) {
        alert("Try again later");
    } else {
        var data = await response.json();
        return data;
    }
}

function unixTimeStampToHour(t) {
    var dt = new Date(t * 1000);
    var hr = dt.getHours();
    return hr;
}

function iconWeather(weather) {

    //Correspondance path image locale avec String donnée en paramètre de fonction
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
        case "Fog": icon = "./ressources/svg/019-fog.svg";
            break;
    }

    return icon;
}

function getDay(t) {
    var dt = new Date(t * 1000);
    //Récupération numéro de jour
    let day = dt.getDay();
    //Correspondance numéro de jour avec nom jour pour affichage ultérieur
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

async function getDailyWeather(position) {
    //Récupération du nom de la ville pour affichage
    var titreVille = await getCityName(position);
    //Constrution de l'URL pour appel API
    let url = 'https://api.openweathermap.org/data/2.5/onecall?lat='
        + position.coords.latitude + '&lon='
        + position.coords.longitude + '&exclude=minutely,alerts&appid=bea2c2ef5da3e6bbecace5807f66ff95&units=metric';
    
    let data = await getResponse(url);
    
    //Vidage de la div de la page HTML où seront insérées les données
    //Pour éviter l'empilement de données dans les div
    blockInfo.innerHTML = "";
    illustration.innerHTML = "";

    //Variables issues de la réponse JSON
    let { current } = data;
    let temp = current["temp"];
    let weather = current["weather"]["0"]["main"];

    //Création du div principal
    const divDayInfo = document.createElement("div");
    //Création des sous-div
    const imageMeteo = document.createElement("img");
    const nomVille = document.createElement("div");
    const temperature = document.createElement("div");
    const descImageMeteo = document.createElement("div");
    

    //ajout de l'icone correspondant à la description du temps
    const pathIcon = iconWeather(weather);

    //Ecriture de valeurs dans chaque sous-div
    //imageMeteo.innerHTML = '<img id = "mainImage" src ="' + pathIcon + '" alt = " ' + weather + '" />';
    imageMeteo.setAttribute('src', pathIcon);
    imageMeteo.setAttribute('alt', weather);
    imageMeteo.setAttribute('id', 'mainImage');
    nomVille.innerHTML = '<div id="flexItem">'+titreVille+'</div>';
    temperature.innerHTML = '<div id="flexItem">'+Math.floor(temp) + '°C</div>';
    descImageMeteo.innerHTML = '<div id="flexItem">'+weather+'</div>';

    //Insertion de chaque sous-div dans le div principal
    divDayInfo.innerHTML = nomVille.innerHTML;
    divDayInfo.innerHTML += temperature.innerHTML;
    divDayInfo.innerHTML += descImageMeteo.innerHTML;

    //Ajout du div principal dans la page HTML
    illustration.appendChild(imageMeteo);
    //illustration.textContent = "zergerg";
    blockInfo.append(divDayInfo);

}

async function getCityName(position) {
    //Constrution de l'URL pour appel API et récupération nom ville
    let url = 'https://api.openweathermap.org/data/2.5/weather?lat='
        + position.coords.latitude + '&lon='
        + position.coords.longitude + '&appid=bea2c2ef5da3e6bbecace5807f66ff95&units=metric';
    
    //Récupération résultat de fonction asynchrone
    let data = await getResponse(url);
    let { name } = data;
    return name;

}

async function recup3Heures(position) {
    //Constrution de l'URL pour appel API
    let url = 'https://api.openweathermap.org/data/2.5/onecall?lat='
        + position.coords.latitude + '&lon='
        + position.coords.longitude + '&exclude=minutely,alerts&appid=bea2c2ef5da3e6bbecace5807f66ff95&units=metric';
    
    //Récupération résultat de fonction asynchrone
    data = await getResponse(url);
    //Récupération des valeurs dans la réponse JSON
    let {hourly, temp} = data;


    //Vidage de la div de la page HTML où seront insérées les données
    jourCourant.innerHTML = "";

    for (i = 1; i <= 21; i = i + 3) {
        //Définition variables timestamp et température
        time = hourly[i]["dt"];
        temp = hourly[i]["temp"];

        //Transformation du timestamp en valeur lisible
        const heure = unixTimeStampToHour(time);

        //Création du div principal
        const creneau = document.createElement("div");
        //Création des sous-div
        const creneauH = document.createElement("div");
        const creneauT = document.createElement("div");

        //Ecriture de valeurs dans chaque sous-div
        creneauH.innerHTML = "<div class='flexItem'>" + heure + "h </div>";
        creneauT.innerHTML = "<div class='flexItem'>" + Math.floor(temp) + "°C </div>";
        
        //Insertion de chaque sous-div dans le div principal
        creneau.innerHTML = creneauH.innerHTML;
        creneau.innerHTML += creneauT.innerHTML;

        //Ajout du div principal dans la page HTML
        jourCourant.append(creneau);
    }
    
}

async function recup7Jours(position) {

    let url = 'https://api.openweathermap.org/data/2.5/onecall?lat='
        + position.coords.latitude + '&lon='
        + position.coords.longitude + '&exclude=minutely,alerts&appid=bea2c2ef5da3e6bbecace5807f66ff95&units=metric';
    
    //Récupération résultat de fonction asynchrone
    data = await getResponse(url);
    //Récupération des valeurs dans la réponse JSON
    let {daily} = data;
    //Vidage de la div de la page HTML où seront insérées les données
    semaine.innerHTML = "";
    var icon;
    for (i = 0; i <= 6; i++) {

        let pathIcon = iconWeather(description);
        var day = daily[i]["dt"];
        day = getDay(day);
        var temp = daily[i]["temp"]["day"];
        var description = daily[i]["weather"]["0"]["main"];
        
        //Création du div principal
        var jour = document.createElement("div"); 
        //Création des sous-div
        var jourIcon = document.createElement("img");
        var jourJ = document.createElement("div");        
        var jourT = document.createElement("div");
        
        console.log('Debug: '+pathIcon);

        //Ecriture de valeurs dans chaque sous-div
        jourJ.innerHTML = "<div class='flexItem'>" + day + "</div>";         
        jourT.innerHTML = "<div class='flexItem'>" + Math.floor(temp) + "°C </div>";
        jourIcon.setAttribute('class', 'smallImg');
        jourIcon.setAttribute('src', pathIcon);
        jourIcon.setAttribute('alt', description);
        //jourIcon.innerHTML = '<img class = "smallImg" src ="' + pathIcon + '" alt = " ' + description + '" />';

        //Insertion de chaque sous-div dans le div principal
        jour.innerHTML = jourJ.innerHTML;
        jour.innerHTML += jourT.innerHTML;
        jour.appendChild(jourIcon);
        
        //Ajout du div principal dans la page HTML
        semaine.append(jour);

    }
}

if ("geolocation" in navigator) {
    navigator.geolocation.watchPosition((position) => {
        var data;
        //Lancement du script dès acceptation partage de position par l'utilisateur
        getDailyWeather(position);
        recup3Heures(position);
        recup7Jours(position);
    });
}