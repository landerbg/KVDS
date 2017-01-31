app.factory('StateService', function($log){


    var StateObject = {};
    StateObject.is_started = {
        condition : false,
        text : 'Спрян'
    };
    StateObject.sort_method =
    {
        column : 'ID',
        new_first : true
    };
    StateObject.isonline = true;
    StateObject.is_loading = false;
    StateObject.bumped_por = [];
    StateObject.visible_por = [];
    StateObject.max_id = 0;//Брояч на ajax заявките които са върнали резултат
    StateObject.bump_por = 0;
    StateObject.position = 0;
    StateObject.lineStyle = [];//ДА СЕ СЛОЖИ В СЪРВИСА !!!!
    StateObject.max_porid = 0;
    StateObject.bump_isvisible = 0;
    StateObject.search_visible = false;
    StateObject.counter = 0;
    StateObject.timers_started = false;

    StateObject.timers = function ()
    {
        StateObject.timers_started = true;
        // $log.info(StateObject.timers_started)
        for (var i = 0;i < StateObject.visible_por.length; i++ )
            StateObject.visible_por[i].COUNTER++;
    }
    return StateObject;


});
