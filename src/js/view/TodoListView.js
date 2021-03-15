/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
class TodoListView {
    constructor(config) {
        this.config = config;
        this.$list = this.generateList();
        this.removeTodoAddEventListener();
    }

    generateList() {
        return $(`
            <ul class="list-group js-todo-list lead"></ul>
        `).click((e) => this.onClickTodo(e));
    }

    removeTodoAddEventListener() {
        return this.$list.click((e) => this.onClickCloseButton(e));
    }

    generateTodos(todo) {
        const doneClass = todo.completed ? 'done' : 'not-done';

        return `
            <li data-id="${todo.id}" class="list-group-item my-1 d-flex bd-highlight ${doneClass}">${todo.title}
            <i class="bi bi-trash mx-3 bd-highlight"></i>
            </li>
        `;
    }

    renderTodos(todos) {
        const todosHtml = todos.map(this.generateTodos);
        this.$list.html(todosHtml);
    }

    removeTodo(id) {
        const todoListItem = this.$list.find(`li[data-id="${id}"]`);
        if (todoListItem) {
            todoListItem.remove();
        }
    }

    onClickTodo(e) {
        const todoListElementTarget = $(e.target).hasClass('list-group-item');
        if (todoListElementTarget) {
            const id = $(e.target).data('id');
            this.config.toggleCompleted(id);
        }
    }

    onClickCloseButton(e) {
        const todoCloseButton = $(e.target).hasClass('bi-trash');
        const todoListItem = $(e.target).closest('li');
        const listId = todoListItem.data('id');

        if (todoCloseButton) {
            this.config.removeTodolist(listId);
        }
    }
}
