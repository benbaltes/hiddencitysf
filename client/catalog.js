$(function() {
	console.log('Start')
	populateAllToys();
});

function populateAllToys(){
  $.ajax({ 
   type : "GET", 
   url : "https://oxho60p1v9.execute-api.us-west-2.amazonaws.com/dev/toys", 
   beforeSend: function(xhr){xhr.setRequestHeader('x-api-key', 'i7LM89nUBi6csSwEUrNem1sOEOr3eu6B68dch1GR');},
   success : function(result) {
      // Create a div for every single toy returned
   		console.log(result);
   		for(toyIndex in result){
        console.log(result[toyIndex])
   			var imageUrl = result[toyIndex].image_url;
   			console.log(imageUrl);
   			$(".toycatalog").append("<div class='box'><div class='toyTitle'></div></div>");
   		}

      // Put image in every single div
      var childDivs = $(".toycatalog").children();
      console.log(childDivs)
      var i = 0
      for(toyIndex in result){ 
        // console.log(childDivs[i])
        // console.log(result[i].image_url)  
        childDivs[i].style.backgroundImage = "url('" + result[i].image_url + "')";
        childDivs[i].style.backgroundSize = "cover";

        var toyTitleDiv = childDivs[i].getElementsByClassName('toyTitle')[0]
        toyTitleDiv.innerHTML = result[i].name;
        i++;
      }
   }, 
   error : function(result) { 
     	console.log("FAILURE");
     	console.log(result)
   } 
 });
}
