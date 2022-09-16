$(document).ready(function () {
    console.log("ready!");
    $('.iz-animation-active .iz-text').html(function (i, html) {
        var chars = $.trim(html).split("");

        return '<span>' + chars.join('</span><span>') + '</span>';
    });
});