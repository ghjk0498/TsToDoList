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
			todoListElem.append(<HTMLElement>createTodoElement(todo.value, todo.id, todo.checked)[0])
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
		let [todoDivElem, todoId]: [HTMLElement, string] = createTodoElement(inputElem.value);
		let todoListElem: HTMLElement = <HTMLElement>document.getElementById("todo-list");
		todoListElem.prepend(todoDivElem);
		
		let todo: ToDo = {
			"id" : todoId,
			"value" : inputElem.value,
			"checked" : false,
		}
		todoList.unshift(todo);
		localStorage.setItem("todoList", JSON.stringify(todoList));
		
		inputElem.value = "";
		inputElem.focus();
	}
}

function createTodoElement(input: string, id: string = "", checked: boolean = false): [HTMLElement, string] {
	let todoDivElem: HTMLElement = <HTMLElement>document.createElement("div");
	todoDivElem.setAttribute("class", "todo");
	
	let checkboxElem: HTMLInputElement = <HTMLInputElement>document.createElement("input");
	checkboxElem.setAttribute("type", "checkbox");
	checkboxElem.checked = checked;
	
	let textareaElem: HTMLTextAreaElement = <HTMLTextAreaElement>document.createElement("textarea");
	textareaElem.setAttribute("class", "text");
	textareaElem.readOnly = true;
	
	let textareaId: string;
	if (id != "") {
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
	
	return [todoDivElem, textareaId];
}

function onTodoClick(e: MouseEvent) {
	let inputElem: HTMLInputElement = <HTMLInputElement>document.getElementById("todo-input");
	let target: HTMLInputElement = <HTMLInputElement>e.target;
	
	if (currentFocusTodo === target.id) {
		currentFocusTodo = "";
		target.style.border = "1px solid black";
		inputElem.value = "";
	} else {
		if (currentFocusTodo) {
			(<HTMLInputElement>document.getElementById(currentFocusTodo)).style.border = "1px solid black";
		}
		currentFocusTodo = target.id;
		target.style.border = "2px solid red";
		inputElem.value = target.value;
	}
}

function check(elem: HTMLInputElement, id: string) {
	let todoList: Array<ToDo> = JSON.parse(<string>localStorage.getItem("todoList"));
	
	for (let todo of todoList) {
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
	let todoListElem: HTMLElement = <HTMLElement>document.getElementById("todo-list");
	let removeList: Array<ChildNode> = [];
	for (let elem of todoListElem.childNodes) {
		if (elem.firstChild && (<HTMLInputElement>elem.firstChild).checked) {
			removeList.push(elem);
		}
	}
	while (removeList.length != 0) {
		(<ChildNode>removeList.pop()).remove();
	}
	
	let todoList: Array<object> = [];
	for (let elem of todoListElem.childNodes) {
		if (elem.lastChild) {
			todoList.push(new ToDo(
				(<HTMLElement>elem.lastChild).id,
				(<HTMLInputElement>elem.lastChild).value,
				(<HTMLInputElement>elem.firstChild).checked
			));
		}
	}
	localStorage.setItem("todoList", JSON.stringify(todoList));
}