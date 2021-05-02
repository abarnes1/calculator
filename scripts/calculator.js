const displayMain = document.querySelector("#displayMain");
const displayOperation = document.querySelector("#displayOperation");
const MAX_DIGITS = 15;

let resetInputOnNextDigit = true; //keeps last input on screen until new input is received
let lastButtonClicked;
let operandLeft = NaN;
let operandRight = NaN;
let lastResult = NaN;
let errorState = false;

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

        if(errorState) {
          setErrorState(false);
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
            operandRight = parseFloat(displayMain.textContent);
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
          operandLeft = parseFloat(displayMain.textContent);
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
    let number = parseFloat(displayMain.textContent);
    if(number){
      number *= -1;
      displayMain.textContent = getDisplayString(number, MAX_DIGITS);
    }
  });

  const squareRoot = document.querySelector("#squareRoot");
  squareRoot.addEventListener('click', () => {
    //if we have an operator, square root of current input is right operand
    if(hasStoredOperator()){
      let number = parseFloat(displayMain.textContent);
      operandRight = Math.sqrt(number);

      displayOperation.textContent = `${operandLeft} ${operator} sqrt(${number})`;
      displayMain.textContent = getDisplayString(operandRight, MAX_DIGITS);
    } else {
      //no operator so square root the input and treat as left operand
      let number = parseFloat(displayMain.textContent);
      operandLeft = Math.sqrt(number);

      displayOperation.textContent = `sqrt(${number})`;
      displayMain.textContent = getDisplayString(operandLeft, MAX_DIGITS);
    }

    lastButtonClicked = squareRoot;
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
        operandLeft = lastResult;
        let result = operate(operandLeft, operandRight, equalsOperator);
        lastResult = result;

        displayOperation.textContent = `${operandLeft} ${equalsOperator} ${operandRight} =`
        displayMain.textContent = getDisplayString(lastResult, MAX_DIGITS);
    } else if (hasStoredOperator()) { 
      //normal a + b type of operation
      operandRight = parseFloat(displayMain.textContent);
      let result = operate(operandLeft, operandRight, operator);
      lastResult = result;

      displayOperation.textContent = `${operandLeft} ${operator} ${operandRight} =`
      displayMain.textContent = getDisplayString(lastResult, MAX_DIGITS);
    } else { 
      //pressing = without an operator
      operandLeft = parseFloat(displayMain.textContent);
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

  if (digit === "." && displayText.indexOf(".") === -1){ //first decimal
    displayText += digit;
  } else {
    if (displayText.startsWith("0") && displayText.indexOf(".") === -1) {
      displayText = digit;
    } else if (digit !== ".") {
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

function operate(num1, num2, operator) {
  let computed = NaN;

  if (operator === '+') {
    computed = num1 + num2;
  } else if (operator === '-') {
    computed = num1 - num2;
  } else if (operator === 'x') {
    computed = num1 * num2;
  } else if (operator === '/') {
    computed = num1 / num2;
  }

  return computed;
}

function getDisplayString(number, maxLength){
  if(isNaN(number)){
    setErrorState(true);
    return "Error!";
  }

  if(!isFinite(number)){
    setErrorState(true);
    return "Overflow!";
  }

  let result = "";

  //force large numbers to exponential format
  const integerDigits = parseInt(number).toString().length;
  //force very small numbers to exponential format
  const lowerBound = (number > 0) ? Math.pow(10, -(maxLength) + "0.".length) : Math.pow(-10, -(maxLength) + "-0.".length);

  let stringValue;

  if(integerDigits > maxLength){
    stringValue = number.toExponential(maxLength);
  } else if (number > 0 && number < lowerBound){ //positive out of bounds
    stringValue = number.toExponential(maxLength - "0.".length);
  } else if (number < 0 && Math.abs(number) < Math.abs(lowerBound)){ //negative out of bounds
    stringValue = number.toExponential(maxLength - "-0.".length);
  } else {
    stringValue = (number > 0) ? number.toFixed(maxLength - "0.".length) : number.toFixed(maxLength - "-0.".length);
  }

  //comes in with exponent or as a low/high enough number to need one based on maxLength -> convert to exponent and cut down to length
  if(stringValue.indexOf("e") > -1){ 
    const nonDecimalDigits = stringValue.indexOf(".") + 1 + (stringValue.length - stringValue.indexOf("e"));
    const maxDecimalPlaces = maxLength - nonDecimalDigits;
    result = number.toExponential(maxDecimalPlaces);

    //remove extra zeroes 1.230000000e+20 -> 1.23e+20
    let decimalPlaces = result.substring(result.indexOf(".") + 1, result.indexOf("e") - result.indexOf(".") + 1)
    decimalPlaces = decimalPlaces.replace(/0*$/, ""); //trims 0 from the end

    //enforce 1 zero 1e+25 -> 1.0e+25
    if(decimalPlaces.length === 0){
      decimalPlaces = "0";  
    }

    //piece back together
    result = result.substring(0, result.indexOf(".")) + "." + decimalPlaces + result.substring(result.indexOf("e"));

  } else if (stringValue.startsWith("0.") || stringValue.startsWith("-0.")){ //inside bounds but starts with 0
    result = stringValue.startsWith("0.") ? number.toFixed(maxLength - "0.".length) : number.toFixed(maxLength - "-0.".length);
  } else { //"normal" numbers 123456.789000 or -123456.7890000
    if(number.toString().length > maxLength) {
      if((stringValue.indexOf(".") + 1) === maxLength){
        result = Math.round(number).toString();
      } else {
        result = stringValue.substring(0, maxLength)
      }
    } else {
      result = number.toString();
    }
  }

  result = trimDecimalZeros(result);
  return result;
}

function trimDecimalZeros (numberString){
  if (numberString.includes(".")){
    numberString = numberString.replace(/0*$/, ""); //trims 0 from the end
  }

  numberString = numberString.replace(/\.$/, "", ""); //trims . from the end
  return numberString;
}

function setErrorState(isError){
  const operationButtons = Array.from(document.querySelectorAll(".operation-button"));
  operationButtons.forEach(button => {
    if(isError){
      errorState = true;
      button.classList.add("disabled-button");
      button.disabled = true;
    } else {
      errorState = false;
      button.classList.remove("disabled-button");
      button.disabled = false;
    }
  });
}

function resetCalculator() {
  operandLeft = NaN;
  operandRight = NaN;
  lastResult = NaN;
  resetInputOnNextDigit = true;
  lastButtonClicked = null;
  operator = "";

  displayMain.textContent = "0";
  displayOperation.textContent = "";
}

resetCalculator();
initializeButtonEvents(); 
