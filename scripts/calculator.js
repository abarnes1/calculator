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

        if(isLastButtonEquals()){
          displayOperation.textContent = "";
          operator = "";
          equalsOperator = "";
          operandLeft = NaN;
          operandRight = NaN;
        }

        lastButtonClicked = button;
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
          } else {  
            //otherwise store the replacement operator
            operator = e.target.value;
            displayOperation.textContent = `${operandLeft} ${operator}`;
          }
        } else { 
          //first time an operator was pressed, store operator and first operand
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

  const squareRoot = document.querySelector("#squareRoot");
  squareRoot.addEventListener('click', () => {
    //if we have an operator, square root of current input is right operand
    if(hasStoredOperator()){
      let number = stringToNumber(displayMain.textContent);
      operandRight = Math.sqrt(number);

      displayOperation.textContent = `${operandLeft} ${operator} sqrt(${number})`;
      displayMain.textContent = numberToString(operandRight);
    } else {
      //no operator so square root the input and treat as left operand
      let number = stringToNumber(displayMain.textContent);
      operandLeft = Math.sqrt(number);

      displayOperation.textContent = `sqrt(${number})`;
      displayMain.textContent = numberToString(operandLeft);
    }

    lastButtonClicked = squareRoot;


    // let number = stringToNumber(displayMain.textContent);
    // if(number){
    //   displayOperation.textContent = `sqrt(${number})`;
    //   number = Math.sqrt(number);
    //   displayMain.textContent = numberToString(number);

    //   //&Sqrt;

    //   // if(lastOperator === equal.id){
    //   //   operand1 = number;
    //   // } else {
    //   //   operand2 = number;
    //   // }
    // }
  });

  const clearInput = document.querySelector("#clearInput");
  clearInput.addEventListener('click', () => {
    displayMain.textContent = "0";
  });

  const clearAll = document.querySelector("#clearAll");
  clearAll.addEventListener('click', () => resetCalculator());

  const equal = document.querySelector("#equals");
  equal.addEventListener('click', () => {

    //pressing = = = = = to repeat the last operation
    if(isLastButtonEquals() && hasStoredEqualsOperator()){ 
        operandLeft = stringToNumber(displayMain.textContent);
        let result = operate(operandLeft, operandRight, equalsOperator);
        displayOperation.textContent = `${operandLeft} ${equalsOperator} ${operandRight} =`
        displayMain.textContent = numberToString(result);
    } else if (hasStoredOperator()) { 
      //normal a + b type of operation
      operandRight = stringToNumber(displayMain.textContent);
      let result = operate(operandLeft, operandRight, operator);
      displayOperation.textContent = `${operandLeft} ${operator} ${operandRight} =`
      displayMain.textContent = numberToString(result);
    } else { 
      //pressing = without an operator
      operandLeft = stringToNumber(displayMain.textContent);
      displayOperation.textContent = `${operandLeft} =`;
    }

    resetInputOnNextDigit = true; 
    
    equalsOperator = (operator) ? operator : equalsOperator;
    operator = "";
    lastButtonClicked = equal;

    updateExpressionDisplay();
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

function hasStoredEqualsOperator(){
  return Boolean(equalsOperator);
}

function updateExpressionDisplay(){
  let displayItems = [];
  //if we have an operator build the expression from left to right and display
  // if(!isNaN(operandLeft)) {
  //   displayItems.push(operandLeft);
    
  //   if(operator){
  //     displayItems.push(operator);

  //     if(!isNaN(operandRight)){
  //       displayItems.push(operandRight);
  //     }
  //   }
  // }
  
  if(isLastButtonEquals()){
    displayItems.push("=");
  }

  //displayOperation.textContent = displayItems.join(" ");
  console.log(displayItems.join(" "));
}

function stringToNumber(stringNumber){
  console.log(`Parsing: ${stringNumber}`);
  let number = NaN;
  // if(stringNumber.indexOf("e") > -1){
  //   //solve exponent here
  // } else {
  //   number = parseFloat(stringNumber);
  // }

  if(stringNumber.indexOf(".") === -1){
    number = parseInt(stringNumber);
  } else if(stringNumber.indexOf("e") > -1) {
    //solve exponent here
  } else {
    number = parseFloat(stringNumber);
  }
  
  console.log(`Parse output: ${number}`);

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

  return computed;
}

function numberToString(number) {
  let result = "";
  if (isNaN(number)) {
    result = "Error!";
  } else if (!isFinite(number)){
    result = "Overflow!";
  } else {
    result = number.toFixed(12);
    if (result.includes(".")){
      result = result.replace(/0*$/, ""); //trims 0 from the end
    }
  
    result = result.replace(/\.$/, "", ""); //trims . from the end
  }

  console.log(`Number ${number} converted string: ${result}`);

  return result;
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