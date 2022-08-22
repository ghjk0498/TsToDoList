"use strict";
// 참고 url
// https://poiemaweb.com/
// https://hyunseob.github.io/2016/11/18/typescript-function/
// @@@ 이민우 차장님 - 피드백 해주신거 참고해서 수정 필요
let count = 0;
let currentFocusTodo;
class ToDo {
    constructor(id, value, checked) {
        this.id = id;
        this.value = value;
        this.checked = checked;
    }
}
window.onload = function () {
    let todoList = JSON.parse(localStorage.getItem("todoList"));
    if (todoList) {
        const todoListElem = document.getElementById("todo-list");
        for (let todo of todoList) {
            todoListElem.append(createTodoElement(todo.value, todo.id, todo.checked)[0]);
        }
        if (todoList.length != 0) {
            count = Number(todoList[0].id.split("-")[1]);
        }
    }
    else {
        todoList = [];
    }
    document.getElementById("todo-input").addEventListener("keydown", (e) => {
        console.log(e.keyCode);
        if ((e.keyCode == 10 || e.keyCode == 13)) {
            e.preventDefault();
            if (e.ctrlKey) {
                e.target.value += "\n";
            }
            else {
                document.getElementById("regist-submit").click();
            }
        }
    });
};
function regist() {
    const inputElem = document.getElementById("todo-input");
    let todoList = JSON.parse(localStorage.getItem("todoList"));
    if (currentFocusTodo) {
        document.getElementById(currentFocusTodo).value = inputElem.value;
        for (let todo of todoList) {
            if (todo.id === currentFocusTodo) {
                todo.value = inputElem.value;
            }
        }
        localStorage.setItem("todoList", JSON.stringify(todoList));
    }
    else {
        const [todoDivElem, todoId] = createTodoElement(inputElem.value);
        const todoListElem = document.getElementById("todo-list");
        todoListElem.prepend(todoDivElem);
        let todo = {
            "id": todoId,
            "value": inputElem.value,
            "checked": false,
        };
        todoList.unshift(todo);
        localStorage.setItem("todoList", JSON.stringify(todoList));
        inputElem.value = "";
        inputElem.focus();
    }
}
function createTodoElement(input, id = "", checked = false) {
    const todoDivElem = document.createElement("div");
    todoDivElem.setAttribute("class", "todo");
    const checkboxElem = document.createElement("input");
    checkboxElem.setAttribute("type", "checkbox");
    checkboxElem.checked = checked;
    const textareaElem = document.createElement("textarea");
    textareaElem.setAttribute("class", "text");
    textareaElem.readOnly = true;
    let textareaId;
    if (id != "") {
        textareaId = id;
    }
    else {
        count += 1;
        textareaId = "text-" + count;
    }
    textareaElem.setAttribute("id", textareaId);
    checkboxElem.setAttribute("onclick", "check(this, '" + textareaId + "')");
    textareaElem.addEventListener("click", onTodoClick);
    textareaElem.value = input;
    todoDivElem.append(checkboxElem);
    todoDivElem.append(textareaElem);
    return [todoDivElem, textareaId];
}
function onTodoClick(e) {
    const inputElem = document.getElementById("todo-input");
    const target = e.target;
    if (currentFocusTodo === target.id) {
        currentFocusTodo = "";
        target.style.border = "1px solid black";
        inputElem.value = "";
    }
    else {
        if (currentFocusTodo) {
            document.getElementById(currentFocusTodo).style.border = "1px solid black";
        }
        currentFocusTodo = target.id;
        target.style.border = "2px solid red";
        inputElem.value = target.value;
    }
}
function check(elem, id) {
    let todoList = JSON.parse(localStorage.getItem("todoList"));
    for (let todo of todoList) {
        if (id === todo.id) {
            if (elem.checked) {
                todo.checked = true;
            }
            else {
                todo.checked = false;
            }
            break;
        }
    }
    localStorage.setItem("todoList", JSON.stringify(todoList));
}
function deleteTodo() {
    const todoListElem = document.getElementById("todo-list");
    let removeList = [];
    for (let elem of todoListElem.childNodes) {
        if (elem.firstChild && elem.firstChild.checked) {
            removeList.push(elem);
        }
    }
    while (removeList.length != 0) {
        removeList.pop().remove();
    }
    let todoList = [];
    for (let elem of todoListElem.childNodes) {
        if (elem.lastChild) {
            todoList.push(new ToDo(elem.lastChild.id, elem.lastChild.value, elem.firstChild.checked));
        }
    }
    localStorage.setItem("todoList", JSON.stringify(todoList));
}
