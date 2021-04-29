const displayMain = document.querySelector("#displayMain");
let num1 = 0;
let num2 = 0;
let operation = null;

let firstNum = 0;
let secondNum = 0;

console.log(displayMain);

function initializeButtonEvents(){
  let buttons = Array.from(document.querySelectorAll("button"));

  buttons.forEach(button  => {
    if(button.value){
      button.addEventListener('click', (e) => {
        // if(!isNaN(e.target.value)){
          appendDigit(e.target.value);
        // }
      });
    }
    // button.addEventListener('click', (e) => {
    //   if(e.target.value && !isNaN(e.target.value)){
    //     appendDigit(e.target.value);
    //   } else {
    //     console.log(e.target.id);
    //   }
    // });
  });
}

function appendDigit(digit){
  if(operation === null){
    let temp = num1.toString() + digit.toString();
    num1 = parseFloat(num1.toString() + digit.toString());
    updateDisplay();
  }
}

function updateDisplay(){
  displayMain.textContent = num1;
}

function resetCalculator() {
  num1 = 0;
  num2 = 0;
  operation = null;
  updateDisplay();
}

resetCalculator();
initializeButtonEvents();