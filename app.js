var RSBer = (function(RSBer, $){
  var _placeSearch;
  var autocomplete;
  var isInit = false;

  var _init = function(){
    if(!isInit && !!window.google){
      autocomplete = new window.google.maps.places.Autocomplete(
           /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
           {types: ['geocode']});
      isInit = true;
    }
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
           autocomplete.setBounds(circle.getBounds());
         });
       }
  };

  var getNewsFeed = function(){
     var params = {
         // Request parameters
         "q": "illegal animal trade",
         "count": "10",
         "offset": "0",
         "mkt": "en-us",
         "safeSearch": "Moderate",
     };

     $.ajax({
         url: "https://api.cognitive.microsoft.com/bing/v5.0/news/search?q=microsoft&count=10&offset=0&mkt=en-us&safeSearch=Moderate&q=microsoft&count=10&offset=0&mkt=en-us&safeSearch=Moderate",
         beforeSend: function(xhrObj){
             // Request headers
             xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","9e1f82438f5249efb4a0add36f4fa17c");
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

  var getLatLong = function() {
    return {
      lat: autocomplete.getPlace().geometry.location.lat(),
      lng: autocomplete.getPlace().geometry.location.lng()
    }
  };

  return {
    init: _init,
    geolocate: _geolocate,
    getNewsFeed: getNewsFeed,
    getLatLong: getLatLong
  };

}(RSBer || {}, jQuery, window.google));

$(document).on('ready', function(){
  RSBer.getNewsFeed();
  RSBer.init();
})
.on('click', '.search-icon', function(e){
  var latlong = RSBer.getLatLong();
  window.location.href = '/responsibuyer/search.html?lat=' + latlong.lat + '&long=' + latlong.lng;
  console.log('Lat long: ', latlong);
});

function initRSBer() {
  RSBer.init();
};
