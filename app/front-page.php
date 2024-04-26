<?php get_header(); 
?>
<header class="header">
    <h1 class="header__title">Курсы валют</h1>
</header>
<main>
    <div class="content">
        <form class="form" id="form" action="#">
                <label for="startDate">Начальная дата</label>
                <input type="date" id="startDate" >
                <label for="endDate" >Конечная дата</label>
                <input type="date" id="endDate">
                <div class="button_container">
                    <button id="submit">Таблица</button>
                    <button id="out_to_json">JSON</button>
                </div>
        </form>
    </div>

    <ul class=tabs>
        <li class="tabs__tab highlighted">Таблица<li>
        <li class="tabs__tab">График<li>
    </ul>    

    <section class="currency_rate">
        <table class="currency_rate__table">
            <thead>
                <th>№</th>
                <th>ИД</th>
                <th>Код</th>
                <th>Номинал</th>
                <th>Название</th>
                <th>Значение</th>
                <th>Курс за единицу</th>
                <th>Дата</th>
            </thead>
            <tbody>
            </tbody>
        </table>
    </section>
    <section class="chart">
    <div class="chart__canvas-wrapper">
      <canvas id="canvas" width="500" height="250">
        Браузер не поддерживает Canvas
      </canvas>
    </div>
    </section>
</main>
<?php get_footer(); ?>