$(function() {
})  

$("#submit").on('click', function(){
    //let currency = new Currency('https://www.cbr.ru/scripts/XML_daily.asp');
    data = {
        action: 'get_currency_rate',
        date:'02/03/2002'
    }

    jQuery.post(MainData.ajaxurl, data, function (textStatus){
        alert(textStatus);
    });
});

$('.tabs__tab').on('click', function(e){
    $('.tabs__tab').removeClass('highlighted');
    $(e.target).addClass('highlighted');
    
    switch($(e.target).text()){
        case 'Таблица' : $('.currency_rate').show(); break
        case 'График' : $('.currency_rate').hide(); break
    }
})

    