const displayMain = document.querySelector("#displayMain");
const displayOperation = document.querySelector("#displayOperation");
const MAX_DIGITS = 15;

let lastButtonPressed;


let operand1 = NaN;
let operand2 = NaN;

let lastOperator = "";
let operator = "";

function initializeButtonEvents(){
  const digitButtons = Array.from(document.querySelectorAll(".digit"));
  digitButtons.forEach(button  => {
    if(button.value){
      button.addEventListener('click', (e) => {
        appendToDisplay(e.target.value);

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
        operand1 = stringToNumber(displayMain.textContent);
      } else if (lastOperator === "equals") {
        operand1 = stringToNumber(displayMain.textContent);
      } else {
        operand2 = stringToNumber(displayMain.textContent);
        let result = operate(operand1, operand2, operator);
        displayMain.textContent = result;
        displayOperation.textContent = `${operand1} ${operator} ${operand2} =`;
        operand1 = result;
      }
              
      lastOperator = operator;
      operator = e.target.value;

      displayOperation.textContent = `${operand1} ${operator}`;

      resetInputOnNextDigit = true;
    });
  });

  const negate = document.querySelector("#negate");
  negate.addEventListener('click', () => {
    let text = displayMain.textContent;
    let number = stringToNumber(text);
    if(number){
      number *= -1;
      displayMain.textContent = numberToString(number);
    }
  });

  const clearInput = document.querySelector("#clearInput");
  clearInput.addEventListener('click', () => {
    displayMain.textContent = "0";
  });

  const clearAll = document.querySelector("#clearAll");
  clearAll.addEventListener('click', () => resetCalculator());

  const equal = document.querySelector("#equals");
  equal.addEventListener('click', () => {
    if(operator){
      if(lastOperator === "equals"){
        operand1 = stringToNumber(displayMain.textContent);
      } else {
        operand2 = stringToNumber(displayMain.textContent);
      }
      
      let result = operate(operand1, operand2, operator);
      displayMain.textContent = numberToString(result);
      displayOperation.textContent = `${operand1} ${operator} ${operand2} =`;
      operand1 = result;
      resetInputOnNextDigit = true;
    } else {
      displayOperation.textContent += ' =';
    }

    lastOperator = "equals";
  });
}

function appendToDisplay(digit) {
  let displayText = displayMain.textContent;

  if (resetInputOnNextDigit) {
    displayText = "0";
    resetInputOnNextDigit = false;
  }

  if (digit === "." && displayText.indexOf(".") === -1){
    displayText += digit;
  } else {
    if (displayText.startsWith("0") && displayText.indexOf(".") === -1) {
      displayText = digit;
    } else {
      displayText += digit;
    }
  }

  displayMain.textContent = displayText;
}

function stringToNumber(stringNumber){
  let number = NaN;
  if(stringNumber.indexOf(".") === -1){
    // console.log("parsing int...");
    number = parseInt(stringNumber);
  } else if(stringNumber.indexOf("e") > -1) {
    //deal with exponent here
  } else {
    number = parseFloat(stringNumber);
    // console.log("parsing float...");
  }
  
  return number;
}

function operate(num1, num2, operator) {
  // console.log(`Operating: ${num1}, ${operator}, ${num2}`);
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

  if (operator === 'negate') {
    computed = num2 * -1;
  }

  // if (operator === 'sqrt') {
  //   computed = Math.sqrt(num2);
  // }

  return computed;
}

function numberToString(number) {
  return number.toString();
}

function resetCalculator() {
  operand1 = NaN;
  operand2 = NaN;
  resetInputOnNextDigit = true;
  expression = "";
  operator = "";
  lastButtonPressed = null;

  displayMain.textContent = "0";
  displayOperation.textContent = "";
}

function logOperands(){
  console.log(`Operand1: ${operand1}, Operand2: ${operand2}, Operator: ${operator}`);
}

resetCalculator();
initializeButtonEvents();