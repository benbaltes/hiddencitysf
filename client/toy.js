$(function() {
  var toyID = getParameterByName('toyID');

	populateToyInfo(toyID);
	populateToyLocations(toyID)


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

function initMap(result) {
	if(result != null){
		var uluru = {lat: 37.7960991, lng: -122.4155806};
		// var uluru2 = {lat: 37.7930991, lng: -122.4195806};

		var map = new google.maps.Map(document.getElementById('map'), {
			zoom: 13,
			center: uluru
		});


		marker = new google.maps.Marker({
			 position: new google.maps.LatLng(uluru.lat,uluru.lng),
			 map: map
		 });

		for(locationMeta in result){
			var latitude = result[locationMeta].lat;
			var longitude = result[locationMeta].lon;

			marker = new google.maps.Marker({
				position: new google.maps.LatLng(latitude,longitude),
				map: map
			});

		}
	}
}

function initComments(result) {
  console.log('RESULT IN INIT COMMENTS');
  console.log(result)
  commentTemplate = makeCommentHTML(result[0]);
  $('.commentcontainer').append(commentTemplate);
  console.log(commentTemplate);
}

function makeCommentHTML(locData) {
  userImg = locData.image_url;
  userMsg = locData.message;
  userName = locData.user_name;
  time = locData.created;

  commentTemplate = ['<div class="comment">',
    '<div class="commentpic">',
      '<img class="commentimg" src="images/toyimage.png"></img>',
    '</div>',
    '<div class="commentmetadata">',
      '<b>',
        userName,
      '</b> says... <br>',
    '</div>',
    '<div class="commenttext">',
      userMsg,
    '</div>',
    '<div class="commenttimestamp"><br> at ',
      time,
    '</div>',
  '</div>'];

  return commentTemplate.join("");
}

function populateToyLocations(toyID) {
 console.log('in func getToyLocations');
 if(toyID==null){
	console.log('Toyid is null');
 	toyID = 'f83f36c8-d2ad-11e6-b08f-0a52c9c1f137';
 }
 else{
	 $.ajax({
	   type : "GET",
	   url : "https://oxho60p1v9.execute-api.us-west-2.amazonaws.com/dev/toys/" + toyID + "/history",
	   beforeSend: function(xhr){xhr.setRequestHeader('x-api-key', 'i7LM89nUBi6csSwEUrNem1sOEOr3eu6B68dch1GR');},
	   success : function(result) {
	 	  console.log("SUCCESS");
	 	  console.log(result);

			initMap(result);
      initComments(result);
	   },
	   error : function(result) {
	     	console.log("FAILURE");
	     	console.log(result)
	   }
	 });
 }
}

function populateToyInfo(toyID){
  $.ajax({
   type : "GET",
   url : "https://oxho60p1v9.execute-api.us-west-2.amazonaws.com/dev/toys/" + toyID,
   beforeSend: function(xhr){xhr.setRequestHeader('x-api-key', 'i7LM89nUBi6csSwEUrNem1sOEOr3eu6B68dch1GR');},
   success : function(result) {
		 console.log('toyInfo: ');
		 console.log(result);
	 	 var toyName = result.name;
		 var toyIMG = result.image_url;
		 setToyName(toyName);
		 setToyImage(toyIMG)

   },
   error : function(result) {
     	console.log("FAILURE");
     	console.log(result);
   }
 });
}

function setToyImage(toyIMG){

}

function setToyName(name){
	console.log('setting toy name: ' + name);
	$("#toyname").html(name);
}

function setToyImage(imgurl){
	console.log('setting toy img: ' + imgurl);
	$("#toyIMG").attr('src', imgurl);
}
