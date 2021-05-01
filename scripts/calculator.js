const displayMain = document.querySelector("#displayMain");
const displayOperation = document.querySelector("#displayOperation");
const MAX_DIGITS = 15;

let resetInputOnNextDigit = true; //keeps last input on screen until new input is received
let lastButtonClicked;
let operandLeft = NaN;
let operandRight = NaN;

let equalsOperator = "";
let operator = "";

function initializeButtonEvents(){
  const digitButtons = Array.from(document.querySelectorAll(".digit-button"));
  digitButtons.forEach(button  => {
    if(button.value){
      button.addEventListener('click', (e) => {
        appendToDisplay(e.target.value);
        lastButtonClicked = button;
        console.log(lastButtonClicked);
      });
    }
  });

  const operationButtons = Array.from(document.querySelectorAll(".operation-button"));
  operationButtons.forEach(button => {
    if(button.value){
      button.addEventListener('click', (e) => {
        if(hasStoredOperator()){ 
          
          //if last button was not an operator: do the operation, store the new operator, and update the display
          if(!isLastButtonOperator()){ 
            operandRight = stringToNumber(displayMain.textContent);
            let result = operate(operandLeft, operandRight, operator);
            
            operandLeft = result;
            operandRight = NaN;
            operator = e.target.value;
            
            displayMain.textContent = `${result}`;
            displayOperation.textContent = `${operandLeft} ${operator}`;
          } else {  //otherwise store the replacement operator
            operator = e.target.value;
            displayOperation.textContent = `${operandLeft} ${operator}`;
          }
        } else { //first time operator was pressed, store operator and first operand
          operandLeft = stringToNumber(displayMain.textContent);
          operator = e.target.value;
          displayOperation.textContent = `${operandLeft} ${operator}`;
        }
        
        resetInputOnNextDigit = true;
        lastButtonClicked = button;
      });
    }
  });

  const negate = document.querySelector("#negate");
  negate.addEventListener('click', () => {
    let number = stringToNumber(displayMain.textContent);
    if(number){
      number *= -1;
      displayMain.textContent = numberToString(number);
    }
  });

  // const squareRoot = document.querySelector("#squareRoot");
  // squareRoot.addEventListener('click', () => {
  //   const text = displayMain.textContent;
  //   let number = stringToNumber(text);
  //   if(number){
  //     displayOperation.textContent = `sqrt(${number})`;
  //     number = Math.sqrt(number);
  //     displayMain.textContent = numberToString(number);

  //     if(lastOperator === equal.id){
  //       operand1 = number;
  //     } else {
  //       operand2 = number;
  //     }
  //   }
  // });

  const clearInput = document.querySelector("#clearInput");
  clearInput.addEventListener('click', () => {
    displayMain.textContent = "0";
  });

  const clearAll = document.querySelector("#clearAll");
  clearAll.addEventListener('click', () => resetCalculator());

  const equal = document.querySelector("#equals");
  equal.addEventListener('click', () => {
    console.log(`operator: ${operator}, equalsOperator: ${equalsOperator}`);
    if(isLastButtonEquals()){ //pressing = = = = 
        operandLeft = stringToNumber(displayMain.textContent);
        let result = operate(operandLeft, operandRight, equalsOperator);
        displayOperation.textContent = `${operandLeft} ${equalsOperator} ${operandRight} =`
        displayMain.textContent = numberToString(result);
    } else if (operator) { //normal 
      operandRight = stringToNumber(displayMain.textContent);
      let result = operate(operandLeft, operandRight, operator);
      displayOperation.textContent = `${operandLeft} ${operator} ${operandRight} =`
      displayMain.textContent = numberToString(result);

    } else { //otherwise slap an equals sign on whatever is there
      operandLeft = numberToString(displayMain.textContent);
      displayOperation.textContent = `${operandLeft} =`;
    }

    resetInputOnNextDigit = true; 
    
    equalsOperator = (operator) ? operator : equalsOperator;
    operator = "";
    lastButtonClicked = equal;
  });
}

function appendToDisplay(digit) {
  let displayText = displayMain.textContent;

  if (resetInputOnNextDigit || isNaN(displayText)) {
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

function isLastButtonOperator(){
  if(lastButtonClicked){
    return lastButtonClicked.classList.contains("operation-button") ? true : false;
  }

  return false;
}

function isLastButtonEquals(){
  if(lastButtonClicked){
    return lastButtonClicked.id === "equals" ? true : false;
  }

  return false;
}

function hasStoredOperator(){
  return Boolean(operator);
}

function updateExpressionDisplay(){
  let displayItems = [];
  //if we have an operator build the expression from left to right and display
  if(!isNaN(operandLeft)) {
    displayItems.push(operandLeft);
    
    if(operator){
      displayItems.push(operator);

      if(!isNaN(operandRight)){
        displayItems.push(operandRight);
      }
    }
  }

  if(isLastButtonEquals()){
    displayItems.push("=");
  }

  displayOperation.textContent = displayItems.join(" ");
}

function stringToNumber(stringNumber){
  let number = NaN;
  if(stringNumber.indexOf(".") === -1){
    number = parseInt(stringNumber);
  } else if(stringNumber.indexOf("e") > -1) {
    //solve exponent here
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
  return isNaN(number) ? "Error!" : number.toString();
}

function resetCalculator() {
  operandLeft = NaN;
  operandRight = NaN;
  resetInputOnNextDigit = true;
  lastButtonClicked = null;
  operator = "";

  displayMain.textContent = "0";
  displayOperation.textContent = "";
}

resetCalculator();
initializeButtonEvents();