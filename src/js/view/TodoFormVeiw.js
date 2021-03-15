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
