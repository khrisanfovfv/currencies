
jQuery(function ($) {
    let count_records; 
    let skip = 0;

    $("#submit").on('click', function () {
        let startDate = $('#startDate').val()
        let endDate = $('#endDate').val();

        // Проверяем что дата быта введена в одном из полей
        if ((startDate == '') && (endDate == '')) {
            alert('Введите не менее одной даты');
        } else {
            // Делаем запрос на сервер
            
            // Узнаем количество записей в таблице
            data = {
                action: 'count_currency_records'
            }
            jQuery.post(MainData.ajaxurl, data, function(count){
                let count_per_page = 20
                count_records = count;
                output_data(count_per_page, skip);
                // //Строим график
                // draw_chart(currency_rate[0]);

            });
        }

    });

    /** Вывод данных в таблицу */
    function output_data(count, skip){

        // Выводим данные таблицы
        data = {
            action: 'get_currency_rate',
            startDate: $('#startDate').val(),
            endDate: $('#endDate').val(),
            filter_id : $('#filter_id').val(),
            filter_cur_id : $('#filter_cur_id').val(),
            filter_num_code : $('#filter_num_code').val(),
            filter_char_code : $('#filter_char_code').val(),
            filter_nominal : $('#filter_nominal').val(),
            filter_name : $('#filter_name').val(),
            filter_value : $('#filter_value').val(),
            filter_vunit_rate : $('#filter_vunit_rate').val(),
            filter_date : $('#filter_date').val(),
            skip: skip,
            count : count
        }

        jQuery.post(MainData.ajaxurl, data, function (result) {
            let currency_rate = JSON.parse(result);
            // Рисуем таблицу
            // Предварительно очищаем прошлый вывод
            $('.currency_rate__table>tbody>tr').not(':first').remove();
            currency_rate.forEach(element => {
                draw_row_table(element);
            });
            skip = draw_pagination(20, count_records,1);
        });
    }

    /**
     * Кнопка JSON
     */
    $('#out_to_json').on('click', function () {
        let startDate = $('#startDate').val()
        let endDate = $('#endDate').val();
        // Проверяем что дата быта введена в одном из полей
        if ((startDate == '') && (endDate == '')) {
            alert('Введите не менее одной даты');
        } else {
            // Делаем запрос на сервер
            data = {
                action: 'get_currency_rate',
                startDate: $('#startDate').val(),
                endDate: $('#endDate').val(),
            }

            jQuery.post(MainData.ajaxurl, data, function (result) {
                // Выгрузка файла в формате json
                var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(result);
                var downloadAnchorNode = document.createElement('a');
                downloadAnchorNode.setAttribute("href", dataStr);
                downloadAnchorNode.setAttribute("download", "file.json");
                document.body.appendChild(downloadAnchorNode); // required for firefox
                downloadAnchorNode.click();
                downloadAnchorNode.remove();
            });
        }
    })

    /**
     * ОТРИСОВКА СТРОКИ ТАБЛИЦЫ
     * @param {Object} rate Обьект содержащий валюту 
     */
    function draw_row_table(rate) {
        num = $('.currency_rate__table tbody tr').length;
        $('.currency_rate__table tbody').append(
            $("<tr>")
                .append($("<td>").text(num))
                .append($("<td>").text(rate.id))
                .append($("<td>").text(rate.cur_id))
                .append($("<td>").text(rate.num_code))
                .append($("<td>").text(rate.char_code))
                .append($("<td>").text(rate.nominal))
                .append($("<td>").text(rate.name))
                .append($("<td>").text(rate.value))
                .append($("<td>").text(rate.vunit_rate))
                .append($("<td>").text(rate.date))
        );
    }

    $('.tabs__tab').on('click', function (e) {
        $('.tabs__tab').removeClass('highlighted');
        $(e.target).addClass('highlighted');

        switch ($(e.target).text()) {
            case 'Таблица': {
                $('.currency_rate').show();
                $('.chart').hide();
            } break
            case 'График': {
                $('.currency_rate').hide();
                $('.chart').hide();
            } break;
        }
    })

    /**
     * 
     * @param {integer} num_rows число строк на страницу 
     * @param {integer} count общее число страниц
     * @param {integer} current номер текущей страницы 
     * @returns количество пропущенных записей
     */
    function draw_pagination(num_rows, count, current){
        $('.pagination > *').remove();
        // Не более 3 страниц
        let count_pages = Math.floor(count / num_rows);
        if (count % num_rows > 0){
            count_pages++;
        }

        $('.pagination').append($("<div class='page'>").text(1));

        if (current> 1){
            $('.pagination').append($("<a class='prev'>").text('Пред.')) 
            $('.pagination').append($("<div class='page'>").text(current));
        }



        if (current < count_pages){
            $('.pagination').append($("<a class='next'>").text('След.'));
            $('.pagination').append($("<div class='page'>").text(count_pages));
        }


        $('.page:nth-child(' + current + ')').addClass('selected_page');
        
        $('.prev').on('click', function(e){
            let num = Number($('.page.selected_page').text());
            draw_pagination(20, count_records, num-1);
        });

        $('.next').on('click', function(e){
            let num = Number($('.page.selected_page').text());
            draw_pagination(20, count_records, num+1);
            skip = 20 * (num);
            output_data(20,skip);
        });


        


        // Привязываем событие click
        $('.page').on('click', function(e){
            $('.page').removeClass('selected_page');
            let skip = draw_pagination(20, count_records, $(e.target).text());
            output_data(20, skip);
        })


        let skip = (current-1) * num_rows;
        return skip;
    }

    
    
    
    /**
     * 
     * @param {Object} rate данные по определенной валюте 
     */
    function draw_chart(rate) {
        var canvas = $('#canvas').get(0);
        var gctx = canvas.getContext("2d");
        gctx.fillStyle = '#0046f5';
        gctx.font = '46px serif';
    }



})
