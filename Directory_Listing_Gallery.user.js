// ==UserScript==
// @name         Directory Listing Gallery
// @namespace    Brain++ OSS
// @version      1.1
// @author       Weiran He <hwr@megvii.com>
// @include      /^https:\/\/oss.iap.*.brainpp\.cn\/.*$/
// @grant        none
// @run-at       document-idle
// @require      http://code.jquery.com/jquery-2.2.4.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js
// @supportURL   https://discourse.brainpp.cn/t/topic/33465
// @updateURL    https://gist.github.com/hewr1993/8b42a79ad795dfbed2c2a1246260dda1
// @downloadURL  https://bitbucket.org/!api/2.0/snippets/hewr1993/knzoAB/52527a26dc96198c31bf4c453b6ca931754d8ce3/files/Directory_Listing_Gallery.user.js
// ==/UserScript==

(function() {
    'use strict';

    function insertCSS(url) {
        const ele = document.createElement('link');
        ele.type = 'text/css';
        ele.rel = 'stylesheet';
        ele.href = url;
        document.head.appendChild(ele);
    }
    function insertJS(url) {
        const ele = document.createElement('script');
        ele.type = 'text/javascript';
        ele.src = url;
        document.head.appendChild(ele);
    }
    insertCSS('https://fonts.googleapis.com/icon?family=Material+Icons');
    insertCSS('https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css');
    insertJS('https://cdnjs.cloudflare.com/ajax/libs/galleria/1.6.1/galleria.min.js');
    insertCSS('https://cdnjs.cloudflare.com/ajax/libs/galleria/1.5.7/themes/fullscreen/galleria.classic.min.css');

    function createFloatButton() {
        $('body').append(
'<div id="dlg_float_btn" class="fixed-action-btn">\
  <a class="btn-floating btn-large blue">\
    <i class="large material-icons">photo</i>\
  </a><ul></ul></div>');
        $('body').append(
'<div id="dlg_float_btn_exit" class="fixed-action-btn" style="visibility:hidden">\
  <a class="btn-floating btn-small ref">\
    <i class="small material-icons">exit_to_app</i>\
  </a><ul></ul></div>');
    }
    createFloatButton();

    function createGalleria(lst) {
        $('#dlg_main').remove();
        let content = '<div class="galleria" id="dlg_main" style="height:1px; width:1px;">';
        lst.forEach(e => {
            content += `<img src="${e.url}" data-title="${e.name}">`;
        });
        content += '</div>';
        $('body').append(content);
    }
    createGalleria([]);

    var dlg_initialized = false;
    function initGalleria() {
        if (dlg_initialized) return;
        dlg_initialized = true;
        //Galleria.loadTheme('https://cdnjs.cloudflare.com/ajax/libs/galleria/1.6.1/themes/classic/galleria.classic.min.js');
        Galleria.loadTheme('https://cdnjs.cloudflare.com/ajax/libs/galleria/1.6.1/themes/fullscreen/galleria.fullscreen.min.js');
        Galleria.configure ({
            preload: 5,
            autoplay: 0, // will move forward every x milliseconds
            carousel: true, // default is true
            carouselSpeed: 200, // default is 200 milliseconds
            clicknext: false, // default is false
            debug: false, // true is default
            fullscreenCrop: false,
            fullscreenDoubleTap: true, // true is default
            height:0.7,
            imageCrop: false, // false is default
            lightbox: true,
            maxScaleRatio: 1,
            responsive: true,
            showCounter: true,
            showImagenav: true,
            showInfo: true,
            thumbCrop: false,
            thumbnails: 'lazy', // true is default
            transition: 'flash'
        });
    }

    $(document).ready(function(){
        $('#dlg_float_btn').floatingActionButton();
        $('#dlg_float_btn').on("click", () => {
            initGalleria();
            let lst = [];
            $('pre a').each((idx, e) => {
                let fn = e.href.split("/").reverse()[0];
                let pos = fn.lastIndexOf(".");
                if (pos < 0) return;
                let ext = fn.substr(pos + 1);
                let name = fn.substr(0, pos);
                if (['jpg', 'jpeg', 'png', 'bmp'].indexOf(ext.toLowerCase()) >= 0) {
                    lst.push({ image: e.href, title: name });
                }
            });
            Galleria.run('.galleria', { dataSource: lst });
            Galleria.ready(function(options) {
                let gal = this;
                gal.lazyLoadChunks(1);
                $("#dlg_float_btn").attr('style', 'visibility:hidden');
                $("#dlg_float_btn_exit").attr('style', 'visibility:visible; z-index:20000');
                $('#dlg_float_btn_exit').on("click", () => {
                    window.location.reload();
                    $("#dlg_float_btn_exit").attr('style', 'visibility:hidden');
                    $("#dlg_float_btn").attr('style', 'visibility:visible');
                });
            });
        });
        $('#dlg_float_btn_exit').floatingActionButton();
    });
})();
