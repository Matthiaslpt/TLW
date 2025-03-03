// Fonction pour initialiser la page
function init_page() {
  var spanUser = document.createElement("span");
  spanUser.id = "user";
  var loginLink = document.createElement("a");
  loginLink.href = "login.html";

  var img_user = document.createElement("img");
  img_user.src = "../images/user.png";
  img_user.alt = "Connexion";

  img_user.height = "50";
  spanUser.appendChild(loginLink);
  loginLink.appendChild(img_user);

  if (localStorage.hasOwnProperty("user")) {
    spanUser.innerHTML = localStorage.getItem("user");
    var logOut = document.createElement("input");
    logOut.type = "button";
    logOut.id = "logOut";
    logOut.value = "X";
    logOut.setAttribute("onclick", "log_out()");
    spanUser.appendChild(loginLink);
    spanUser.appendChild(logOut);
    spanUser.style.left = "90%";
    loginLink.href = "#";
  }

  // Création d'un lien vers la page d'accueil avec le logo
  var logo = document.createElement("a");
  logo.href = "index.html";
  // Création de l'image du logo
  var img = document.createElement("img");
  img.src = "../images/logo.png";
  img.alt = "Cool Guys Voyage";
  img.id = "logo";
  img.height = "200";

  // Ajout de l'image au lien du logo
  logo.appendChild(img);

  // Ajout du logo à l'entête de la page
  document.querySelector("#entete").appendChild(spanUser);
  document.querySelector("#entete").appendChild(logo);

  // Création d'un lien vers la page d'accueil dans le pied de page
  var accueil = document.createElement("a");
  accueil.href = "index.html";
  accueil.innerHTML = "Accueil";
  document.querySelector("footer").appendChild(accueil);

  // Création d'un lien vers la page de contact dans le pied de page
  var contact = document.createElement("a");
  contact.href = "contact.html";
  contact.innerHTML = "A propos & contact";
  document.querySelector("footer").appendChild(contact);

  // Création d'un lien vers la page du panier dans le pied de page
  var panier = document.createElement("a");
  panier.href = "panier.html";
  panier.innerHTML = "Panier";
  document.querySelector("footer").appendChild(panier);
}

// Classe pour représenter une destination de voyage
class Destination {
  constructor(nom, prix, id, filtre) {
    this._nom = nom;
    this._prix = prix;
    this._lien = `url('../images/${nom}.jpg')`;
    this._id = id;
    this._filtre = filtre;
    this._state = "display";
  }
}

// Liste pour stocker les objets Destination
let listeDestinations = [];

// Fonction asynchrone pour récupérer les données des destinations depuis un fichier JSON
async function create_dest() {
  try {
    // Récupération des données depuis le fichier destinations.json
    var fetchResult = await fetch("../json/destinations.json");
    var info_dest = await fetchResult.json();

    // Transformation des données en objets de la classe Destination
    listeDestinations = info_dest.map(
      (dest) => new Destination(dest.name, dest.price, dest.id, dest.filtre)
    );
  } catch (error) {
    console.error("Erreur lors de la récupération des destinations:", error);
  }
}

function log_out() {
  localStorage.removeItem("user");
  window.location.href = "index.html";
}
