$("body").append('<div class="note ui-draggable ui-draggable-handle draggable" style="left: 931px; top: 104px;"><div class="close" style="display: block;"></div><textarea placeholder="">aaa</textarea></div>');
$('body').click(addNote);
$( '.note').hover();
function addNote(e){
    let x = e==null?100:e.pageX;
    let y = e==null?100:e.pageY;
  $( '.note' ).each(
    function(){
      //if( $( this ).find( 'textarea' ).val() === '' ){ $( this ).remove(); }  
    }
  );
  
  var note = $('<div class="note"><div class="close"></div><textarea placeholder=""></textarea></div>');
  $( note ).css('left',x-50);
  $( note ).css('top',y-25);
  
  $( this ).append(note);
  $( note ).draggable();
  $( note ).find( 'textarea' ).focus();
  $( note ).click(function(e){return false;});
  $( note ).find( ".close" ).click(
    function(){
      $( note ).remove();
      return false;
    });
  
  $( note ).hover(
			function(){
				$( note ).find( ".close" ).toggle();
			});
  

}

addNote(document.getElementsByTagName("body"));


