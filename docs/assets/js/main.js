var cookies_alert=$("#cookies-alert");$(document).ready(function(){null===localStorage.getItem("cookieNotice")&&(cookies_alert.addClass("block"),setTimeout(function(){cookies_alert.addClass("show")},50))}),$("#close-cookies-alert").click(function(){localStorage.setItem("cookieNotice",!0),cookies_alert.removeClass("show"),setTimeout(function(){cookies_alert.removeClass("block")},500)});
//# sourceMappingURL=maps/main.js.map
