var cookies_alert = $('#cookies-alert');

$(document).ready(function () {

    // Show cookie bar if no local storage exists
    if (localStorage.getItem('cookieNotice') === null) {
        cookies_alert.addClass('block');

        setTimeout(function () {
            cookies_alert.addClass('show');
        }, 50);
    }

});

// Close cookie bar
$('#close-cookies-alert').click(function () {
    localStorage.setItem('cookieNotice', true);

    cookies_alert.removeClass('show');

    setTimeout(function () {
        cookies_alert.removeClass('block');
    }, 500);
});