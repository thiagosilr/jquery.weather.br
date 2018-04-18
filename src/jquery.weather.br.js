;(function ( $, window, document, undefined ) {
    'use strict';

    var pluginName = 'weather';
    var defaults = {
            geoLocation: true,
            locationLat: 0,
            locationLon: 0,
            lang: 'pt',
            unit: 'c',
            format: 'week',
            pathFolderLocales: ''
        };
    var element;
    var settings;
    var forecastIcons = {
        'ec': 'wi-showers',
        'ci': 'wi-day-showers',
        'c': 'wi-rain',
        'in': 'wi-day-showers',
        'pp': 'wi-day-storm-showers',
        'cm': 'wi-day-showers wi-flip-horizontal',
        'cn': 'wi-night-showers',
        'pt': 'wi-day-storm-showers',
        'pm': 'wi-day-storm-showers wi-flip-horizontal',
        'np': 'wi-day-storm-showers',
        'pc': 'wi-day-storm-showers',
        'pn': 'wi-day-cloudy',
        'cv': 'wi-sprinkle',
        'ch': 'wi-showers',
        't': 'wi-thunderstorm',
        'ps': 'wi-day-sunny-overcast',
        'e': 'wi-cloud',
        'n': 'wi-cloudy',
        'cl': 'wi-day-sunny',
        'nv': 'wi-day-haze',
        'g': 'wi-snowflake-cold',
        'ne': 'wi-snow',
        'nd': '',
        'pnt': 'wi-night-alt-storm-showers',
        'psc': 'wi-day-showers',
        'pcm': 'wi-day-showers wi-flip-horizontal',
        'pct': 'wi-day-showers',
        'pcn': 'wi-night-showers',
        'npt': 'wi-day-storm-showers',
        'npn': 'wi-night-alt-storm-showers',
        'ncn': 'wi-night-alt-showers',
        'nct': 'wi-day-showers',
        'ncm': 'wi-day-showers wi-flip-horizontal',
        'npm': 'wi-day-storm-showers wi-flip-horizontal',
        'npp': 'wi-day-showers',
        'vn': 'wi-day-cloudy-high',
        'ct': 'wi-day-showers',
        'ppn': 'wi-night-storm-showers',
        'ppt': 'wi-day-storm-showers',
        'ppm': 'wi-day-storm-showers wi-flip-horizontal' 
    };
    var htmlWeather = $('<aside id="jquery-weather">' +
                            '<h1>' +
                                '<span class="city"></span>' +
                                '<div><span class="region"></span>' +
                            '</h1>' +
                            '<ul>' +
                            '</ul>' +
                            '<div class="source">CPTEC/INPE</div>' +
                        '</aside>');
    var htmlForecast = $('<li>' +
                            '<span class="day" data-i18n=""></span>' +
                            '<span class="icon"><i class="wi"></i></span>' +
                            '<span class="temperature">' +
                                '<span class="low"></span>' +
                                '<span class="high"></span>' +
                            '</span>' +
                         '</li>');
    

    var getWeather = function() {
        var urlApi = 'http://servicos.cptec.inpe.br/XML/cidade/7dias/' + settings.locationLat + '/' + settings.locationLon + '/previsaoLatLon.xml';
        
        getXML(urlApi,
            function(data) {
                showWeather(data.responseText);
            },
            function() {
                showGetWeatherError();
            });
    };

    var getXML = function(url, callbackSuccess, callbackError) {
        jQuery.ajax = (function(_ajax) {
            var protocol = location.protocol,
                hostname = location.hostname,
                exRegex = new RegExp(protocol + '//' + hostname),
                YQL = 'http' + (/^https/.test(protocol)?'s':'') + '://query.yahooapis.com/v1/public/yql?callback=?',
                query = 'select * from html where url="{URL}" and xpath="*"';

            function isExternal(url) {
                return !exRegex.test(url) && /:\/\//.test(url);
            }

            return function(o) {
                var url = o.url;
                if (o.dataType === 'xml') {
                   query = 'select * from xml where url="{URL}"';   // XML
                }

                if (/get/i.test(o.type) && !/json/i.test(o.dataType) && isExternal(url)) {
                    // Manipulate options so that JSONP-x request is made to YQL
                    o.url = YQL;
                    o.dataType = 'json';
                    o.data = {
                        q: query.replace('{URL}', url + (o.data ? (/\?/.test(url) ? '&' : '?') + jQuery.param(o.data) : '')),
                        format: 'xml'
                    };

                    // Since it's a JSONP request
                    // complete === success
                    if (!o.success && o.complete) {
                        o.success = o.complete;
                        delete o.complete;
                    }

                    o.success = (function(_success) {
                        return function(data) {
                            if (_success) {
                                // Fake XHR callback.
                                _success.call(this, {
                                    // YQL screws with <script>s, Get rid of them
                                    responseText: (data.results[0] || '')
                                        .replace(/<script[^>]+?\/>|<script(.|\s)*?\/script>/gi, '')
                                }, 'success');
                            }
                        };
                    })(o.success);
                }
                return _ajax.apply(this, arguments); // Use base Jquery ajax
            };
        })(jQuery.ajax);

        return $.ajax({
            url: url,
            type: 'GET',
            dataType: 'xml',
            success: function(data) {
                callbackSuccess(data);
            },
            error: function() {
                callbackError();
            }
        });
    };

    var showGetWeatherError = function() {
        var weather = htmlWeather.clone();

        weather.find('h1').html('');
        weather.find('ul').append('<li class="error" data-i18n="ServiceError"></li>');

        $(element).html(weather);
        translate();
    };

    var getDay = function(date) {
        date = new Date(date);
        var days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        var day = date.getDay();
        return days[day];
    };

    var getTemperature = function(temperature) {
        var unit = settings.unit.toLowerCase();

        switch(unit) {
            case 'f':
                return Math.round(9 * (temperature / 5) + 32);
            default:
                return temperature;
        }
    };

    var showWeather = function(weather) {
        var location = $(weather);
        var forecasts = $(weather).find('previsao');

        if (forecasts.length > 0) {
            // Set informations
            htmlWeather.find('h1 .city').text(location.find('nome').text());
            htmlWeather.find('h1 .region').text(location.find('uf').text());

            if (settings.format.toLowerCase() === 'week') {
                htmlWeather.addClass('week');

                $.each(forecasts, function() {
                    var forecast = htmlForecast.clone();
                        forecast.find('.day').attr('data-i18n', getDay($(this).find('dia').text()));
                        forecast.find('.day').text(getDay($(this).find('dia').text()));
                        forecast.find('.wi').addClass(forecastIcons[$(this).find('tempo').text()]);
                        forecast.find('.temperature .low').html(getTemperature($(this).find('minima').text()) + '&deg;');
                        forecast.find('.temperature .high').html(getTemperature($(this).find('maxima').text()) + '&deg;');
                    
                    htmlWeather.find('ul').append(forecast);    
                });
            } else {
                htmlWeather.addClass('today');

                htmlForecast.find('.day').data('i18n', getDay($(forecasts[0]).find('dia').text()));
                htmlForecast.find('.day').text(getDay($(forecasts[0]).find('dia').text()));
                htmlForecast.find('.wi').addClass(forecastIcons[$(forecasts[0]).find('tempo').text()]);
                htmlForecast.find('.temperature .low').html(getTemperature($(forecasts[0]).find('minima').text()) + '&deg;');
                htmlForecast.find('.temperature .high').html(getTemperature($(forecasts[0]).find('maxima').text()) + '&deg;');
                
                htmlWeather.find('ul').append(htmlForecast);  
            }

            $(element).html(htmlWeather);
            translate();
        } else {
            showGetWeatherError();
        }
    };

    var getPathIstall = function() {
        var pathInstall = $('script[src*="jquery.weather.br"]').attr('src');
        pathInstall = pathInstall.split('/');
        pathInstall[pathInstall.length-1] = '';
        pathInstall = pathInstall.join('/');
        
        return pathInstall;
    };

    var translate = function() {
        var path = '';
        if (settings.pathFolderLocales !== "") {
            path = settings.pathFolderLocales + '/' + settings.lang + '.json';
            $.getJSON(path, function() {
                render();
            })
            .fail(function() {
                error();
            });
        } else {
            path = getPathIstall() + 'locales/' + settings.lang + '.json';
            $.getJSON(path, function() {
                render();
            })
            .fail(function() {
                error();
            });
        }
        
        function render() {
            // Set translation
            i18n.init(
                {   
                    resGetPath: path
                },
                function() {
                    $(element).i18n();
                }
            );
        }

        function error() {
            console.warn(
                '[jquery.weather.br]\n ' + 
                'EN - The translation file could not be found in the following directory "' + path + '". Make sure the "locales" directory is in the same folder as the plugin, or configure the path by setting the "pathFolderLocales" attribute.\n ' +
                'ES - No se pudo encontrar el archivo de traducción en el siguiente directorio "' + path + '". Compruebe que el directorio "locales" está en la misma carpeta del plugin, o configure la ruta a través de la configuración del atributo "pathFolderLocales".\n ' +
                'PT - Não foi possível encontrar o arquivo de tradução no seguinte diretório "' + path + '". Verifique se o diretório “locales” está na mesma pasta do plugin, ou configure o caminho através da configuração do atributo "pathFolderLocales".'
            );
        }
    };

    var showLoad = function() {
        var load = htmlWeather.clone();

        load.find('h1').attr('data-i18n', 'Load').html('Loading...');
        load.find('ul').append('<li class="load"><i class="wi"></i></li>');

        $(element).html(load);
        translate();
    };


    // Plugin constructor
    function Plugin (element, options) {
        this.element = element;
        this.settings = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    // Avoid Plugin.prototype conflicts
    $.extend(Plugin.prototype, {
        init: function () {

            // Validating configuration
            if (this.settings.locationLat === 0 || this.settings.locationLon === 0) {
                console.warn(
                    '[jquery.weather.br]\n ' + 
                    'EN - The "locationLat" and "locationLon" attributes are required. Because the automated location is not working.\n ' +
                    'ES - Los atributos "locationLat" y "locationLon" son obligatorios. Por el motivo de la obtención de la ubicación automático no funciona.\n ' +
                    'PT - Os atributos "locationLat" e "locationLon" são obrigatórios. Pelo motivo da obtenção da localização automática não funcionar.'
                );
                return false;
            } 

            if ($.inArray(this.settings.lang, ['en', 'es', 'pt']) === -1) {
                console.warn(
                    '[jquery.weather.br]\n ' + 
                    'EN - Invalid language. Allowed values "en", "es" or "pt".\n ' +
                    'ES - Lenguaje invalido. Valores permitidos "en", "es" o "pt".\n ' +
                    'PT - Linguagem invalida. Valores permitidos "en", "es" ou "pt".'
                );
                return false;
            } 


            element = this.element;
            settings = this.settings;

            // Loading
            showLoad();

            // If configured for get the user's location performs the query.
            if (this.settings.geoLocation) {
                // Checks whether the browser supports Geolocation.
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(this.locationSuccess, this.locationError);
                } else {
                    console.warn(
                        '[jquery.weather.br]\n ' + 
                        'EN - Browser does not support Geolocation, will use the default location.\n ' +
                        'ES - Navegador no soporta Geolocalización, utilizará la ubicación predeterminada.\n ' +
                        'PT - Navegador não suporta Geolocation, será utilizado a localização padrão.'
                    );
                    getWeather();
                }
            } else {
                getWeather();
            }
        },
        locationSuccess: function (position) {
            settings.locationLat = position.coords.latitude;
            settings.locationLon = position.coords.longitude;
            getWeather();
        },
        locationError: function () {
            console.warn(
                '[jquery.weather]\n ' + 
                'EN - Could not get the user\'s location, it will use the default location.\n ' +
                'ES - No se pudo obtener la ubicación del usuario, se utilizará la ubicación predeterminada.\n ' +
                'PT - Não foi possível obter a localização do usuário, será utilizado a localização padrão.'
            );
            getWeather();
        }
    });

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[ pluginName ] = function ( options ) {
        this.each(function() {
                if ( !$.data( this, 'plugin_' + pluginName ) ) {
                        $.data( this, 'plugin_' + pluginName, new Plugin( this, options ) );
                }
        });

        // chain jQuery functions
        return this;
    };

})( jQuery, window, document );