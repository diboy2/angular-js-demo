var app = angular.module('contacts', ['ngRoute']);

app.config(function($routeProvider) {
	$routeProvider
		.when('/contacts', {
			templateUrl: 'contactsHTML',
			controller: 'ContactsCtlr'
		})
		.when('/notes', {
			templateUrl: 'notesHTML',
		})
		.otherwise({
			redirectTo: 'contacts'
		})
});

app.controller('ContactsCtlr', function($scope,stats,toastr,storage,json) {
	// console.log('ContactsCtlr');

	$scope.contacts = [];

	if(storage.contacts) {
		// console.log('found saved contacts');
		$scope.contacts = json.parse(storage.contacts);
	}
	// console.log($scope.contacts);
	
	$scope.$watch('contacts', function() {
		// console.log('watch contacts');
		$scope.usc = stats.countUSC($scope.contacts);
	}, true);

	$scope.$on('$destroy', function() {
		// console.log('left Contacts');
		storage.contacts = json.stringify($scope.contacts);
	});
	
	$scope.addContact = function() {
		// console.log('add contact',$scope.contacts);
		$scope.contacts.push({
			first: $scope.first,
			last: $scope.last,
			org: $scope.org,
			email: $scope.email,
			phone: $scope.phone
		});

		$scope.first = null;
		$scope.last = null;
		$scope.org = null;
		$scope.email = null;
		$scope.phone = null;
		toastr.success('Success! Contact added.')
	}
});

app.value('toastr', window.toastr);
app.value('storage', window.localStorage);
app.value('json', window.JSON);

app.factory('stats', function() {
	function countUSC(contacts) {
		var total = 0;

		contacts.forEach(function(contact) {
			// console.log(contact);
			if(contact.org == 'USC') {
				total++;
			}
		});

		return total;
	}

	return {
		countUSC: countUSC,
	}
})

app.directive('contactTable', function() {
	return {
		restrict: 'E',
		templateUrl: 'contactHTML'
	}
})

app.directive('highLight', function() {
	return {
		restrict: 'A',
		scope: {
			highLight: '='
		},
		link: function($scope,$el) {
			var org = $scope.highLight;
			var bg;

			if(org == 'USC') {
				bg = 'info';
			} else if (org == 'UCLA') {
				bg = 'warning';
			}

			$el.addClass(bg);
		}
	}
})