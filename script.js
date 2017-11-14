'use strict'
var l = console.log;

//l(localStorage)
//localStorage.clear()
var todolist3 = new TodolistModule()
todolist3.init(document.getElementsByClassName('todolist-container')[0])
var todolist = new TodolistModule()
todolist.init(document.getElementsByClassName('todolist-container')[1])


var lists = [todolist, todolist3];


var collapseAllBtn = document.getElementsByClassName('collapse-all-btn')[0];
collapseAllBtn.addEventListener('click', function(){
	lists.forEach(todolist => {
		todolist.collapse();
	})
})


