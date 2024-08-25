function List() {
  const fruits = [
    { id: 1, name: "Apple", calories: 95 },
    { id: 2, name: "Orange", calories: 45 },
    { id: 3, name: "Banana", calories: 105 },
    { id: 4, name: "Coconut", calories: 159 },
    { id: 5, name: "Pineapples", calories: 37 },
  ];

  fruits.sort((a, b) => a.calories - b.calories);

  const loCalFruit = fruits.filter((fruit) => fruit.calories < 100);

  const listItems = fruits.map((fruit) => (
    <li key={fruit.id}>
      {fruit.name}: &nbsp;
      {fruit.calories}
    </li>
  ));

  return <ol>{listItems}</ol>;
}

export default List;
