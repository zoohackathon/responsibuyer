var RSBer = (function(RSBer, $){
  var _placeSearch;
  var autocomplete;
  var isInit = false;

  var _init = function (){
    if(!isInit){
      autocomplete = new window.google.maps.places.Autocomplete(
           /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
           {types: ['geocode']});
    }
    isInit = true;
  };

  var _geolocate = function(){
    if (!!navigator && typeof navigator.geolocation !== 'undefined') {
         navigator.geolocation.getCurrentPosition(function getPosition(position) {
           var geolocation = {
             lat: position.coords.latitude,
             lng: position.coords.longitude
           };
           var circle = new window.google.maps.Circle({
             center: geolocation,
             radius: position.coords.accuracy
           });
           this.autocomplete.setBounds(circle.getBounds());
         });
       }
  };

  var getNewsfeed = function(){
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
  };
  

  return {
    init: _init,
    geolocate: _geolocate,
    getNewsfeed: getNewsfeed
  }; 
  
}(RSBer || {}, jQuery, window.google));

$(document).on('ready', function(){
  RSBer.init();
});

window.initRSBer = function(RSBer){
  RSBer.init();
};


