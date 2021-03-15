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
