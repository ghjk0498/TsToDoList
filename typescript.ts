// 참고 url
// https://poiemaweb.com/
// https://hyunseob.github.io/2016/11/18/typescript-function/

let count: number = 0;
let currentFocusTodo: string;

class ToDo {
	id: string;
	value: string;
	checked: boolean;
	
	constructor(id: string, value: string, checked: boolean) {
		this.id = id;
		this.value = value;
		this.checked = checked;
	}
}

window.onload = function() {
	let todoList: Array<ToDo> = JSON.parse(<string>localStorage.getItem("todoList"));

	if (todoList) {
		let todoListElem: HTMLElement = <HTMLElement>document.getElementById("todo-list");
		for (let todo of todoList) {
			todoListElem.append(<HTMLElement>createTodoElement(todo.value, todo.id, todo.checked).elem)
		}
		if (todoList.length != 0) {
			count = Number(todoList[0].id.split("-")[1]);
		}
	} else {
		todoList = [];
	}
}

function regist() {
	let inputElem: HTMLInputElement = <HTMLInputElement>document.getElementById("todo-input");
	let todoList: Array<ToDo> = JSON.parse(<string>localStorage.getItem("todoList"));
	
	if (currentFocusTodo) {
		(<HTMLInputElement>document.getElementById(currentFocusTodo)).value = inputElem.value;
		
		for (let todo of todoList) {
			if (todo.id === currentFocusTodo) {
				todo.value = inputElem.value;
			}
		}
		localStorage.setItem("todoList", JSON.stringify(todoList));
	} else {
		let todoElemAndId: HTMLElement = <HTMLElement>createTodoElement(inputElem.value);
		let todoDivElem: object = todoElemAndId.elem;
		let todoListElem: object = document.getElementById("todo-list");
		todoListElem.prepend(todoDivElem);
		
		let todo: object = {
			"id" : todoElemAndId.id,
			"value" : inputElem.value,
			"checked" : false,
		}
		todoList.unshift(todo);
		localStorage.setItem("todoList", JSON.stringify(todoList));
		
		inputElem.value = "";
		inputElem.focus();
	}
}

function createTodoElement(input, id, checked=false) {
	let todoDivElem: object = document.createElement("div");
	todoDivElem.setAttribute("class", "todo");
	
	let checkboxElem: object = document.createElement("input");
	checkboxElem.setAttribute("type", "checkbox");
	checkboxElem.checked = checked;
	
	let textareaElem: object = document.createElement("textarea");
	textareaElem.setAttribute("readonly", true);
	textareaElem.setAttribute("class", "text");
	
	let textareaId: string;
	if (id) {
		textareaId = id;
	} else {
		count += 1;
		textareaId = "text-" + count;
	}
	textareaElem.setAttribute("id", textareaId);
	checkboxElem.setAttribute("onclick", "check(this, '" + textareaId + "')");
	
	textareaElem.addEventListener("click", onTodoClick);
	textareaElem.value = input;
	
	todoDivElem.append(checkboxElem);
	todoDivElem.append(textareaElem);
	
	// [return value] : todoDivElement, textarea.id
	return {
		"elem" : todoDivElem,
		"id" : textareaId,
	};
}

function onTodoClick(e) {
	let inputElem: object = document.getElementById("todo-input");
	
	if (currentFocusTodo === e.target.id) {
		currentFocusTodo = null;
		e.target.style.border = "1px solid black";
		inputElem.value = "";
	} else {
		if (currentFocusTodo) {
			document.getElementById(currentFocusTodo).style.border = "1px solid black";
		}
		currentFocusTodo = e.target.id;
		e.target.style.border = "2px solid red";
		inputElem.value = e.target.value;
	}
}

function check(elem, id) {
	for (let todo: object of todoList) {
		if (id === todo.id) {
			if (elem.checked) {
				todo.checked = true;
			} else {
				todo.checked = false;
			}
			break;
		}
	}
	localStorage.setItem("todoList", JSON.stringify(todoList));
}

function deleteTodo() {
	let todoListElem: object = document.getElementById("todo-list");
	let removeList: Array<object> = [];
	for (let elem: object of todoListElem.childNodes) {
		if (elem.firstChild && elem.firstChild.checked) {
			removeList.push(elem);
		}
	}
	while (removeList.length != 0) {
		removeList.pop().remove();
	}
	
	let todoList: Array<object> = [];
	for (let elem of todoListElem.childNodes) {
		if (elem.lastChild) {
			todoList.push({
				"id" : elem.lastChild.id,
				"value" : elem.lastChild.value,
				"checked" : elem.firstChild.checked,
			});
		}
	}
	localStorage.setItem("todoList", JSON.stringify(todoList));
}