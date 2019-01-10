export function build(type, elm) {
  let functionList = {
    youtube: youtube
  };

  return functionList[type](elm);
}
function youtube(data) {
  return `
  <p>${data.getAttribute("data-description")}</p>
  
  <iframe class="youtube-iframe" src="https://www.youtube-nocookie.com/embed/${data.getAttribute(
    "data-yt-code"
  )}" frameborder="0" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
}
