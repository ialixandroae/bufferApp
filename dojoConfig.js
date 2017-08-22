var locationPath = window.location.pathname.replace(/\/[^\/]+$/, '/');

window.dojoConfig = {
    deps: ['app/main'],
    packages: [{
        name: 'app',
        location: locationPath + '/app',
        main: 'main'
    }]
};

// Setare min & max in input text 
function minmax(value, min, max) {
    if (parseInt(value) < min || isNaN(parseInt(value)))
        return 1;
    else if (parseInt(value) > max)
        return 15;
    else return value;
}