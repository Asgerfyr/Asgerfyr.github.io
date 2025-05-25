//typewriter effect
const tryperContainers = document.querySelectorAll(".js-tryper-container");
let trypers = new Map();
const curserBlinkAfter = 500;

tryperContainers.forEach((container) => {
  const tryper = container.querySelector(".js-tryper");
  const curser = container.querySelector(".js-curser");
  const data = JSON.parse(tryper.dataset.info);

  trypers.set(container, {
    DOM_typer: tryper,
    DOM_curser: curser,
    currentStringData: { index: 0, charIndex: 0 },
    ...data,
  });

  return typewriterNextOperation(container);
});

function typewriterNextOperation(container) {
  const { currentStringData, strings } = trypers.get(container);
  writeMode = strings[currentStringData.index].typeStyle;
  typewriterRemoveBlinkCurser(trypers.get(container).DOM_curser);
  switch (writeMode) {
    case "blink":
      typewriterBlink(container);
      break;
    case "deleteTo":
      typewriterDeleteTo(container);
      break;
    default:
      typewriterAddChar(container);
      break;
  }
}

function typewriterAddChar(container) {
  const { currentStringData, strings, DOM_typer, typeSpeed } =
    trypers.get(container);

  // get char to add
  const currentString = strings[currentStringData.index].string;
  const char = currentString[currentStringData.charIndex];

  // add the next char
  DOM_typer.innerHTML += char;

  // increase charindex
  currentStringData.charIndex++;

  //If charindex is less than string length setinterval this function again
  if (currentStringData.charIndex < currentString.length) {
    return setTimeout(() => {
      typewriterAddChar(container);
    }, typeSpeed);
  }

  return typewriterCleanupPause(
    container,
    strings,
    strings[currentStringData.index].pauseFor
  );
}

function typewriterBlink(container) {
  const { currentStringData, strings, DOM_typer } = trypers.get(container);
  const currentString = strings[currentStringData.index].string;

  DOM_typer.innerHTML = currentString;

  return typewriterCleanupPause(
    container,
    strings,
    strings[currentStringData.index].pauseFor
  );
}

function typewriterDeleteTo(container) {
  const { currentStringData, strings, DOM_typer, typeSpeed } =
    trypers.get(container);

  // get current string to delete to
  const currentString = strings[currentStringData.index].string;

  // delete a char in the string
  DOM_typer.innerHTML = DOM_typer.innerHTML.slice(0, -1);
  // if the object dosent match the object to delete to
  if (
    DOM_typer.innerHTML.length > 0 &&
    DOM_typer.innerHTML != currentString.slice(0, DOM_typer.innerHTML.length)
  ) {
    return setTimeout(() => {
      typewriterDeleteTo(container);
    }, typeSpeed);
  }

  return typewriterCleanupPause(
    container,
    strings,
    strings[currentStringData.index].pauseFor
  );
}

function typewriterCleanupPause(container, strings, pauseFor = 0) {
  const { currentStringData } = trypers.get(container);
  currentStringData.charIndex = 0;
  currentStringData.index++;
  if (currentStringData.index >= strings.length) {
    if (!trypers.get(container).loop) return;
    currentStringData.index = 0;
  }

  //blink curser if idle for more then curserBlinkAfter
  if (pauseFor > curserBlinkAfter) {
    setTimeout(() => {
      typewriterAddBlinkCurser(container);
    }, curserBlinkAfter);
  }
  // else setinterval pause cleanup function
  return setTimeout(() => {
    typewriterNextOperation(container);
  }, pauseFor);
}

function typewriterRemoveBlinkCurser(curser) {
  if (curser.classList.contains("js-blinkcurser")) {
    curser.classList.remove("js-blinkcurser");
  }
}

function typewriterAddBlinkCurser(container) {
  const { DOM_curser } = trypers.get(container);
  DOM_curser.classList.add("js-blinkcurser");
}
