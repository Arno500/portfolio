require("./sass/styles.scss");
import * as anim from "./scripts/background";
import * as event from "./scripts/events";
import * as utils from "./scripts/utils";
import * as smoothscroll from "smoothscroll-polyfill";
import scrollSnapPolyfill from "css-scroll-snap-polyfill";
import * as localforage from "localforage";
import "core-js/features/array/iterator";
import "core-js/web/dom-collections";
import "@babel/polyfill";

localforage.config({
  name: "arnauxandco",
  description:
    "L'espace de stockage du terminal, pour le portfolio d'Arno DUBOIS",
  storeName: "portfolio"
});

window.onload = bootstrap;

function bootstrap() {
  smoothscroll.polyfill();
  scrollSnapPolyfill();
  event.addChooserListener();
  if (!utils.isIEorEdge()) {
    (function() {
      var msEdgeMatch = /Edge\/([0-9]+)/i.exec(navigator.userAgent);
      if (msEdgeMatch) document.documentMode = parseInt(msEdgeMatch[1]);
    })();
    const Velocity = require("velocity-animate/velocity");
    require("velocity-animate/velocity.ui.js");
    anim.animateBackground();
  }
  utils.imagePreloader();
  let gui = document.querySelector(".gui");
  gui.parentElement.removeChild(gui);
  localforage.getItem("mode").then(value => {
    if (value && value !== "") {
      event.startMode(value, "noscroll");
    }
  });
}
