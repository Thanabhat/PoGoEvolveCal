angular.module('evoApp', [])
    .controller('AppController', function() {
        this.numMon = 10;
        this.monObjList = [];
        this.sum = 0;
        this.addMon = function() {
            this.monObjList.push({
                name: 'Pidgey',
                hasCandy: 0,
                requiredCandy: 12,
                countEvolve: 0
            });
        };
        this.cal = function(monObj) {
            var sol = 0;
            var remain = monObj.hasCandy;
            while (true) {
                if (remain >= monObj.requiredCandy) {
                    sol++;
                    remain -= monObj.requiredCandy;
                    remain++;
                } else {
                    break;
                }
            }
            monObj.countEvolve = sol;
            this.updateSum();
        };
        this.updateSum = function() {
            this.sum = 0;
            for (var i = 0; i < this.numMon; i++) {
                this.sum += this.monObjList[i].countEvolve;
            }
        };
        for (var i = 0; i < this.numMon; i++) {
            this.addMon();
        }
    })
    .directive('selectOnClick', ['$window', function($window) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                element.on('click', function() {
                    if (!$window.getSelection().toString()) {
                        // Required for mobile Safari
                        this.setSelectionRange(0, this.value.length)
                    }
                });
            }
        };
    }]);
