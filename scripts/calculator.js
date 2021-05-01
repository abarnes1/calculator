const displayMain = document.querySelector("#displayMain");
const displayOperation = document.querySelector("#displayOperation");
const MAX_DIGITS = 15;

let resetInputOnNextDigit = true;
let lastButtonWasOperator = false;
let operand1 = NaN;
let operand2 = NaN;

let lastOperator = "";
let operator = "";

function initializeButtonEvents(){
  const digitButtons = Array.from(document.querySelectorAll(".digit-button"));
  digitButtons.forEach(button  => {
    if(button.value){
      button.addEventListener('click', (e) => {
        appendToDisplay(e.target.value);
      });
    }
  });

  const operationButtons = Array.from(document.querySelectorAll(".operation-button"));
  operationButtons.forEach(button => {
    if(button.value){
      button.addEventListener('click', (e) => {
        if(!operator) { //if no operator selected or we just pressed equals, store the current input to the first operand for the "left" side
          operand1 = stringToNumber(displayMain.textContent);
        } else if(lastButtonWasOperator) {
          operand2 = NaN
        } else {
          operand2 = stringToNumber(displayMain.textContent);
          let result = operate(operand1, operand2, operator);
          displayMain.textContent = result;
          operand1 = result;
        }
                
        lastOperator = operator;
        operator = e.target.value;

        updateExpressionDisplay();
        // displayOperation.textContent = `${operand1} ${operator}`;

        lastButtonWasOperator = true;
        resetInputOnNextDigit = true;
      });
    }
  });

  const negate = document.querySelector("#negate");
  negate.addEventListener('click', () => {
    const text = displayMain.textContent;
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
      if(lastOperator === equal.id){
        operand1 = stringToNumber(displayMain.textContent);
      } else {
        operand2 = stringToNumber(displayMain.textContent);
      }

      lastOperator = equal.id;

      const result = operate(operand1, operand2, operator);
      displayMain.textContent = numberToString(result);
      updateExpressionDisplay();
      operand1 = result;
      resetInputOnNextDigit = true;
    } else {
      updateExpressionDisplay();
    }
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

function updateExpressionDisplay(){
  let displayItems = [];
  //if we have an operator build the expression from left to right and display
  if(!isNaN(operand1)) {
    displayItems.push(operand1);
    
    if(operator){
      displayItems.push(operator);

      if(!isNaN(operand2)){
        displayItems.push(operand2);

        if(lastOperator === "equals"){
          displayItems.push("=");
        }
      }
    }
  }

  displayOperation.textContent = displayItems.join(" ");
}

function stringToNumber(stringNumber){
  let number = NaN;
  if(stringNumber.indexOf(".") === -1){
    number = parseInt(stringNumber);
  } else if(stringNumber.indexOf("e") > -1) {
  } else {
    number = parseFloat(stringNumber);
  }
  
  return number;
}

function operate(num1, num2, operator) {
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
  operator = "";

  displayMain.textContent = "0";
  displayOperation.textContent = "";
}

resetCalculator();
initializeButtonEvents();