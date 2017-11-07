'use strict'
var	txt = document.querySelector('textarea'),
    ENTER_KEYCODE = 13;

txt.addEventListener('keydown', function(e){

  //check carriage at the last position
	if(this.selectionStart == this.value.length){

    //check enter key
		if(e.keyCode == ENTER_KEYCODE){
			// cancel default enter
			e.preventDefault();
			//add '' for smart autoGrow
			this.value = this.value + '\n'  + '';
			autoGrow(this)
			return false
		}
	} else {

	}
  
	autoGrow(txt)
});

txt.addEventListener('keyup', function(e){
	autoGrow(txt)
});

function autoGrow(item){
	item.style.height = null;
	item.style.height = item.scrollHeight + 'px'
}






