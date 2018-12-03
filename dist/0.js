(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[0],{

/***/ "./scripts/timebackground.js":
/*!***********************************!*\
  !*** ./scripts/timebackground.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

Velocity.defaults = {
  duration: 800,
  easing: "swing",
  display: "auto",
  visibility: "auto",
  loop: true,
  delay: false,
  mobileHA: true
};

function animateTime() {
  var paperPlane = document.querySelector(".timebackground-plane");

  Velocity(
    paperPlane,
    {
      translateX: [0, "70vw"],
      translateY: [0, "10vh"]
    },
    { duration: 1000 }
  );
}


/***/ })

}]);
//# sourceMappingURL=0.js.map