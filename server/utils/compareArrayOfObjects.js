function compareArrayOfObjects (arr1, arr2) {

}


const arr1 = [
  { id: 'user1', name: 'User1', prop: 'propA' },
  { id: 'user2', name: 'User2', prop: 'propB', xx: 'a' },
  { id: 'user3', name: 'User3', prop: 'propC', zz: 'b' },
];  // arr1 vs arr2 => true


const arr2 = [
  { id: 'user2', name: 'User2', prop: 'propB', xx: 'a' },
  { id: 'user1', name: 'User1', prop: 'propA' },
  { id: 'user3', name: 'User3', prop: 'propC', zz: 'b' },
];  // arr1 vs arr2 => true


const arr3 = [
  { id: 'user2', name: 'User2', prop: 'propB', xx: 'a' },
  { id: 'user3', name: 'User3', prop: 'propC', zz: 'b' },
];  // arr1 vs arr3 => false


const arr4 = [
  { id: 'user1', name: 'User1', prop: 'propA' },
  { id: 'user2', name: 'User2', prop: 'propB', anotherProp: 'another', xx: 'a' },
  { id: 'user3', name: 'User3', prop: 'propC', zz: 'b' },
];

console.log('1', compareArrayOfObjects(arr1, arr2));  // true
console.log('2', compareArrayOfObjects(arr1, arr3));  // false
console.log('2', compareArrayOfObjects(arr1, arr4));  // false