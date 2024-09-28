const BASE_URL = "http://127.0.0.1:8000/api/";

let isEditing = false;
let currentEditId = null;

class TodoItem {
    constructor(id, text, isCompleted) {
        this.id = id;
        this.text = text;
        this.isCompleted = isCompleted;
    }
}

class TodoList {
    constructor() {
        this.items = [];
    }

    addItem(item) {
        this.items.push(item);
    }

    removeItem(id) {
        this.items = this.items.filter(item => item.id !== id);
    }
}

const todoList = new TodoList();

async function fetchTodoList() {
    try {
        const response = await fetch(`${BASE_URL}list`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) throw new Error("Ошибка загрузки списка задач");
        const items = await response.json();
        items.forEach(itemData => {
            const todoItem = new TodoItem(itemData.id, itemData.text, itemData.state);
            todoList.addItem(todoItem);
            renderTodoItem(todoItem);
        });
    } catch (error) {
        alert(error.message);
    }
}

async function addTodoItem(text) {
    try {
        const response = await fetch(`${BASE_URL}item/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text }),
        });
        if (!response.ok) throw new Error("Ошибка добавления задачи");
        const data = await response.json();
        const todoItem = new TodoItem(data.id, text, false);
        todoList.addItem(todoItem);
        renderTodoItem(todoItem);
    } catch (error) {
        alert(error.message);
    }
}

async function editTodoItem(id, newValues) {
    try {
        const response = await fetch(`${BASE_URL}item/edit`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, text: newValues.text }),
        });
        if (!response.ok) throw new Error("Ошибка редактирования задачи");
        await response.json();
        const listItem = document.querySelector(`li[data-id="${id}"]`);
        if (listItem) {
            listItem.childNodes[0].nodeValue = newValues.text;
        }
    } catch (error) {
        alert(error.message);
    }
}

async function toggleTodoItemState(id, isCompleted) {
    try {
        const response = await fetch(`${BASE_URL}item/state`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, state: isCompleted }),
        });
        if (!response.ok) throw new Error("Ошибка изменения состояния задачи");
        const listItem = document.querySelector(`li[data-id="${id}"]`);
        if (listItem) {
            listItem.style.textDecoration = isCompleted ? "line-through" : "none";
        }
    } catch (error) {
        alert(error.message);
    }
}

async function deleteTodoItem(id) {
    try {
        const response = await fetch(`${BASE_URL}item/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }),
        });
        if (!response.ok) throw new Error("Ошибка удаления задачи");
        todoList.removeItem(id);
        const listItem = document.querySelector(`li[data-id="${id}"]`);
        if (listItem) {
            listItem.remove();
        }
    } catch (error) {
        alert(error.message);
    }
}

function renderTodoItem(todoItem) {
    var li = document.createElement("li");
    li.setAttribute("data-id", todoItem.id);
    li.appendChild(document.createTextNode(todoItem.text));
    document.getElementById("todoList").appendChild(li);

    var crossSpan = document.createElement("SPAN");
    crossSpan.className = "close";
    crossSpan.appendChild(document.createTextNode("\u00D7"));
    li.appendChild(crossSpan);
    crossSpan.onclick = function() {
        deleteTodoItem(todoItem.id);
    };

    var editSpan = document.createElement("SPAN");
    editSpan.className = "edit";
    editSpan.appendChild(document.createTextNode("\u270e"));
    li.appendChild(editSpan);
    editSpan.onclick = function() {
        enterEditMode(todoItem.id, todoItem.text, li);
    };

    var completedSpan = document.createElement("SPAN");
    completedSpan.className = "completed";
    completedSpan.appendChild(document.createTextNode("\u2714"));
    li.appendChild(completedSpan);
    completedSpan.onclick = function() {
        toggleCompletion(todoItem, li);
    };

    if (todoItem.isCompleted) {
        li.style.textDecoration = "line-through";
    }
}

function enterEditMode(id, text, li) {
    document.getElementById("todoInput").value = text;
    isEditing = true;
    currentEditId = id;
}

function resetEditState() {
    isEditing = false;
    currentEditId = null;
    document.getElementById("todoInput").value = "";
}

async function toggleCompletion(todoItem, li) {
    todoItem.isCompleted = !todoItem.isCompleted;
    await toggleTodoItemState(todoItem.id, todoItem.isCompleted);
    li.style.textDecoration = todoItem.isCompleted ? "line-through" : "none";
}

window.elementProcessing = async function() {
    var inputValue = document.getElementById("todoInput").value;
    if (inputValue === "") {
        alert("Нельзя вписать пустое дело");
        return;
    }

    if (isEditing) {
        await editTodoItem(currentEditId, { text: inputValue });
        resetEditState();
        return;
    }

    await addTodoItem(inputValue);
    document.getElementById("todoInput").value = "";
};

window.onload = fetchTodoList;