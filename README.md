# Descontinuado
Devido aos critérios de segurança do browsers atuais onde não permitem chamadas http em sites https. O plugin se tornou inviável com a fonte de dados do INPE, que não teve sua estrutura atualizada para surpotar https (http://servicos.cptec.inpe.br/XML/cidade/7dias/). Como não encontrei fontes gratuitas confiáveis o plugin está descontinuado.

# Plugin jQuery Weather BR
Plugin jQuery que exibe a previsão do tempo para as cidades brasileiras.

## Primeiros passos
Plugin jQuery que exibe a previsão do tempo para as cidades brasileiras.

1. Download da última versão ou npm install jquery.weather.br --save

2. Agora iremos incluir os arquivos CSS e Javascript. Você pode pegar os arquivos na pasta /dist do arquivo que você baixou manualmente ou atráves do gerenciador de pacotes.

    - Inclua o CSS no topo da sua página na tag `<head>`:
`<link href="diretorio-aplicacao/jquery.weather.br.min.css" rel="stylesheet">`

    - Inclua o Javascript na parte inferior da sua página antes do fechamento da tag </body>:
    `<script src="diretorio-aplicacao/jquery.weather.br.min.js">`

3. Certifique-se de que o jQuery que é exigido pelo plugin, também seja carregado.

    - Se você já usa o jQuery em sua página, verifique se ele está carregado antes de jquery.weather.br.min.js.
    - jQuery 1.5.1 ou superior é necessário.
    - jQuery Slim não é compatível com o plugin.

4. Executando o plugin. Basta escolher o elemento onde o mesmo irá inserir o conteúdo.
    ```HTML
    <div id="weather"></div>
    <script>
        $(function() {
            $('#weather').weather({
                locationLat: -19.9267427,
                locationLon: -43.9601151
            });
        });
    </script>
    ```

## Exemplo
```HTML
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>jQuery Weather BR - Demo</title>

        <!-- jQuery Weather CSS -->
        <link href="plugin/jquery.weather.br.min.css" media="all" rel="stylesheet" />
        
        <style type="text/css">
            #weather {
                margin: auto;
                width: 300px;
            }
        </style>
    </head>
    <body>
        <!-- Element to be applied jquery.weather -->
        <div id="weather"></div>
        
        <!-- jQuery -->            
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
        <!-- jQuery Weather --> 
        <script src="plugin/jquery.weather.br.min.js"></script>

        <!-- Start jQuery Weather -->
        <script>
            $(function() {
                $('#weather').weather({
                    locationLat: -19.9267427,
                    locationLon: -43.9601151
                });
            });
        </script>
    </body>
</html>
```

## Configuração
```JavaScript
$(function() {
    $('#weather').weather({
        geoLocation: true,
        locationLat: -19.9267427,
        locationLon: -43.9601151,
        lang: 'pt',
        unit: 'c',
        format: 'today',
        pathFolderLocales: 'path/locales'
    });
});
```

|Nome|Obrigatório|Tipo|Valor padrão|Descrição|
|----|----|----|----|----|
|geoLocation|Não|Boolean|true|[`true`] O plugin irá tentar obter a localização atual do usuário utilizando geolocation. Caso não sejá possível o mesmo irá utilizar as coordenadas fornecidas nos parâmetros locationLat e locationLon. [`false`] O plugin irá utilizar apenas as coordenadas fornecidas nos parâmetros locationLat e locationLon.|
|locationLat|Sim|Decimal| |Forneça a latitude do local a qual deseja obter o clima.|
|locationLon|Sim|Decimal| |Forneça a longitude do local a qual deseja obter o clima.|
|lang|Não|String|en|Idioma|[`en`] Inglês. [`es`] Espanhol. [`pt`] Português|
|unit|Não|String|f|[`f`] Fahrenheit. [`c`] Celsius|
|format|Não|String|week|[`week`] Semana. [`today`] Hoje|
|pathFolderLocales|Não|String|O plugin irá procurar pela pasta locales no mesmo diretório onde o plugin foi instalado.|Caso coloque as traduções em outro diretório forneça o mesmo.|
