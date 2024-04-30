Данный сервис создан с помощью платфомы wordpress и gulp
Для запуска нужно развернуть экземпляр wordpress на машине выполняюшей роль сервера
на сервере создать пустую базу данных currencies
со следующими полями

Указать ее в настройках wordpress при установке(подробнее об установке wordpress https://wp-kama.ru/handbook/wordpress/ustanovka-wordpress?ysclid=lvjlq4yd7c815102029)
Создать каталог в папке <Папка Wordpress>\wp-content\themes - назвать его currencies
Далее при установке wordpress указать базу данных currencies и учетные данные для доступа к ней
По завершении установки заходим на наш сайт wordpress с учетными данными указанными при установке

Далее нужно настроить gulp глобально (подробности об установке https://gulpjs.su/docs/ru/getting-started/quick-start/)
npm install --global gulp-cli

Затем командой 
npm install 

установить все необходимые библиотеки из файла package.json проекта

в константе destFolder файла gulpfile.js указать путь к каталогу wordpress

запустить gulp
командой gulp 
В папке с темой <Папка Wordpress>\wp-content\themes\currencies должны сформироваться файлы проекта

Далее в настройках wordpress нужно активировать тему Currencies
При активации автоматически создасться таблица <Префикс указанный при установке>currency_rate

