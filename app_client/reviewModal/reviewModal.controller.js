// function(){
	angular
		.module('loc8rApp')
    	.controller('reviewModalCtrl', reviewModalCtrl);

	reviewModalCtrl.$inject = ['$uibModalInstance', 'loc8rData', 'locationData'];
	function reviewModalCtrl($uibModalInstance, loc8rData, locationData){
		var vm = this;
		vm.locationData = locationData;
		console.log(vm);
		
		 vm.modal = {
                  close: function(response){
                        $uibModalInstance.close(response);
                  },
      		cancel : function () {
      			$uibModalInstance.dismiss('cancel');
      		}
      	};

      	vm.onSubmit = function() {
      		vm.formError = "";
      		if (!vm.formData.rating || !vm.formData.reviewText) {
      			vm.formError = "All field are required, please try again!";
      			return false;
      		}else{
      			vm.doAddReview(vm.locationData.locationid, vm.formData);
      		}
      		
      	};

            vm.doAddReview = function(locationid, formData) {
                  loc8rData.addReviewById(locationid, {
                        rating: formData.rating,
                        reviewText: formData.reviewText

                  })
                  .then(function (response) {
                        console.log("Success!");
                        console.log(response);
                        vm.modal.close(response);      
                  })
                  .catch(function(e){
                        vm.formError = "Your review has not been saved, try again!";
                  });   
                  
                  return false;
            };

	}
// }();