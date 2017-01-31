/**
 * Created by Lander on 14-9-12.
 */
app.controller('SummaryController', function ($scope, $log, Misc, $http) {
$scope.st.position = 0;
$("html, body").animate({scrollLeft: 0}, 200);
    $scope.stop_app();


$scope.summary = [];
$scope.rechsdr = {};
function draw_por_list() { //Прави самъри на поъчките в табличен вид
    $scope.summary = [];
    for (var i = 0; i < $scope.st.visible_por.length; i++) {
        for (var j = 0; j < $scope.st.visible_por[i].SDR.length; j++) {
            var templine = {
                art : $scope.st.visible_por[i].SDR[j].ARTIKUL,
                kol : $scope.st.visible_por[i].SDR[j].KOL,
                artnomer : $scope.st.visible_por[i].SDR[j].ARTNOMER
            };
            var position = 0;
            var is_there = false;

            for(var k = 0; k < $scope.summary.length; k++)
            {
               if($scope.summary[k].art == templine.art) {
                   position = k; //Позиция в масива в която е вече съществуващия артикул към който ще прибавим количество
                   is_there = true;
                   break;
               }
            }
            if (is_there) {
                $log.info(templine.kol);
                $scope.summary[k].kol = parseInt($scope.summary[k].kol) + parseInt(templine.kol);
            }
            else {
                $scope.summary.push(templine);
            }
        }
    }

}
    draw_por_list();


$scope.get_rechsdr = function(artnomer)
    {   //$log.info(artnomer);
        var responsePromise = $http.post($scope.server_url + '/scripts/index.php/get_rech', {id:artnomer, database:$scope.configuration.database_path})
        responsePromise.success(function (data, status, headers, config) {
            $log.info(data);
            if(data.length > 0) {
                $("html, body").animate({scrollTop: 0}, 200);
                $scope.rechsdr = data;

            }
            else
            {
                $scope.rechsdr = [];
                $scope.misc.toast('Няма въведена рецепта!', 'danger', 1500);

            }
        });
        responsePromise.error(function (data, status, headers, config) {
            $scope.misc.toast(data, 'danger', 4000);
        });
    }

});