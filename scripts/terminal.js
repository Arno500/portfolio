import {
  showElement,
  scrollToElm,
  truncateText,
  setCaretPosition,
  stripHTML,
  encodeToHTML,
  switchSwitcher
} from "./utils";
import * as localforage from "localforage";
import { projectClickHandler, switchMode } from "./events";
// import { resolve } from "url";

const availableCommands = require("../data/commands.json");
const projects = require("../data/projects.json");
var pressed = false;
var resuming = false;
var finished = true;
var commandHistory = [""];
var currentCommand = 0;

function stopKeyDown(event) {
  pressed = false;
  document.removeEventListener("keyup", stopKeyDown);
}

export function startCommandLineMode(container, scroll = "") {
  let terminal = document.createElement("section");
  terminal.className = "terminal hidden";
  container.insertAdjacentElement("beforeend", terminal);

  Promise.all([
    //localforage.getItem("terminalContent"),
    localforage.getItem("commandHistory")
  ])
    .then(values => {
      var commandHistoryArray = JSON.parse(values[0]);
      if (!values[0] /* || !values[1] */) {
        //localforage.setItem("terminalContent", "");
        localforage.setItem("commandHistory", JSON.stringify([]));
        buildTerminal("", terminal, scroll);
      } else {
        buildTerminal(commandHistoryArray, terminal, scroll);
        commandHistory = commandHistoryArray;
        currentCommand = commandHistoryArray.length;
      }
    })
    .catch(error =>
      console.error(
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
  terminal.insertAdjacentHTML(
    "beforeend",
    "<span>Bienvenue dans la console Arnaux & Co !</span><br><span>Pour commencer, tapez 'help' ou '?'</span><br>"
  );
  askForCommand(terminal);

  if (
    oldContent !== "" ||
    (typeof oldContent !== "undefined" && oldContent.length > 0)
  ) {
    //terminal.insertAdjacentHTML("beforeend", oldContent);
    resuming = true;
    oldContent.forEach(command => {
      commandInterpreter(command, true);
    });
    resuming = false;
  }
  setTimeout(function() {
    projectClickHandler();
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
  //event.preventDefault();
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

function commandInterpreter(command, nohistory = false) {
  let terminal = document.querySelector(".terminal");
  transformInput(terminal, command);

  let commandArray = command.trim().split(" ");
  let extractedCommand = commandArray[0].toLowerCase();
  let commandArguments = commandArray.slice(1).join('","');
  commandHistory.push(command);
  currentCommand++;

  let action =
    availableCommands[extractedCommand] ||
    availableCommands.aliases[extractedCommand];

  if (!resuming) {
    _paq.push([
      "trackEvent",
      "Commande",
      extractedCommand,
      "",
      action ? 1 : false
    ]);
  }

  if (action) {
    if (availableCommands.actions[action].slice(-2) === "()") {
      var functionResult = eval(
        availableCommands.actions[action].slice(0, -1) +
          '["' +
          commandArguments +
          '"])'
      );
      if (functionResult && functionResult.output) {
        print(functionResult.output);
      }
      if (functionResult && typeof functionResult.after === "function") {
        functionResult.after();
      }
    } else {
      print(availableCommands.actions[action]);
    }
  } else {
    print(
      "<div>Cette commande n'existe pas. Tapez 'help' ou '?' pour plus d'aide.</div>"
    );
  }

  let cleanCommandHistory = commandHistory.filter(n => {
    if (n != "") {
      return n;
    }
  });

  if (nohistory === false) {
    localforage.setItem("commandHistory", JSON.stringify(cleanCommandHistory));
  }
  /* localforage.setItem(
    "terminalContent",
    document.querySelector(".terminal").innerHTML
  ); */
  if (finished === true) {
    askForCommand(terminal);
  }
}

function print(content) {
  let terminal = document.querySelector(".terminal");
  terminal.insertAdjacentHTML("beforeend", content);
  terminal.scrollTop = terminal.scrollHeight;
}

function transformInput(terminal, command) {
  let intro = terminal.querySelector(".prompt");
  let input = terminal.querySelector(".command-input");
  let inputContainer = terminal.querySelector(".flex-input");

  if (inputContainer) {
    inputContainer.textContent = intro.textContent + " " + command;
    inputContainer.classList.remove("flex-input");
  }
}

function helpCommand(args) {
  let properties = Object.keys(availableCommands);
  properties.splice(-3, 3);

  if (args && args[0] && availableCommands.helptexts[args[0]]) {
    return {
      output:
        "Voici l'aide de la commande " +
        args[0] +
        " :<br>" +
        availableCommands.helptexts[args[0]] +
        ""
    };
  } else {
    return {
      output:
        "Voici les commandes disponibles : <br>" +
        properties +
        "<br><br>Vous pouvez aussi trouver l'aide d'une commande, en tapant \"help\" suivi de la commande sur laquelle vous voulez obtenir de l'aide"
    };
  }
}

function rmCommand(args) {
  if (
    args &&
    args[0] ===
      "--i-know-what-i-am-doing-right-now-on-a-website-that-is-not-mine"
  ) {
    return { output: "Ah là là, vous faites vraiment tout ce qu'on vous dit" };
  } else if (args && args[0]) {
    return { output: "Permission refusée." };
  } else {
    return {
      output:
        "C'est toujours une mauvaise idée. Si vous voulez être sûr, tapez --i-know-what-i-am-doing-right-now-on-a-website-that-is-not-mine"
    };
  }
}

function mailCommand(args) {
  if (!resuming) {
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
  }
  return {
    output:
      "Vous n'avez plus qu'à m'envoyer un mail @ <a href=\"mailto:contact@arnodubo.is?subject=J'ai%20quelques%20travaux%20pour%20vous\">contact@arnodubo.is</a> !"
  };
}

function projectsCommand() {
  let output = '<ul class="projects-container card-model">';
  projects.forEach(project => {
    output += `<li data-name="${encodeToHTML(
      project.name
    )}" data-description="${encodeToHTML(
      project.description
    )}" data-action="${encodeToHTML(project.action)}" data-type="${
      project.type
    }" data-link="${encodeToHTML(project.link)}" data-yt-code="${encodeToHTML(
      project.ytCode
    )}" data-link-infos="${encodeToHTML(JSON.stringify(project.linkInfos))}"
      tabindex="0"
    >
      <figure>
      <picture>
        <source type="image/webp" srcset="${project.thumbWebp}">
        <source type="image/jpeg" srcset="${project.thumb}">
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
    </li>`;
  });
  output += "</ul>";
  return {
    output,
    after: projectClickHandler
  };
}

function catCommand(args) {
  if (args[0] === "index.html") {
    finished = false;
    var html = document.documentElement.innerHTML;
    var cleanhtml = html.replace(
      /((<div class="dot).*(><\/div>)+)|(<pre>.*<\/pre>)|((<a).*(qc-cmp-persistent-link).*(<\/a>))/gm,
      ""
    );
    if (resuming) {
      let oneblockarray = cleanhtml
        .split("\n")
        .map(elm => encodeToHTML(elm))
        .join("<br>");
      finished = true;
      return { output: "<pre>" + oneblockarray + "</pre>" };
    } else {
      outputing(cleanhtml.split("\n"));
    }
    function outputing(previousOutput, preCode) {
      const numberOfLinesToShow = 6;
      var showing = previousOutput
        .slice(0, numberOfLinesToShow)
        .map(elm => encodeToHTML(elm));
      var remaining = previousOutput;
      previousOutput.splice(0, numberOfLinesToShow);
      var terminal = document.querySelector(".terminal");
      if (!preCode) {
        var preCode = document.createElement("pre");
        preCode.classList.add("pre-current");
        terminal.insertAdjacentElement("beforeend", preCode);
      }
      preCode.insertAdjacentHTML("beforeend", showing.join("<br>"));
      terminal.scrollTop = terminal.scrollHeight;

      if (showing.length < numberOfLinesToShow) {
        finished = true;
        print("</pre>");
        askForCommand(document.querySelector(".terminal"));
        return { output: "" };
      } else {
        setTimeout(function() {
          outputing(remaining, preCode);
        }, 200);
      }
    }
    return { output: "" };
  } else if (args && args[0]) {
    return { output: "Permission refusée ⛔" };
  } else {
    return { output: "^C~" };
  }
}

function exitCommand(args) {
  if (!resuming) {
    switchMode("mode-gui");
    switchSwitcher(true);
    commandHistory.splice(-1, 1);
  }
  return { output: "" };
}
