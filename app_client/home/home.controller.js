

angular
  .module('loc8rApp')
  .controller('homeCtrl', homeCtrl)
  .service('loc8rData', loc8rData)
  .service('geolocation', geolocation);

homeCtrl.$inject = ['$scope', 'loc8rData', 'geolocation'];
function homeCtrl ($scope, loc8rData, geolocation) {
	var vm = this;
  	vm.pageHeader = {
  		title: 'Loc8r',
  		strapline: 'Find places to work with wifi near you!'
  	};
  	vm.sidebar = {
  		content: "Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake or a pint? Let Loc8r help you find the place you're looking for."
  	}; 
  	

  	vm.message = "Checking your location";

	vm.getData = function(position){
		vm.message = "Searching for nearby places...";
		var lat = position.coords.latitude;
		var lng = position.coords.longitude;

		loc8rData.locationByCoords(lat, lng)
				.then(function (response) {
					vm.message = response.data.length > 0 ? "" : "No locations found";
					vm.data = {
						locations: response.data
					};
				})
				.catch(function(e){
					vm.message = "Sorry, something's gone wrong ";
					console.log(e);
				});	
	};

	vm.showError = function(error) {
		$scope.$apply(function(){
			vm.message = error.message;
		});
	};
	
	vm.noGeo = function(){
		$scope.$apply = function(){
			vm.message = "Geolocation is not supported in this browser.";
		};
	};

	geolocation.getPosition(vm.getData, vm.showError, vm.noGeo);

}

