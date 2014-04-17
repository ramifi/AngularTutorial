var TodoApp = angular.module("TodoApp", ["ngResource", "ngRoute"]).
    config(function ($routeProvider) {
        $routeProvider.
            when('/', { controller: ListCtrl, templateUrl: 'list.html' }).
            otherwise({ redirectTo: '/' });
    });

TodoApp.factory('Todo', function ($resource) {
    return $resource('/api/todo/:id', { id: '@id' }, { update: { method: 'PUT' } });
});

TodoApp.directive('sorted', function () {
    return {
        scope: true,
        transclude: true,
        template: '<a ng-click="do_sort()" ng-transclude></a>' +
            '<span ng-show="do_show(true)"><i class="icon-circle-arrow-down"></i></span>' +
            '<span ng-show="do_show(false)"><i class="icon-circle-arrow-up"></i></span>',
        controller: function ($scope, $element, $attrs) {
            $scope.sort = $attrs.sorted;

            $scope.do_sort = function () { $scope.sort_by($scope.sort); };

            $scope.do_show = function (asc) {
                return (asc != $scope.sort_desc) && ($scope.sort_order == $scope.sort);
            };
        }
    }
});

var ListCtrl = function ($scope, $location, Todo) {

    $scope.search = function () {
        Todo.query({ q: $scope.query, sort: $scope.sort_order, desc: $scope.sort_desc, limit: $scope.limit, offset: $scope.offset },
           function (items) {
                var cnt = items.length;
                $scope.no_more = cnt < 20;
                $scope.items = $scope.items.concat(items);
            }
        );
    };

    //$scope.search = function () {
    //    $scope.items = Todo.query({ sort: $scope.sort_order, desc: $scope.sort_desc, limit: $scope.limit, offset: $scope.offset });
    //}

    $scope.do_show = function (asc, col) {
        return (asc != $scope.sort_desc) && ($scope.sort_order == col);
    };

    $scope.sort_by = function (col) {
        if ($scope.sort_order === col) {
            $scope.sort_desc = !$scope.sort_desc;
        }
        else {
            $scope.sort_order = col;
            $scope.sort_desc = false;
        }

        $scope.reset();
    };



    $scope.show_more = function () {
        $scope.offset += $scope.limit;
        $scope.search();
    };

    $scope.reset = function () {
        $scope.limit = 20;
        $scope.offset = 0;
        $scope.items = [];

        $scope.search();

    };


    $scope.sort_order = 'Priority';
    $scope.sort_desc = false;
    $scope.reset();

};

