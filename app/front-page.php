<?php get_header();
$startDate = strtotime(date('Y-m-d')) - 3600*24*29; 
$endDate = strtotime(date('Y-m-d'));
$urrow_up = get_template_directory_uri() . '/images/arrow-up-svgrepo-com.svg'

?>
<header class="header">
    <h1 class="header__title">Курсы валют</h1>
</header>
<main>
    <div class="content">
        <div class="content__top">
            <form class="form" id="form_left" action="#">
            <label for="startDate">Начальная дата</label>
            <input type="date" id="startDate" value="<?php echo Date('Y-m-d', $startDate) ?>">
            <label for="endDate">Конечная дата</label>
            <input type="date" id="endDate" value="<?php echo Date('Y-m-d', $endDate) ?>">
            <label for="records_per_page">Записей на страницу</label>
            <select id="records_per_page">
                <option value="10">10</option>
                <option value="20" selected="selected">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
            </select>
            <div class="button_container">
                <button id="output_data">Вывести данные</button>
                <button id="out_to_json">JSON</button> 
            </div>
            </form>
            <form class="form" id="form_right">
                <button id="load_data">Загрузить данные</button>
            </form>
        </div>
        

        <ul class=tabs>
            <li class="tabs__tab highlighted">Таблица
            <li>
            <li class="tabs__tab">График
            <li>
        </ul>

        <section class="currency_rate">
            <table class="currency_rate__table">
                <thead>
                    <th>№</th>
                    <th id="id">ИД<div class="order asc"><img src="<?php echo $urrow_up ?>"></div></th>
                    <th id="cur_id">ИД валюты <div class="order asc"><img src="<?php echo $urrow_up ?>"></div></th>
                    <th id="num_code">Код валюты <div class="order asc"><img src="<?php echo $urrow_up ?>"></div></th>
                    <th id ="char_code" style="width: 160px">Буквенный код <div class="order asc"><img src="<?php echo $urrow_up ?>"></div></th>
                    <th id="nominal">Номинал <div class="order asc"><img src="<?php echo $urrow_up ?>"></div></th>
                    <th id="name">Название <div class="order asc"><img src="<?php echo $urrow_up ?>"></div></th>
                    <th id="value" style="width: 110px">Значение <div class="order asc"><img src="<?php echo $urrow_up ?>"></div></th>
                    <th id="vunit_rate"style="width: 180px">Курс за единицу <div class="order asc"><img src="<?php echo $urrow_up ?>"></div></th>
                    <th id="data">Дата <div class="order asc"><img src="<?php echo $urrow_up ?>"></div></th>
                </thead>
                <tbody>
                    <td></td>
                    <td><input class="filter" id="filter_id" type="text"></input></td>
                    <td><input class="filter" id="filter_cur_id" type="text"></input></td>
                    <td><input class="filter" id="filter_num_code" type="text"></input></td>
                    <td><input class="filter" id="filter_char_code" type="text"></input></td>
                    <td><input class="filter" id="filter_nominal" type="text"></input></td>
                    <td><input class="filter" id="filter_name" type="text"></input></td>
                    <td><input class="filter" id="filter_value" type="text"></input></td>
                    <td><input class="filter" id="filter_vunit_rate" type="text"></input></td>
                    <td><input class="filter" id="filter_date" type="date"></input></td>
                </tbody>
            </table>
            <div class="pagination">
            </div>

        </section>
        <section class="chart">
            <form id="chart_form" action="#">
                <label for="currency_name">Валюта</label>
                <select id="currency_name">

                </select>
                <label for="chart_startDate">Начальная дата</label>
                <input type="date" id="chart_startDate">
                <label for="chart_endDate">Конечная дата</label>
                <input type="date" id="chart_endDate">
                <button id="output_chart">Вывести график</button>
            </form>
            <div class="chart__canvas-wrapper">
                <canvas id="canvas" width="900" height="600">
                    Браузер не поддерживает Canvas
                </canvas>
            </div>
        </section>
    </div>


</main>
<?php get_footer(); ?>