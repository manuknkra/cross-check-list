angular.module('CrossCheckList').controller('List', ['$scope', '$rootScope', '$stateParams', '$http', '$location',
    '$state', 'ListDataService',
    function($scope, $rootScope, $stateParams, $http, $location, $state, ListDataService) {
        $scope.url = 'api/fetchAllData';
        $scope.getListData = function() {
            ListDataService.getListData($scope.url)
                .then(function(data) {
                    $scope.listData = data;
                    console.log($scope.listData);
                },
                function(status, message) {
                    console.log(status + ': ' + message);
                }
            );
        };
        $scope.getListData();
    }
]);
