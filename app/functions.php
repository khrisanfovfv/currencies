<?php 

require_once('currency.php');
class CurrenciesFN{
    public $url = '';
    public function __construct() {
        add_action( 'wp_enqueue_scripts', array($this, 'currencies_scripts'));
        add_action('wp_ajax_nopriv_get_currency_rate', array($this, 'get_currency_rate'));
        $this->url = 'http://www.cbr.ru/scripts/XML_daily.asp?date_req=02/03/2002';
    }  

    /**
     * ============= ПОДКЛЮЧАЕМ СКРИПТЫ И СТИЛИ ============
     */
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
        // Очищаем базу данных 
        $this->truncate_table();

        $startDate = date("d-m-Y", strtotime($_POST['startDate']));
        $endDate = date("d-m-Y", strtotime($_POST['endDate']));
        if (($_POST['startDate'] != '') && ($_POST['endDate']=='')){
            $rates = $this->request_currencies($startDate);
            // Вставляем строки в базу данных
            foreach ($rates as $rate) {
                $this->insert_to_database($rate);
        }
        }

        if (($_POST['startDate'] == '') && ($_POST['endDate']!='')){
            $rates = $this->request_currencies($endDate);
            // Вставляем строки в базу данных
            foreach ($rates as $rate) {
                $this->insert_to_database($rate);
            }
        }
        
        if (($_POST['startDate'] != '') && ($_POST['endDate']!='')){
            $rates = [];
            $startDate_sec = strtotime($startDate);
            $endDate_sec =  strtotime($endDate);
            $seconds = $endDate_sec - $startDate_sec;
            $days = $seconds / 86400;
            // Если даты совпадают
            if ($days == 0){
                $rates = $this->request_currencies($startDate);
            } else {
                $date = $startDate;
                for($i=1; $i<= $days+1; $i++){
                    $rates = $this->request_currencies($date);
                    $date =  date("d/m/Y", strtotime($startDate . " +$i day"));
                    // Вставляем строки в базу данных
                    foreach ($rates as $rate) {
                        $this->insert_to_database($rate);
                    }

                }
            }
        }

        // Считываем значения базы данных
        $this->select_from_database();
        wp_die();
    }

    /**
     * ========= СЧИТЫВАЕМ КУРС ВАЛЮТ ЗА ЗАДАННЫЙ ДЕНЬ ========
     */
    function request_currencies($date){
        $reader = new XMLReader();
        $rates = [];
        if ($reader->open('http://www.cbr.ru/scripts/XML_daily.asp?date_req='.$date)){
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
                    $rate->vunit_rate = $reader->value;
                }
                    
                if ($reader->nodeType == XMLReader::END_ELEMENT && $reader->localName == 'Valute'){
                    array_push($rates, $rate);
                }

                $rate->date = $date = date('Y-m-d', strtotime(str_replace('-', '/', $date)));
            }
            return $rates;
        } else{
             wp_die('При выполнении запроса ' . $this->url . 'Произошла ошибка', 'Ошибка', array('responce' => 500));
        }
    }

    /**
     * ОЧИЩАЕМ БАЗУ ДАННЫХ
     */

     function truncate_table(){
        global $wpdb;
        $table_name = $wpdb->prefix . 'currency_rate';
            $wpdb->query("TRUNCATE $table_name")
         or wp_die($wpdb->last_error,'Ошибка', array('response' => 500));
    }

    /** 
     * ВСТАВЛЯЕМ ЗНАЧЕНИЯ МАССИВА В БАЗУ ДАННЫХ 
     * */
    function insert_to_database($rate){
        global $wpdb;
        $table_name = $wpdb->prefix . 'currency_rate';
        $wpdb->insert(
            $table_name,
            array(
                'cur_id' => $rate->id,
                'num_code' => $rate->num_code,
                'char_code' => $rate->char_code,
                'nominal' => $rate->nominal,
                'name' => $rate->name,
                'value' => $rate->value,
                'vunit_rate' => $rate->vunit_rate,
                'date' => $rate->date,
            ),
            array(
                '%s', // cur_id
                '%s', // num_code
                '%s', // char_code
                '%d', // nominal
                '%s', // name
                '%s', // value
                '%s', // vunit_rate
                '%s', // date
            )
        ) or wp_die($wpdb->last_error,'Ошибка', array('response' => 500));
    }

    /**
     * ========= ИЗВЛЕКАЕМ ЗНАЧЕНИЯ ИЗ БАЗЫ ДАННЫХ ==========
     */
    function select_from_database(){
        global $wpdb;
        $table_name = $wpdb->prefix . 'currency_rate';
        $results = $wpdb->get_results(
            $wpdb->prepare("SELECT * FROM {$prefix}$table_name"), ARRAY_A
        );
        echo json_encode($results);
    }
}





if (class_exists('CurrenciesFN')) {
    new CurrenciesFN();
}
?>