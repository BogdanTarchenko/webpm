import TodoItem from "./todo/todoItem.js";
import TodoList from "./todo/todoList.js";

var todoList = new TodoList();
var idCount = 1;
var isEditing = false;
var currentEditId = null;

function elementProcessing() {
    var inputValue = document.getElementById("todoInput").value;
    if (inputValue === "") {
        alert("Нельзя вписать пустое дело");
        return;
    }

    if (isEditing) {
        editElement(currentEditId, { text: inputValue });
        resetEditState();
        return;
    }

    var li = document.createElement("li");
    var text = document.createTextNode(inputValue);
    li.appendChild(text);

    document.getElementById("todoList").appendChild(li);
    var todoItem = new TodoItem(idCount, inputValue, false);
    idCount++;
    todoList.addItem(todoItem);
    console.log(todoList);

    document.getElementById("todoInput").value = "";

    var crossSpan = document.createElement("SPAN");
    var cross = document.createTextNode("\u00D7");
    crossSpan.className = "close";
    crossSpan.appendChild(cross);
    li.appendChild(crossSpan);

    crossSpan.onclick = function() {
        removeElement(todoItem.id, li);
    };

    var editSpan = document.createElement("SPAN");
    var edit = document.createTextNode("\u270e");
    editSpan.className = "edit";
    editSpan.appendChild(edit);
    li.appendChild(editSpan);

    editSpan.onclick = function() {
        enterEditMode(todoItem.id, inputValue, li);
    };

    var completedSpan = document.createElement("SPAN");
    var completed = document.createTextNode("\u2714");
    completedSpan.className = "completed";
    completedSpan.appendChild(completed);
    li.appendChild(completedSpan);

    completedSpan.onclick = function() {
        toggleCompletion(todoItem, li);
    };
}

function removeElement(id, element) {
    todoList.removeItem(id);
    element.style.display = "none";
    console.log(todoList);
}

function editElement(id, newValues) {
    todoList.editItem(id, newValues);

    var listItem = document.querySelector(`li[data-id="${id}"]`);
    if (listItem) {
        listItem.childNodes[0].nodeValue = newValues.text;
    }
    console.log(todoList);
}

function enterEditMode(id, text, li) {
    isEditing = true;
    currentEditId = id;

    var todoInput = document.getElementById("todoInput");
    todoInput.value = text;
    todoInput.placeholder = "Сюда введите отредактированное название дела...";

    var addButton = document.getElementById("addButton");
    addButton.innerHTML = "Сохранить";

    li.dataset.id = id;
}

function resetEditState() {
    isEditing = false;
    currentEditId = null;

    document.getElementById("todoInput").value = "";
    document.getElementById("todoInput").placeholder = "Название дела...";

    var addButton = document.getElementById("addButton");
    addButton.innerHTML = "Добавить";
}

function toggleCompletion(todoItem, listItem) {
    todoItem.changeItemState();
    if (todoItem.isCompleted) {
        listItem.style.textDecoration = "line-through";
        listItem.style.backgroundColor = "#474747";
    } else {
        listItem.style.textDecoration = "none";
        listItem.style.backgroundColor = "#eee";
    }

    todoList.editItem(todoItem.id, { isCompleted: todoItem.isCompleted });
    console.log(todoList);
}

function exportTodoList() {
    const jsonStr = JSON.stringify(todoList.getItems());
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "todoList.json";
    a.click();

    URL.revokeObjectURL(url);
}

function importTodoList() {
    var input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = function(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result;
            try {
                const items = JSON.parse(content);
                todoList = new TodoList();
                idCount = 1;
                document.getElementById("todoList").innerHTML = "";

                items.forEach(itemData => {
                    const todoItem = new TodoItem(itemData.id, itemData.text, itemData.isCompleted);
                    todoList.addItem(todoItem);
                    idCount = Math.max(idCount, itemData.id + 1);

                    var li = document.createElement("li");
                    li.appendChild(document.createTextNode(todoItem.text));
                    li.setAttribute("data-id", todoItem.id);

                    if (todoItem.isCompleted) {
                        li.style.textDecoration = "line-through";
                    }

                    document.getElementById("todoList").appendChild(li);

                    var crossSpan = document.createElement("SPAN");
                    var cross = document.createTextNode("\u00D7");
                    crossSpan.className = "close";
                    crossSpan.appendChild(cross);
                    li.appendChild(crossSpan);

                    crossSpan.onclick = function() {
                        removeElement(todoItem.id, li);
                    };

                    var editSpan = document.createElement("SPAN");
                    var edit = document.createTextNode("\u270e");
                    editSpan.className = "edit";
                    editSpan.appendChild(edit);
                    li.appendChild(editSpan);

                    editSpan.onclick = function() {
                        enterEditMode(todoItem.id, todoItem.text, li);
                    };

                    var completedSpan = document.createElement("SPAN");
                    var completed = document.createTextNode("\u2714");
                    completedSpan.className = "completed";
                    completedSpan.appendChild(completed);
                    li.appendChild(completedSpan);

                    completedSpan.onclick = function() {
                        toggleCompletion(todoItem, li);
                    };
                });

                console.log(todoList);
            } catch (err) {
                alert("Ошибка при загрузке файла: " + err.message);
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

window.elementProcessing = elementProcessing;
window.exportTodoList = exportTodoList;
window.importTodoList = importTodoList;
