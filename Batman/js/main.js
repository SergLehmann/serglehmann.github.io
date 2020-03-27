$(document).ready(function () {
    let tabsItem = $('.menu-tabs');
    
    tabsItem.on('click', function(event) {
        event.preventDefault();
        let activeContent = $(this).attr('href');
        $('.visible').toggleClass('visible');
        $(activeContent).toggleClass('visible');
        $('.menu-tabs-active').toggleClass('menu-tabs-active');
        $(this).toggleClass('menu-tabs-active');
    });
});