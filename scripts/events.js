import { startCommandLineMode } from "./terminal";
import { startUiMode } from "./ui";
import { hideElement, showElement } from "./utils";
import * as localforage from "localforage";
import MicroModal from "micromodal";
import * as builders from "./typesbuilder";

export function addChooserListener() {
  document.querySelector(".mode-terminal").addEventListener("click", () => {
    startMode("mode-terminal");
  });
  document.querySelector(".mode-gui").addEventListener("click", () => {
    startMode("mode-gui");
  });
}

export function startMode(mode, scroll = "") {
  var projectsContainer = document.querySelector(".component-container");
  let modeCheckbox = document.querySelector("#mode-switcher");
  hideElement(document.querySelector(".chooser")).then(function() {
    if (mode === "mode-gui") {
      _paq.push(["trackEvent", "Mode", "Graphique"]);
      startUiMode(projectsContainer, scroll);
      modeCheckbox.checked = true;
      localforage.setItem("mode", "mode-gui");
    } else if (mode === "mode-terminal") {
      _paq.push(["trackEvent", "Mode", "Terminal"]);
      startCommandLineMode(projectsContainer, scroll);
      localforage.setItem("mode", "mode-terminal");
    }
    showElement(document.querySelector(".mode-toggler"));
    document.querySelector(".switch").addEventListener("change", modeChecker);
  });
}

function modeChecker(event) {
  let switcher = event.currentTarget;

  if (!switcher.checked) {
    switchMode("mode-terminal");
  } else {
    switchMode("mode-gui");
  }
  console.info("Changing mode");
}

export function switchMode(mode) {
  if (mode === "mode-terminal") {
    localforage.setItem("mode", "mode-terminal");
    hideElement(document.querySelector(".gui")).then(function(elm) {
      elm.parentNode.removeChild(elm);
      startCommandLineMode(document.querySelector(".component-container"));
    });
  } else if (mode === "mode-gui") {
    localforage.setItem("mode", "mode-gui");
    hideElement(document.querySelector(".terminal")).then(function(elm) {
      elm.parentNode.removeChild(elm);
      startUiMode(document.querySelector(".component-container"));
    });
  }
}

export function projectClickHandler() {
  document.querySelectorAll("[data-name]").forEach(elm => {
    elm.removeEventListener("click", projectClickModal);
    elm.addEventListener("click", projectClickModal);
  });
}

function projectClickModal(event) {
  event.stopPropagation();
  let modal = document.querySelector("#modal");
  if (modal) {
    modal.parentNode.removeChild(modal);
  }
  let content = builders.build(
    event.currentTarget.getAttribute("data-type"),
    event.currentTarget
  );
  document.querySelector("body").insertAdjacentHTML(
    "beforeend",
    `
  <div id="modal" tabindex="-1" class="modal-container" >
    <div tabindex="-1" class="modal-closer" data-micromodal-close aria-hidden="true">

      <div role="dialog" class="modal" aria-modal="true" aria-labelledby="${event.currentTarget.getAttribute(
        "data-name"
      )}" >
      <header>
        <h2>
          ${event.currentTarget.getAttribute("data-name")}
        </h2>
      </header>

      <div>
       ${content}
      </div>
      <button type="button" class="modal-button-closer" data-micromodal-close>Fermer</button>
      </div>

    </div>
  </div>
  `
  );
  MicroModal.init();
  MicroModal.show("modal");
}
