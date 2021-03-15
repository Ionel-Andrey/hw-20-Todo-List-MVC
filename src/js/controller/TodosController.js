/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
class TodosController {
    constructor() {
        this.todoListView = new TodoListView({
            toggleCompleted: (id) => this.toggleCompleted(id),
            removeTodolist: (id) => this.removeTodolist(id),
        });

        this.todoFormView = new TodoFormView({
            createTodolist: (todo) => this.createTodolist(todo),
        });

        this.todosModel = new TodosModel();

        const $app = $('.app');

        $app.append(this.todoListView.$list);

        this.init();
    }

    async init() {
        const todos = await this.todosModel.getTodos();
        this.todoListView.renderTodos(todos);
    }

    async toggleCompleted(id) {
        await this.todosModel.toogleCompleted(id);
        this.todoListView.renderTodos(this.todosModel.todos);
    }

    async removeTodolist(id) {
        await this.todosModel.removeTodolist(id);
        this.todoListView.removeTodo(id);
    }

    async createTodolist(todo) {
        await this.todosModel.createTodolist(todo)
            .then((newTodo) => this.todoFormView.createTodolist(newTodo));
    }
}
