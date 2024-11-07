console.log("I'm testing here!!");
const VERBOSE_FLAG = 1;
//place your test functions in this array
const allTests = [
  testcompareArrays
];
doAllTests();



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
