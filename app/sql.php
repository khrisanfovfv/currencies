<?php
/**
* КЛАСС СОДЕРЖАЩИЙ ФУНКЦИИИ ДЛЯ РАБОТЫ С БАЗОЙ ДАННЫХ
*/

class CSQL {
    
    protected $prefix;
    protected $table_name;
    
    public function __construct(string $table_name) {
        global $wpdb;
        $this->prefix = $wpdb->prefix;
        $this->table_name = $this->prefix . $table_name;
    }

    /** ===== ОЧИЩАЕТ БАЗУ ДАННЫХ ===== */
    public function truncate_table()
     {
        global $wpdb;
        $wpdb->query("TRUNCATE $this->table_name")
           or wp_die($wpdb->last_error, 'Ошибка', array('response' => 500));
     }

    
     /**
     * ============ ПОЛУЧАЕМ КОЛИЧЕСТВО СТРОК ============
     */
    function count_currency_records(){
        global $wpdb;
        $prefix = $wpdb->prefix;
        $table_name = $prefix . 'currency_rate';
        $count = $wpdb->get_var("SELECT COUNT(*) FROM $table_name");
        if ($wpdb->last_error){
            wp_die($wpdb->last_error,'Ошибка', array('response' => 500));
        }
        echo $count;
        wp_die();
    }
    /**
     * ПОЛУЧАЕМ СПИСОК ВАЛЮТ С ИХ ИД
     *
     * @return array список ИД и наименований валют
     */
    function get_currency_name_list(){
        global $wpdb;
        $prefix = $wpdb->prefix;
        $table_name = $prefix . 'currency_rate';
        $results = $wpdb->get_results(
            $wpdb->prepare("SELECT DISTINCT cur_id , name FROM $table_name"), ARRAY_A);
        echo json_encode($results);
        wp_die();
    }

    /**
     * ПОЛУЧАЕМ ДАННЫЕ ДЛЯ ГРАФИКА
     *
     * @return array массив значений валюты
     */
    function get_chart_data(){
        global $wpdb;
        $cur_id = $_POST['cur_id'];
        $prefix = $wpdb->prefix;
        $table_name = $prefix . 'currency_rate';
        $results = $wpdb->get_results(
            $wpdb->prepare("SELECT value, date FROM $table_name WHERE cur_id = %s
                ORDER BY date ASC", $cur_id), ARRAY_A);
        echo json_encode($results);
        wp_die();
    }


    /**
     * ВСТАВКА ЗНАЧЕНИЯ МАССИВА В БАЗУ ДАННЫХ 
     *
     * @param [object] $rate объект класса Currency
     */ 
    function insert_to_database($rate)
    {
        global $wpdb;
        
        $wpdb->insert(
            $this->table_name,
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
        ) or wp_die($wpdb->last_error, 'Ошибка', array('response' => 500));
    }

    /**
     * ========= ИЗВЛЕКАЕМ ЗНАЧЕНИЯ ИЗ БАЗЫ ДАННЫХ ==========
     */
    function select_from_database()
    {
        global $wpdb;
        $sort                       =       $_POST['sort'];
        $skip                       =       $_POST['skip'];
        $count_per_page             =       $_POST['count_per_page'];
        $sort_direction              =      $_POST['sort_direction'];
        $wild                       =       '%';

        $like_filter_id             =       $wild . $wpdb->esc_like($_POST['filter_id']) .$wild;
        $like_filter_cur_id         =       $wild . $wpdb->esc_like($_POST['filter_cur_id']) .$wild;
        $like_filter_num_code       =       $wild . $wpdb->esc_like($_POST['filter_num_code']) .$wild;
        $like_filter_char_code      =       $wild . $wpdb->esc_like($_POST['filter_char_code']) .$wild;
        $like_filter_nominal        =       $wild . $wpdb->esc_like($_POST['filter_nominal']) .$wild;
        $like_filter_name           =       $wild . $wpdb->esc_like($_POST['filter_name']) .$wild;
        $like_filter_value          =       $wild . $wpdb->esc_like($_POST['filter_value']) .$wild;
        $like_filter_vunit_rate     =       $wild . $wpdb->esc_like($_POST['filter_vunit_rate']) .$wild;
        $like_filter_date           =       $wild . $wpdb->esc_like($_POST['filter_date']) .$wild;

        $prefix = $wpdb->prefix;
        $table_name = $prefix . 'currency_rate';
        $results = $wpdb->get_results(
            $wpdb->prepare("SELECT * FROM $table_name
            WHERE id LIKE %s 
            AND cur_id LIKE %s 
            AND num_code LIKE %s
            AND char_code LIKE %s 
            AND nominal LIKE %s 
            AND name LIKE %s 
            AND value LIKE %s
            AND vunit_rate LIKE %s 
            AND date like %s
            ORDER BY $sort $sort_direction
            LIMIT %d, %d",
                array($like_filter_id, 
                      $like_filter_cur_id, 
                      $like_filter_num_code,
                      $like_filter_char_code, 
                      $like_filter_nominal, 
                      $like_filter_name,
                      $like_filter_value, 
                      $like_filter_vunit_rate, 
                      $like_filter_date,
                      $skip, $count_per_page
                      )
            ), ARRAY_A
        );
        if ($wpdb->last_error){
            wp_die($wpdb->last_error, 'Ошибка', array('response'=> 500));
        }
        echo json_encode($results);
        wp_die();
    }
}

?>