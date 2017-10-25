'use strict'
var l = console.log;

var todoList = new TodoListModule()
todoList.init(document.getElementsByClassName('todoList-container')[0])


function TodoListModule(){
	var widget, widget_task_template, widget_addTask, widget_taskList, widget_filters, widget_infobar,
		todoList_template = document.getElementById('todoList-template').innerHTML,
		todoList_task_item_template = document.getElementById('todoList-task-item-template').innerHTML;

	// classes
		const todoListClasses = {
			WRAPPER_CLASS : 'todoList-wrapper',
			TODOLIST_NAME_CLASS : 'todoList-name',
			MAIN_INPUT_CLASS : 'addTask',
			FILTERS_CLASS : 'filters',
			FILTERS_ITEM_CLASS : 'filters__item',
			FILTERS_ITEM_SELECTED_CLASS : 'filters__item--selected',
			NO_TASK_CLASS : 'no-tasks',
			NO_TASK_HIDDEN_CLASS : 'no-tasks--hidden',
			TASK_LIST_CLASS : 'taskList',
			INFOBAR_CLASS : 'infobar',
			INFOBAR_HIDDEN_CLASS : 'infobar--hidden',
			INFOBAR_REMAIN_CLASS : 'infobar__remain',
			INFOBAR_REMOVE_BTN_CLASS : 'infobar__remove-btn',
			INFOBAR_REMOVE_BTN_HIDDEN_CLASS : 'infobar__remove-btn--hidden',
			INFOBAR_SELECTED_CLASS : 'infobar__selected',
			NO_SELECT_CLASS : 'noselect'
		}
		
		const todoListItemClasses = {
			TASK_ITEM_CLASS : 'task-item',
			TASK_ITEM_CHECKBOX_LABEL_CLASS : 'task-item__checkbox-label',
			TASK_ITEM_CHECKBOX_CLASS : 'task-item__checkbox',
			TASK_ITEM_TASK_CLASS: 'task-item__task',
			TASK_ITEM_DEADLINE_CLASS : 'task-item__deadline',
			TASK_ITEM_DEADLINE_EMPTY_CLASS : 'task-item__deadline--empty',
			TASK_ITEM_REMOVE_TASK_CLASS : 'task-item__removeTask',
			TASK_ITEM_REMOVE_TASK_HIDDEN_CLASS : 'task-item__removeTask--hidden',
		}	
	////////////////////////////////////////////////////////////////////////////


	function addNewTask(task){
		if(!widget_task_template){
			widget_task_template
		}
	}

	function clearTaskInput(){
		
	}

	function addListeners(){
		if(!widget) return

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
		widget_taskList
		widget_filters
		widget_infobar

	}	

	function initialize(domElem) {
		var widgetHTML;

		if(!widget){
			widget = domElem;
			widgetHTML = templater(todoList_template)(todoListClasses);
			domElem.innerHTML = widgetHTML;
			domElem.classList.add(todoListClasses.WRAPPER_CLASS);

			widget_addTask = widget.getElementsByClassName()[0],
			widget_taskList = widget.getElementsByClassName()[0],
			widget_filters = widget.getElementsByClassName()[0],
			widget_infobar = widget.getElementsByClassName()[0];

			addListeners();
		}
	}

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

	////////////////////////////////////////////////////////////////////////////
	

	//public metods
		this.init = initialize
}



