//create a namespace for all controllers
var railwayControllers = angular.module('railwayControllers', []);

railwayControllers.controller('Yuhu', ['$scope','$rootScope', function($scope,$rootScope) {
    if($rootScope.user != null){
        $scope.greeting = 'Hola!';
    }
}]);

railwayControllers.controller('TrainListController', ['$scope','$kinvey','$location', function($scope,$kinvey,$location) {
    var promise = $kinvey.DataStore.find('trains');
    $scope.trains = {};

    $scope.book = function(val){
        $location.path('/booking/'+val)
    }
    promise.then(
        function(data){
            $scope.trains = data;

        },
        function(error){
        }
    );
}]);

railwayControllers.controller('BookingHistoryController', ['$scope','$kinvey','$routeParams', function($scope,$kinvey,$routeParams) {
    var query = new $kinvey.Query(),
        promise;

    $scope.tickets =[];

    query.equalTo('userid',$kinvey.getActiveUser._id);

    promise = $kinvey.DataStore.find('tickets',query);

    promise.then(function(data){
        $scope.tickets = data;
    },
    function(error){

    })
}
]);

railwayControllers.controller('BookingController', ['$scope','$kinvey','$routeParams', function($scope,$kinvey,$routeParams) {
    var query = new $kinvey.Query(),
        promise;

    $scope.trainNo = Number($routeParams.trainNo);
    $scope.showForm = true;
    $scope.showMessage = false;

    query.equalTo('trainNo',$scope.trainNo);

    promise = $kinvey.DataStore.find('trains',query);

    $scope.bookTickets = function(){
        var data = {},
            promise;

        data.trainNo = $scope.trainNo;
        data.tickets = $scope.seats;
        data.userid = $kinvey.getActiveUser()._id;
        data.passenger = $scope.passenger;
        data.trainName = $scope.trains[0].trainName

        promise = $kinvey.DataStore.save('tickets', data);

        promise.then(
            function(data){

                $scope.showForm = false;
                $scope.showMessage = true;

                $scope.message = "Congratulations! Your tickets are booked"

            },
            function(error){
            }
        );
    }
    promise.then(
        function(data){
            $scope.trains = data;

        },
        function(error){
        }
    );
}]);



railwayControllers.controller('AuthController', ['$scope','$rootScope','$kinvey','$location', function($scope,$rootScope,$kinvey,$location) {
    $scope.user={name:null,password:null}
    $scope.register={name:null,password:null}
    $rootScope.miscClass = 'hide';
    $scope.submit = function(){
        var promise = $kinvey.User.login($scope.user.name, $scope.user.password);

        $scope.user.alertShow = false;
        $scope.register.alertShow = false;
        promise.then(function(activeUser) {
           $scope.user.alertType='success';
           $scope.user.alert="Login success full";
            $scope.user.alertShow = true;
            $rootScope.miscClass = '';

            $location.path('/trains');
        }, function(error) {
            $scope.user.alertType='warning';
            $scope.user.alert=error.description;
            $scope.user.alertShow = true;
            $rootScope.miscClass = 'hide';

        })
    }

    $scope.registerUser = function(){
        var promise = $kinvey.User.signup({
            username : $scope.register.name,
            password : $scope.register.password
        });

        $scope.register.alertShow = false;
        $scope.user.alertShow = false;

        promise.then(function(activeUser) {
            $scope.register.alertType='success';
            $scope.register.alert="Successfully registered";
            $scope.register.alertShow = true;
            $rootScope.miscClass = '';

            $location.path('/trains');

        }, function(error) {
            $scope.register.alertType='warning';
            $scope.register.alert=error.description;
            $scope.register.alertShow = true;
            $rootScope.miscClass = 'hide';

        })
    }


}]);

railwayControllers.controller('LogoutController', ['$scope','$rootScope','$kinvey','$location', function($scope,$rootScope,$kinvey,$location) {
        var user = $kinvey.getActiveUser();
        if(null !== user) {
            var promise = $kinvey.User.logout();
            promise.then(function(activeUser) {
                $location.path('/login')
            }, function(error) {
                console.log(error)
            })
        }

}])


