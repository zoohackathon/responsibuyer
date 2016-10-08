
//autocomplete
var placeSearch, autocomplete;

     function initAutocomplete() {

       autocomplete = new google.maps.places.Autocomplete(
           /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
           {types: ['geocode']});

     }

     function geolocate() {
       if (navigator.geolocation) {
         navigator.geolocation.getCurrentPosition(function(position) {
           var geolocation = {
             lat: position.coords.latitude,
             lng: position.coords.longitude
           };
           var circle = new google.maps.Circle({
             center: geolocation,
             radius: position.coords.accuracy
           });
           autocomplete.setBounds(circle.getBounds());
         });
       }
     }


     //newsfeed
     $(function() {
         var params = {
             // Request parameters
             "q": "illegal animal trade",
             "count": "10",
             "offset": "0",
             "mkt": "en-us",
             "safeSearch": "Moderate",
         };

         $.ajax({
             url: "https://api.cognitive.microsoft.com/bing/v5.0/news/search?" + $.param(params),
             beforeSend: function(xhrObj){
                 // Request headers
                 xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","f07fec7721354863a1a6cf6d2a2d05ee");
             },
             type: "GET",
             // Request body
             data: "{body}",
         })
         .done(function(data) {
             console.log("success");
             console.log(data);
         })
         .fail(function() {
             console.log("error");
         });
     });
