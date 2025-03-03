// Fonction pour mettre à jour le champ d'entrée "#cart" avec les paramètres de l'URL
function updateCart() {
  var p = new URLSearchParams(window.location.search);
  document.querySelector("#cart").value = "cart=" + p;
}

// Fonction asynchrone pour charger les pays depuis un fichier JSON
async function country() {
  // Requête pour obtenir la liste des pays depuis le fichier "country.json"
  var fetchResult = await fetch("../json/country.json");
  var countries = await fetchResult.json();

  // Sélection de l'élément HTML avec l'ID "pays"
  const pays_balise = document.querySelector("#pays");

  // Parcours de la liste des pays
  for (var i of countries) {
    // Création d'une option pour chaque pays
    var option = document.createElement("option");

    // Attribution de la valeur et du texte de l'option
    option.value = i;
    option.innerHTML = i.name;

    // Sélection automatique de la France
    if (i.name === "France") {
      option.selected = "selected";
    }

    // Ajout de l'option à la liste déroulante
    pays_balise.appendChild(option);
  }
}

// Fonction pour mettre à jour les champs de paiement en fonction du moyen de paiement choisi
function update_payment() {
  // Sélection de tous les champs de saisie et sélecteurs dans le fieldset avec l'ID "coord-bancaire"
  const fieldsetCB = document.querySelectorAll(
    "#coord-bancaire > input, #coord-bancaire > select"
  );

  // Vérification du moyen de paiement choisi
  if (document.querySelector("#MoyPaiement").value === "CB") {
    // Affichage du fieldset "coord-bancaire" et ajout de l'attribut "required" à ses éléments
    document.querySelector("#coord-bancaire").style.display = "block";
    fieldsetCB.forEach((element) => element.setAttribute("required", ""));
  } else {
    // Masquage du fieldset "coord-bancaire" et suppression de l'attribut "required" de ses éléments
    document.querySelector("#coord-bancaire").style.display = "none";
    fieldsetCB.forEach((element) => element.removeAttribute("required"));
  }
}

// Fonction pour afficher les informations de la commande
function show_infos() {
  // Récupération des paramètres de l'URL
  var p = new URLSearchParams(window.location.search);

  // Récupération des données de réservation depuis le stockage local
  var res_data_temp = sessionStorage.getItem("res_data");
  var res_data = JSON.parse(res_data_temp);

  // Initialisation d'un tableau pour stocker les clés
  var cles = [];

  // Parcours des clés dans les paramètres de l'URL
  for (var key of p.keys()) {
    // Conversion en nombre et ajout au tableau
    cles.push(Number(p.get(key)));
  }

  // Initialisation des variables pour le prix total, la destination, et la sélection
  let prix_total = 0;
  let dest = "Pour ";
  const selection = [];

  // Parcours des éléments dans les données de réservation
  for (element of res_data) {
    // Vérification si l'ID de l'élément est inclus dans les clés
    if (cles.includes(element[element.length - 1].id)) {
      // Calcul du prix total en ajoutant le prix de l'élément
      prix_total += Number(element[1].slice(0, element[1].length - 1));

      // Construction de la chaîne de destination
      dest += ` ${element[0]}`;

      // Ajout d'une virgule si plusieurs destinations
      if (cles.length > 1) {
        dest += ", ";
      }

      // Ajout de l'ID à la liste de sélection
      selection.push(element[element.length - 1].id);
    }
  }

  // Affichage du prix total dans l'élément avec l'ID "prix"
  document.querySelector("#prix").innerHTML = `Prix à payer : ${prix_total}€`;

  // Affichage du récapitulatif de la commande dans un élément h2
  document.querySelector(
    "h2"
  ).innerHTML = `Récapitulatif de la commande: ${dest}`;

  // Conversion de la liste de sélection en JSON et attribution à l'attribut "value" de l'élément avec l'ID "selections"
  selection_json = JSON.stringify(selection);
  document.querySelector("#selections").setAttribute("value", selection_json);
}
