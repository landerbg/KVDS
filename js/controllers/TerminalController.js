/**
 * Created by Lander on 14-9-5.
 */
/**
 * Created by Lander on 14-9-4.
 */
app.controller('TerminalController', function ($scope, $http, $interval, $log, $filter, ConfigService, Misc, StateService) {

    $scope.configuration = ConfigService;
    $scope.st = StateService;
    $scope.misc = Misc;
    $scope.ring = $scope.configuration.ring_number + '.mp3';
    $scope.navbarCollapsed = true;
    $scope.top_margin = 70;

    $scope.$watch('st.isonline', function () {
        if (!$scope.st.isonline) {
            $scope.st.is_started.text = "Офлайн";

        }
        else {
            $scope.st.is_started.text = "Онлайн";

        }
    });
    //Подреждане по време на постъпване . може да бъде 'MACA', PRINTERNAMESID или нещо друго от базата

    $scope.server_url = 'http://109.160.34.166:8887/pordisplaybuild';


    if (!angular.isUndefined($scope.configuration.server_url))
        $scope.server_url = $scope.configuration.server_url;//Ako ima ne]o zapisano w полето за сървър го ползва


    $scope.toggle_search = function () {
        $scope.filter_por = "";
        $scope.st.search_visible = !$scope.st.search_visible;
    }


    $scope.change_sort = function (sort) {
        $scope.st.sort_method.column = sort;
        $log.info($scope.st.sort_method);
    }

    $scope.refresh = function () {
        if (!$scope.st.is_started.condition)
            return;
        $log.info('Онлайн ли съм :' + $scope.st.isonline);
        $log.debug($scope.misc.current_promise);
        $scope.st.is_loading = true;
        var por = {
            id: $scope.st.max_porid,
            database: $scope.configuration.database_path,
            printers: $scope.configuration.selected_printers
        };
        $http.post($scope.server_url + '/scripts/index.php/por', por)
            .then(function (r) {
                $log.info($scope.st.max_porid);
                // var breakcheck = false;
                console.log(r.data);
                if (angular.isObject(r.data) && !angular.isUndefined(r.data[0])) {

                    for (var i = 0; i < r.data.length; i++) {

                        if (!angular.isUndefined(r.data[i]) && angular.isObject($filter('filter')($scope.st.visible_por, {ID: r.data[i].SDR}, true))) {//Da se dobavi rproverka dali porychkata veche ne e v spisyka


                            $scope.st.visible_por.unshift(r.data[i]);
                            $scope.st.position = 0;
                            $("html, body").animate({scrollLeft: 0}, 200);
                            //Добавя елемента в началото ако е нова поръчката
                            //  breakcheck = false;//
                            for (var j = 0; j < r.data[i].SDR.length; j++) {
                                if (r.data[i].SDR[j].MISTRALT_STATUS == 1) {
                                    $scope.st.lineStyle[r.data[i].SDR[j].ID] = 1;
                                }
                                else
                                    $scope.st.lineStyle[r.data[i].SDR[j].ID] = 0;
                            }
                        }
                    }
                    $scope.st.max_id++;
                    $scope.st.max_porid = r.data[r.data.length - 1].ID;
                    // $log.info("Third");
                    $scope.sound.play();

                }
                else if (!angular.isUndefined(r.data[0])) {
                    $scope.misc.toast(r.data, 'warning', 3000);

                }

                $scope.st.isonline = true;
                $scope.st.is_loading = false;
                // $log.error($scope.st.max_porid);
                $scope.misc.setTimeout($scope, $scope.refresh, $scope.configuration.refresh_interval);

            },
            function (error) {
                $scope.misc.toast('Няма връзка с база данни!', 'danger', 3000);
                $scope.st.isonline = false;
                $scope.st.is_loading = false;
                $log.error(error);
                $scope.misc.setTimeout($scope, $scope.refresh, $scope.configuration.refresh_interval);
            });
    }

    $scope.start_app = function () {

        if ($scope.st.is_started.condition === false) {

            $scope.st.is_started.condition = true;
            $scope.st.is_started.text = 'Онлайн';
            $log.info('Стартирам приложението');
            $scope.refresh();


            if (!$scope.configuration.is_app) {
                $scope.sound = new Audio($scope.ring);


            }
            else {
                $scope.ring = '/android_asset/www/' + $scope.ring; //Така е пътя при Phonegap build-a

                window.plugins.insomnia.keepAwake(); //Настройва екрана да не се гаси само ако има поръчки
                $scope.sound = new Media($scope.ring);

            }


            if ($scope.st.timers_started === false) {
                $log.info('Puskam timerite');
                $interval($scope.st.timers, 1000);
            }
        }
    };
    $scope.start_app();
    $scope.stop_app = function () {
        $log.info($scope.st);
        $scope.st.is_started.condition = false;
        $scope.st.is_started.text = 'Спрян';
        $log.info('Спирам приложението');
        $scope.misc.cancelTimeout();
    };

    //$interval($scope.refresh, 5000);


    $scope.void_por = function (id) {
        var responsePromise = $http.post($scope.server_url + '/scripts/index.php/void', {
            id: id,
            database: $scope.configuration.database_path
        })
        responsePromise.success(function (data, status, headers, config) {
            $log.info(data);
            if (data == 1) {//php скрипта връща 1 при успех
                for (var i = 0; i < $scope.st.bumped_por.length; i++) {
                    if ($scope.st.bumped_por[i].ID == id) {
                        $scope.st.visible_por.push($scope.st.bumped_por[i]);
                        $scope.st.bumped_por.splice(i, 1);
                    }
                }
            }
            else $scope.misc.toast('Грешка при връзка с базата данни!', 'danger', 3000);
        });
        responsePromise.error(function (data, status, headers, config) {
            $scope.misc.toast(data, 'danger', 3000);
        });
    }

    $scope.check_printers = function () {
        var responsePromise = $http.post($scope.server_url + '/scripts/index.php/load_printers', {database: $scope.configuration.database_path})
        responsePromise.success(function (data, status, headers, config) {
            if (angular.isArray(data)) {//Ако върне масив от принтери значи е успешна комуникацията
                $scope.configuration.used_printers = data;
                $scope.misc.toast('Успешна връзка с базата данни.Изберете принтери!', 'success', 4000);
            }
            else {
                $scope.configuration.used_printers = [];
                $scope.misc.toast(data, 'danger', 4000);
            }

        });
        responsePromise.error(function (data, status, headers, config) {
            $scope.misc.toast(data, 'danger', 4000);
        });
    }


    $scope.mark_por = function (id) {
        if ($scope.st.bump_por == id) {
            $scope.bump();//Ако номера на поръчката съвпада с номера на маркираната значи се натиска за втори път и се чисти
            $scope.st.bump_isvisible = 0;
        }
        else {
            $scope.st.bump_por = id;//номер на маркираната за приключване поръчка
            $scope.st.bump_isvisible = 1;
            $log.info($scope.st.bump_por);
        }
    }

    $scope.bump = function () {
        $scope.finish_por($scope.st.bump_por);
//Няма нужда от тази функция.Може да се вика директно другата
        $log.info($scope.st.bumped_por);

    };


    $scope.scrollright = function () {
        $("html, body").animate({scrollLeft: $scope.st.position + 500}, 200);
        if ($scope.st.position < $scope.configuration.por_width * $scope.st.visible_por.length - 500)
            $scope.st.position += 600;
        console.log($scope.st.position);
    }

    $scope.scrollleft = function () {
        $("html, body").animate({scrollLeft: $scope.st.position - 500}, 200);
        if ($scope.st.position > 499)
            $scope.st.position -= 600;
        console.log($scope.st.position);
    }

    $scope.ready_line = function (id) {
        if ($scope.st.lineStyle[id] === 1) {
            $scope.edit_line(id, 2);
        }
        else if ($scope.st.lineStyle[id] === 2) {
            $scope.edit_line(id, 0);
        }
        else $scope.edit_line(id, 1);
    }

    $scope.clear_allpor = function () {
        if (confirm("Желаете ли да приключите всички видими поръчки ?")) {

            //$scope.finish_por(0);//Като подам нула чисти всички поръчки изпразва масивите и спира терминала.
            for (var i = 0; i < $scope.st.visible_por.length; i++) {

                $scope.finish_por($scope.st.visible_por[i].ID);
            }
            $scope.st.visible_por = [];
            $scope.st.lineStyle = [];
            $scope.stop_app();
            $scope.start_app();
            $scope.misc.toast('Всички поръчки са приключени!');
        }


    }



    $scope.finish_por = function (id) {
        var responsePromise = $http.post($scope.server_url + '/scripts/index.php/finish', {
            porid: id,
            database: $scope.configuration.database_path,
            printers: $scope.configuration.selected_printers
        })
        //$log.info($scope.configuration.selected_printers);
        responsePromise.success(function (data, status, headers, config) {
            $log.info(data);
            if (data == 1) {
                for (var i = 0; i < $scope.st.visible_por.length; i++) {
                    if ($scope.st.visible_por[i].ID == $scope.st.bump_por) {
                        $scope.st.bumped_por.push($scope.st.visible_por[i]);
                        $scope.st.visible_por.splice(i, 1);//маха маркираната поръчка от масива с поръчките
                        $log.info($scope.st.bumped_por);
                    }
                }
            }
            else $scope.misc.toast('Грешка при връзка с базата данни!', 'danger', 3000);
        });
        responsePromise.error(function (data, status, headers, config) {
            $scope.misc.toast(data, 'danger', 3000);
        });
//DA SE NAPRAVI PROVERKA DALI E MINALO VSICHKO OK !
    }
    $scope.edit_line = function (id, mistralt_status) {
        var responsePromise = $http.post($scope.server_url + '/scripts/index.php/edit', {
            porsdrid: id,
            mistralt_status: mistralt_status,
            database: $scope.configuration.database_path
        })
        responsePromise.success(function (data, status, headers, config) {
            $log.info(data);
            if (data == 1) {
                $scope.st.lineStyle[id] = mistralt_status;
                $log.info($scope.st.lineStyle[id]);
            }
            else $scope.misc.toast('Грешка при връзка с базата данни!', 'danger', 3000);

        });
        responsePromise.error(function (data, status, headers, config) {
            $scope.misc.toast(data, 'danger', 3000);
        });

//DA SE NAPRAVI PROVERKA DALI E MINALO VSICHKO OK !
    }


    $log.info("Излизам от контролера");
});
