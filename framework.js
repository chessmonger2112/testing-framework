
function doAllTests () {
  const preTestResultsArr = [];
  const groupTests = allTests.map(function(test) {
    const testName = test.name;
    const preTestResults = test();
    preTestResultsArr.push(preTestResults);
    const expectedResults = preTestResults.expectedResults;
    const actualResults = preTestResults.actualResults;
    const testResults = getTestResults(expectedResults, actualResults);
    const groupTest = new GroupTest(testName, testResults);
    return groupTest;
  });

  const resultsByGroupTests = groupTests.map(groupTest => groupTest.results);

  // Remember that true + true = 2, and false + true = 0, etc

  const numberOfTotalTests = resultsByGroupTests.map(results => results.length)
    .reduce((num1, num2) => num1 + num2);

  const numberOfTotalPassedTests = resultsByGroupTests.map(results => results.reduce((num1, num2) => num1 + num2))
      .reduce((num1, num2) => num1 + num2);

  const numberOfTotalFailedTests = numberOfTotalTests - numberOfTotalPassedTests;
  const totalNumberOfTestsMessage = `\n\t\tTotal number of tests: ${numberOfTotalTests}. Number of tests passed: ${numberOfTotalPassedTests}. Number of tests failed: ${numberOfTotalFailedTests}`;

  const groupTestResults = groupTests.map(groupTest => groupTest.results.every(testResult => testResult === true));
  const numberOfGrouptTestsPassed = groupTestResults.filter(groupTestResult => groupTestResult === true).length;
  const numberOfGrouptTestsFailed = groupTestResults.filter(groupTestResult => groupTestResult == false).length;

  const numberOfGroupTests = allTests.length;
  const allGroupTestsPassed = numberOfGroupTests === numberOfGrouptTestsPassed;
  const notAllGroupTestPassed = allGroupTestsPassed == false;
  const groupTestMessage = `Total number of group tests: ${numberOfGroupTests}. Number of group tests passed: ${numberOfGrouptTestsPassed}. Number of group tests failed: ${numberOfGrouptTestsFailed}.`;
  const finalMessage = groupTestMessage + totalNumberOfTestsMessage;
  consoleLogResults(allGroupTestsPassed, finalMessage, 0);
  const verboseFlagGreaterThanOne = VERBOSE_FLAG >= 2;
  const shouldGoOverTests = notAllGroupTestPassed || verboseFlagGreaterThanOne;

  if (shouldGoOverTests) {
    groupTests.forEach(function(groupTest, groupIndex) {
      const testName = groupTest.testName;
      const results = groupTest.results;
      const groupPassed = results.every(testResult => testResult);
      const groupFailed = groupPassed === false;
      const shouldLogEachTestResultInGroup = groupFailed || VERBOSE_FLAG === 3;
      const shouldLogGroupTestResult = groupFailed || verboseFlagGreaterThanOne;

      if (shouldLogGroupTestResult) {
        consoleLogResults(groupPassed, testName, 1);
      }

      if (shouldLogEachTestResultInGroup) {
        results.forEach(function(result, testIndex) {
          consoleLogResults(result, testIndex, 2);
          if (result === false) {
            const preTestResults = preTestResultsArr[groupIndex];
            const expectedResults = preTestResults.expectedResults;
            const actualResults = preTestResults.actualResults;
            const expected = expectedResults[testIndex];
            const actual = actualResults[testIndex];
            console.log(`\t\tExpected: ${expected}, actual: ${actual}`);
          }
        });
        console.log("\n");
      }
    });
  }
}

function consoleLogResults(result, indexOrMessage, numberOfTabs) {
  var testResult = result
    ? "Passed:"
    : "Failed:";

  const isLoggingIfAllGroupTestPassed = numberOfTabs === 0;

  const color = result
    ? "green"
    : isLoggingIfAllGroupTestPassed
      ? "#a20909"
      : "red";

  const css = `color: ${color}; font-weight: bold;`;
  const typeOfIndexString = typeof indexOrMessage;
  const indexWasPassedIn = typeOfIndexString === "number";

  const tabsArray = [
    "",
    "\t",
    "\t\t"
  ];

  const tabsPrependedToMessage = tabsArray[numberOfTabs];
  testResult = tabsPrependedToMessage + testResult;
  const message = indexWasPassedIn ?
    `Result of test ${indexOrMessage + 1}` :
    indexOrMessage;
  console.log("%c" + testResult, css, message);
}

function getTestResults(expectedArr, actualArr) {
  if (expectedArr.length != actualArr.length) {
    throw "Tests Failed: Expected values array has different length than actual values array.";
    return [];
  }

  const testResults = expectedArr.map(function(expected, index) {
    const actual = actualArr[index];
    const typeOfExpected = typeof expected;
    const objectType = "object";

    const ifExpectedIsAnObject = typeOfExpected === objectType;
    const testResult = ifExpectedIsAnObject
      ? compareArrays(expected, actual)
      : expected === actual;
    return testResult;
  });

  return testResults;
}

// helpers
function compareArrays(arr1, arr2) {
  const string1 = JSON.stringify(arr1);
  const string2 = JSON.stringify(arr2);
  const result = string1 === string2;
  return result;
}

function PreTestResults(expectedResults, actualResults) {
  this.expectedResults = expectedResults;
  this.actualResults = actualResults;
}

function GroupTest(testName, results) {
  this.testName = testName;
  this.results = results;
}
