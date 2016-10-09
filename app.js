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
      url: "https://ajax.googleapis.com/ajax/services/feed/load?v=2.0&output=json&q=" + encodeURIComponent("http://news.google.com/news?cf=all&hl=en&pz=1&ned=us&q=poaching&output=rss"),
      dataType: "jsonp",
      success: function(data) {
         var entries = data.responseData.feed.entries;
         var index = 0;
         var newsTemplate = $('.news-item-template').clone();
         var newsContainer = $('.news-container');
         for(index; index < entries.length; index++){
            var entry = entries[index];
            var newsItem = newsTemplate.clone()
            .find('a')
            .attr('href', entry.link)
            .attr('target', '_blank')
            .text(entry.title);
            newsContainer.append(newsItem);
         }
      }
    });
  };

  var getLatLong = function() {
    var place = autocomplete.getPlace();
    if(typeof place !== 'undefined'){
      return {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      }
    }
    else if(!!navigator && typeof navigator.geolocation !== 'undefined') {
         navigator.geolocation.getCurrentPosition(function getPosition(position) {
           return {
             lat: position.coords.latitude,
             lng: position.coords.longitude
           };
      }); 
    }
    return {
      lat: 50.19755079999999,
      lng: 9.300948500000004
    };      
  };

  return {
    init: _init,
    geolocate: _geolocate,
    getNewsFeed: getNewsFeed,
    getLatLong: getLatLong
  };

}(RSBer || {}, jQuery, window.google));

$(document).on('ready', function(){
  RSBer.init()
  RSBer.getNewsFeed();
})
.on('click', '.search-icon', function(e){
  var latlong = RSBer.getLatLong();
  window.location.href = 'search.html?lat=' + latlong.lat + '&long=' + latlong.lng;
  console.log('Lat long: ', latlong);
});

function initRSBer() {
  RSBer.init();
};
