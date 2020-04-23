let x = window.matchMedia('(max-width: 1025px)');

if (x.matches) {
  console.log('small screen');
  document.getElementById('vkb-toggle').style.display = 'initial';
} else {
  console.log('big screen');
  document.getElementById('vkb-toggle').style.display = 'none';
}

// Allows the virtual keyboard to only appear on small screens (mobile) as the base game requires a keyboard
x.addListener(function (changed) {
  if (changed.matches) {
    console.log('small screen');
    document.getElementById('vkb-toggle').style.display = 'initial';
  } else {
    console.log('big screen');
  }
});

//Assigning Global Variables
const baseURL = 'https://pokeapi.co/api/v2/pokemon?limit=151';
const possiblePokemon = [];

axios.get(baseURL).then((res) => {
  const pokesArray = res.data.results;

  for (let i = 0; i < pokesArray.length; i++) {
    const pokemon = pokesArray[i].name;
    possiblePokemon.push(pokemon);
  }
});

const maxGuesses = 10;
let guessedLetters = [];
let guessingName;
let nameToMatch;
let numGuesses;
let userGuess;
let wins = 0;
let losses = 0;

//Used to reset current Pokemon display, and start game
setTimeout(resetPokemon, 1000);

function resetPokemon() {
  //Fills remaining guesses with max(10)
  numGuesses = maxGuesses;

  //Pulls random Pokemon from array
  nameToMatch = possiblePokemon[
    Math.floor(Math.random() * possiblePokemon.length)
  ].toUpperCase();

  axios
    .get(`https://pokeapi.co/api/v2/pokemon/${nameToMatch.toLowerCase()}/`)
    .then((res) => {
      let pokeImg = res.data.sprites.front_default;
      document.getElementById('pokemonImg').src = pokeImg;
    });

  //If you'd like to cheat, here you go
  console.log(nameToMatch);

  //Empty arrays for storing guessed letters
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

//Check if key input is alpha
const isAlpha = function (ch) {
  return /^[A-Z]$/i.test(ch);
};

//Start game if letter is pressed
document.onkeyup = function (event) {
  userGuess = event.key;

  if (isAlpha(userGuess)) {
    checkForLetter(userGuess.toUpperCase());
    //Alert user to input alpha key if non-alpha key is released
  } else alert('Please enter an Alphabetic key to play!');
};

//Function for checking letter inputs against randomly selected Pokemon name
function checkForLetter(letter) {
  userGuess = Keyboard.lastKeyPressed;
  //Create local var to be used for non correct keys
  let foundLetter = false;

  //For loop for correct letters
  for (let i = 0, x = nameToMatch.length; i < x; i++) {
    if (letter === nameToMatch[i]) {
      guessingName[i] = letter;
      foundLetter = true;

      //Increment wins and update screen
      if (guessingName.join('') === nameToMatch) {
        wins++;
        setTimeout(resetPokemon, 3000);
      }
    }
    updateScreen();
  }

  //If wrong letter, decrement remaining guesses
  if (!foundLetter) {
    if (!guessedLetters.includes(letter)) {
      guessedLetters.push(letter);
      numGuesses--;
    }

    //If remaining guesses equals 0, increment losses and update screen
    if (numGuesses === 0) {
      guessingName = nameToMatch.split();
      losses++;
      setTimeout(resetPokemon, 3000);
    }
  }
  updateScreen();
}

//Update HTML
function updateScreen() {
  document.getElementById('totalWins').innerText = wins;
  document.getElementById('totalLosses').innerText = losses;
  document.getElementById('currentPokemon').innerText = guessingName.join('');
  document.getElementById('currentPokemonInput').value = '';
  document.getElementById('remainingGuesses').innerText = numGuesses;
  document.getElementById('guessedLetters').innerText = guessedLetters.join(
    ' '
  );
}
