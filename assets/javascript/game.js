// Assigning Global Variables
const baseURL = 'https://pokeapi.co/api/v2/pokemon?limit=151';
const possiblePokemon = [];

axios.get(baseURL).then((res) => {
  const pokesArray = res.data.results;

  for (let i = 0; i < pokesArray.length; i++) {
    const pokemon = pokesArray[i].name;
    possiblePokemon.push(pokemon);
  }
});

const firstRow = 'qwertyuiop-';
const secondRow = ' asdfghjkl  ';
const thirdRow = ' zxcvbnm,.';
const keyboard = document.querySelector('.game__keyboard');
const maxGuesses = 10;
let guessedLetters = [];
let guessingName;
let nameToMatch;
let numGuesses;
let wins = 0;
let losses = 0;

// Used to reset current Pokemon display, and start game
setTimeout(resetPokemon, 1000);

keyboardGenerator = () => {
  let buttonsFirst = firstRow
    .split('')
    .map(
      (letter) =>
        `   
          <button
           class="game__buttonLetter"
           id="${letter}"
           >${letter}</button>
      
       `
    )
    .join('');
  let buttonsSecond = secondRow
    .split('')
    .map(
      (letter) =>
        `   
          <button
           class="game__buttonLetter"
           id="${letter}"
           >${letter}</button>
      
       `
    )
    .join('');
  let buttonsThird = thirdRow
    .split('')
    .map(
      (letter) =>
        `   
          <button
           class="game__buttonLetter"
           id="${letter}"
           >${letter}</button>
      
       `
    )
    .join('');

  let buttons = buttonsFirst + buttonsSecond + buttonsThird;
  keyboard.innerHTML = buttons;
};

function resetPokemon() {
  const element = document.getElementById('pokemonImg');
  element.classList.remove('pokemonShow');
  keyboardGenerator();

  // Fills remaining guesses with max(10)
  numGuesses = maxGuesses;

  // Pulls random Pokemon from array
  nameToMatch = possiblePokemon[
    Math.floor(Math.random() * possiblePokemon.length)
  ].toUpperCase();

  axios
    .get(`https://pokeapi.co/api/v2/pokemon/${nameToMatch.toLowerCase()}/`)
    .then((res) => {
      let pokeImg = res.data.sprites.front_default;
      document.getElementById('pokemonImg').src = pokeImg;
    });

  // If you'd like to cheat, here you go
  console.log(nameToMatch);

  // Empty arrays for storing guessed letters
  guessedLetters = [];
  guessingName = [];

  for (let i = 0, x = nameToMatch.length; i < x; i++) {
    if (nameToMatch[i] === ' ') {
      guessingName.push(' ');
    } else {
      guessingName.push('_ ');
    }
  }

  updateScreen();
}

// Check if key input is alpha
const isAlpha = function alphaCheck(ch) {
  return /^[A-Z]$/i.test(ch);
};

// Start game if letter is pressed
document.onkeyup = function checkLetter(event) {
  if (isAlpha(event.key)) {
    checkForLetter(event.key.toUpperCase());
    // Alert user to input alpha key if non-alpha key is released
  } else alert('Please enter an Alphabetic key to play!');
};

// Function for checking letter inputs against randomly selected Pokemon name
function checkForLetter(letter) {
  // Create local var to be used for non correct keys
  let foundLetter = false;

  // For loop for correct letters
  for (let i = 0, x = nameToMatch.length; i < x; i++) {
    if (letter === nameToMatch[i]) {
      guessingName[i] = letter;
      foundLetter = true;

      // Increment wins and update screen
      if (guessingName.join('') === nameToMatch) {
        const element = document.getElementById('pokemonImg');
        element.classList.add('pokemonShow');
        wins++;
        setTimeout(resetPokemon, 3000);
      }
    }
    updateScreen();
  }

  // If wrong letter, decrement remaining guesses
  if (!foundLetter) {
    if (!guessedLetters.includes(letter)) {
      guessedLetters.push(letter);
      numGuesses--;
    }

    // If remaining guesses equals 0, increment losses and update screen
    if (numGuesses === 0) {
      guessingName = nameToMatch.split();
      losses++;
      setTimeout(resetPokemon, 3000);
    }
  }
  updateScreen();
}

// Keyboard button presses
buttonPress = () => {
  document
    .querySelector('.game__keyboard')
    .addEventListener('click', (event) => {
      const letter = event.target.id.toUpperCase();
      checkForLetter(letter);
      console.log(letter);
    });
};
buttonPress();

// Update HTML
function updateScreen() {
  document.getElementById('totalWins').innerText = wins;
  document.getElementById('totalLosses').innerText = losses;
  document.getElementById('currentPokemon').innerText = guessingName.join('');
  document.getElementById('remainingGuesses').innerText = numGuesses;
  document.getElementById('guessedLetters').innerText = guessedLetters.join(
    ' '
  );
}
