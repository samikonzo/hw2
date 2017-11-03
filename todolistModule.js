function TodolistModule(){
	if(!TodolistModule.count) TodolistModule.count = 0;

	// templates
		var listHTML = `<p class="{{ TODOLIST_NAME_CLASS }}"> TODOLISTNAME </p>

		      <button class="{{ COLLAPSE_BUTTON }}"> collapse / expand</button>

		      <ul class="{{ MENU }}"> menu
		        <li class="{{ MENU_ITEM }}"> <button class="{{ ADD_TODOLIST }}"> ADD NEW TODOLIST</button></li>
		        <li class="{{ MENU_ITEM }}"> <button class="{{ REMOVE_TODOLIST }}"> REMOVE CURRENT TODOLIST</button></li>
		      </ul>

		      <input type="text" class="{{ MAIN_INPUT_CLASS }}" autofocus placeholder="what needs to be done?">

		      <ul class="{{ FILTERS_CLASS }}"> 
		          <li class="{{ FILTERS_ITEM_CLASS }}  {{ FILTERS_ITEM_SELECTED_CLASS }}" value="all">all</li>
		          <li class="{{ FILTERS_ITEM_CLASS }}" value="done">done</li>
		          <li class="{{ FILTERS_ITEM_CLASS }}" value="not-done">not done</li>
		          <li class="{{ FILTERS_ITEM_CLASS }}" value="tomorrow">tomorrow</li>
		          <li class="{{ FILTERS_ITEM_CLASS }}" value="week">week</li>
		        </ul>
		     
		      <ul class="{{ TASK_LIST_CLASS }}">
		      </ul>

		      <div class="{{ INFOBAR_CLASS }} {{ INFOBAR_HIDDEN_CLASS }}">
		        <div class="{{ INFOBAR_REMAIN_CLASS }}">
		          remaining events:<span class="{{ INFOBAR_REMAIN_COUNT_CLASS }}"></span>
		        </div>
		        <button class="{{ INFOBAR_REMOVE_BTN_CLASS }} {{ INFOBAR_REMOVE_BTN_HIDDEN_CLASS }}">done: <span class="{{ INFOBAR_SELECTED_CLASS }} {{ INFOBAR_SPARE_CLASS}}">0</span> | remove it </button>
		        <div class="{{ NO_TASK_CLASS }} {{ NO_TASK_HIDDEN_CLASS }}"> Нет заданий удовлетворяющих требованию </div>
		      </div>`,

	      	listItemHTML = `<li class="{{ TASK_ITEM_CLASS }}">
			      <label class="{{ TASK_ITEM_CHECKBOX_LABEL_CLASS }}"> <input type="checkbox" name="" class="{{ TASK_ITEM_CHECKBOX_CLASS }}"> </label>
			      <span class="{{ TASK_ITEM_TASK_CLASS }}"></span>
			      <span class="{{ TASK_ITEM_DEADLINE_CLASS }} {{ TASK_ITEM_DEADLINE_EMPTY_CLASS }} {{ NO_SELECT_CLASS }}"></span> 
			      <button class="{{ TASK_ITEM_REMOVE_TASK_CLASS }} {{ TASK_ITEM_REMOVE_TASK_HIDDEN_CLASS }}">X</button>
			    </li>`;
	////////////////////////////////////////////////////////////////////////////

	// variables
		var widget, widget_task_template, widget_addTask, widget_taskList,
			widget_filters,  widget_noTasksMessage,
			widget_infobar, widget_infobarRemain, widget_infobarSelected, widget_infobarRemoveBtn,
			tasksObj = {tasksCount : 0,	tasksSelected : 0, tasks : {}},
			taskId = 0,
			todolist_template = listHTML,//document.getElementById('todolist-template').innerHTML,
			todolist_task_item_template = listItemHTML,//document.getElementById('todolist-task-item-template').innerHTML,
			tempInput;

		const KEY_ENTER_KEYCODE = 13,
			  KEY_ESC_KEYCODE = 27;	
	////////////////////////////////////////////////////////////////////////////

	// classes
		const WRAPPER_CLASS = 'todolist-wrapper',
			TODOLIST_NAME_CLASS = 'todolist-name',
			COLLAPSE_BUTTON = '',
			MENU = '',
			MENU_ITEM = '',
			ADD_TODOLIST = '',
			REMOVE_TODOLIST = '',
			MAIN_INPUT_CLASS = 'addTask',
			FILTERS_CLASS = 'filters',
			FILTERS_ITEM_CLASS = 'filters__item',
			FILTERS_ITEM_SELECTED_CLASS = 'filters__item--selected',
			NO_TASK_CLASS = 'no-tasks',
			NO_TASK_HIDDEN_CLASS = 'no-tasks--hidden',
			TASK_LIST_CLASS = 'taskList',
			INFOBAR_CLASS = 'infobar',
			INFOBAR_HIDDEN_CLASS = 'infobar--hidden',
			INFOBAR_REMAIN_CLASS = 'infobar__remain',
			INFOBAR_REMAIN_COUNT_CLASS = 'infobar__remain-count',
			INFOBAR_REMOVE_BTN_CLASS = 'infobar__remove-btn',
			INFOBAR_REMOVE_BTN_HIDDEN_CLASS = 'infobar__remove-btn--hidden',
			INFOBAR_SELECTED_CLASS = 'infobar__selected',
			TASK_ITEM_CLASS = 'task-item',
			TASK_ITEM_DONE_CLASS = 'task-item--done',
			TASK_ITEM_HIDDEN_CLASS = 'task-item--hidden',
			TASK_ITEM_CHECKBOX_LABEL_CLASS = 'task-item__checkbox-label',
			TASK_ITEM_CHECKBOX_CLASS = 'task-item__checkbox',
			TASK_ITEM_TASK_CLASS= 'task-item__task',
			TASK_ITEM_DEADLINE_CLASS = 'task-item__deadline',
			TASK_ITEM_DEADLINE_EMPTY_CLASS = 'task-item__deadline--empty',
			TASK_ITEM_REMOVE_TASK_CLASS = 'task-item__removeTask',
			TASK_ITEM_REMOVE_TASK_HIDDEN_CLASS = 'task-item__removeTask--hidden',
			TASK_ITEM_TASK_EDIT_CLASS = 'task-item__task-edit',
			TASK_ITEM_TASK_EDIT_TASK_CLASS = 'task-item__task-edit--task',
			TASK_ITEM_TASK_EDIT_DEADLINE_CLASS = 'task-item__task-edit--deadline',
			NO_SELECT_CLASS = 'noselect';

		const todolistClasses = {
			WRAPPER_CLASS : WRAPPER_CLASS ,
			TODOLIST_NAME_CLASS : TODOLIST_NAME_CLASS ,
			MAIN_INPUT_CLASS : MAIN_INPUT_CLASS ,
			FILTERS_CLASS : FILTERS_CLASS ,
			FILTERS_ITEM_CLASS : FILTERS_ITEM_CLASS ,
			FILTERS_ITEM_SELECTED_CLASS : FILTERS_ITEM_SELECTED_CLASS ,
			NO_TASK_CLASS : NO_TASK_CLASS ,
			NO_TASK_HIDDEN_CLASS : NO_TASK_HIDDEN_CLASS ,
			TASK_LIST_CLASS : TASK_LIST_CLASS ,
			INFOBAR_CLASS : INFOBAR_CLASS ,
			INFOBAR_HIDDEN_CLASS : INFOBAR_HIDDEN_CLASS ,
			INFOBAR_REMAIN_COUNT_CLASS : INFOBAR_REMAIN_COUNT_CLASS ,
			INFOBAR_REMOVE_BTN_CLASS : INFOBAR_REMOVE_BTN_CLASS ,
			INFOBAR_REMOVE_BTN_HIDDEN_CLASS : INFOBAR_REMOVE_BTN_HIDDEN_CLASS ,
			INFOBAR_SELECTED_CLASS : INFOBAR_SELECTED_CLASS ,
		}
		
		const todolistItemClasses = {
			TASK_ITEM_CLASS : TASK_ITEM_CLASS,
			TASK_ITEM_CHECKBOX_LABEL_CLASS : TASK_ITEM_CHECKBOX_LABEL_CLASS,
			TASK_ITEM_CHECKBOX_CLASS : TASK_ITEM_CHECKBOX_CLASS,
			TASK_ITEM_TASK_CLASS: TASK_ITEM_TASK_CLASS,
			TASK_ITEM_DEADLINE_CLASS : TASK_ITEM_DEADLINE_CLASS,
			TASK_ITEM_DEADLINE_EMPTY_CLASS : TASK_ITEM_DEADLINE_EMPTY_CLASS,
			TASK_ITEM_REMOVE_TASK_CLASS : TASK_ITEM_REMOVE_TASK_CLASS,
			TASK_ITEM_REMOVE_TASK_HIDDEN_CLASS : TASK_ITEM_REMOVE_TASK_HIDDEN_CLASS,
			TASK_ITEM_TASK_EDIT_CLASS : TASK_ITEM_TASK_EDIT_CLASS,
			TASK_ITEM_TASK_EDIT_TASK_CLASS : TASK_ITEM_TASK_EDIT_TASK_CLASS,
			TASK_ITEM_TASK_EDIT_DEADLINE_CLASS : TASK_ITEM_TASK_EDIT_DEADLINE_CLASS,
			NO_SELECT_CLASS : NO_SELECT_CLASS,
		}	
	////////////////////////////////////////////////////////////////////////////

	// init, listener, edit
		function initialize(domElem, tasklistName) {
			if(!domElem) return

			var widgetHTML;

			tasklistName = tasklistName || ('undefined' + TodolistModule.count++);

			if(!widget){
				widget = domElem;
				widget.name = tasklistName;
				widgetHTML = templater(todolist_template)(todolistClasses);
				domElem.innerHTML = widgetHTML;
				domElem.classList.add(WRAPPER_CLASS);

				widget_addTask = widget.getElementsByClassName(MAIN_INPUT_CLASS)[0];
				widget_taskList = widget.getElementsByClassName(TASK_LIST_CLASS)[0];
				widget_filters = widget.getElementsByClassName(FILTERS_CLASS)[0];
				widget_infobar = widget.getElementsByClassName(INFOBAR_CLASS)[0];
				widget_infobarRemain = widget.getElementsByClassName(INFOBAR_REMAIN_COUNT_CLASS)[0]
				widget_infobarSelected = widget.getElementsByClassName(INFOBAR_SELECTED_CLASS)[0];
				widget_infobarRemoveBtn = widget.getElementsByClassName(INFOBAR_REMOVE_BTN_CLASS)[0]
				widget_noTasksMessage = widget.getElementsByClassName(NO_TASK_CLASS)[0];

				addListeners();
			}
		}

		function addListeners(){
			if(!widget) return
			///////////////////////////
		

			///////////////////////////	
			//listen enter & esc
			//////////////////////////
				widget_addTask.onkeydown = function(e){
					var key = e.keyCode;

					if(key == KEY_ESC_KEYCODE) this.blur();
					if(key == KEY_ENTER_KEYCODE){ 
						//cant create empty task
						if(!this.value.trim()) return

						addNewTask(this.value.trim());
						clearTaskInput()
					}
				}
			///////////////////////////

			///////////////////////////
			//listen removebtn click
			//////////////////////////
				widget.addEventListener('click', e => {
					var target = e.target;
					if(target.classList && target.classList.contains(TASK_ITEM_REMOVE_TASK_CLASS)){
						var currentLi = target.closest('li');
						//tasksObj.tasksCount--
						removeTask(currentLi)

					}
				})
			///////////////////////////

			///////////////////////////
			//listen dblclick to edit
			//////////////////////////
				widget.addEventListener('click', e => {
					var target = e.target;

					//check click on task or deadline
					if(target.classList && !target.classList.contains(TASK_ITEM_TASK_CLASS)
					    && !target.classList.contains(TASK_ITEM_DEADLINE_CLASS)) return

					if(!target.firstClick){
						target.firstClick = true;
						setTimeout(function(){
							delete target.firstClick
						},500)
					} else {
						itemEdit(target);
					}
				})
			///////////////////////////

			///////////////////////////
			//filters
			//////////////////////////
				widget_filters.addEventListener('click', e => {
					var target = e.target;
					if(target.nodeName != 'LI') return
					if(target.classList && target.classList.contains(FILTERS_ITEM_SELECTED_CLASS)) return

					//replace class --selected
						widget_filters.getElementsByClassName(FILTERS_ITEM_SELECTED_CLASS)[0].classList.remove(FILTERS_ITEM_SELECTED_CLASS);
						target.classList.add(FILTERS_ITEM_SELECTED_CLASS);

					//change block value 
						var selector = target.getAttribute('value');
						widget_filters.setAttribute('value', selector)

					//switch selected
						var items = widget_taskList.getElementsByClassName(TASK_ITEM_CLASS);
						switch(selector){
							case 'all' : 
								[].forEach.call(items, el => {
									el.classList.remove(TASK_ITEM_HIDDEN_CLASS);
									expandItem(el)
								})
								break;

							case 'done' : 
								[].forEach.call(items, el => {
									if(el.classList.contains(TASK_ITEM_DONE_CLASS)){
										el.classList.remove(TASK_ITEM_HIDDEN_CLASS)
										expandItem(el)
									} else {
										el.classList.add(TASK_ITEM_HIDDEN_CLASS)
										collapseItem(el)
									}
								})
								break;

							case 'not-done' : 
								[].forEach.call(items, el => {
									if(!el.classList.contains(TASK_ITEM_DONE_CLASS)){
										el.classList.remove(TASK_ITEM_HIDDEN_CLASS)
										expandItem(el)
									} else {
										el.classList.add(TASK_ITEM_HIDDEN_CLASS)
										collapseItem(el)
									}
								})
								break;

							case 'tomorrow' : 
								[].forEach.call(items, el => {
									var tomorrow = new Date();
									tomorrow.setDate(tomorrow.getDate() + 1);
									tomorrow.setHours(0,0,0,0);

									var deadline = el.getElementsByClassName(TASK_ITEM_DEADLINE_CLASS)[0].innerHTML,
										deadlineDate = new Date( deadline.replace(/(\d*)?\.(\d*)?\.(\d*)/, '$3 $2 $1') );

									if(deadlineDate.getTime() == tomorrow.getTime()){
										el.classList.remove(TASK_ITEM_HIDDEN_CLASS);
										expandItem(el)
									} else {
										el.classList.add(TASK_ITEM_HIDDEN_CLASS)
										collapseItem(el)
									}
								})
								break;

							case 'week' : 
								[].forEach.call(items, el => {
									var deadline = el.getElementsByClassName(TASK_ITEM_DEADLINE_CLASS)[0].innerHTML,
										deadlineDate = new Date( deadline.replace(/(\d*)?\.(\d*)?\.(\d*)/, '$3 $2 $1') );

									if(isThisWeek(deadlineDate)){
										el.classList.remove(TASK_ITEM_HIDDEN_CLASS);
										expandItem(el)
									} else {
										el.classList.add(TASK_ITEM_HIDDEN_CLASS)
										collapseItem(el)
									}
								})
								break;
						}

					//visible count
						var visibleCount = widget_taskList.querySelectorAll('.' + TASK_ITEM_CLASS + ':not(.' + TASK_ITEM_HIDDEN_CLASS + ')').length;
						//l('visibleCount : ', visibleCount)
						if(!visibleCount){
							widget_noTasksMessage.classList.remove(NO_TASK_HIDDEN_CLASS)
						} else {
							widget_noTasksMessage.classList.add(NO_TASK_HIDDEN_CLASS)
						}

					//extra func
						//check is the date at current week
						function isThisWeek(date){
							var today = new Date(),
								dayNum = today.getDay(),
								thisWeekMinDate = new Date(),
								thisWeekMaxDate = new Date();

							dayNum = dayNum == 0 ? 6 : dayNum - 1;
							thisWeekMinDate.setDate(today.getDate() - dayNum);
							thisWeekMinDate.setHours(0,0,0,0);
							thisWeekMaxDate.setDate(today.getDate() + (6 - dayNum));
							thisWeekMaxDate.setHours(0,0,0,0);
							
							if(date.getTime() >= thisWeekMinDate.getTime() &&
								date.getTime() <= thisWeekMaxDate.getTime()) return true

							return false	
						}

						
				})
			///////////////////////////

			///////////////////////////
			//checkbox
			//////////////////////////
				widget.addEventListener('click', e => {
					var target = e.target,
						li;

					if(target.nodeName != 'INPUT' || target.getAttribute('type') != 'checkbox') return

					li = target.closest('li')

					if(target.checked){
						li.classList.add(TASK_ITEM_DONE_CLASS);
						li.liDataObj.checked = true;
						tasksObj.tasksSelected++;
					} else {
						li.classList.remove(TASK_ITEM_DONE_CLASS);
						li.liDataObj.checked = false;
						tasksObj.tasksSelected--;
					}
				})
			///////////////////////////

			///////////////////////////
			//tasksObj and infobar
			//////////////////////////
				makeChangeListening(tasksObj, 'tasksCount', widget_infobar);
				makeChangeListening(tasksObj, 'tasksSelected', widget_infobar);

				widget_infobar.addEventListener('change', e => {
					//l(tasksObj)
					var prop = e.detail.prop,
						value = e.detail.value;

					widget_infobarRemain.innerHTML = tasksObj.tasksCount - tasksObj.tasksSelected;
					widget_infobarSelected.innerHTML = tasksObj.tasksSelected;

					if(tasksObj.tasksCount){
						widget_infobar.classList.remove(INFOBAR_HIDDEN_CLASS);
					} else {
						widget_infobar.classList.add(INFOBAR_HIDDEN_CLASS);
					}
					
					if(tasksObj.tasksSelected){
						widget_infobarRemoveBtn.classList.remove(INFOBAR_REMOVE_BTN_HIDDEN_CLASS)
					} else {
						widget_infobarRemoveBtn.classList.add(INFOBAR_REMOVE_BTN_HIDDEN_CLASS)
					}
				})

				widget_infobarRemoveBtn.onclick = function(e){
					[].slice.call(widget_taskList.getElementsByClassName(TASK_ITEM_DONE_CLASS)).forEach(li => {
						removeTask(li)
					})
				}
			///////////////////////////


			///////////////////////////
			//local storage
			//////////////////////////

				//listen changing
				widget.addEventListener('change', e => {
					if(!e.detail) return
					if(e.target != e.currentTarget) return	
					refreshLocalStorage()
				})

				createTasksFromLocalStorage()	
			///////////////////////////		
		}	

		function addNewTask(task, deadline, check){
			if(!widget_task_template){
				widget_task_template = templater(todolist_task_item_template)(todolistItemClasses)
			}

			var taskLi = document.createElement('div');
			taskLi.innerHTML = widget_task_template;
			taskLi = taskLi.firstElementChild;
			taskLi.getElementsByClassName(TASK_ITEM_TASK_CLASS)[0].textContent = task;
			taskLi.dataset.id = taskId++;


			if(deadline){
				var deadlineElement = taskLi.getElementsByClassName(TASK_ITEM_DEADLINE_CLASS)[0]
				deadlineElement.textContent = deadline;
				deadlineElement.classList.remove(TASK_ITEM_DEADLINE_EMPTY_CLASS)
			}

			taskLi.classList.add(TASK_ITEM_HIDDEN_CLASS);
			widget_taskList.appendChild(taskLi);
			//collapseItem(taskLi)

			setTimeout(function(){
				taskLi.classList.remove(TASK_ITEM_HIDDEN_CLASS);
			}, 10)
			
			tasksObj.tasksCount++;

			var liDataObj = {
				id: taskLi.dataset.id,
				task: task,
				deadline: deadline,
				checked: check ? true : false,
				element: taskLi,
			}

			tasksObj.tasks[liDataObj.id] = liDataObj
			makeAllPropsChangeListening(tasksObj.tasks[liDataObj.id], widget);
			taskLi.liDataObj = liDataObj

			if(check){
				taskLi.getElementsByClassName(TASK_ITEM_CHECKBOX_CLASS)[0].click()
			}
			refreshLocalStorage()
		}

		function removeTask(li){
			var liDataObj = li.liDataObj;
			if(liDataObj.checked) tasksObj.tasksSelected--;
			tasksObj.tasksCount--;	

			delete tasksObj.tasks[liDataObj.id]
			refreshLocalStorage()

			
			collapseItem(li);
			setTimeout( function(){
				li.remove()
			},500)			

		}

		function clearTaskInput(){
			widget_addTask.value = '';
		}

		function itemEdit(span){
			var startValue = span.innerHTML;

			if(span.classList.contains(TASK_ITEM_TASK_CLASS)){
				//task
				tempInput.type = 'text'
				tempInput.value = startValue;

				tempInput.classList.remove(TASK_ITEM_TASK_EDIT_DEADLINE_CLASS)
				tempInput.classList.add(TASK_ITEM_TASK_EDIT_TASK_CLASS)

			} else {
				//deadline
				tempInput.type = 'date'
				tempInput.value = startValue.replace(/(\d*)?\.(\d*)?\.(\d*)/, '$3-$2-$1');

				tempInput.classList.remove(TASK_ITEM_TASK_EDIT_TASK_CLASS);
				tempInput.classList.add(TASK_ITEM_TASK_EDIT_DEADLINE_CLASS);
			}

			tempInput.startValue = startValue;
			tempInput.relatedSpan = span;

			span.parentNode.replaceChild(tempInput, span);
			tempInput.focus()
		}

		//collapseItem
		function collapseItem(item){
			//check fullHeight for not 
			if(item.fullHeight != undefined) return

			if(!item.style.maxHeight){
				item.style.maxHeight = item.offsetHeight + 'px';
			}	

			setTimeout(function(){
				item.fullHeight = item.offsetHeight;
				item.style.maxHeight = 0;
			},10)
		}
		
		//expandItem
		function expandItem(item){
			item.style.maxHeight = item.fullHeight + 'px';
			setTimeout(function(){
				item.style.maxHeight = null;
			}, 500)
			delete item.fullHeight
		}
	////////////////////////////////////////////////////////////////////////////

	// tempInput
		var tempInput = document.createElement('input');
		tempInput.classList.add(TASK_ITEM_TASK_EDIT_CLASS)		

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
			if(newValue !== false){

				var currentLi = tempInput.closest('li');

				if(this.type == 'date'){
					//edit deadline 
					var editedDate = this.value.replace(/(\d*)?-(\d*)?-(\d*)/, '$3.$2.$1');
					this.relatedSpan.innerHTML = editedDate;
					currentLi.liDataObj.deadline = editedDate;

					if(!this.value){
						this.relatedSpan.classList.add(TASK_ITEM_DEADLINE_EMPTY_CLASS)
					} else {
						this.relatedSpan.classList.remove(TASK_ITEM_DEADLINE_EMPTY_CLASS)
					}

				} else {
					//edit task
					if(!this.value){
						currentLi.remove()
						return
					} 

					this.relatedSpan.innerHTML = this.value
					currentLi.liDataObj.task = this.value
				}
			} 		

			this.parentNode.replaceChild(this.relatedSpan, this);
		}

		tempInput.onfocus = function(e){
			document.addEventListener('mousedown', tempInput.checkMouseClickOut)
		}

		tempInput.onblur = function(e){
			document.removeEventListener('mousedown', tempInput.checkMouseClickOut)
		}

		tempInput.checkMouseClickOut = function(e){
			if(e.target != tempInput){
				tempInput.returnSpan(true)
			}
		}
	////////////////////////////////////////////////////////////////////////////

	// Local Storage
		function createTasksFromLocalStorage(){
			var localTaskList = localStorage.getItem('taskList_' + widget.name);
			if(localTaskList){
				var localTasks = JSON.parse(localTaskList)
				for(var num in localTasks){
					var task = localTasks[num]
					addNewTask(task.task, task.deadline, task.checked)
				}
			}
		}

		function refreshLocalStorage(){
			var tasks = tasksObj.tasks,
				tempObj = {};

			localStorage.removeItem('taskList_' + widget.name);	

			for(var prop in tasks){
				tempObj[prop] = {};
				tempObj[prop].id = tasks[prop].id;
				tempObj[prop].checked = tasks[prop].checked;
				tempObj[prop].deadline = tasks[prop].deadline;
				tempObj[prop].task = tasks[prop].task;
			}

			var serialTasks = JSON.stringify(tempObj)
			localStorage.setItem('taskList_' + widget.name, serialTasks);
		}
	////////////////////////////////////////////////////////////////////////////

	//extra functions
		function templater(html){
			return function(data){
				for(var x in data){
					var regExp = "{{\\s?" + x + "\\s?}}";
					html = html.replace(new RegExp(regExp,'ig'), data[x]);
				}

				html = html.replace(/{{.*?}}/ig, ''); //empty {{ }} must be deleted!

				return html
			}
		}

		function makeChangeListening(obj, prop, element, eventName){
			var startValue = obj[prop];

			eventName = eventName || 'change';

			Object.defineProperty(obj, prop, {
				get: function(){ return startValue},
				set: function(n){
					Object.defineProperty(obj, prop, {
						get: function(){ return n }
					});

					var widgetEvent = new CustomEvent(eventName, {
						bubbles : true,
						detail: {
							prop: prop,
							value : n
						}
					})

					element.dispatchEvent(widgetEvent);
				}
			})
		}

		function makeAllPropsChangeListening(obj, element, eventName){
			for(var prop in obj){
				makeChangeListening(obj, prop, element, eventName)
			}
		}
	////////////////////////////////////////////////////////////////////////////
	
	//public metods
		this.init = initialize
}


