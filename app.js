angular.module('evoApp', [])
    .controller('AppController', function(storage) {
        this.candyOptions = [12, 25, 50, 100, 400];

        this.model = storage.loadModel();

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
            monObj.resultText = 'Can evolve upto ' + (monObj.countEvolve);
            if (monObj.hasPokemon >= 0) {
                if (monObj.hasPokemon < monObj.countEvolve) {
                    monObj.countEvolve = monObj.hasPokemon;
                    monObj.resultText = 'Can evolve upto ' + (monObj.countEvolve);
                } else {
                    var transfer = 0;
                    while (monObj.hasPokemon - sol - transfer > 1) {
                        transfer++;
                        remain++;
                        if (remain >= monObj.requiredCandy) {
                            sol++;
                            remain -= monObj.requiredCandy;
                            remain++;
                            monObj.countEvolve = sol;
                            monObj.resultText = 'Transfer ' + (transfer) + ' to evolve ' + (monObj.countEvolve);
                        }
                    }
                }
            }
            this.updateSum();
            storage.saveModel(this.model);
        };
        this.updateSum = function() {
            this.model.sum = 0;
            for (var i = 0; i < this.model.monObjList.length; i++) {
                this.model.sum += +this.model.monObjList[i].countEvolve;
            }
        };
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
    }]).factory('storage', function() {
        var VERSION = 1;
        return {
            saveModel: function(model) {
                if (typeof localStorage !== 'undefined') {
                    model.VERSION = VERSION;
                    localStorage.setItem('model', JSON.stringify(model));
                }
            },
            loadModel: function() {
                if (typeof localStorage !== 'undefined') {
                    var item = localStorage.getItem('model');
                    if (item) {
                        var model = JSON.parse(item);
                        if (model.VERSION == VERSION) {
                            return model;
                        }
                    }
                    //default model
                    var numMon = 10;
                    var model = {
                        monObjList: [],
                        sum: 0
                    };
                    this.addMon(model, 'Caterpie', 12);
                    this.addMon(model, 'Weedle', 12);
                    this.addMon(model, 'Pidgey', 12);
                    this.addMon(model, 'Rattata', 25);
                    for (var i = model.monObjList.length; i < numMon; i++) {
                        this.addMon(model);
                    }
                    return model;
                }
            },
            addMon: function(model, name, requiredCandy) {
                model.monObjList.push({
                    name: name || 'XXX',
                    requiredCandy: requiredCandy || 12,
                    hasCandy: 0,
                    hasPokemon: -1,
                    countEvolve: 0,
                    resultText: ''
                })
            }
        };
    });
