class TodoItem {
    constructor(id, text, isCompleted) {
        this.id = id;
        this.text = text;
        this.isCompleted = isCompleted;
    }

    editItemTitle(newTitle) {
        this.text = newTitle;
    }

    changeItemState() {
        this.isCompleted = !this.isCompleted
    }
}

export default TodoItem;