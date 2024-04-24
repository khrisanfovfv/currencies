$(function() {
})  

$("#get_currencies").on('click', function(){
    //let currency = new Currency('https://www.cbr.ru/scripts/XML_daily.asp');
    data = {
        action: 'get_currency_rate',
        date:'02/03/2002'
    }

    jQuery.post(MainData.ajaxurl, data, function (textStatus){
        alert(textStatus);
        parseString(xml, function(err, result){
            alert(result);
        });
    });
});

    