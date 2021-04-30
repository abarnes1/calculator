const displayMain = document.querySelector("#displayMain");
const displayOperation = document.querySelector("#displayOperation");

let resetInputOnNextDigit = true;
let inputBuffer = "0";
let storedResult = 0;
let operator = "1";

// const calculator = {
//   resetInputOnNextDigit: true,
//   inputBuffer: "0",
//   storedResult: 0,
//   operation: "",
// }

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
      storedNumber = inputBuffer;
      operator = e.target.value;
      console.log(`Operator set: ${operator}`);

      resetInputOnNextDigit = true;

      updateDisplay();
    });
  });

  const clearInput = document.querySelector("#clearInput");
  clearInput.addEventListener('click', () => {
    inputBuffer = "0";
    updateDisplay();
  });

  const clearAll = document.querySelector("#clearAll");
  clearAll.addEventListener('click', () => resetCalculator());

  const equal = document.querySelector("#equals");
  equal.addEventListener('click', () => {
    console.log(`Equals operator: ${operator}`);
    storedNumber = operate(4, 4, operator)
    resetInputOnNextDigit = true;
    updateDisplay();
  });
}

function appendInput(digit) {
  console.log(`Input Buffer Before: ${inputBuffer}`)
  if (resetInputOnNextDigit) {
    inputBuffer = "0";
    resetInputOnNextDigit = false;
  }

  if (digit === "." && inputBuffer.indexOf(".") === -1){
    inputBuffer += digit;
  } else {
    if (inputBuffer.startsWith("0") && inputBuffer.indexOf(".") === -1) {
      inputBuffer = digit;
    } else {
      inputBuffer += digit;
    }
  }
  console.log(`Input Buffer After: ${inputBuffer}`)
}

function operate(num1, num2, operator) {
  // let computed = NaN;
  console.log(`Operating: ${num1}, ${num2}, ${operator}`);
  let computed = 0;

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

  if (operator === 'sqrt') {
    computed = Math.sqrt(num2);
  }

  return computed;
}

function updateDisplay() {
  console.log("updating display...");
  displayMain.textContent = inputBuffer;
  displayOperation.textContent = getExpressionString();
}

function getExpressionString() {
  let display = "";
  if (operation) {
    if (operation === "sqrt") {
      
    } else if (operation === "negate") {

    } else {
      display = `${numberDisplayString(storedNumber)} ${operation}`;
    }
  }

  return display;
}

function numberDisplayString(number) {
  return number;
}

function resetCalculator() {
  resetInputOnNextDigit = true;
  inputBuffer = "0";
  storedResult = 0,
  operation = ""
  
  updateDisplay();
}

resetCalculator();
initializeButtonEvents();