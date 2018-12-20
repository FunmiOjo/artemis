// assumes that lower bound is zero
const getRandomNonRepeatingIntegers = (desiredNumIntegers, upperBound) => {
  let numbers = new Set();
  while (numbers.length < desiredNumIntegers) {
    numbers.add(Math.floor(Math.random() * upperBound));
  }

  return [...numbers];
};

module.exports = {getRandomNonRepeatingIntegers};
