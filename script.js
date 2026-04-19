let totalQuestions = 80;
let current = 0;
let score = 0;

let startTime;
let questionStart;

let questionSet = [];
let wrongQuestions = [];

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateQuestion() {
  let level = document.getElementById("level").value;

  let modes;

  if (level == 1) modes = ["table","square"];
  else if (level == 2) modes = ["table","square","cube"];
  else if (level == 3) modes = ["table","cube","factorial","power"];
  else modes = ["table","square","cube","factorial","fraction","power","trick"];

  let mode = modes[random(0, modes.length-1)];

  let q, ans;

  if (mode === "table") {
    let a = random(7,25), b = random(1,15);
    q = `${a} × ${b}`;
    ans = a*b;
  }

  else if (mode === "square") {
    let n = random(1,25);
    q = `${n}²`;
    ans = n*n;
  }

  else if (mode === "cube") {
    let n = random(1,20);
    q = `${n}³`;
    ans = n*n*n;
  }

  else if (mode === "factorial") {
    let n = random(1,8);
    ans = 1;
    for (let i=1;i<=n;i++) ans*=i;
    q = `${n}!`;
  }

  else if (mode === "fraction") {
    let n = random(1,25);
    q = `1/${n} in %`;
    ans = 100/n;
  }

  else if (mode === "power") {
    let base = [2,3,4,8,22,23,24,25][random(0,7)];
    let expLimits = {2:14,3:7,4:6,8:4,22:4,23:3,24:4,25:3};
    let e = random(1, expLimits[base]);
    q = `${base}^${e}`;
    ans = Math.pow(base,e);
  }

  else {
    let specials = [11,5,0.25,0.125,99,999];
    let a = random(10,200);
    let b = specials[random(0, specials.length-1)];
    q = `${a} × ${b}`;
    ans = a*b;
  }

  return {q, ans};
}

for (let i = 0; i < totalQuestions; i++) {
  questionSet.push(generateQuestion());
}

function loadQuestion() {
  if (current === 0) startTime = Date.now();

  questionStart = Date.now();

  document.getElementById("qnum").innerText = current + 1;

  let qObj = questionSet[current];
  document.getElementById("question").innerText = qObj.q;

  document.getElementById("answer").value = "";
  document.getElementById("feedback").innerText = "";
}

function check() {
  let user = document.getElementById("answer").value.trim();
  let correct = questionSet[current].ans;

  let timeTaken = (Date.now() - questionStart)/1000;

  let isCorrect =
    Math.abs(Number(user) - Number(correct)) < 0.001
    && timeTaken <= 5;

  if (isCorrect) {
    score++;
    document.getElementById("feedback").innerText = "Correct";
  } else {
    document.getElementById("feedback").innerText =
      `Wrong: ${correct}`;
    wrongQuestions.push(questionSet[current]);
  }

  document.getElementById("score").innerText = score;

  current++;

  if (current < questionSet.length) {
    setTimeout(loadQuestion, 800);
  } else {
    repeatWrong();
  }
}

function repeatWrong() {
  if (wrongQuestions.length === 0) {
    endQuiz();
    return;
  }

  questionSet = wrongQuestions;
  wrongQuestions = [];
  current = 0;

  alert("Repeating wrong questions");
  loadQuestion();
}

function endQuiz() {
  let totalTime = (Date.now() - startTime)/1000;
  let avg = (totalTime/totalQuestions).toFixed(2);

  document.getElementById("question").innerText = "Finished!";
  document.getElementById("feedback").innerText =
    `Score: ${score}/${totalQuestions} | Avg: ${avg}s`;
}

document.getElementById("answer").addEventListener("keypress", function(e) {
  if (e.key === "Enter") check();
});

setInterval(() => {
  if (startTime) {
    let t = Math.floor((Date.now() - startTime)/1000);
    document.getElementById("time").innerText = t;
  }
}, 1000);

loadQuestion();
