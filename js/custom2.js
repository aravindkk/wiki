$(document).ready(function(){
  console.log('-in custom2-');	
  $.get('/wiki/history/3792', function(data){
    var p ='<p>No revisions!</p>';
    if(data!='-1')
    {   
    	p='';
    	for(var i=0;i<data.length;i++)
       	  p = p + '<p>' + data[i].revision + ': ' + data[i].user_id + '</p>';
    }
    $('#result').html(p);
  });
});