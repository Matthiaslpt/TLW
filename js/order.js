// Informations sur la destination
var informationDest = [
  "Destination",
  "Prix",
  "Date de départ",
  "Date de retour",
  "Nombre d'adultes",
  "Nombre d'enfants",
  "petits déjeuners",
];

// Fonction pour récapituler les informations des réservations
function recap_infos() {
  // Récupération des paramètres de l'URL
  var p = new URLSearchParams(window.location.search);

  // Récupération de la liste des ID des destinations depuis les paramètres
  var destinations = JSON.parse(p.get("id"));

  // Récupération des données de réservation depuis le stockage local
  var res_data_temp = sessionStorage.getItem("res_data");
  var res_data = JSON.parse(res_data_temp);

  // Parcours des ID de destinations sélectionnées
  for (var key of destinations) {
    //Création d'un fieldset
    var fieldset = document.createElement("fieldset");
    fieldset.id = "recap";
    // Création d'une liste à puces (ul) pour chaque destination
    let ul = document.createElement("ul");
    // Ajout de la puce au fieldset
    fieldset.appendChild(ul);

    // Parcours des propriétés de chaque réservation
    for (nb in res_data[key]) {
      // Vérification si la propriété existe dans informationDest
      if (informationDest[nb] !== undefined) {
        // Vérification pour "petits déjeuners" et s'il y a 8 éléments dans la réservation
        if (
          informationDest[nb] === "petits déjeuners" &&
          res_data[key].length === 8
        ) {
          // Création d'un élément de liste (li) pour "petits déjeuners"
          let li = document.createElement("li");
          li.innerHTML = "Avec " + informationDest[nb];
          ul.appendChild(li);
        } else if (
          !(nb === 6) &&
          informationDest[nb] !== "petits déjeuners" &&
          res_data[key][nb] !== "0"
        ) {
          // Création d'un élément de liste (li) pour les autres propriétés
          let li = document.createElement("li");
          li.innerHTML = informationDest[nb] + ":  " + res_data[key][nb];
          ul.appendChild(li);
        }
      }
    }

    // Ajout du fieldset à l'élément avec l'ID "bandeau"
    document.querySelector("#bandeau").appendChild(fieldset);

    sessionStorage.removeItem("res_data");
  }
}
