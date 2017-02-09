## Установка

1. npm install
2. Запустить mongodb-сервер на порте 27017 (по умолчанию)
3. node index.js

## Интерфейсы клиента и повара

Интерфейс клиента открывается по урлу "localhost:3000"
Интерфейс повара открывается по урлу "localhost:3000/kitchen"

## Структура серверной части

Файл index.js, который запускает сервер, принимает запросы через socket.io и вызывает нужные модели
Модели отвечают за работу с БД
При запуске сервера из файла menu.json парсится в БД актуальное меню

## Структура интерфейса клиента

Точка входа - public/client.html
Главный javascript-файл - public/modules/clientApp/client.js
Остальные элементы разбиты на компоненты и храняться в папке public/modules/clientApp/components

## Структура интерфейса повара

Точка входа - public/kitchen.html
Главный javascript-файл - public/modules/kitchenApp/kitchen.js
Остальные элементы разбиты на компоненты и храняться в папке public/modules/kitchenApp/components

## Тестирование Protractor

Файлы тестов хранятся в папке e2e-tests
Файл конфига также в этой папке (protractor.conf.js)
Перед первым запуском тестирования нужно обновить webdriver командой "npm run update-webdriver"
Для запуска тестов пишем в консоль "npm run protractor"

## Тестирование Mocha

Файлы тестов хранятся в папке tests
Для запуска тестов пишем в консоль "npm run mocha"