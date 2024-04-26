$(function() {
})  

$("#submit").on('click', function(){
    //let currency = new Currency('https://www.cbr.ru/scripts/XML_daily.asp');
    let startDate =  $('#startDate').val()
    let endDate = $('#endDate').val();
    // Проверяем что дата быта введена в одном из полей
    if ((startDate == '') && (endDate == '')){
        alert('Введите не менее одной даты');
    } else{
        data = {
            action: 'get_currency_rate',
            startDate : $('#startDate').val(),
            endDate : $('#endDate').val(),
            date:'02/03/2002'
        }

        jQuery.post(MainData.ajaxurl, data, function (result){
            let currency_rate = JSON.parse(result);
            currency_rate.forEach(element => {
                draw_row_table(element);
            });
        
    });
    }
    
});

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
        case 'Таблица' : $('.currency_rate').show(); break
        case 'График' : $('.currency_rate').hide(); break
    }
})

    