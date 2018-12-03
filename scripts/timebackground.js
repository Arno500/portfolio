export default (Velocity.defaults = {
  duration: 800,
  easing: "swing",
  display: "auto",
  visibility: "auto",
  loop: true,
  delay: false,
  mobileHA: true
});

export function animateTime() {
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
