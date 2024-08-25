import React, { useState } from "react";

function ToDoList() {
    const [tasks, setTasks] = useState(["Eat", "Shit", "Shower"]);
    const [newTask, setNewTask] = useState("");

    function handleInputChange(e) {
        // because the input has value of newTask,
        // if we don't update newtask, what we type won't show
        setNewTask(e.target.value);
    }

    function addTask() {
        setTasks((t) => [...tasks, newTask]);
    }

    function deleteTask(index) {}

    function moveTaskUp(index) {
        if (index > 0) {
            const updatedTasks = [...tasks];
            [updatedTasks[index], updatedTasks[index - 1]] = [
                updatedTasks[index - 1],
                updatedTasks[index],
            ];
            setTasks(updatedTasks);
        }
    }

    function moveTaskDown(index) {
        if (index < tasks.length - 1) {
            const updatedTasks = [...tasks];
            [updatedTasks[index], updatedTasks[index + 1]] = [
                updatedTasks[index + 1],
                updatedTasks[index],
            ];
            setTasks(updatedTasks);
        }
    }

    function displayTasks() {
        return tasks.map((task, i) => (
            <li key={i}>
                <span className="text">{task}</span>
                <button className="delete-button" onClick={() => deleteTask(i)}>
                    Delete
                </button>
                <button className="move-button" onClick={() => moveTaskUp(i)}>
                    Move Up
                </button>
                <button className="move-button" onClick={() => moveTaskDown(i)}>
                    Down
                </button>
            </li>
        ));
    }

    return (
        <div className="to-do-list">
            <h1>To-do List</h1>
            <div>
                <input
                    type="text"
                    placeholder="Add new task"
                    value={newTask}
                    onChange={handleInputChange}
                />
                <button className="add-button" onClick={addTask}>
                    Add
                </button>
            </div>
            <ol>{displayTasks()}</ol>
        </div>
    );
}

export default ToDoList;
