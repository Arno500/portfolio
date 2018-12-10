require("./sass/styles.scss");
var preprod = false;
const projets = require("./projets/projets.json");
window.onload = bootstrap;
import * as anim from "./scripts/timebackground";
import Velocity from "velocity-animate";

function bootstrap() {
  //startCommandLineMode(".terminal");
  anim.animateTime();
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
  let terminal = document.querySelector(element);

  terminal.insertAdjacentHTML(
    "beforeend",
    "<span>Bienvenue dans la console Arnaux & Co !</span><br><span>Pour commencer, tapez 'help' ou '?'</span>"
  );

  askForCommand(element);
}

function askForCommand(element) {
  let terminal = document.querySelector(element);
  let input = document.createElement("input");
  input.type = "text";
  input.classList.add("command-input");

  terminal.insertAdjacentHTML(
    "beforeend",
    "<br><div class='flex-input'><div>[root@arnodubo.is ~]#</div></div>"
  );

  let flexInput = document.querySelector(".flex-input");
  flexInput.insertAdjacentElement("beforeend", input);
}
