import {
  showElement,
  scrollToElm,
  truncateText,
  setCaretPosition
} from "./utils";
import * as localforage from "localforage";

const availableCommands = require("../data/commands.json");
const projects = require("../data/projects.json");
var pressed = false;
var commandHistory = [""];
var currentCommand = 0;

function stopKeyDown(event) {
  pressed = false;
  document.removeEventListener("keyup", stopKeyDown);
}

export function startCommandLineMode(container, scroll = "") {
  let terminal = document.createElement("div");
  terminal.className = "terminal hidden";
  container.insertAdjacentElement("beforeend", terminal);

  Promise.all([
    localforage.getItem("terminalContent"),
    localforage.getItem("commandHistory")
  ])
    .then(values => {
      if (!values[0] || !values[1]) {
        localforage.setItem("terminalContent", "");
        localforage.setItem("commandHistory", "[]");
        buildTerminal("", terminal, scroll);
      } else {
        buildTerminal(values[0], terminal, scroll);
        commandHistory = values[1];
        currentCommand = values[1].length;
      }
    })
    .catch(error =>
      console.log(
        "Oopsie! Error reading into the memory of your browser. You should probably upgrade !",
        error
      )
    );

  terminal.addEventListener("click", () => {
    event.currentTarget.querySelector(".command-input").focus();
  });

  return;
}
function buildTerminal(
  oldContent,
  terminal = document.querySelector(".terminal"),
  scroll = ""
) {
  if (oldContent === "") {
    terminal.insertAdjacentHTML(
      "beforeend",
      "<span>Bienvenue dans la console Arnaux & Co !</span><br><span>Pour commencer, tapez 'help' ou '?'</span><br>"
    );
  } else {
    terminal.insertAdjacentHTML("beforeend", oldContent);
  }
  askForCommand(terminal);
  setTimeout(function() {
    terminal.scrollTop = terminal.scrollHeight;
    showElement(terminal).then(() => {
      if (scroll !== "noscroll") {
        scrollToElm(terminal, terminal.querySelector("input"));
      }
    });
  }, 1);
  return;
}

function askForCommand(terminal) {
  let input = document.createElement("input");
  input.type = "text";
  input.classList.add("command-input");

  terminal.insertAdjacentHTML(
    "beforeend",
    "<div class='flex-input'><div class='prompt'>[root@arnodubo.is ~]#</div></div>"
  );

  let flexInput = document.querySelector(".flex-input");
  flexInput.insertAdjacentElement("beforeend", input);
  input.focus();

  input.addEventListener("keydown", keyManager);
}

function keyManager(event) {
  let input = document.querySelector(".command-input");
  if (event.key === "Enter" && !pressed) {
    pressed = true;
    commandHistory.splice(-1, 1);
    currentCommand = commandHistory.length;
    commandInterpreter(event.currentTarget.value);
    commandHistory.push("");
    document.addEventListener("keyup", stopKeyDown);
  } else if (
    event.key === "ArrowUp" &&
    typeof commandHistory[currentCommand - 1] !== "undefined"
  ) {
    currentCommand--;
    input.value = commandHistory[currentCommand];
    setTimeout(() => setCaretPosition(input, input.value.length), 1);
  } else if (
    event.key === "ArrowDown" &&
    typeof commandHistory[currentCommand + 1] !== "undefined"
  ) {
    currentCommand++;
    input.value = commandHistory[currentCommand];
  }
}

function commandInterpreter(command) {
  let terminal = document.querySelector(".terminal");
  transformInput(terminal);

  let commandArray = command.trim().split(" ");
  let extractedCommand = commandArray[0].toLowerCase();
  let commandArguments = commandArray.slice(1).join('","');
  commandHistory.push(command);
  currentCommand++;

  let action =
    availableCommands[extractedCommand] ||
    availableCommands.aliases[extractedCommand];

  if (action) {
    console.log(action);
    if (availableCommands.actions[action].slice(-2) === "()") {
      print(
        eval(
          availableCommands.actions[action].slice(0, -1) +
            '["' +
            commandArguments +
            '"])'
        )
      );
    } else {
      print(availableCommands.actions[action]);
    }
  } else {
    print(
      "<div>Cette commande n'existe pas. Tapez 'help' ou '?' pour plus d'aide.</div>"
    );
  }

  localforage.setItem("commandHistory", commandHistory);
  localforage.setItem(
    "terminalContent",
    document.querySelector(".terminal").innerHTML
  );
  askForCommand(terminal);
}

function print(content) {
  let terminal = document.querySelector(".terminal");
  terminal.insertAdjacentHTML("beforeend", content);
}

function transformInput(terminal) {
  let intro = terminal.querySelector(".prompt");
  let input = terminal.querySelector(".command-input");
  let inputContainer = terminal.querySelector(".flex-input");

  inputContainer.textContent = intro.textContent + " " + input.value;
  inputContainer.classList.remove("flex-input");
}

function helpCommand(args) {
  let properties = Object.keys(availableCommands);
  properties.splice(-3, 3);

  if (args && args[0] && availableCommands.helptexts[args[0]]) {
    return (
      "Voici l'aide de la commande " +
      args[0] +
      " :<br>" +
      availableCommands.helptexts[args[0]] +
      ""
    );
  } else {
    return (
      "Voici les commandes disponibles : <br>" +
      properties +
      "<br><br>Vous pouvez aussi trouver l'aide d'une commande, en tapant \"help\" suivi de la commande sur laquelle vous voulez obtenir de l'aide"
    );
  }
}

function rmCommand(args) {
  if (
    args &&
    args[0] ===
      "--i-know-what-i-am-doing-right-now-on-a-website-that-is-not-mine"
  ) {
    return "Ah là là, vous faites vraiment tout ce qu'on vous dit";
  } else {
    return "C'est toujours une mauvaise idée. Si vous voulez être sûr, tapez --i-know-what-i-am-doing-right-now-on-a-website-that-is-not-mine";
  }
}

function mailCommand(args) {
  if (args[0]) {
    window.open(
      "mailto:contact@arnodubo.is?subject=" +
        encodeURIComponent(args.join(" ")) +
        "&body=Bonjour%2C%0AJe%20vous%20veux%20dans%20mon%20%C3%A9quipe.%0A%0ACordialement%2C%0AMartine%20Dupont",
      "_top"
    );
  } else {
    window.open(
      "mailto:contact@arnodubo.is?subject=J'ai%20quelques%20travaux%20pour%20vous&body=Bonjour%2C%0AJe%20vous%20veux%20dans%20mon%20%C3%A9quipe.%0A%0ACordialement%2C%0AMartine%20Dupont",
      "_top"
    );
  }
  return "Vous avez plus qu'à m'envoyer un mail @ <a href=\"mailto:contact@arnodubo.is?subject=J'ai%20quelques%20travaux%20pour%20vous\">contact@arnodubo.is</a>";
}

function projectsCommand() {
  let output = '<div class="projects-container">';
  projects.forEach(project => {
    output += `<div>
      <figure>
        <img src="${project.thumb}" alt="${project.name}"></img>
        <figcaption>
          <h1>${project.name}</h1>
          <p>${truncateText(project.description, 20)}</p>
        </figcaption>
      </figure>
    </div>`;
  });
  output += "</div>";
  return output;
}
