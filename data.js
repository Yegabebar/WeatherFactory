const currentStatus = document.getElementById("currentStatus");
const currentWeatherIcon = document.getElementById("currentWeatherIcon");
const nextHours = document.getElementById("nextHours");
const sevenDays = document.getElementById("sevenDays");

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
    let dt = new Date(t * 1000);
    let hr = dt.getHours();
    return hr;
}

function getIcon(weather) {

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

async function getCityName(position) {
    //Constrution de l'URL pour appel API et récupération nom ville
    let url = 'https://api.openweathermap.org/data/2.5/weather?lat='
        + position.coords.latitude + '&lon='
        + position.coords.longitude + '&appid=bea2c2ef5da3e6bbecace5807f66ff95&units=metric';
    
    //Récupération résultat de fonction asynchrone
    let data = await getResponse(url);
    let {name} = data;
    return name;

}

function getDay(t) {
    let dt = new Date(t * 1000);
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
    const titreVille = await getCityName(position);
    //Constrution de l'URL pour appel API
    const url = 'https://api.openweathermap.org/data/2.5/onecall?lat='
        + position.coords.latitude + '&lon='
        + position.coords.longitude + '&exclude=minutely,alerts&appid=bea2c2ef5da3e6bbecace5807f66ff95&units=metric';
    
    const data = await getResponse(url);
    
    //Vidage de la div de la page HTML où seront insérées les données
    //Pour éviter l'empilement de données dans les div
    currentStatus.innerHTML = "";
    currentWeatherIcon.innerHTML = "";

    //Variables issues de la réponse JSON
    const {current} = data;
    const temp = current["temp"];
    const weather = current["weather"]["0"]["main"];

    //Création du div principal
    const divDayInfo = document.createElement("div");
    //Création des sous-div
    const imageMeteo = document.createElement("img");
    const nomVille = document.createElement("div");
    const temperature = document.createElement("div");
    const descImageMeteo = document.createElement("div");
    

    //ajout de l'icone correspondant à la description du temps
    const iconPath = getIcon(weather);

    //Ecriture de valeurs dans chaque sous-div
    //imageMeteo.innerHTML = '<img id = "mainImage" src ="' + iconPath + '" alt = " ' + weather + '" />';
    imageMeteo.setAttribute('src', iconPath);
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
    currentWeatherIcon.appendChild(imageMeteo);
    //currentWeatherIcon.textContent = "zergerg";
    currentStatus.append(divDayInfo);

}

async function get3Hours(position) {
    //Constrution de l'URL pour appel API
    const url = 'https://api.openweathermap.org/data/2.5/onecall?lat='
        + position.coords.latitude + '&lon='
        + position.coords.longitude + '&exclude=minutely,alerts&appid=bea2c2ef5da3e6bbecace5807f66ff95&units=metric';
    
    //Récupération résultat de fonction asynchrone
    const data = await getResponse(url);
    //Récupération des valeurs dans la réponse JSON
    const {hourly} = data;


    //Vidage de la div de la page HTML où seront insérées les données
    nextHours.innerHTML = "";

    for (i = 1; i <= 21; i = i + 3) {
        //Définition variables timestamp et température
        time = hourly[i]["dt"];
        let temp = hourly[i]["temp"];

        //Transformation du timestamp en valeur lisible
        let heure = unixTimeStampToHour(time);

        //Création du div principal
        let creneau = document.createElement("div");
        //Création des sous-div
        let creneauH = document.createElement("div");
        let creneauT = document.createElement("div");

        //Ecriture de valeurs dans chaque sous-div
        creneauH.innerHTML = "<div class='flexItem'>" + heure + "h </div>";
        creneauT.innerHTML = "<div class='flexItem'>" + Math.floor(temp) + "°C </div>";
        
        //Insertion de chaque sous-div dans le div principal
        creneau.innerHTML = creneauH.innerHTML;
        creneau.innerHTML += creneauT.innerHTML;

        //Ajout du div principal dans la page HTML
        nextHours.append(creneau);
    }
    
}

async function get7Days(position) {

    const url = 'https://api.openweathermap.org/data/2.5/onecall?lat='
        + position.coords.latitude + '&lon='
        + position.coords.longitude + '&exclude=minutely,alerts&appid=bea2c2ef5da3e6bbecace5807f66ff95&units=metric';
    
    //Récupération résultat de fonction asynchrone
    data = await getResponse(url);
    //Récupération des valeurs dans la réponse JSON
    const {daily} = data;
    //Vidage de la div de la page HTML où seront insérées les données
    sevenDays.innerHTML = "";
    
    for (i = 0; i <= 6; i++) {        
        let day = getDay(daily[i]["dt"]);
        let temp = daily[i]["temp"]["day"];
        let description = daily[i]["weather"]["0"]["main"];
        let iconPath = getIcon(description);

        //Création du div principal
        let dayDiv = document.createElement("div"); 
        //Création des sous-div
        let dayIcon = document.createElement("img");
        let dayName = document.createElement("div");        
        let dayTemp = document.createElement("div");

        //Ecriture de valeurs dans chaque sous-div
        dayName.innerHTML = "<div class='flexItem'>" + day + "</div>";         
        dayTemp.innerHTML = "<div class='flexItem'>" + Math.floor(temp) + "°C </div>";
        dayIcon.setAttribute('class', 'smallImg');
        dayIcon.setAttribute('src', iconPath);
        dayIcon.setAttribute('alt', description);
        //dayIcon.innerHTML = '<img class = "smallImg" src ="' + iconPath + '" alt = " ' + description + '" />';

        //Insertion de chaque sous-div dans le div principal
        dayDiv.innerHTML = dayName.innerHTML;
        dayDiv.innerHTML += dayTemp.innerHTML;
        dayDiv.appendChild(dayIcon);
        
        //Ajout du div principal dans la page HTML
        sevenDays.append(dayDiv);

    }
}

if ("geolocation" in navigator) {
    navigator.geolocation.watchPosition((position) => {
        //Lancement du script dès acceptation partage de position par l'utilisateur
        getDailyWeather(position);
        get3Hours(position);
        get7Days(position);
    });
}