
jQuery(function ($) {

    $('.currency_rate').show();
    $('.chart').hide();
    let count_records; 
    let skip = 0;

    $("#output_data").on('click', function() {
            
            // Узнаем количество записей в таблице
            data = {
                action: 'count_currency_records'
            }
            jQuery.post(MainData.ajaxurl, data, function(count){
                
                let count_per_page = $('#records_per_page').val();
                count_records = count;
                output_data(count_per_page, skip, 'date', 'DESC');
                
                
                //Строим график
                // draw_chart(currency_rate[0]);

            });
        });

    // НАЖАТИЕ КНОПКИ ЗАГРУЗИТЬ ДАННЫЕ
    $('#load_data').on('click', function(){
        load_data_from_url();
    })


    /**
     * ФУНКЦИЯ ДЛЯ ЗАГРУЗКИ КУРСОВ ВАЛЮТ С САЙТА ЦБ
     */
    function load_data_from_url(){
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
                alert(result);
            })
        }
    }

    /**
     * == ФУНКЦИЯ ДЛЯ ПЕРИОДИЧЕСКОЙ ЗАГРУЗКИ ОБНОВЛЕННЫХ ДАННЫХ С САЙТА ==
     */
    setInterval(load_data_from_url, 60000*20);

    /** 
     * ==================== ВЫВОД ДАННЫХ В ТАБЛИЦУ ==================
     * */
    function output_data(count_per_page, skip, sort_fileld, sort_direction){
        // Выводим данные таблицы
        data = {
            action: 'select_from_database',
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
            sort: sort_fileld,
            sort_direction: sort_direction,
            skip: skip,
            count_per_page : count_per_page
        }

        jQuery.post(MainData.ajaxurl, data, function (result) {
            let currency_rate = JSON.parse(result);
            // Рисуем таблицу
            // Предварительно очищаем прошлый вывод
            $('.currency_rate__table>tbody>tr').not(':first').remove();
            currency_rate.forEach(element => {
                draw_row_table(element);
            });
            //skip = draw_pagination(20, count_records,1);

            // Подготавливаем список валют для графика
            data = {
                action: 'get_currency_name_list',
            }
            jQuery.post(MainData.ajaxurl, data, function (result) {
                let names = JSON.parse(result)
                names.forEach(element =>{
                    $("#currency_name").append($("<option></option>")
                        .attr("value", element.cur_id) 
                        .text(element.name)); 
                })
                $('#chart_startDate').val($('#startDate').val());
                $('#chart_endDate').val($('#endDate').val());
            });

        });
    }

    /**
     * ================= Кнопка JSON =================
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
     * ============= ОТРИСОВКА СТРОКИ ТАБЛИЦЫ =============
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
    /**
     *  ============ ВЫБОР ВКЛАДКИ ==============
     */
    $('.tabs__tab').on('click', function (e) {
        $('.tabs__tab').removeClass('highlighted');
        $(e.target).addClass('highlighted');
        switch($(e.target).text().trim()) {
            case 'Таблица': {
                $('.currency_rate').show();
                $('.chart').hide();
            }; break;
            case 'График': {
                $('.currency_rate').hide();
                $('.chart').show();
            }; break;
        }
    })

    /**
     * ================= ПАГИНАЦИЯ СТРАНИЦ ===============
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
     * ========== НАВЕДЕНИЕ НА ЭЛЕМЕНТ ШАПКИ ТАБЛИЦЫ =============*/
    $('.currency_rate__table>thead th').on('mouseover', function(e){
        $(e.target).find('img').addClass('show_order_img')
    });

    /** ============== УХОД МЫШКОЙ С ШАПКИ ТАБЛИЦЫ ===============*/
    $('.currency_rate__table>thead th').on('mouseleave', function(e){
        $(e.target).find('img').removeClass('show_order_img');
    });

    /** =============== НАЖАТИЕ НА ЗНАЧОК СОРТИРОВКИ ================*/
    $('.order').on('click', function(e){
        e.stopPropagation();
        $('.order img').css('display','none');
        let sort_field = $(e.target).parents('th').attr('id');
        $(e.target).css('display', 'block');
        if ($(e.target).parent().hasClass('asc')){
            $(e.target).parent().removeClass('asc');
            $(e.target).parent().addClass('dsc');
            $(e.target).attr('src',MainData.images + 'arrow-down-svgrepo-com.svg');
            output_data(100, 20, sort_field, 'DESC');

        } else if ($(e.target).parent().hasClass('dsc')){
            $(e.target).parent().removeClass('dsc');
            $(e.target).parent().addClass('asc');
            $(e.target).attr('src',MainData.images + 'arrow-up-svgrepo-com.svg');
            output_data(100, 20, sort_field, 'ASC');
        }
    })

    /**
     * ========= КНОПКА ВЫВЕСТИ ГРАФИК ===========
     */
    $('#output_chart').on('click', function(){

        // Получаем данные для графика
        let data = {
            action : 'get_chart_data',
            cur_id : $('#currency_name').val().trim()
        } 

        jQuery.post(MainData.ajaxurl, data, function (result) {
            let values = JSON.parse(result);
            
            // Ищем максимальный элемент
            let max = values.reduce((prev, curr) => prev.value > curr.value ? prev : curr);

            // Ищем минимальный элемент
            let min = values.reduce((prev, curr) => prev.value < curr.value ? prev : curr);


            // Настраиваем параметры графика
            var canvas = $('#canvas').get(0);
            var gctx = canvas.getContext("2d");

            gctx.fillStyle = '#0046f5';
            gctx.font = '46px serif';

            gctx.beginPath();
            gctx.strokeStyle = '#7a7979';
            gctx.lineWidth = 0.5;
            gctx.moveTo(30, 10);

            // Рисуем оси
            let x_axis_width = $('#canvas').width() - 40 ;
            let y_axis_height = $('#canvas').height() - 40;

            gctx.lineTo(30, y_axis_height);
            gctx.lineTo(x_axis_width, y_axis_height);
            

            // Вычисляем еденицу значения на пиксель
            let value_per_pixel = (parseFloat(max.value)-parseFloat(min.value))/y_axis_height;

            // Вычисляем еденицу времени на пиксель
            let start = new Date($('#chart_startDate').val());
            let end = new Date($('#chart_endDate').val());
            let day = 1000*60*60*24;
            let interval = (end - start + day)/day;
            date_per_pixel = interval / x_axis_width;

            // Рисуем график
            let xs = y_axis_height - values[0].date/ date_per_pixel;
            let ys = values[0].value/value_per_pixel;
            gctx.moveTo(xs,ys);
            values.forEach(element=> {
                x = element.date/date_per_pixel;
                y = element.value/value_per_pixel;
                gctx.lineTo(x,y);
            })

            gctx.stroke();
        });


        
        // Получаем канву
        
        // Рисуем график
       
       
        
        //gctx.lineTo( canvas_width - 20, canvas_height -20);

        //gctx.closePath();
        //
    })

    
    
    
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
