// Informations de destination
var informationDest = [
  "Destination",
  "Prix",
  "Date de départ",
  "Date de retour",
  "Nombre d'adultes",
  "Nombre d'enfants",
  "petits déjeuners",
];

// Fonction pour effacer les paramètres de l'URL
function clearUrlParameters() {
  // Remplace l'URL actuelle sans paramètres
  history.replaceState({}, document.title, window.location.pathname);
}

// Fonction pour supprimer une réservation en fonction de son ID
function remove(id) {
  // Nettoie les paramètres de l'URL
  clearUrlParameters();

  if (id === "All") {
    sessionStorage.removeItem("res_data");
    // Supprime tous les éléments fieldset
    document.querySelectorAll("fieldset").forEach((element) => {
      element.remove();
    });
  } else {
    // Récupère les données de réservation depuis le stockage local
    var res_data_temp = sessionStorage.getItem("res_data");
    var res_data = JSON.parse(res_data_temp);

    // Crée une nouvelle liste de réservations excluant celle avec l'ID spécifié
    const new_res_data = res_data.filter(
      (item) => !item.some((subItem) => subItem.id === id)
    );

    // Met à jour les données de réservation dans le stockage local
    var res_data_json = JSON.stringify(new_res_data);
    sessionStorage.setItem("res_data", res_data_json);

    // Supprime tous les éléments fieldset
    document.querySelectorAll("fieldset").forEach((element) => {
      element.remove();
    });
  }

  // Met à jour les informations de réservation affichées
  update_res_info();
}

// Fonction pour mettre à jour les informations de réservation affichées
function update_res_info() {
  // Récupère les données de réservation depuis le stockage local
  var res_data = store_data();
  if (sessionStorage.hasOwnProperty("res_data") && res_data.length > 0) {
    document.querySelector("#delAll").style.display = "block";
  } else {
    document.querySelector("#delAll").style.display = "none";
  }
  // Récupère le template de réservation
  let template = document.querySelector("#res");

  // Compteur pour les noms des champs checkbox
  var i = 0;

  if (res_data && res_data.length !== 0) {
    // Affiche le bouton de confirmation s'il y a des réservations
    document.querySelector("#bouton").style.display = "inline-block";

    // Parcours des données de réservation
    for (const info of res_data) {
      // Clonage du template
      let clone = document.importNode(template.content, true);
      let div = clone.querySelector("#grid-panier");

      // Création d'une nouvelle checkbox
      new_input = document.createElement("input");
      new_input.setAttribute("type", "checkbox");
      new_input.setAttribute("value", info[info.length - 1].id);
      new_input.setAttribute("id", "Valider");
      new_input.setAttribute("name", "id" + i);
      new_input.setAttribute("onchange", "block_confirmation()");
      div.appendChild(new_input);

      // Création d'une liste pour afficher les informations de réservation
      let ul = document.createElement("ul");

      // Création d'une image pour la destination
      var new_img = document.createElement("img");
      new_img.setAttribute("src", `../images/${info[0]}.jpg`);
      new_img.setAttribute("alt", "destination réservé");
      div.appendChild(new_img);

      // Parcours des clés des informations de réservation
      for (const key of Object.keys(info)) {
        if (info[key].id == null) {
          // Ajout d'un élément li avec l'information correspondante
          // Gestion particulière pour "petits déjeuners"
          if (informationDest[key] === "petits déjeuners") {
            let new_li = document.createElement("li");
            ul.appendChild(new_li);
            new_li.innerHTML = "Avec " + informationDest[key];
          } else if (info[key] !== "0") {
            let new_li = document.createElement("li");
            ul.appendChild(new_li);
            new_li.innerHTML = informationDest[key] + ": " + info[key];
          }
        }
      }

      // Ajout de la liste à la div
      div.appendChild(ul);

      // Attribution des propriétés à l'élément cloné
      clone
        .querySelector("#delete")
        .setAttribute("onclick", `remove(${info[info.length - 1].id});`);
      i += 1;

      // Ajout de l'élément cloné au contenu du panier
      document.querySelector("#contenu-panier").appendChild(clone);
    }
  } else {
    // Cache le bouton de confirmation s'il n'y a pas de réservations
    document.querySelector("#bouton").style.display = "none";

    // Affiche un message indiquant que le panier est vide
    let new_h2 = document.createElement("h2");
    new_h2.innerHTML = "Le panier est vide ";
    let new_img = document.createElement("img");
    let new_a = document.createElement("a");
    new_img.setAttribute("src", `../images/empty.png`);
    new_img.setAttribute("alt", "Nothing here ¯_༼ ಥ ‿ ಥ ༽_/¯");
    new_img.setAttribute("id", "empty");
    new_a.setAttribute("href", "index.html");
    document.querySelector("main").appendChild(new_h2);
    document.querySelector("main").appendChild(new_a).appendChild(new_img);
    document.querySelectorAll("br").forEach((element) => {
      element.style.visibility = "hidden";
    });
  }
}

// Fonction pour bloquer la confirmation si aucune réservation n'est sélectionnée
function block_confirmation() {
  let block = true;
  checkboxes = document.querySelectorAll("#Valider");
  checkboxes.forEach((element) => {
    if (element.checked) {
      block = false;
    }
  });
  if (block) {
    checkboxes.forEach((element) => element.setAttribute("required", ""));
  } else {
    checkboxes.forEach((element) => element.removeAttribute("required"));
  }
}

// Fonction pour récupérer et stocker les données de réservation
function store_data() {
  var p = new URLSearchParams(window.location.search);
  var res_data_temp = sessionStorage.getItem("res_data");
  var res_data = [];
  id_unavailable = [];

  // Vérifie si des données de réservation existent déjà dans le stockage local
  if (!(res_data_temp == null)) {
    var res_data = JSON.parse(res_data_temp);
  }

  // Récupère les IDs des réservations existantes
  for (element of res_data) {
    id_unavailable.push(Number(element[6].id));
  }

  // Initialise une nouvelle liste de données de réservation
  var data_bis = [];

  // Vérifie si des paramètres existent dans l'URL
  if (p.get("dest") !== null) {
    i = res_data.length;

    // Trouve un nouvel ID non utilisé
    while (id_unavailable.includes(i)) {
      i++;
    }

    // Ajoute les paramètres de l'URL à la liste de données
    for (const key of p.keys()) {
      data_bis.push(p.get(key));
    }

    // Vérifie si ces données ne sont pas déjà présentes dans le stockage local
    if (
      !res_data.some((existingData) =>
        arraysAreEqual(existingData.slice(0, 6), data_bis.slice(0, 6))
      )
    ) {
      // Ajoute un nouvel ID à la liste de données
      data_bis.push({ id: i });

      // Ajoute les données à la liste de réservations
      res_data.push(data_bis);
    }

    // Met à jour le stockage local avec les nouvelles données
    var data_json = JSON.stringify(res_data);
    sessionStorage.setItem("res_data", data_json);
  }

  // Retourne les données de réservation mises à jour
  return res_data;
}

// Fonction pour comparer deux tableaux et vérifier s'ils sont égaux
function arraysAreEqual(array1, array2) {
  return JSON.stringify(array1) === JSON.stringify(array2);
}
