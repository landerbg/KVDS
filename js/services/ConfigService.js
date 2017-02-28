/**
 * Created by Lander on 14-9-11.
 */

app.factory('ConfigService', function () {
//Функция сетваща деолт стойности на конфигурационния обект
    function set_default(conf) {
        conf.printers = 2;
        conf.por_width = 210;
        conf.por_height = 250;
        conf.por_overflow = true;
        conf.time_firstalert = 420;
        conf.time_secondalert = 600;
        conf.display_width = 99999;
        conf.bump_isvisible = true;
        conf.refresh_interval = 30000;
        conf.por_font = 14;
        conf.theme = 4;//Тази тема най ми харесва
        conf.ring_number = 1;
        conf.is_app = false;
        localStorage.setItem("pt_global_config", JSON.stringify(conf));
        return conf;
    }

    var ConfigParams = {};//Конфугурационен обект
    ConfigParams = JSON.parse(localStorage.getItem('pt_global_config')) || set_default(ConfigParams);
    ConfigParams.saveConfiguration = function () {
        localStorage.setItem("pt_global_config", JSON.stringify(this));
        return "Настройките са записани успешно.";
    }
    ConfigParams.resetConfiguration = function () {
        localStorage.removeItem("pt_global_config");
        set_default(this);
        return "Настройките са върнати по подразбиране!";
    }

    return ConfigParams;
});