'use strict'
var l = console.log;

var wrapper = document.getElementsByClassName('wrapper')[0],
	form = document.getElementsByClassName('task-form')[0],
	table = document.getElementsByClassName('to-do-list')[0],
	editMenu = document.getElementsByClassName('edit-menu')[0];

wrapper.onclick = function(e) {
	var target = e.target;
	if(target.classList.contains('add-task')) {
		form.classList.remove('task-form--invisible');
		form.elements[0].focus()

		document.body.addEventListener('mousedown', listenClickNotInForm);
	};
}

form.onsubmit = function(e){
	e.preventDefault();

	var sendingData = {},
		elements = this.elements,
		empty = true; //flag of empty input

	[].forEach.call(elements, el => {
		if(el.name){
			var value = el.value.trim();
			if(value && value != undefined) empty = false;
			
			if(el.name == 'date'){
				l('not repalced value : ', value)
				value = value.replace(/(\d*?)-(\d*?)-(\d*)/, '$3.$2.$1');	
				l('repalced value : ', value);
			}

	
			sendingData[el.name] = value;
			el.value = ''	
		}
	})

	if(empty){
		closeTaskForm()
		return
	}

	//create row and cells
		var tr = document.createElement('tr');
		tr.classList.add('to-do-list__row');

		for(var i = 0; i < table.rows[0].cells.length; i++){
			var columnName = table.rows[0].cells[i].getAttribute('name')

			var td = document.createElement('td');
			td.setAttribute('name', columnName);
			if(sendingData[columnName]) td.innerHTML = sendingData[columnName];

			tr.appendChild(td);
		}	

		table.appendChild(tr)

	//hide task-form
		closeTaskForm()
}

function closeTaskForm(){
	form.classList.add('task-form--invisible');
	document.body.removeEventListener('click', listenClickNotInForm);
}

function listenClickNotInForm(e){
	var formRect = form.getBoundingClientRect();

	if(e.clientX < formRect.left || e.clientX > formRect.right ||
		e.clientY < formRect.top || e.clientY > formRect.bottom){
		closeTaskForm()
	}
}



//show edit-menu
table.addEventListener('mouseover', function(e){
	var target = e.target,
		row = target.closest('tr');
	
	if(!row || row.sectionRowIndex == '0'){
		return
	}	

	openEditMenu(row)
})

//hide edit-menu
table.addEventListener('mouseout', function(e){
	var target = e.target,
		row = target.closest('tr'),
		relatedTarget = e.relatedTarget,
		relatedRow;

	if(!relatedTarget) return
	relatedRow = relatedTarget.closest('tr');	


	if(!row || !target || !relatedTarget) return 

	if(row == relatedRow){
		return
	}

	closeEditMenu(row);

})

function openEditMenu(row){
	row.appendChild(editMenu)
	editMenu.relatedRow = row;
	setTimeout( function(){editMenu.classList.remove('edit-menu--hidden')}, 0)
}

function closeEditMenu(row){
	editMenu.classList.add('edit-menu--hidden')
}

editMenu.addEventListener('click', function(e){
	var target = e.target,
		row = this.relatedRow;

	if(!target || !row) return
	

	if(target.classList.contains('edit-menu__mark-task-done')){
		markDoneRow(row)
	}

	if(target.classList.contains('edit-menu__remove-task'))	{
		removeRow(row)
	}
})

function markDoneRow(row){
	row.classList.toggle('to-do-list__row--task-done')
}
function removeRow(row){
	if(confirm('удалить?'))	row.remove()
}