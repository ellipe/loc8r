/* Angular Controllers and Directives*/


var locationListCtrl = function ($scope, loc8rData, geolocation) {
	$scope.message = "Checking your location";

	$scope.getData = function(position){
		$scope.message = "Searching for nearby places...";

		console.log(position);
		var lat = position.coords.latitude;
		var lng = position.coords.longitude;

		loc8rData.locationByCoords(lat, lng)
				.then(function (response) {
					$scope.message = response.data.length > 0 ? "" : "No locations found";
					$scope.data = {
						locations: response.data
					};
				})
				.catch(function(e){
					$scope.message = "Sorry, something's gone wrong ";
					console.log(e);
				});	
	};

	$scope.showError = function(error) {
		$scope.$apply(function(){
			$scope.message = error.message;
		});
	};
	
	$scope.noGeo = function(){
		$scope.$apply = function(){
			$scope.message = "Geolocation is not supported in this browser.";
		};
	};

	geolocation.getPosition($scope.getData, $scope.showError, $scope.noGeo);
	
};

var _isNumeric = function (n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
};

/* Filter for formatting the distance correctly */
var formatDistance = function () {
	return function(distance){
		var numDistance, unit;
		if (distance && _isNumeric(distance)) {
			if (distance > 1) {
				numDistance = parseFloat(distance).toFixed(1);
				unit = 'km';
			}else{
				numDistance = parseInt(distance * 1000, 10);
				unit = 'm';
			}
		return numDistance + ' ' + unit;

		}else{
			return "?";
		}
	};
};

/* Directive for rating stars */
var ratingStars = function () {
	// Isolated scope.
	return {
		scope: {
			thisRating: '=rating'
		},
	templateUrl : '/angular/rating-stars.html'
	};
};

/* Service data for controller */
var loc8rData = function ($http) {
	var locationByCoords = function(lat, lng){
		return $http.get('/api/locations?lng=' + lng +'&lat='+ lat +'&maxDistance=999999999999999999');
	};
	return {
		locationByCoords : locationByCoords
	};
  		
};

var geolocation = function(){
	var getPosition = function(cbSuccess, cbError, cbNoGeo){
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(cbSuccess, cbError);
		}else{
			cbNoGeo();
		}
	};
	return {
		getPosition : getPosition
	};
};

// Angular Module Loader
angular
		.module('loc8rApp', [])
		.controller('locationListCtrl', locationListCtrl)
		.filter('formatDistance', formatDistance)
		.directive('ratingStars', ratingStars)
		.service('loc8rData', loc8rData)
		.service('geolocation', geolocation);


