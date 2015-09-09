angular.module('CrossCheckList').service('ListDataService', function($http, $q) {
    var listData = [
        {
            'type': 'firewall',
            'name': 'TX',
            'owner': 'jtuck',
            'state': 'running'
        }
    ];
    this.getListData = function(url) {
        var def = $q.defer();
        if (url === 'api/fetchAllData') {
            def.resolve(listData);
        } else {
            def.reject(501, 'Fetch list data failed for api URL' + url);
        }
        return def.promise;
    };
});
