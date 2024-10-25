let noteCreationInterval = 350; //350
let noteSpeed = 25; //25
let difficultyIncreaseInterval;
const backgroundVideo = document.getElementById('background-video');
let highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0;

backgroundVideo.style.filter = 'brightness(100%)';

if (highScore > 999) {
  highScore = 0;
  localStorage.setItem('highScore', highScore);
}

function checkHighScore() {
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('highScore', highScore);
  }
}

function displayHighScore() {
  document.getElementById('high-score').textContent = `Recorde: ${highScore}`;
}

backgroundVideo.addEventListener('canplay', function() {
  console.log('O vídeo está pronto para ser reproduzido.');
});

function increaseDifficulty() {
  if (noteCreationInterval > 200) {
    noteCreationInterval -= 50;
    clearInterval(noteInterval);
    noteInterval = setInterval(createNote, noteCreationInterval);
  }
  if (noteSpeed < 40) {
    noteSpeed += 1.5;
  }
}

const lines = {
  'a': document.getElementById('line-a'),
  's': document.getElementById('line-s'),
  'd': document.getElementById('line-d'),
  'f': document.getElementById('line-f'),
};

const keys = ['a', 's', 'd', 'f'];
let score = 0;
let notes = [];
let mistakes = 0;
const maxMistakes = 7;

let noteInterval;
let moveInterval;

function createNote() {
  const key = keys[Math.floor(Math.random() * keys.length)];
  const note = document.createElement('div');
  note.classList.add('note');
  note.dataset.key = key;
  note.dataset.missed = 'false';
  note.dataset.hit = 'false'; 
  note.style.top = '-60px';
  lines[key].appendChild(note);
  notes.push(note);
}

function moveNotes() {
  notes.forEach((note, index) => {
    const top = parseInt(note.style.top || -60);
    if (top > 490 && note.dataset.missed === 'false') {
      note.dataset.missed = 'true';
      lines[note.dataset.key].classList.add('flash');
      setTimeout(() => {
        lines[note.dataset.key].classList.remove('flash');
      }, 200);
      note.remove();
      notes.splice(index, 1);
      registerMistake();
    } else if (note.dataset.missed === 'false') {
      note.style.top = `${top + noteSpeed}px`;
    }
  });
}

function checkKeyPress(event) {
  const key = event.key.toLowerCase();
  if (keys.includes(key)) {
    const line = lines[key];
    const note = notes.find(n => n.dataset.key === key && n.dataset.hit === 'false' && n.dataset.missed === 'false');
    if (note) {
      const notePosition = parseInt(note.style.top);
      if (notePosition > 300 && notePosition < 520) {
        note.dataset.hit = 'true'; 
        note.remove(); 
        notes = notes.filter(n => n !== note); 
        score++;
        document.getElementById('score').textContent = `Score: ${score}`;
        const fire = document.createElement('div');
        fire.classList.add('fire-effect');
        const flame = document.createElement('div');
        flame.classList.add('fire-flame');
        fire.appendChild(flame);
        const smallFlame = document.createElement('div');
        smallFlame.classList.add('fire-flame-small');
        fire.appendChild(smallFlame);
        line.appendChild(fire);
        setTimeout(() => {
          fire.remove();
        }, 400);
      }
    }
  }
}

function startBackgroundVideo() {
  backgroundVideo.style.display = 'block';
  backgroundVideo.play();
}

function registerMistake() {
  mistakes++;
  if (mistakes >= maxMistakes) {
    endGame();
  }
}

function endGame() {
  clearInterval(noteInterval);
  clearInterval(moveInterval);
  clearInterval(difficultyIncreaseInterval);
  checkHighScore();
  document.getElementById('final-score').textContent = score;
  document.getElementById('high-score').textContent = `Recorde: ${highScore}`;
  document.getElementById('game-over').classList.remove('hidden');
  document.getElementById('game-container').classList.add('hidden');
  document.getElementById('score').classList.add('hidden');
}

function restartGame() {
  score = 0;
  mistakes = 0;
  noteCreationInterval = 300;
  noteSpeed =25;
  document.getElementById('score').textContent = `Score: ${score}`;
  document.getElementById('high-score').textContent = `Recorde: ${highScore}`;
  document.getElementById('game-over').classList.add('hidden');
  document.getElementById('game-container').classList.remove('hidden');
  document.getElementById('score').classList.remove('hidden');
  notes.forEach(note => note.remove());
  notes = [];
  clearInterval(noteInterval);
  clearInterval(moveInterval);
  clearInterval(difficultyIncreaseInterval);
  startGame();
}

document.addEventListener('keydown', checkKeyPress);

function startGame() {
  noteInterval = setInterval(() => {
    createNote();
  }, noteCreationInterval);

  moveInterval = setInterval(() => {
    moveNotes();
  }, 50);
  difficultyIncreaseInterval = setInterval(increaseDifficulty, 8000);
  displayHighScore();
}

startGame();