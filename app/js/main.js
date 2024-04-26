$(function() {
})  

$("#submit").on('click', function(){
    let startDate =  $('#startDate').val()
    let endDate = $('#endDate').val();
    // Проверяем что дата быта введена в одном из полей
    if ((startDate == '') && (endDate == '')){
        alert('Введите не менее одной даты');
    } else{
        // Делаем запрос на сервер
        data = {
            action: 'get_currency_rate',
            startDate : $('#startDate').val(),
            endDate : $('#endDate').val(),
        }

        jQuery.post(MainData.ajaxurl, data, function (result){
            let currency_rate = JSON.parse(result);
            // Рисуем таблицу
            currency_rate.forEach(element => {
                draw_row_table(element);
            });

            //Строим график
            draw_chart(currency_rate[0]);    
            
        });
    }
    
});

/**
 * Кнопка JSON
 */
$('#out_to_json').on('click', function(){
    let startDate =  $('#startDate').val()
    let endDate = $('#endDate').val();
    // Проверяем что дата быта введена в одном из полей
    if ((startDate == '') && (endDate == '')){
        alert('Введите не менее одной даты');
    } else{
        // Делаем запрос на сервер
        data = {
            action: 'get_currency_rate',
            startDate : $('#startDate').val(),
            endDate : $('#endDate').val(),
        }

        jQuery.post(MainData.ajaxurl, data, function (result){
            // Выгрузка файла в формате json
            var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(result);
            var downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href",     dataStr);
            downloadAnchorNode.setAttribute("download",  "file.json");
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
function draw_row_table(rate){
    num = $('.currency_rate__table tbody tr').length+1;
        $('.currency_rate__table tbody').append(
            $("<tr>")
                .append($("<td>").text(num))
                .append($("<td>").text(rate.cur_id))
                .append($("<td>").text(rate.num_code))
                .append($("<td>").text(rate.nominal))
                .append($("<td>").text(rate.name))
                .append($("<td>").text(rate.value))
                .append($("<td>").text(rate.vunit_rate))
                .append($("<td>").text(rate.date))
        );
}

$('.tabs__tab').on('click', function(e){
    $('.tabs__tab').removeClass('highlighted');
    $(e.target).addClass('highlighted');
    
    switch($(e.target).text()){
        case 'Таблица' : {
            $('.currency_rate').show();
            $('.chart').hide();
        } break
        case 'График' : {
            $('.currency_rate').hide(); 
            $('.chart').hide();
        } break;
    }
})

/**
 * 
 * @param {Object} rate данные по определенной валюте 
 */
function draw_chart(rate){
    var canvas = $('#canvas').get(0);
    var gctx = canvas.getContext("2d");
    gctx.fillStyle = '#0046f5';
    gctx.font = '46px serif';
}

    