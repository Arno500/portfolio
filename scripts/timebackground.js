export function animateTime() {
  Velocity.defaults = {
    duration: 800,
    easing: "swing",
    display: "auto",
    visibility: "auto",
    loop: true,
    delay: false,
    mobileHA: true,
    queue: false
  };

  var paperPlane = document.querySelector(".timebackground-plane");
  var sun = document.querySelector(".timebackground-sun");
  var mountains = document.querySelector(".timebackground-mountains");

  Velocity(
    paperPlane,
    { translateX: ["70vw", 0], translateY: ["10vh", 0] },
    { duration: 1000, easing: "swing" }
  );
  return true;
}
