/* 
returns array of random non-repeating numbers between 0 and upper bound
*/
const getRandomNonRepeatingIntegers = (desiredNumIntegers, upperBound) => {
  let numbers = new Set();

  while (numbers.size < desiredNumIntegers) {
    numbers.add(Math.floor(Math.random() * upperBound));
  }

  return [...numbers];
};

/*
returns array of podcasts located at given indices in given podcastList
*/
const extractItems = (itemList, indices) => {
  const extractedItems = [];
  indices.forEach(index => extractedItems.push(itemList[index]));
  return extractedItems;
};

/*
returns array of selected podcasts given podcasts to select from and desired
number of podcasts
*/
const getSelectedItems = ({items, desiredNumItems, numItemsToSelectFrom}) => {
  const indices = getRandomNonRepeatingIntegers(
    desiredNumItems,
    numItemsToSelectFrom
  );

  const selectedItems = extractItems(items, indices);
  return selectedItems;
};

module.exports = {getSelectedItems};
