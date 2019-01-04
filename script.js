require("./sass/styles.scss");
import * as anim from "./scripts/timebackground";
import * as event from "./scripts/events";
import * as term from "./scripts/terminal";
import * as utils from "./scripts/utils";
import Velocity from "velocity-animate/velocity";
import "velocity-animate/velocity.ui.js";
import * as smoothscroll from "smoothscroll-polyfill";
import * as localforage from "localforage";

localforage.config({
  name: "arnauxandco",
  description:
    "L'espace de stockage du terminal, pour le portfolio d'Arno DUBOIS",
  storeName: "portfolio"
});

window.onload = bootstrap;

function bootstrap() {
  smoothscroll.polyfill();
  event.addChooserListener();
  anim.animateBackground();
  localforage.getItem("mode").then(value => {
    if (value && value !== "") {
      event.startMode(value, "noscroll");
    }
  });
}
