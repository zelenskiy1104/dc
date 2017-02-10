module.exports = class Error {
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

    log() {
        console.log(this.txt + this.err);
    }
}