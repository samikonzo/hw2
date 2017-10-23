'use strict'
var l = console.log;


var todoList = new TodoListModule()
todoList.init(document.getElementsByClassName('todoList-wrapper')[0])


function TodoListModule(){
	var elem, addTaskInput, taskList, filters;
		
	const KEY_ENTER_KEYCODE = 13,
		KEY_ESC_KEYCODE = 27;


	//tempInput
		var tempInput = document.createElement('input');
		tempInput.classList.add('task-item__task-edit')		

		tempInput.onkeydown = function(e){
			var key = e.keyCode;

			if(key && key != KEY_ESC_KEYCODE && key != KEY_ENTER_KEYCODE) return

			if(key == KEY_ESC_KEYCODE){
				tempInput.returnSpan(false)
			}
				
			if(key == KEY_ENTER_KEYCODE){ 
				tempInput.returnSpan(true)
			}
		}

		tempInput.returnSpan = function(newValue){
			if(newValue != undefined){

				if(this.type == 'date'){
					this.relatedSpan.innerHTML = this.value.replace(/(\d*)?-(\d*)?-(\d*)/, '$3.$2.$1');

					if(!this.value){
						this.relatedSpan.classList.add('task-item__deadline--empty')
					} else {
						this.relatedSpan.classList.remove('task-item__deadline--empty')
					}

				} else {
					if(!this.value){
						var currentLi = tempInput.closest('li');
						currentLi.remove()
						return
					} 

					this.relatedSpan.innerHTML = this.value
				}
			} 		

			this.parentNode.replaceChild(this.relatedSpan, this);
		}

		tempInput.checkMouseClickOut = function(e){
			if(e.target != tempInput) tempInput.returnSpan(true)
		}

		tempInput.onfocus = function(e){
			document.addEventListener('mousedown', tempInput.checkMouseClickOut)
		}

		tempInput.onblur = function(e){
			document.removeEventListener('mousedown', tempInput.checkMouseClickOut)
		}
	// /tempInput


	function render(domElem){
		if(!elem){
			//need to create template for generate in empty block!
			elem = domElem;
			addTaskInput = domElem.getElementsByClassName('addTask')[0];
			taskList =domElem.getElementsByClassName('taskList')[0];
			filters = domElem.getElementsByClassName('filters')[0];
			addListeners()
		}
	}

	function addListeners(){
		//listen enter & esc
		addTaskInput.onkeydown = function(e){
			var key = e.keyCode;

			if(key == KEY_ESC_KEYCODE) this.blur();
			if(key == KEY_ENTER_KEYCODE){ 
				//cant create empty task
				if(!this.value.trim()) return

				todoListAddTask(this.value.trim());
				todoListClearTaskInput()
			}
		}

		//listen removebtn click
		elem.addEventListener('click', e => {
			var target = e.target;
			if(target.classList && target.classList.contains('task-item__removeTask')){
				var currentLi = target.closest('li');

				//cant remove template!
				if(currentLi && currentLi.classList && currentLi.classList.contains('task-item--template')) return

				currentLi.remove();
			}
		})

		//listen dblclick - edit
		elem.addEventListener('click', e => {
			var target = e.target;

			//check click on task or deadline
			if(target.classList && !target.classList.contains('task-item__task') && !target.classList.contains('task-item__deadline')) return


			if(!target.firstClick){
				target.firstClick = true;
				setTimeout(function(){
					delete target.firstClick
				},500)
			} else {
				edit(target);
			}
		})

		//mouseover
		elem.addEventListener('mouseover', e => {
			var target = e.target,
				li = target.closest('li');
			if(!li) return
		})
		//mouseout
		elem.addEventListener('mouseout', e => {
		})

		//filters
		filters.addEventListener('click', e => {
			var target = e.target;
			if(target.nodeName != 'LI') return
			if(target.classList && target.classList.contains('filters__item--selected')) return

			//replace class --selected
			filters.getElementsByClassName('filters__item--selected')[0].classList.remove('filters__item--selected');
			target.classList.add('filters__item--selected');

			//change block value 
			var selector = target.getAttribute('value');
			filters.setAttribute('value', selector)

			//switch selected
			var items = taskList.getElementsByClassName('task-item');
			switch(selector){
				case 'all' : 
					[].forEach.call(items, el => {
						el.classList.remove('task-item--hidden');
					})
					break;

				case 'done' : 
					[].forEach.call(items, el => {
						if(el.classList.contains('task-item--done')){
							el.classList.remove('task-item--hidden')
						} else {
							el.classList.add('task-item--hidden')
						}
					})
					break;

				case 'not-done' : 
					[].forEach.call(items, el => {
						if(!el.classList.contains('task-item--done')){
							el.classList.remove('task-item--hidden')
						} else {
							el.classList.add('task-item--hidden')
						}
					})
					break;

				case 'tomorrow' : 
					[].forEach.call(items, el => {
						var tomorrow = new Date();
						tomorrow.setDate(tomorrow.getDate() + 1);
						tomorrow.setHours(0,0,0,0);

						var deadline = el.getElementsByClassName('task-item__deadline')[0].innerHTML,
							deadlineDate = new Date( deadline.replace(/(\d*)?\.(\d*)?\.(\d*)/, '$3 $2 $1') );

						if(deadlineDate.getTime() == tomorrow.getTime()){
							el.classList.remove('task-item--hidden');
						} else {
							el.classList.add('task-item--hidden')
						}
					})
					break;

				case 'week' : 
					[].forEach.call(items, el => {
						var deadline = el.getElementsByClassName('task-item__deadline')[0].innerHTML,
							deadlineDate = new Date( deadline.replace(/(\d*)?\.(\d*)?\.(\d*)/, '$3 $2 $1') );

						if(isThisWeek(deadlineDate)){
							el.classList.remove('task-item--hidden');
						} else {
							el.classList.add('task-item--hidden')
						}
					})
					break;
			}

			function isThisWeek(date){
				var today = new Date(),
					dayNum = today.getDay(),
					thisWeekMinDate = new Date(),
					thisWeekMaxDate = new Date();

				dayNum = dayNum == 0 ? 6 : dayNum - 1;
				thisWeekMinDate.setDate(today.getDate() - dayNum);
				thisWeekMaxDate.setDate(today.getDate() + (6 - dayNum));
					
				//l('date : ', date)	
				//l('daynum : ', dayNum);
				//l('thisWeekMinDate : ', thisWeekMinDate);
				//l('thisWeekMaxDate : ', thisWeekMaxDate);
				//l('date.getTime() >= thisWeekMinDate.getTime() : ', date.getTime() >= thisWeekMinDate.getTime());
				//l('date.getTime() <= thisWeekMaxDate.getTime()) : ', date.getTime() <= thisWeekMaxDate.getTime());
				//l(' ');
				//l(' ');
				
				if(date.getTime() >= thisWeekMinDate.getTime() &&
					date.getTime() <= thisWeekMaxDate.getTime()) return true

				return false	

			}
		})

	}

	function edit(span){
		var startValue = span.innerHTML;

		if(span.classList.contains('task-item__task')){
			//task
			tempInput.type = 'text'
			tempInput.value = startValue;

			tempInput.classList.remove('task-item__task-edit--deadline')
			tempInput.classList.add('task-item__task-edit--task')

		} else {
			//deadline
			tempInput.type = 'date'
			tempInput.value = startValue.replace(/(\d*)?\.(\d*)?\.(\d*)/, '$3-$2-$1');

			tempInput.classList.remove('task-item__task-edit--task')
			tempInput.classList.add('task-item__task-edit--deadline')
		}

		tempInput.startValue = startValue;
		tempInput.relatedSpan = span;

		span.parentNode.replaceChild(tempInput, span);
		tempInput.focus()
	}

	function todoListAddTask(task){

		var li = elem.getElementsByClassName('task-item--template')[0].cloneNode(1),
			taskSpan = li.getElementsByClassName('task-item__task')[0];


		li.classList.remove('task-item--template');
		taskSpan.textContent = task;
		taskList.appendChild(li);
	}

	function todoListClearTaskInput(){
		addTaskInput.value = ''
	}

	this.init = render	
}