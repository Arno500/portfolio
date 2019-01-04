import { startCommandLineMode } from "./terminal";
import { hideElement, showElement } from "./utils";
import * as localforage from "localforage";

export function addChooserListener() {
  document.querySelector(".mode-terminal").addEventListener("click", () => {
    startMode("mode-terminal");
  });
  document.querySelector(".mode-gui").addEventListener("click", () => {
    startMode("mode-gui");
  });
}

export function startMode(mode, scroll = "") {
  let projectsContainer = document.querySelector(".projects");
  let modeCheckbox = document.querySelector("#mode-switcher");
  hideElement(document.querySelector(".chooser")).then(function() {
    if (mode === "mode-gui") {
      modeCheckbox.checked = true;
      localforage.setItem("mode", "mode-gui");
    } else if (mode === "mode-terminal") {
      startCommandLineMode(projectsContainer, scroll);
      localforage.setItem("mode", "mode-terminal");
    }
    showElement(document.querySelector(".mode-toggler"));
    document.querySelector(".switch").addEventListener("change", modeChecker);
  });
}

function modeChecker(event) {
  let switcher = event.currentTarget;

  console.info("Changing mode");

  if (!switcher.checked) {
    startCommandLineMode(document.querySelector(".projects"));
    localforage.setItem("mode", "mode-terminal");
  } else {
    localforage.setItem("mode", "mode-gui");
    hideElement(document.querySelector(".terminal")).then(function(elm) {
      elm.remove();
    });
  }
}
