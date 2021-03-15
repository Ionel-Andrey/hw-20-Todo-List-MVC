/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
$(() => {
    const controller = new TodosController();
});

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

/* eslint-disable no-shadow */
/* eslint-disable no-return-assign */
/* eslint-disable no-unused-vars */
class TodosModel {
    constructor() {
        this.todos = [];
    }

    async getTodos() {
        return fetch('https://jsonplaceholder.typicode.com/todos')
            .then((response) => response.json())
            .then((todos) => this.todos = todos);
    }

    async toogleCompleted(id) {
        const todo = this.todos.find((todo) => todo.id === id);

        const newTodo = {
            ...todo,
            completed: !todo.completed,
        };

        return fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
            method: 'PUT',
            body: JSON.stringify(newTodo),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .then((response) => response.json())
            .then((newTodo) => {
                this.todos = this.todos.map((todo) => {
                    if (todo.id !== id) {
                        return todo;
                    }

                    return newTodo;
                });
            });
    }

    async removeTodolist(id) {
        const todo = this.todos.find((todo) => todo.id === id);
        this.todos = this.todos.filter((todo) => todo.id !== id);

        return fetch(`https://jsonplaceholder.typicode.com/todos/${todo.id}`, {
            method: 'DELETE',
        });
    }

    async createTodolist(title) {
        return fetch('https://jsonplaceholder.typicode.com/todos', {
            method: 'POST',
            body: JSON.stringify({
                title,
                completed: false,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .then((response) => response.json())
            .then((newTodo) => {
                if (title && title.trim().length) {
                    this.todos = [newTodo, ...this.todos];
                    return newTodo;
                }
                return null;
            });
    }
}

/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */
class TodoFormView {
  constructor(config) {
    this.config = config;
    this.$todoForm = this.generateTodoForm();
    this.renderTodoForm();
    this.disableEnterKeyEventListener();
  }

  generateTodo(todo) {
    const doneClass = todo.completed ? 'done' : 'not-done';

    return `
        <li data-id="${todo.id}" class="list-group-item my-1 d-flex bd-highlight ${doneClass}">${todo.title}
        <i class="bi bi-trash mx-3 bd-highlight"></i>
        </li>
    `;
  }

  generateTodoForm() {
    return $(`
    <form class="js-todo-form position-relative">
        <input class="js-todo-name my-5 shadow bg-white rounded w-100 p-3 pe-5" type="text" name="todo"
            placeholder="type your list here">
        <button class="js-add-todo btn btn-dark shadow px-5 py-3 position-absolute top-50 end-0 translate-middle-y"
            type="button">ADD</button>
    </form>
`).click((e) => this.onClickAddButton(e));
  }

  disableEnterKeyEventListener() {
    this.$todoForm.keypress((e) => this.onKeypressInput(e));
  }

  renderTodoForm() {
    const $app = $('.app');
    $app.append(this.$todoForm);
  }

  createTodolist(todo) {
    const currentAddInputValue = $('.js-todo-name').val();
    const initialAddInputValue = $('.js-todo-name').val('');

    if (currentAddInputValue && currentAddInputValue.trim().length) {
      this.renderTodo(todo);

      return initialAddInputValue;
    }

    alert('Your input is empty');
    return initialAddInputValue;
  }

  renderTodo(todo) {
    this.$todoList = $('.js-todo-list');
    const todoItem = this.generateTodo(todo);
    this.$todoList.prepend(todoItem);
  }

  onClickAddButton(e) {
    const todoAddButton = $(e.target).hasClass('js-add-todo');
    if (todoAddButton) {
      const currentAddInputValue = $('.js-todo-name').val();
      this.config.createTodolist(currentAddInputValue);
    }
  }

  onKeypressInput(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  }
}

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
