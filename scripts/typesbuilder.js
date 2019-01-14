export function build(type, elm) {
  let functionList = {
    link: link,
    youtube: youtube
  };

  if (functionList[type]) {
    return functionList[type](elm);
  } else {
    console.error(
      `Fonction d'affichage de modal pour ce type (${type}) non définie : `,
      this
    );
    return `Cette modal n'est pas complète. Merci de m'envoyer un mail @ contact@arnodubo.is`;
  }
}

function link(data) {
  const linkInfos = JSON.parse(data.getAttribute("data-link-infos"));
  if (linkInfos.disabled) {
    var disabledState = "disabled";
  } else {
    var disabledState = "";
  }

  var link = data.getAttribute("data-link");
  if (link == "" || typeof link !== "string") {
    var link = "";
  } else {
    var link = 'href="' + link + '"';
  }
  return `
    <p>${data.getAttribute("data-description")}</p>

    <div class="p-relative-centerer">
    <a class="modal-button-link" ${link} alt="${data.getAttribute(
    "data-name"
  )}" target="_blank" ${disabledState}>
      <img src="${linkInfos.icon}" title="">
      <p>${linkInfos.title}</p>
      </a>
    </div>
  `;
}

function youtube(data) {
  return `
  <p>${data.getAttribute("data-description")}</p>
  
  <iframe class="youtube-iframe" src="https://www.youtube-nocookie.com/embed/${data.getAttribute(
    "data-yt-code"
  )}" frameborder="0" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
}
