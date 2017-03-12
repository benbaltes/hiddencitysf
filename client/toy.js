$(function() {
	console.log('Start')
  var toyID = getParameterByName('toyID');
	populateToyInfo('toyID');
});

function getParameterByName(name,url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function populateToyInfo(toyID){
  $.ajax({ 
   type : "GET", 
   url : "https://oxho60p1v9.execute-api.us-west-2.amazonaws.com/dev/toys/" + toyID, 
   beforeSend: function(xhr){xhr.setRequestHeader('x-api-key', 'i7LM89nUBi6csSwEUrNem1sOEOr3eu6B68dch1GR');},
   success : function(result) {

   }, 
   error : function(result) { 
     	console.log("FAILURE");
     	console.log(result)
   } 
 });
}
