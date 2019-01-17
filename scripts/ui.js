import {
  encodeToHTML,
  truncateText,
  stripHTML,
  showElement,
  scrollToElm
} from "./utils";

import { projectClickHandler } from "./events";

const projects = require("../data/projects.json");
const commands = require("../data/commands.json");

export function startUiMode(container, scroll = "") {
  let ui = document.createElement("section");
  ui.className = "gui hidden";
  container.insertAdjacentElement("beforeend", ui);

  ui.insertAdjacentHTML(
    "beforeend",
    '<div class="me">' + commands.actions.me + "</div>"
  );
  ui.insertAdjacentHTML("beforeend", "<h2>Projets</h2>");
  ui.insertAdjacentHTML("beforeend", projectsGenerator());
  projectClickHandler();
  ui.insertAdjacentHTML(
    "beforeend",
    '<a title="Le CV PDF d\'Arno DUBOIS" href="./files/CV (interactif).pdf" class="resume-link">Mon CV PDF</a>'
  );
  ui.insertAdjacentHTML(
    "beforeend",
    `<div class="contact-me"><a title="LinkedIn Arno DUBOIS" href="https://www.linkedin.com/in/arno-dubois/" class="linkedin">Mon LinkedIn</a>
    <a title="Contacter Arno DUBOIS par mail" href="mailto:contact@arnodubo.is?subject=J'ai%20quelques%20travaux%20pour%20vous&body=Bonjour%2C%0AJe%20vous%20veux%20dans%20mon%20%C3%A9quipe.%0A%0ACordialement%2C%0AMartine%20Dupont" class="mail">Me contacter par mail</a></div>`
  );

  setTimeout(function() {
    showElement(ui).then(() => {
      if (scroll !== "noscroll") {
        scrollToElm(ui);
      }
    });
  }, 1);
}

function projectsGenerator() {
  let output = '<div class="projects-container grid-2-small-1 has-gutter-l">';
  projects.forEach(project => {
    output += `<article data-name="${encodeToHTML(
      project.name
    )}" data-description="${encodeToHTML(
      project.description
    )}" data-action="${encodeToHTML(project.action)}" data-type="${
      project.type
    }" data-link="${encodeToHTML(project.link)}" data-yt-code="${encodeToHTML(
      project.ytCode
    )}" data-link-infos="${encodeToHTML(
      JSON.stringify(project.linkInfos)
    )}" class="col-1">
      <figure>
      <picture>
        <source type="image/webp" srcset="${project.thumbWebp}">
        <img src="${encodeToHTML(project.thumb)}" alt="${encodeToHTML(
      project.name
    )}"></img>
      </picture>
        <figcaption>
          <h3>${encodeToHTML(project.name)}</h3>
          <p>${truncateText(
            stripHTML(project.description.replace('"', "\u0022")),
            17
          )}</p>
        </figcaption>
      </figure>
    </article>`;
  });
  output += "</div>";
  return output;
}
