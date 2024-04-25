<?php 

require_once('currency.php');
class CurrenciesFN{
    public $url = '';
    public function __construct() {
        add_action( 'wp_enqueue_scripts', array($this, 'currencies_scripts'));
        add_action('wp_ajax_nopriv_get_currency_rate', array($this, 'get_currency_rate'));
        $this->url = 'http://www.cbr.ru/scripts/XML_daily.asp?date_req=02/03/2002';
    }  

    function currencies_scripts(){
        wp_register_script( 'main_script', get_template_directory_uri() . '/js/main.min.js', array(), filemtime(get_template_directory() . '/js/main.min.js'), true );
        wp_register_style('main_style', get_template_directory_uri() . '/css/style.min.css', array(), filemtime(get_template_directory() . '/css/style.min.css'), 'all');
        wp_enqueue_script('main_script');
        wp_enqueue_style('main_style'); 
        // Передаем переменную ajaxurl в main.js
        wp_localize_script('main_script','MainData', array(
            'ajaxurl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('currencies')
        ));
    }

    function get_currency_rate(){
        //$date = $_POST['date'];
        
        //$content = file_get_contents($this->url);
        $reader = new XMLReader();
        $rates = [];
        $date ='';

        if ($reader->open($this->url)){
            while($reader->read()) {

                if ($reader->nodeType == XMLReader::ELEMENT && $reader->localName == 'ValCurs'){
                    $date = $reader->getAttribute('Date');
                }


                if ($reader->nodeType == XMLReader::ELEMENT && $reader->localName == 'Valute'){
                    $rate = new Currency();
                    $rate->id = $reader->getAttribute('ID');

                }

                if($reader->nodeType == XMLReader::ELEMENT && $reader->localName == 'NumCode') {
                    $reader->read();
                    $rate->num_code = $reader->value;
                }

                if($reader->nodeType == XMLReader::ELEMENT && $reader->localName == 'CharCode') {
                    $reader->read();
                    $rate->char_code = $reader->value;
                }

                if($reader->nodeType == XMLReader::ELEMENT && $reader->localName == 'Nominal') {
                    $reader->read();
                    $rate->nominal = $reader->value;
                }

                if($reader->nodeType == XMLReader::ELEMENT && $reader->localName == 'Name') {
                    $reader->read();
                    $rate->name = $reader->value;
                }

                if($reader->nodeType == XMLReader::ELEMENT && $reader->localName == 'Value') {
                    $reader->read();
                    $rate->value = $reader->value;
                }

                if($reader->nodeType == XMLReader::ELEMENT && $reader->localName == 'VunitRate') {
                    $reader->read();
                    $rate->vinit_rate = $reader->value;
                }
                    
                $rate->date = $date;

                if ($reader->nodeType == XMLReader::END_ELEMENT && $reader->localName == 'Valute'){
                    array_push($rates, $rate);
                }
            }
            print_r($rates);
        } else{
             wp_die('При выполнении запроса ' . $this->url . 'Произошла ошибка', 'Ошибка', array('responce' => 500));
        }
        wp_die();
    }
}

if (class_exists('CurrenciesFN')) {
    new CurrenciesFN();
}
?>