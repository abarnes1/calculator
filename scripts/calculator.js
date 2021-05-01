const displayMain = document.querySelector("#displayMain");
const displayOperation = document.querySelector("#displayOperation");


let resetInputOnNextDigit = true;
let operand1 = NaN;
let operand2 = NaN;
let screenText = "0";
let lastResult = NaN;
let operator = "";

function initializeButtonEvents(){
  const digitButtons = Array.from(document.querySelectorAll(".digit"));
  digitButtons.forEach(button  => {
    if(button.value){
      button.addEventListener('click', (e) => {
        appendInput(e.target.value);
        displayMain.textContent = screenText;

        if(operand1){
          expression = `${operand1} ${operator}`;
          displayOperation.textContent = expression;  
        }
      });
    }
  });

  const operationButtons = Array.from(document.querySelectorAll(".operator-button"));
  operationButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      if(!operator) { //if no operator selected, store the current screen text to first operand 
        console.log("we had no operator stored.");
        operand1 = stringToNumber(screenText);
        displayOperation.textContent = `${operand1} ${operator}`;
      } else {  //otherwise switch the operator
        console.log("Operator was stored.");
      }

      operator = e.target.value;
      displayOperation.textContent = `${operand1} ${operator}`;

      resetInputOnNextDigit = true;
    });
  });

  const clearInput = document.querySelector("#clearInput");
  clearInput.addEventListener('click', () => {
    screenText = "0";
  });

  const clearAll = document.querySelector("#clearAll");
  clearAll.addEventListener('click', () => resetCalculator());

  const equal = document.querySelector("#equals");
  equal.addEventListener('click', () => {

    operand2 = stringToNumber(screenText);
    lastResult = operate(operand1, operand2, operator);
    displayMain.textContent = lastResult;
    displayOperation.textContent = `${operand1} ${operator} ${operand2} =`;
    operand1 = lastResult;
    resetInputOnNextDigit = true;
  });
}

function appendInput(digit) {
  if (resetInputOnNextDigit) {
    screenText = "0";
    resetInputOnNextDigit = false;
  }

  if (digit === "." && screenText.indexOf(".") === -1){
    screenText += digit;
  } else {
    if (screenText.startsWith("0") && screenText.indexOf(".") === -1) {
      screenText = digit;
    } else {
      screenText += digit;
    }
  }
}

function stringToNumber(stringNumber){
  let number = NaN;
  if(stringNumber.indexOf(".") === -1){
    number = parseInt(stringNumber);
  } else if(stringNumber.indexOf("e") === -1) {
    //deal with exponent here
  } else {
    number = parseFloat(stringNumber);
    console.log(number);
  }
  
  return number;
}

function operate(num1, num2, operator) {
  console.log(`Operating: ${num1}, ${num2}, ${operator}`);
  let computed = NaN;

  if (operator === '+') {
    computed = num1 + num2;
  }

  if (operator === '-') {
    computed = num1 - num2;
  }

  if (operator === 'x') {
    computed = num1 * num2;
  }

  if (operator === '/') {
    computed = num1 / num2;
  }

  // if (operator === 'negate') {
  //   computed = num2 * -1;
  // }

  // if (operator === 'sqrt') {
  //   computed = Math.sqrt(num2);
  // }

  return computed;
}

function numberDisplayString(number) {
  return number;
}

function resetCalculator() {
  operand1 = NaN;
  operand2 = NaN;
  resetInputOnNextDigit = true;
  screenText = "0";
  lastResult = 0;
  expression = "";
  operator = "";

  displayMain.textContent = "0";
  displayOperation.textContent = "";
}

resetCalculator();
initializeButtonEvents();