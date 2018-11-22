require("./sass/styles.scss");
var preprod = false;
const projets = require("./projets/projets.json");
window.onload = bootstrap;

function bootstrap() {
  if (!preprod) {
    document.querySelector(".final").style.display = "block";
    document.querySelector(".preprod").style.display = "none";
    startCommandLineMode(".terminal");
  } else {
    countdown(new Date("Jan 15, 2019 00:00:00").getTime(), ".date-counter");

    var counter = setInterval(function() {
      countdown(new Date("Jan 15, 2019 00:00:00").getTime(), ".date-counter");
    }, 1000);
  }
}

function countdown(date, element) {
  var now = new Date().getTime();
  var distance = date - now;

  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.querySelector(element).innerHTML =
    days +
    " jours, " +
    hours +
    " heures, " +
    minutes +
    " minutes et " +
    seconds +
    " secondes";
}

function startCommandLineMode(element) {
  var terminal = document.querySelector(element);

  terminal.insertAdjacentHTML(
    "beforeend",
    "<span>Bienvenue dans la console Arnaux & Co !</span><br><span>Pour commencer, tapez 'help' ou '?'</span>"
  );
}
