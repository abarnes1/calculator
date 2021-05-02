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
      displayMain.textContent = numberToString(number);
    }
  });

  const squareRoot = document.querySelector("#squareRoot");
  squareRoot.addEventListener('click', () => {
    //if we have an operator, square root of current input is right operand
    if(hasStoredOperator()){
      let number = parseFloat(displayMain.textContent);
      operandRight = Math.sqrt(number);

      displayOperation.textContent = `${operandLeft} ${operator} sqrt(${number})`;
      displayMain.textContent = numberToString(operandRight);
    } else {
      //no operator so square root the input and treat as left operand
      let number = parseFloat(displayMain.textContent);
      operandLeft = Math.sqrt(number);

      displayOperation.textContent = `sqrt(${number})`;
      displayMain.textContent = numberToString(operandLeft);
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
        operandLeft = parseFloat(displayMain.textContent);
        let result = operate(operandLeft, operandRight, equalsOperator);
        displayOperation.textContent = `${operandLeft} ${equalsOperator} ${operandRight} =`
        displayMain.textContent = numberToString(result);
    } else if (hasStoredOperator()) { 
      //normal a + b type of operation
      operandRight = parseFloat(displayMain.textContent);
      let result = operate(operandLeft, operandRight, operator);
      displayOperation.textContent = `${operandLeft} ${operator} ${operandRight} =`
      displayMain.textContent = numberToString(result);
    } else { 
      //pressing = without an operator
      operandLeft = parseFloat(displayMain.textContent);
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

function getDisplayString(number, maxLength){
  if(isNaN(number)){
    return "Error!";
  }

  if(!isFinite(number)){
    return "Overflow!";
  }

  let result = "";

  //force large numbers to exponential format
  const integerDigits = parseInt(number).toString().length;
  let stringValue;
  //force very small numbers to exponential format
  const lowerBound = (number > 0) ? Math.pow(10, -(maxLength) + "0.".length) : Math.pow(-10, -(maxLength) + "-0.".length);
  // console.log(`  lowerBound: ${lowerBound}`);

  if(integerDigits > maxLength){
    stringValue = number.toExponential(maxLength);
  } else if (number > 0 && number < lowerBound){ //positive out of bounds
    stringValue = number.toExponential(maxLength - "0.".length);
  } else if (number < 0 && Math.abs(number) < Math.abs(lowerBound)){
    // console.log("  negative out of bounds");  //negative out of bounds
    stringValue = number.toExponential(maxLength - "-0.".length);
  } else {
    stringValue = (number > 0) ? number.toFixed(maxLength - "0.".length) : number.toFixed(maxLength - "-0.".length);
  }

  console.log(` stringValue: ${stringValue}`);

  //comes in with exponent or as a low/high enough number to need one based on maxLength -> convert to exponent and cut down to length
  if(stringValue.indexOf("e") > -1){ 
    const nonDecimalDigits = stringValue.indexOf(".") + 1 + (stringValue.length - stringValue.indexOf("e"));
    const maxDecimalPlaces = maxLength - nonDecimalDigits;

    console.log(`  decimal places: ${maxDecimalPlaces}`);
    result = number.toExponential(maxDecimalPlaces);
    console.log(`  exponential at max length: ${result}`);

    //remove extra zeroes 1.230000000e+20 -> 1.23e+20
    let decimalPlaces = result.substring(result.indexOf(".") + 1, result.indexOf("e") - result.indexOf(".") + 1)
    decimalPlaces = decimalPlaces.replace(/0*$/, ""); //trims 0 from the end

    //enforce 1 zero 1e+25 -> 1.0e+25
    if(decimalPlaces.length === 0){
      decimalPlaces = "0";  
    }

    //piece back together
    result = result.substring(0, result.indexOf(".")) + "." + decimalPlaces + result.substring(result.indexOf("e"));

    return result;
  }

  //if inside bounds but < 1 or > -1
  // if (stringValue.startsWith("0.") || stringValue.startsWith("-0.")){ //starts with 0.
    result = stringValue.startsWith("0.") ? number.toFixed(maxLength - "0.".length) : number.toFixed(maxLength - "-0.".length);

    if (result.includes(".")){
      result = result.replace(/0*$/, ""); //trims 0 from the end
    }

    result = result.replace(/\.$/, "", ""); //trims . from the end

    return result;
  // } 
  
  //"normal" numbers 123456.789 or -123456.789
  // result = (stringValue.length > maxLength) ? stringValue.substring(0, maxLength) : stringValue;

// console.log(`Number ${number} converted string: ${result}`);

  // return result;
}

function testFunc(){
  let test = parseFloat("1.23e25");
  console.log(`testing: ${test}`);
  let result = getDisplayString(test, MAX_DIGITS);
  console.log(`result: ${result}`)

  // test = parseFloat("1.2345678901234e25");
  // console.log(`testing: ${test}`);
  // result = getDisplayString(test, MAX_DIGITS);
  // console.log(`result: ${result}`)

  // test = parseFloat("1.000000000000000e25");
  // console.log(`testing: ${test}`);
  // result = getDisplayString(test, MAX_DIGITS);
  // console.log(`result: ${result}`)

  test = parseFloat("12345678901234567890");
  console.log(`testing: ${test}`);
  result = getDisplayString(test, MAX_DIGITS);
  console.log(`result: ${result}`)

  test = parseFloat("-12345678901234567890");
  console.log(`testing: ${test}`);
  result = getDisplayString(test, MAX_DIGITS);
  console.log(`result: ${result}`)

  test = parseFloat("0.0000001");
  console.log(`testing: ${test}`);
  result = getDisplayString(test, MAX_DIGITS);
  console.log(` result: ${result}`)

  test = parseFloat("0.00000000000001");
  console.log(`testing: ${test}`);
  result = getDisplayString(test, MAX_DIGITS);
  console.log(` result: ${result}`)

  test = parseFloat("0.000010000");
  console.log(`testing: ${test}`);
  result = getDisplayString(test, MAX_DIGITS);
  console.log(` result: ${result}`)

  test = parseFloat("-0.0000001");
  console.log(`testing: ${test}`);
  result = getDisplayString(test, MAX_DIGITS);
  console.log(` result: ${result}`)

  test = parseFloat("-0.00000000000001");
  console.log(`testing: ${test}`);
  result = getDisplayString(test, MAX_DIGITS);
  console.log(` result: ${result}`)

  test = parseFloat("-0.000010000");
  console.log(`testing: ${test}`);
  result = getDisplayString(test, MAX_DIGITS);
  console.log(` result: ${result}`)

  test = parseFloat("12345678.12345678");
  console.log(`testing: ${test}`);
  result = getDisplayString(test, MAX_DIGITS);
  console.log(` result: ${result}`)

  test = parseFloat("-12345678.12345678");
  console.log(`testing: ${test}`);
  result = getDisplayString(test, MAX_DIGITS);
  console.log(` result: ${result}`)

  test = parseFloat("1.2345");
  console.log(`testing: ${test}`);
  result = getDisplayString(test, MAX_DIGITS);
  console.log(` result: ${result}`)

  test = parseFloat("-11.2345");
  console.log(`testing: ${test}`);
  result = getDisplayString(test, MAX_DIGITS);
  console.log(` result: ${result}`)
}

function numberToString(number) {
  let result = "";
  if (isNaN(number)) {
    result = "Error!";
  } else if (!isFinite(number)){
    result = "Overflow!";
  } else {
    let stringValue = number.toString();
    
    if(stringValue.indexOf("e") > -1){ //comes in with exponent -> cut down to length
      console.log(`${number} has an exponent`);
      result = number.toExponential(9);
      //remove extra zeroes
      let decimalPlaces = result.substring(result.indexOf(".") + 1, result.indexOf("e") - result.indexOf(".") + 1)
      decimalPlaces = decimalPlaces.replace(/0*$/, ""); //trims 0 from the end
      if(decimalPlaces.length === 0){
        decimalPlaces = "0";
      }

      //piece back together
      result = result.substring(0, result.indexOf(".")) + "." + decimalPlaces + result.substring(result.indexOf("e"));
      console.log(result);

    } else if(stringValue.indexOf(".") >= 10) { //has a decimal with more than 10 digits before decimal point
      result = number.toExponential(9);
      console.log(`${number} was long enough to convert to ${result}`);
    } else if (stringValue.startsWith("0.")){ //starts with 0.
      result = number.toFixed(10)

      if (result.includes(".")){
        result = result.replace(/0*$/, ""); //trims 0 from the end
        console.log(`${number} was a long decimal ${result}`);
      }
  
      result = result.replace(/\.$/, "", ""); //trims . from the end
    } else { //normal number
      result = stringValue;
    }
  }

  // console.log(`Number ${number} converted string: ${result}`);

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
testFunc();