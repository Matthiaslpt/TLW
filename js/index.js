// Fonction pour obtenir l'heure actuelle en millisecondes, ajustée d'une heure en arrière
function getHours() {
  // Crée une nouvelle instance de l'objet Date représentant l'instant actuel
  const now = new Date();

  // Convertit le temps actuel en millisecondes et soustrait une heure (3600000 millisecondes)
  const timeInMillis = Number(now.getTime()) - 3600000;

  // Retourne le temps ajusté
  return timeInMillis;
}

// Fonction asynchrone pour récupérer les données météorologiques d'une ville
async function weather_API(city) {
  try {
    // Effectue une requête pour obtenir les coordonnées géographiques de la ville
    var fetchResult = await fetch(
      "http://api.openweathermap.org/geo/1.0/direct?q=" +
        city +
        "&appid=" +
        API_KEY
    );
    // Récupère les données de la ville à partir du résultat de la requête
    var city_data = await fetchResult.json();

    // Effectue une requête pour obtenir les données météorologiques actuelles de la ville
    var fetch_weather = await fetch(
      "https://api.openweathermap.org/data/2.5/weather?lat=" +
        city_data[0].lat +
        "&lon=" +
        city_data[0].lon +
        "&appid=" +
        API_KEY
    );

    // Récupère les données météorologiques à partir du résultat de la deuxième requête
    var city_weather_data = await fetch_weather.json();

    // Calcule le temps actuel en fonction du fuseau horaire de la ville
    const timeInMillis = getHours() + 1000 * city_weather_data.timezone;

    // Récupère l'heure actuelle au format "hh:mm"
    const hour = new Date(timeInMillis).toLocaleTimeString();

    // Met à jour le contenu de l'élément HTML avec les informations météorologiques
    document.querySelector("#info_" + city).innerHTML = `${Math.round(
      city_weather_data.main.temp - 273.15
    )}°C <br>${hour.slice(0, 5)}`;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des données météorologiques :",
      error
    );
  }
}

// Fonction asynchrone pour afficher les voyages
async function affichageVoyages() {
  // Attend que la fonction create_dest() soit terminée avant de continuer
  await create_dest();

  // Sélectionne le template avec l'ID "Destination" dans le document HTML
  let template = document.querySelector("#Destination");

  // Parcourt la liste des destinations
  for (const dest of listeDestinations) {
    // Clone le contenu du template
    let clone = document.importNode(template.content, true);

    // Remplace "{{destination}}" par le nom de la destination dans le titre h1
    let newContent = clone
      .querySelector("h1")
      .innerHTML.replace(/{{destination}}/g, dest._nom);

    // Met à jour le contenu du titre h1 avec le nouveau contenu
    clone.querySelector("h1").innerHTML = newContent;

    // Définit l'ID du titre h2 avec "info_nomDestination"
    clone.querySelector("h2").id = `info_${dest._nom}`;

    // Récupère les informations météorologiques pour la destination et met à jour le contenu
    weather_API(dest._nom);

    // Définit l'ID de la div avec le nom de la destination
    clone.querySelector("div").id = dest._nom;

    // Définit l'image de fond de la div avec le lien de la destination
    clone.querySelector("div").style.backgroundImage = dest._lien;

    // Définit le lien de la balise <a> pour rediriger vers la page de réservation avec l'ID de la destination
    clone.querySelector("a").href = `reservation.html?id=${dest._id}`;

    // Définit l'ID de la balise <a> avec "nomDestination-case"
    clone.querySelector("a").id = dest._nom + "-case";

    // Ajoute le clone au contenu de la page
    document.querySelector("#contenu").appendChild(clone);
  }
}

// Fonction pour gérer le slider de prix
function slider() {
  // Récupère les éléments du DOM liés au slider et à l'affichage de la valeur du slider
  var slider = document.querySelector("#price");
  var output = document.querySelector("#price-value");

  // Vérifie si la valeur du slider est égale à zéro
  if (slider.value == "0") {
    // Affiche "Aucun" si la valeur est zéro
    output.innerHTML = "Aucun";
  } else {
    // Affiche la valeur actuelle du slider
    output.innerHTML = slider.value + "€";

    // Met en place un gestionnaire d'événements pour mettre à jour l'affichage en temps réel lorsque la valeur du slider change
    slider.oninput = function () {
      output.innerHTML = this.value + "€";
    };
  }
}

// Fonction pour filtrer les destinations en fonction des critères spécifiés
function filtrer() {
  // Parcourt la liste des destinations
  for (const ville of listeDestinations) {
    // Vérifie si la valeur du slider de prix est égale à zéro
    if (document.querySelector("#price").value == 0) {
      // Vérifie les filtres liés aux enfants et aux animaux
      if (
        (document.querySelector("#f-enfants").checked &&
          !ville._filtre.includes("child")) ||
        (document.querySelector("#f-animaux").checked &&
          !ville._filtre.includes("pet"))
      ) {
        // Masque la case de destination si les critères ne sont pas satisfaits
        document.querySelector(`#${ville._nom}-case`).style.display = "none";
      } else {
        // Affiche la case de destination si les critères sont satisfaits
        document.querySelector(`#${ville._nom}-case`).style.display = "block";
      }
    } else if (document.querySelector("#price").value < ville._prix) {
      // Masque la case de destination si le prix de la destination est supérieur à la valeur du slider
      document.querySelector(`#${ville._nom}-case`).style.display = "none";
    } else {
      // Vérifie les filtres liés aux enfants et aux animaux
      if (
        (document.querySelector("#f-enfants").checked &&
          !ville._filtre.includes("child")) ||
        (document.querySelector("#f-animaux").checked &&
          !ville._filtre.includes("pet"))
      ) {
        // Masque la case de destination si les critères ne sont pas satisfaits
        document.querySelector(`#${ville._nom}-case`).style.display = "none";
      } else {
        // Affiche la case de destination si les critères sont satisfaits
        document.querySelector(`#${ville._nom}-case`).style.display = "block";
      }
    }
  }
}

var ScrollDisplay = function () {
  var y = window.scrollY;
  var logo_bis = document.querySelector("#logo_bis");
  var logo = document.querySelector("#logo");
  if (y >= 200 && dir_logo === "reverse") {
    dir_logo = "normal";
    logo_bis.classList.toggle("slideIn");
    logo.classList.toggle("slideOut");
  } else if (y <= 200 && dir_logo === "normal") {
    dir_logo = "reverse";
    logo_bis.classList.toggle("slideIn");
    logo.classList.toggle("slideOut");
  }
};

var dir_logo = "reverse";
window.addEventListener("scroll", ScrollDisplay);
