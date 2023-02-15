const myArray = [1, 2, 3, 3, 4, 5, 5, 6, 6, 7, 11, 11, 13];
const uniqueArray = [];

for (let i = myArray.length - 1; i >= 0; i--) {
    console.log('equal myArray[i] :: ', myArray[i], ' i :: ', i, ' indexOf :: ',myArray.indexOf(myArray[i]));
  if (myArray.indexOf(myArray[i]) !== i) {
    console.log('not equal myArray[i] :: ', myArray[i], ' i :: ', i, ' indexOf :: ',myArray.indexOf(myArray[i]));
	myArray.splice(i, 1);
  }
}

console.log('myArray :: ', myArray);

for (let i = 0; i < myArray.length; i++) {
    if (!uniqueArray.includes(myArray[i])) {
      uniqueArray.push(myArray[i]);
    }
 }

console.log('uniqueArray :: ', uniqueArray);