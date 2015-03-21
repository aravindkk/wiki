$(document).ready(function(){
 alert('here in alert');	
 $.get('/wiki/i/3792',
       function( data ) {
  //var p = 'Be the first to create this wiki <a href="/wiki/edit">here</a>!';
  console.dir(data);
  //if(data)
   var p = '<p>' + data.section_id + '</p>' + '<p>' + data.user_id + '</p>' + '<p>' + data.revision + '</p>' + '<p>' + data.section_1 + '</p>' + '<p>' + data.section_2 + '</p>' + '<p>' + data.section_3 + '</p>' + '<p>' + data.section_4 + '</p>' + '<p>' + data.section_5 + '</p>';
  
  $("#result").html(p);
  alert( "Load was performed." ); 
   });
});
