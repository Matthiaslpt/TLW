async function checkPassword() {
  var fetchResult = await fetch("../json/login.json");
  var logins = await fetchResult.json();
  let id = document.querySelector("#id");
  let mdp = document.querySelector("#mdp");
  for (element of logins) {
    if (element.id == id.value && element.password === mdp.value) {
      window.location.href = "index.html";
      localStorage.setItem("user", element.name);
    } else {
      id.value = "";
      mdp.value = "";
      document.querySelector("#error").style.display = "block";
    }
  }
}
