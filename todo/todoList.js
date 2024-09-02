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

    editItem(id, newValues) {
        const itemIndex = this.items.findIndex(item => item.id === id);
        if (itemIndex !== -1) {
            if (newValues.text !== undefined) {
                this.items[itemIndex].editItemTitle(newValues.text);
            }
            if (newValues.isCompleted !== undefined) {
                this.items[itemIndex].isCompleted = newValues.isCompleted;
            }
        }
    }

    getItems() {
        return this.items;
    }
}

export default TodoList;
