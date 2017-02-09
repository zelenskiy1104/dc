## Ссылки на Heroku
<a href="https://nd3-dc.herokuapp.com/">Интерфейс клиента</a>
<br /><br />
<a href="https://nd3-dc.herokuapp.com/kitchen">Интерфейс повара</a>

## Установка
1. npm install
2. Запустить mongodb-сервер на порте 27017 (по умолчанию)
3. node index.js

## Интерфейсы клиента и повара
<ul>
<li>Интерфейс клиента открывается по урлу "localhost:3000"</li>
<li>Интерфейс повара открывается по урлу "localhost:3000/kitchen"</li>
</ul>

## Структура серверной части
<ul>
<li>Файл index.js, который запускает сервер, принимает запросы через socket.io и вызывает нужные модели</li>
<li>Модели отвечают за работу с БД</li>
<li>При запуске сервера из файла menu.json парсится в БД актуальное меню</li>
</ul>

## Структура интерфейса клиента
<ul>
<li>Точка входа - public/client.html</li>
<li>Главный javascript-файл - public/modules/clientApp/client.js</li>
<li>Остальные элементы разбиты на компоненты и храняться в папке public/modules/clientApp/components</li>
</ul>

## Структура интерфейса повара
<ul>
<li>Точка входа - public/kitchen.html</li>
<li>Главный javascript-файл - public/modules/kitchenApp/kitchen.js</li>
<li>Остальные элементы разбиты на компоненты и храняться в папке public/modules/kitchenApp/components</li>
</ul>

## Тестирование Protractor
<ul>
<li>Файлы тестов хранятся в папке e2e-tests</li>
<li>Файл конфига также в этой папке (protractor.conf.js)</li>
<li>Перед первым запуском тестирования нужно обновить webdriver командой "npm run update-webdriver"</li>
<li>Для запуска тестов пишем в консоль "npm run protractor"</li>
</ul>

## Тестирование Mocha
<ul>
<li>Файлы тестов хранятся в папке tests</li>
<li>Для запуска тестов пишем в консоль "npm run mocha"</li>
</ul>