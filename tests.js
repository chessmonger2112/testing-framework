console.log("I'm testing here!!");
const VERBOSE_FLAG = 1;
doAllTests();

//place your test functions in this array
const allTests = [
  testGraph
];

function doAllTests () {
  const groupTests = allTests.map(function(test) {
    const testName = test.name;
    const preTestResults = test();
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

  if (notAllGroupTestPassed) {
    groupTests.forEach(function(groupTest) {
      const testName = groupTest.testName;
      const results = groupTest.results;
      const groupPassed = results.every(testResult => testResult);
      const groupFailed = groupPassed === false;
      const shouldLogEachTestResultInGroup = groupFailed || VERBOSE_FLAG === 3;
      const shouldLogGroupTestResult = groupFailed || VERBOSE_FLAG >= 2;

      if (shouldLogGroupTestResult) {
        consoleLogResults(groupPassed, testName, 1);
      }

      if (shouldLogEachTestResultInGroup) {
        results.forEach(function(result, index) {
          consoleLogResults(result, index, 2);
        });
        console.log("\n");
      }
    });
  }
}

//Example of how to use this framework
//Have a test function of something you want to test. And return the expected values and actual values thusly
function testcompareArrays() {
  const testArray1 = [
    "b",
    "b",
    "b"
    ];

  const testArray2 = [
    "b",
    "b",
    "b"
    ];

  const testArray3 = [
    "c",
    "c",
    "c"
  ];

  const actual1 = compareArrays(testArray2, testArray3); // should be false
  const actual2 = compareArrays(testArray1, testArray2); // should be true

  const expected1 = false;
  const expected2 = true;

  const actualResults = [
    actual1,
    actual2
  ];

  const expectedResults = [
    expected1,
    expected2
  ];

  const preTestResults = new PreTestResults(expectedResults, actualResults);
  return preTestResults;
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
