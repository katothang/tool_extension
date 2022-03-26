

  $.getScript( "https://www.gstatic.com/firebasejs/7.14.6/firebase-app.js", function( ) {
    $.getScript( "https://www.gstatic.com/firebasejs/7.14.6/firebase-firestore.js", function() {
        $.getScript( "js/firebase.js", function() {
            console.log( data ); // Data returned
            console.log( textStatus ); // Success
            console.log( jqxhr.status ); // 200
            console.log( "Load was performed." );
          });
  });
  });

  //

