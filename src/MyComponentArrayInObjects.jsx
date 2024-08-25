import react, { useState } from "react";

function MyComponentArrayInObjects() {
    const [cars, setCars] = useState([]);
    const [carYear, setCarYear] = useState(new Date().getFullYear());
    const [carMake, setCarMake] = useState("");
    const [carModel, setCarModel] = useState("");

    function handleAddCar() {
        const newCar = { year: carYear, make: carMake, model: carModel };
        setCars((c) => [...cars, newCar]);

        setCarYear(new Date().getFullYear());
        setCarModel("");
        setCarMake("");
    }
    function handleRemoveCar(index) {
        setCars((c) => c.filter((_, i) => i !== index));
    }

    function handleYearChange(event) {
        setCarYear(event.target.value);
    }
    function handleMakeChange(event) {
        setCarMake(event.target.value);
    }
    function handleModelChange(event) {
        setCarModel(event.target.value);
    }

    function displayCars() {
        return cars.map((car, index) => (
            <li key={index} onClick={() => handleRemoveCar(index)}>
                {car.year} {car.make} {car.model}
            </li>
        ));
    }

    return (
        <div>
            <h2>List of Car Objects:</h2>
            <ul>{displayCars()}</ul>
            <input
                type="number"
                value={carYear}
                placeholder={carYear}
                onChange={handleYearChange}
            />{" "}
            <br />
            <input
                type="text"
                value={carMake}
                placeholder="Add Make"
                onChange={handleMakeChange}
            />{" "}
            <br />
            <input
                type="text"
                value={carModel}
                placeholder="Add Model"
                onChange={handleModelChange}
            />
            <button onClick={handleAddCar}>Add car</button>
        </div>
    );
}

export default MyComponentArrayInObjects;
