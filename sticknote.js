$('body').dblclick(addNote);
$( '.note').hover();
function addNote(e){
    let x = e==null?100:e.pageX;
    let y = e==null?100:e.pageY;
  $( '.note' ).each(
    function(){
      //if( $( this ).find( 'textarea' ).val() === '' ){ $( this ).remove(); }  
    }
  );
  
  var note = $('<div class="note"><div class="save">save</div><div class="close"></div><textarea placeholder=""></textarea></div>');
  $( note ).css('left',x-50);
  $( note ).css('top',y-25);
  //$( note ).css('left',300);
  //$( note ).css('top',300);
  
  $( this ).append(note);
  $( note ).draggable();
  $( note ).find( 'textarea' ).focus();
  $( note ).click(function(e){return false;});
  $( note ).find( ".close" ).click(
    function(){
      $( note ).remove();
      return false;
    });

    $( note ).find( ".save" ).click(
      function(){
        alert("save data");
        return false;
      });
  
  $( note ).hover(
			function(){
				$( note ).find( ".close" ).toggle();
			});

  

}

function loadNote() {



}




