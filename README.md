Данный сервис создан с помощью платфомы wordpress и gulp
Для запуска нужно развернуть экземпляр wordpress на машине выполняюшей роль сервера
на сервере создать базу данных currency_rate
со следующими полями
id - mediumint(9)
cur_id - tinytext
num_code - var_char(3)
char_code - var_char(3)
nominal - mediumint(11)
name - tinytext
value - tinytext
vunit_rate - tinytext
date - date
Указать ее в настройках wordpress при установке
Создать новую тему wordpress - каталог в папке currencies

Далее нужно настроить gulp
установить следующие расширения
    "browser-sync": "^3.0.2",
    "gulp": "^5.0.0",
    "gulp-autoprefixer": "^8.0.0",
    "gulp-clean": "^0.4.0",
    "gulp-concat": "^2.6.1",
    "gulp-imagemin": "^7.1.0",
    "gulp-sass": "^5.1.0",
    "gulp-uglify-es": "^3.0.0",
    "jquery": "^3.7.1",
    "jsdom": "^24.0.0",
    "sass": "^1.75.0"

в константе destFolder файла gulpfile.js указать путь к каталогу wordpress
