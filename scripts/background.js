import { throttle } from "lodash-es";
import { default as Velocity } from "velocity-animate";
require("velocity-animate/velocity.ui.js");

export function animateBackground() {
  function rand(min, max) {
    let result = Math.floor(Math.random() * (max - min + 1)) + min;
    if (result === 0) {
      return 1;
    } else {
      return result;
    }
  }

  var isMobile = !!("ontouchstart" in window);
  var nbPoints = isMobile ? 30 : 150;
  var animatedBackground = document.querySelector(".animatedbackground");
  var pointsHTML = "";

  for (let i = 0; i < nbPoints; i++) {
    pointsHTML += "<div class='dot'></div>";
  }
  animatedBackground.insertAdjacentHTML("beforeEnd", pointsHTML);

  var points = document.querySelectorAll(".dot");

  animeSequence();

  function animeSequence() {
    var screenWidth = Math.max(
        document.documentElement.clientWidth,
        window.innerWidth || 0
      ),
      screenHeight = Math.max(
        document.documentElement.clientHeight,
        window.innerHeight || 0
      );

    var translateZMin = -400,
      translateZMax = 325;

    var containerAnimationMap = {
      perspective: [215, 50],
      opacity: [0.9, 0.55]
    };

    animatedBackground.style["perspective-origin"] =
      screenWidth / 2 + "px " + screenHeight * 0.45 + "px";
    points
      .velocity(
        {
          opacity: [0.8, 0]
        },
        { queue: false, duration: 2000, easing: "ease-in" }
      )
      .velocity(
        {
          transform: [
            function() {
              return (
                "translateX(+=" +
                rand(-screenWidth / 2.5, screenWidth / 2.5) +
                "px) translateY(+=" +
                rand(-screenHeight / 2.75, screenHeight / 2.75) +
                "px) translateZ(+=" +
                rand(translateZMin, translateZMax) +
                "px)"
              );
            },
            "ease-in-out",
            function() {
              return (
                "translateX(" +
                rand(1, screenWidth) +
                "px) translateY(" +
                rand(1, screenHeight) +
                "px) translateZ(" +
                rand(translateZMin, translateZMax) +
                "px)"
              );
            }
          ]
        },
        {
          duration: 15000,
          easing: "ease-in-out"
        }
      )
      .velocity("reverse", { duration: 2000, easing: "ease-out" })
      .velocity(
        { opacity: "0" },
        {
          sync: true,
          duration: 300,
          easing: "ease-out",
          complete: function() {
            animeSequence();
          }
        }
      );
    Velocity(
      animatedBackground,
      { perspective: ["500px", "50px"] },
      { duration: 3000, easing: "ease-in-out" }
    ).velocity("reverse", {
      sync: false,
      duration: 1500,
      delay: 12500
    });
  }

  /* Feature detection */
  var passiveIfSupported = false;

  try {
    window.addEventListener(
      "test",
      null,
      Object.defineProperty({}, "passive", {
        get: function() {
          passiveIfSupported = { passive: true };
        }
      })
    );
  } catch (err) {}

  document
    .querySelector(".topsection")
    .addEventListener(
      "mousemove",
      throttle(parallaxPerspective, 1 / 20),
      passiveIfSupported
    );
  document
    .querySelector(".topsection")
    .addEventListener(
      "touchmove",
      throttle(parallaxPerspective, 1 / 20),
      passiveIfSupported
    );

  window.onresize = function() {
    points.velocity("stop");
    Velocity(animatedBackground, "stop");
    animeSequence();
  };
}

function parallaxPerspective(event) {
  const screenWidth = Math.max(
      document.documentElement.clientWidth,
      window.innerWidth || 0
    ),
    screenHeight = Math.max(
      document.documentElement.clientHeight,
      window.innerHeight || 0
    );
  const reductionCoeffX = 3,
    reductionCoeffY = 3,
    // lastTouch = event.touches ? event.touches.length : 0,
    pointX =
      typeof event.pageX !== "undefined"
        ? event.pageX
        : event.targetTouches[0].clientX,
    pointY =
      typeof event.pageY !== "undefined"
        ? event.pageY
        : event.targetTouches[0].clientY;
  document.querySelector(".animatedbackground").style["perspective-origin"] =
    screenWidth / 2 +
    (screenWidth / 2 - (screenWidth - pointX)) / reductionCoeffX +
    "px " +
    (screenHeight * 0.45 +
      (screenHeight * 0.55 - (screenHeight - pointY)) / reductionCoeffY) +
    "px";
}
