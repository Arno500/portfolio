import { encode as encodeHTML } from "html-encoder-decoder";
import * as ImagePreloader from "image-preloader";
const projects = require("../data/projects.json");

// Function from David Walsh: http://davidwalsh.name/css-animation-callback
function whichTransitionEvent() {
  var t,
    el = document.createElement("fakeelement");

  var transitions = {
    transition: "transitionend",
    OTransition: "oTransitionEnd",
    MozTransition: "transitionend",
    WebkitTransition: "webkitTransitionEnd"
  };

  for (t in transitions) {
    if (el.style[t] !== undefined) {
      return transitions[t];
    }
  }
}

var transitionEvent = whichTransitionEvent();

export function hideElement(element) {
  return new Promise(function(resolve, reject) {
    element.addEventListener(transitionEvent, function handler(event) {
      if (event.propertyName === "height") {
        resolve(element);
        element.removeEventListener(transitionEvent, handler);
      }
    });
    element.classList.add("hidden");
  });
}

export function showElement(element) {
  return new Promise(function(resolve, reject) {
    element.addEventListener(transitionEvent, function handler(event) {
      if (event.propertyName === "height") {
        resolve(element);
        element.removeEventListener(transitionEvent, handler);
      }
    });
    element.classList.remove("hidden");
    if (element.classList.contains("hidden-noanim")) {
      element.classList.remove("hidden-noanim");
      resolve(element);
    }
  });
}

export function scrollToElm(element, focusElm) {
  element.scrollIntoView({
    behavior: "smooth",
    block: "nearest",
    inline: "nearest"
  });
  (focusElm ? focusElm : element).focus({ preventScroll: true });
}

export function truncateText(text, length) {
  return `${text
    .trim()
    .split(" ")
    .slice(0, length)
    .join(" ")}...`;
}

// Credits: http://blog.vishalon.net/index.php/javascript-getting-and-setting-caret-position-in-textarea/
export function setCaretPosition(ctrl, pos) {
  // Modern browsers
  if (ctrl.setSelectionRange) {
    ctrl.focus();
    ctrl.setSelectionRange(pos, pos);

    // IE8 and below
  }
}

export function stripHTML(input) {
  return input.replace(/<(?:.|\n)*?>/gm, "");
}

export function encodeToHTML(input) {
  if (
    input &&
    input !== null &&
    input !== undefined &&
    typeof input === "string"
  ) {
    return encodeHTML(input);
  } else {
    return input;
  }
}

export function imagePreloader() {
  let thumbs = projects.map(project => project.thumbWebp);
  let icons = projects.map(project => {
    if (project.linkInfos) {
      return project.linkInfos.icon;
    } else {
      return null;
    }
  });

  let images = Array.prototype.concat(thumbs, icons);
  let preloader = new ImagePreloader();
  preloader.preload(images).then(fini => {
    console.info("Toutes les images sont chargées !");
  });
}

/* Sample function that returns boolean in case the browser is Internet Explorer*/
export function isIEorEdge() {
  let ua = navigator.userAgent;
  /* MSIE used to detect old browsers and Trident used to newer ones*/
  var is_ie = ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1;
  var is_edge = /Edge/.test(navigator.userAgent);

  if (is_ie || is_edge) {
    return true;
  } else {
    return false;
  }
}

export function switchSwitcher(checked) {
  let switcher = document.querySelector(".switch");
  switcher.checked = checked;
}
