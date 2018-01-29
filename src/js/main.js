var app = app || {};
app.main = {
    test: function () {
        console.log('wahoo!');

    }


};
app.init = function () {
    app.main.test();
};

$(document).ready(function () {
    app.init();
});