/**
 * Main application controller
 *
 * You can use this controller for your whole app if it is small
 * or you can have separate controllers for each logical section
 * 
 */
;(function() {

  angular
    .module('reservation-calendar')
    .controller('MainController', MainController);

  MainController.$inject = ['$scope', 'QueryService'];


  function MainController($scope, QueryService) {
    $scope.days = ["Sun", "Mon", "Tue", "Web", "Thu", "Fri", "Sat"]

    $scope.currentTimeZone = function() {
        QueryService.query("GET", "now", {}, {})
        .then(function(data){
            console.log('Now ',data.data.time);
        });
    }

    $scope.currentTimeZone();

    $scope.removeTime = function (date) {
        return date.day(0).hour(0).minute(0).second(0).millisecond(0);
    }

    $scope.selected = $scope.removeTime($scope.selected || moment());
    $scope.month = $scope.selected.clone();

    var start = $scope.selected.clone();
    start.date(1);
    $scope.removeTime(start.day(0));

    $scope.buildMonth = function (start, month) {
        $scope.weeks = [];
        var done = false, date = start.clone(), monthIndex = date.month(), count = 0;
        while (!done) {
            $scope.weeks.push({ days: $scope.buildWeek(date.clone(), month) });
            date.add(1, "w");
            done = count++ > 2 && monthIndex !== date.month();
            monthIndex = date.month();
        }
    }
    
    $scope.buildWeek = function (date, month) {
        var days = [];
        for (var i = 0; i < 7; i++) {
            days.push({
                name: date.format("dd").substring(0, 1),
                number: date.date(),
                isCurrentMonth: date.month() === month.month(),
                isToday: date.isSame(new Date(), "day"),
                date: date
            });
            date = date.clone();
            date.add(1, "d");
        }
        return days;
    }

    $scope.buildMonth(start, $scope.month);

    $scope.changeTriggers = function() {
        $scope.getReservationOfMonth();
    }

    $scope.next = function() {
        var next = $scope.month.clone();
        $scope.removeTime(next.month(next.month()+1).date(1));
        $scope.month.month($scope.month.month()+1);
        $scope.buildMonth(next, $scope.month);
        $scope.getReservationOfMonth();
    };

    $scope.previous = function() {
        var previous = $scope.month.clone();
        $scope.removeTime(previous.month(previous.month()-1).date(1));
        $scope.month.month($scope.month.month()-1);
        $scope.buildMonth(previous, $scope.month);
        $scope.getReservationOfMonth();
    };

    $scope.reserved = [];
    $scope.getReservationOfMonth = function() {
        $scope.reserved = [];
        var firstDay = moment($scope.month).startOf('months').unix();
        var lastDay = moment($scope.month).endOf('months').unix();

        var url = 'reserve/' + firstDay + '/' + lastDay; 
        QueryService.query("GET", url, {}, {})
        .then(function(data){
            $scope.reserved = data.data.reserved;
        });
    }

    $scope.addReservation = function(day) {
        var tenantData = {
            "tennantName": $scope.tenantName,
            "time": moment(day.date).endOf('day').unix(),
            "reserved": true
        }

        console.log("tenantData ",tenantData);
        QueryService.query("POST", "reserve", {}, tenantData)
        .then(function(data){
            $("#confirm-stay").removeClass("open-modal");
            $scope.changeTriggers();
        });
    }

    $scope.cancelReservation = function(day) {
        var tenantData = $scope.getTenant(day);
        tenantData['reserved'] = false;
        QueryService.query("POST", "reserve", {}, tenantData)
        .then(function(data){
            $("#cancel-stay").removeClass("open-modal");
            $scope.changeTriggers();
        });
    }

    $scope.selectDate = function(day) {
        $scope.day = day;
        $scope.selected = day.date;
        if($scope.isReserved(day)) {
            $scope.tenant = $scope.getTenant(day);
            $scope.cancelPopup();
        } else {
            $scope.confirmPopup();
        }
    }

    $scope.getTenant = function(day) {
        var startTimezone = moment(day.date).startOf('day').unix();
        var endTimezone = moment(day.date).endOf('day').unix();
        var tenant = {};
        angular.forEach($scope.reserved, function(val,key){
            if(startTimezone <= val.time &&  endTimezone >= val.time) {
                tenant = val;
            }
        })
        return tenant;
    }

    $scope.getClass = function(day) {
        var cls = [];
        if(day.isCurrentMonth) {
            cls.push("current-month");
        }
        if(day.isToday) {
            cls.push("current-day");
        }
        if($scope.isReserved(day)) {
            cls.push("is-reserved");
        }
        return cls;
    }

    $scope.isReserved = function(day) {
        var startTimezone = moment(day.date).startOf('day').unix();
        var endTimezone = moment(day.date).endOf('day').unix();
        var reserved = false;
        angular.forEach($scope.reserved, function(val,key){
            if(startTimezone <= val.time &&  endTimezone >= val.time) {
                reserved = true;
            }
        })
        return reserved;
    }

    $scope.getFormattedDate = function(date) {
        return moment(date).format("D MMM");
    }

    $scope.getReservationOfMonth();

    $scope.confirmPopup = function() {
        $("#confirm-stay").addClass("open-modal").parent().addClass("fade");
    }

    $scope.cancelPopup = function() {
        $("#cancel-stay").addClass("open-modal").parent().addClass("fade");
    }

    $scope.closeConfirmStay = function() {
        $("#confirm-stay").removeClass("open-modal").parent().removeClass("fade");
    }

    $scope.closeCancelStay = function() {
        $("#cancel-stay").removeClass("open-modal").parent().removeClass("fade");
    }

  }


})();