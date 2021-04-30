const displayMain = document.querySelector("#displayMain");
const displayOperation = document.querySelector("#displayOperation");

let resetInputOnNextDigit = true;
let inputString = "0";
let storedNumber = 0;
let operation = null;

console.log(displayMain);

function initializeButtonEvents(){
  const digitButtons = Array.from(document.querySelectorAll(".digit"));
  digitButtons.forEach(button  => {
    if(button.value){
      button.addEventListener('click', (e) => {
        appendInput(e.target.value);
        updateDisplay();
      });
    }
  });

  const operationButtons = Array.from(document.querySelectorAll(".operation-button"));
  operationButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      storedNumber = inputString;
      operation = e.target.value;

      resetInputOnNextDigit = true;

      updateDisplay();
    });
  });

  const clearInput = document.querySelector("#clearInput");
  clearInput.addEventListener('click', () => {
    inputString = "0";
    updateDisplay();
  });

  const clearAll = document.querySelector("#clearAll");
  clearAll.addEventListener('click', () => resetCalculator());
}

function appendInput(input) {
  if (resetInputOnNextDigit) {
    inputString = "0";
    resetInputOnNextDigit = false;
  }

  if (inputString === "0") {
    inputString = "";
  }

  if (inputString.indexOf(".") === -1){
    inputString += input;
  } else if(input !== "."){
    inputString += input;
  }

  updateDisplay();
}

function operate(num1, num2, operator) {
  
}

function updateDisplay(){
  displayMain.textContent = numberDisplayString(inputString);
  displayOperation.textContent = getOperationDisplay();
}

function getOperationDisplay() {
  let display = "";
  if (operation !== null){
    display = `${numberDisplayString(storedNumber)} ${operation}`;
  }

  return display;
}

function numberDisplayString(number) {
  return number;
}

function resetCalculator() {
  resetInputOnNextDigit = true;
  inputString = "0";
  storedNumber = 0;
  operation = null;
  updateDisplay();
}

resetCalculator();
initializeButtonEvents();