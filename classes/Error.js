/*
* Обработка ошибок и вывода их в UI
* */

module.exports = class Error {

    /*
     * Конструктор
     *
     * @param err Объект ошибки
     * @param type Тип ошибки
     */

    constructor(err, type) {

        this.err = err;
        this.type = type;

        this.txt = '';

        if (this.type == 'connect') {
            this.txt = 'Проблема с соединением с базой данных: ';
        }
        if (this.type == 'db') {
            this.txt = 'Ошибка БД: ';
        }
    }

    /*
     * Вывод ошибки в консоль
     */

    log() {
        console.log(this.txt + this.err);
    }
}