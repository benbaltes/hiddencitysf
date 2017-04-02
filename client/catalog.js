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
				var toyID = result[toyIndex].uuid;
				console.log('toyID: ' + toyID )
   			console.log(imageUrl);
				//$(".toycatalog").append("<a href=/toys?uuid=" + toyID + ">");

				appendstring1 = "<a href='toy.html?toyID=" + toyID + "'>";
				appendstring2 = "<div class='box'><div class='toyTitle'></div></div>";
				appendstring3 = "</a>";
				toydiv = appendstring1 + appendstring2 + appendstring3;

				$(".toycatalog").append(toydiv);
   		}

      // Put image in every single div
      var toyDivs = $(".box")
      console.log(toyDivs)
      var i = 0
      for(toyIndex in result){
        // console.log(childDivs[i])
        // console.log(result[i].image_url)
        toyDivs[i].style.backgroundImage = "url('" + result[i].image_url + "')";
        toyDivs[i].style.backgroundSize = "cover";

        var toyTitleDiv = toyDivs[i].getElementsByClassName('toyTitle')[0]
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
