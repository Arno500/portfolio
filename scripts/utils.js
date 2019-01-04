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
  });
}

export function scrollToElm(element, focusElm) {
  element.scrollIntoView({
    behavior: "smooth"
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
