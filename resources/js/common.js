function loadScript(url,callback){
    var head=document.getElementsByTagName("head")[0];
    var script=document.createElement('script');
    script.src=url;
    // script.type='text/javascript';
    //real browsers
    script.onload=callback;
    //Internet explorer
    script.onreadystatechange = function() {
        if (this.readyState == 'complete') {
            callback();
        }
    }
    head.appendChild(script);
}
function loadCss(url) {
    var head=document.getElementsByTagName("head")[0];
    var appCss = document.createElement('link');
    appCss.href = url;
    appCss.rel = 'stylesheet';
    head.prepend(appCss);
}

// document.write('<script src="' + resources_path + 'js/jquery.activeNavigation.js"></script>');
const swiperJs = `https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js`;
const fancyboxJs = `https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.umd.js`;
const waypointJs = `${resources_path}js/waypoint/noframework.waypoints.min.js`;
const scrollToJs = `${resources_path}js/jquery.scrollTo.min.js`;
const aosJs = `https://unpkg.com/aos@2.3.1/dist/aos.js`;
const fontAwesomeJs = `https://pro.fontawesome.com/releases/v5.15.4/js/all.js`;
const bootstrapJs = `${resources_path}js/bootstrap.bundle.min.js`;
//視差滾動 https://github.com/alexfoxy/lax.js
const parallaxJs = `https://cdn.jsdelivr.net/npm/lax.js`;
const metisMenuJs = 'https://cdn.jsdelivr.net/npm/metismenujs/dist/metismenujs.min.js';
const metisMenuCss = 'https://cdn.jsdelivr.net/npm/metismenujs/dist/metismenujs.min.css';



// loadScript(waypointJs);
loadScript(aosJs);
loadScript(bootstrapJs);


// swiper
var hasSwiper = document.querySelectorAll('.swiper');

if (hasSwiper.length > 0) {
    loadScript(swiperJs);
}



// // fancybox 4
var hasFancybox = document.querySelectorAll('[data-fancybox]');
if (hasFancybox.length > 0) {
    loadScript(fancyboxJs, function () {
        Fancybox.bind("[data-fancybox]");
    });
}

// // scrollTo
// document.write('<script src="' + resources_path + 'js/jquery.scrollTo.min.js"></script>');

// // waypoint
// document.write('<script src="' + resources_path + 'js/waypoint/jquery.waypoints.min.js"></script>');

// // aos (animate)
// document.write('<script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>');

// // mmenu
// document.write('<script src="' + resources_path + 'js/mmenu/mmenu.polyfills.js"></script>');
// document.write('<script src="' + resources_path + 'js/mmenu/mmenu.js"></script>');

// //FontAwesome 5
// document.write('<script src="https://pro.fontawesome.com/releases/v5.15.4/js/all.js" integrity="sha384-8nTbev/iV1sg3ESYOAkRPRDMDa5s0sknqroAe9z4DiM+WDr1i/VKi5xLWsn87Car" crossorigin="anonymous"></script>');
// // bootstrap 5
// document.write('<script src="' + resources_path + 'js/bootstrap.bundle.min.js"></script>');



// // custom
// document.write('<script src="' + resources_path + 'js/script.js"></script>');

