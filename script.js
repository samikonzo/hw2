'use strict'
var l = console.log;

//l(localStorage)
//localStorage.clear()
var todolist3 = new TodolistModule()
todolist3.init(document.getElementsByClassName('todolist-container')[0])
var todolist = new TodolistModule()
todolist.init(document.getElementsByClassName('todolist-container')[1])
var todolist2 = new TodolistModule()
todolist2.init(document.getElementsByClassName('todolist-container')[2], 'Музыка')







