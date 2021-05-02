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

  test = parseFloat("913517247483640800");
  console.log(`testing: ${test}`);
  result = getDisplayString(test, MAX_DIGITS);
  console.log(`result: ${result}`)

  // test = parseFloat("-12345678901234567890");
  // console.log(`testing: ${test}`);
  // result = getDisplayString(test, MAX_DIGITS);
  // console.log(`result: ${result}`)

  // test = parseFloat("0.0000001");
  // console.log(`testing: ${test}`);
  // result = getDisplayString(test, MAX_DIGITS);
  // console.log(` result: ${result}`)

  // test = parseFloat("0.00000000000001");
  // console.log(`testing: ${test}`);
  // result = getDisplayString(test, MAX_DIGITS);
  // console.log(` result: ${result}`)

  // test = parseFloat("0.000010000");
  // console.log(`testing: ${test}`);
  // result = getDisplayString(test, MAX_DIGITS);
  // console.log(` result: ${result}`)

  // test = parseFloat("-0.0000001");
  // console.log(`testing: ${test}`);
  // result = getDisplayString(test, MAX_DIGITS);
  // console.log(` result: ${result}`)

  // test = parseFloat("-0.00000000000001");
  // console.log(`testing: ${test}`);
  // result = getDisplayString(test, MAX_DIGITS);
  // console.log(` result: ${result}`)

  // test = parseFloat("-0.000010000");
  // console.log(`testing: ${test}`);
  // result = getDisplayString(test, MAX_DIGITS);
  // console.log(` result: ${result}`)

  // test = parseFloat("12345678.12345678");
  // console.log(`testing: ${test}`);
  // result = getDisplayString(test, MAX_DIGITS);
  // console.log(` result: ${result}`)

  // test = parseFloat("-12345678.12345678");
  // console.log(`testing: ${test}`);
  // result = getDisplayString(test, MAX_DIGITS);
  // console.log(` result: ${result}`)

  // test = parseFloat("1.2345");
  // console.log(`testing: ${test}`);
  // result = getDisplayString(test, MAX_DIGITS);
  // console.log(` result: ${result}`)

  // test = parseFloat("1.7320508075688772");
  // console.log(`testing: ${test}`);
  // result = getDisplayString(test, MAX_DIGITS);
  // console.log(` result: ${result}`)

  test = parseFloat("-11.2345");
  console.log(`testing: ${test}`);
  result = getDisplayString(test, MAX_DIGITS);
  console.log(` result: ${result}`)

  test = parseFloat("99980001.000000");
  console.log(`testing: ${test}`);
  result = getDisplayString(test, MAX_DIGITS);
  console.log(` result: ${result}`)

  test = parseFloat("-99980001.000000");
  console.log(`testing: ${test}`);
  result = getDisplayString(test, MAX_DIGITS);
  console.log(` result: ${result}`)
}

testFunc();