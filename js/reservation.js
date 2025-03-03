// Récupération du paramètre "id" depuis l'URL
var p = new URLSearchParams(window.location.search);
var id = p.get("id");

// Fonction asynchrone pour mettre à jour les informations de destination
async function updateDest() {
  // Appel de la fonction asynchrone pour créer les destinations
  await create_dest();

  // Mise à jour des éléments HTML avec les informations de la destination
  document.querySelector("#dest").textContent +=
    " " + listeDestinations[id]._nom;
  document.querySelector(
    "#background_image"
  ).src = `../images/${listeDestinations[id]._nom}.jpg`;
  document.querySelector("#dest_name").value = listeDestinations[id]._nom;
}

// Fonction asynchrone pour effectuer le calcul du prix du voyage
async function calculer() {
  // Appel de la fonction asynchrone pour créer les destinations
  await create_dest();

  // Récupération des valeurs des champs du formulaire
  var prixVoyage = listeDestinations[id]._prix;
  var nbAdulte = Number(document.querySelector("#Nadultes").value);
  var nbEnfant = Number(document.querySelector("#Nenfants").value);
  var petitDejeuner = document.querySelector("#checkbox");

  // Calcul du prix en fonction des valeurs entrées par l'utilisateur
  var prix = prixVoyage * nbAdulte + ((prixVoyage * 40) / 100) * nbEnfant;
  if (petitDejeuner.checked == true) {
    prix += 15 * (nbAdulte + nbEnfant);
  }

  // Calcul du prix total en fonction du nombre de jours sélectionnés
  const nbJours = DiffDate();
  if (!isNaN(nbJours)) {
    prix *= nbJours;
  }

  // Mise à jour de l'affichage du prix total
  document.querySelector("#total").innerHTML =
    "Prix du Voyage approximatif : " + prix + "€";
  document.querySelector("#price").value = prix + "€";
}

// Fonction asynchrone pour masquer certaines options en fonction de la destination
async function hide_options() {
  // Appel de la fonction asynchrone pour créer les destinations
  await create_dest();

  // Affichage ou masquage de la section enfants en fonction des filtres de la destination
  document.querySelector("#child").style.display = listeDestinations[
    id
  ]._filtre.includes("child")
    ? "block"
    : "none";

  // Attribution de l'attribut "required" au champ du nombre d'enfants en fonction des filtres de la destination
  document
    .querySelector("#Nenfants")
    .setAttribute(
      "required",
      listeDestinations[id]._filtre.includes("child") ? "" : null
    );
}

// Fonction pour obtenir la date du jour au format ISO
function getTodayDate() {
  const today = new Date();
  const minDate = today.toISOString().split("T")[0];
  return minDate;
}

// Fonction pour définir la date minimale dans les formulaires
function minDateform1() {
  minDate = getTodayDate();
  document.querySelector("#depart").setAttribute("min", minDate);
  document.querySelector("#retour").setAttribute("min", minDate);
}

// Fonction pour définir la date minimale dans le formulaire de retour
function minDateform2() {
  var minDate = addDay(document.querySelector("#depart").value)
    .toISOString()
    .split("T")[0];

  document.querySelector("#retour").setAttribute("min", minDate);
}

// Fonction pour calculer la différence en jours entre deux dates
function DiffDate() {
  const date1 = Date.parse(document.querySelector("#depart").value);
  const date2 = Date.parse(document.querySelector("#retour").value);

  if (isNaN(date1) || isNaN(date2)) {
    return NaN;
  }
  const Diff = (date2 - date1) / 86400000;
  return Diff;
}

// Fonction pour ajouter un jour à une date
function addDay(date) {
  const tomorrow = new Date(date);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return tomorrow;
}

function reset() {
  const input = document.querySelectorAll("input");
  const select = document.querySelectorAll("select");
  input[2].value = "";
  input[3].value = "";
  input[4].checked = false;
  select[0].value = "1";
  select[1].value = "0";
}
