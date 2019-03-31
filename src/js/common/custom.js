$(function(){
  var SLIDERS = {};
  var DOM = {
    datepicker: '[data-datepicker]',
    select: '[data-select]',
    inputmask: '[data-inputmask]',
    sliders: '[data-swiper]',
    tabs: '[data-tabs]',
    copyForMobile: '[data-copy-container]'
  }

  var Plugins = {};

  Plugins.copyForMobile = function(el){
    var elements = el.find('[data-copy]'),
        target = el.find('[data-copy-in]');
    elements.each(function(){
      var $this = $(this),
          wrapper = $('<div/>', {class: 'copy-element copy-element_'+$this.data('copy')}),
          insertPlace = target.find('.copy-' + $this.data('copy')),
          newEl = wrapper.append($this.clone());
        insertPlace.replaceWith(newEl);
    });
  }

  Plugins.inputmask = function(el){
    var mask = el.data('inputmask');
    el.mask(mask);
  }

  Plugins.datepicker = function(el){
    el.datepicker();
  }

  Plugins.select = function(el){
    el.select2();
  }

  Plugins.tabs = function(el){
    var nav = el.find('[data-tabs-nav]'),
        content = el.find('[data-tabs-content]');
    nav.children().click(function(){
      $(this).addClass('active').siblings().removeClass('active');
      var items = content.children(),
          activeItem = items.eq($(this).index());
      items.removeClass('active');
      activeItem.addClass('active');
      if(activeItem.find('[data-swiper]').length){
        var swiper = activeItem.find('[data-swiper]')[0].swiper;
        swiper.update();
      }
    }).eq(0).click();
  }

  Plugins.sliders = function(el){
    var swiperName = el.data('swiper');
    var slidesProps = {
      'additionals':{
        slidesPerView: 4,
        spaceBetween: 35,
        navigation: {
          nextEl: '.swiper-nav__next',
          prevEl: '.swiper-nav__prev'
        },
        breakpoints:{
          991:{
            slidesPerView: 2
          }
        }
      },
      'home':{
        slidesPerView: 1,
        loop: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        autoplay: {
          delay: 5000
        }
      },
      /* 
      li.reviews-authors__item.reviews-authors__item_active
        .author: img(src="img/author.jpg", alt="Джек Воробей")
      */
      'reviews-pagination':{
        slidesPerView:6,
        spaceBetween: 23,
        breakpoints: {
          991:{
            slidesPerView: 3
          },
          575:{
            slidesPerView: 3,
            spaceBetween: 10
          }
        },
        on: {
          tap: function(el, i){
            var activeClass = 'reviews-authors__item_active';
            $('.reviews-authors__item').removeClass(activeClass);
            this.slides.eq(this.clickedIndex).find('.reviews-authors__item').addClass(activeClass);

            SLIDERS['home-reviews'].slideTo(this.clickedIndex);
            this.slideTo(this.clickedIndex);
          }
        }
      },
      'home-reviews':{
        on: {
          transitionEnd: function(){
            var authorsSlider = $('.reviews-authors')[0].swiper,
                reviewActiveClass = 'reviews-authors__item_active';
            console.log(authorsSlider.slides)
            authorsSlider.slides.find('.reviews-authors__item').removeClass(reviewActiveClass);
            authorsSlider.slides.eq(this.realIndex).find('.reviews-authors__item').addClass(reviewActiveClass);
            authorsSlider.slideTo(this.realIndex);
          }
        }
      }
    }
    var slider = new Swiper(el, slidesProps[swiperName]);
    SLIDERS[swiperName] = slider;
  }

  Plugins.init = function(el, plugin){
    $(el).each(function(){
      Plugins[plugin]($(this));
    });
  };

  Plugins.init(DOM.inputmask, 'inputmask');
  Plugins.init(DOM.select, 'select');
  Plugins.init(DOM.datepicker, 'datepicker');
  Plugins.init(DOM.sliders, 'sliders');
  Plugins.init(DOM.copyForMobile, 'copyForMobile');
  Plugins.init(DOM.tabs, 'tabs');


  /*-- END: mobile nav --*/


  /*-- START: mobile nav --*/
  var MOBILE_NAV = (function () {
    var mobileNavClass = 'mobile-nav';
    var menus = [
      '.header__nav',
      '.header-menu > ul'
    ];
    var additionalBlocks = [
      '.footer-contacts',
      '.header-contacts__callback',
      '.social'
    ];
    var cnt = $('<div/>');
    var additionalWrapper = $('<div/>', {class: 'mobile-nav__additionals'});

    for (var i = 0; i < menus.length; i++) {
      if ($(menus[i]).length) {
        var section = $('<div/>').addClass(mobileNavClass + '__section ' + mobileNavClass + '__section_' + i);
        section.append(getItems(menus[i]));
        cnt.append(section);
      }
    }

    for (var j = 0; j < additionalBlocks.length; j++) {
      if ($(additionalBlocks[j]).length) {
        var section = $('<div/>').addClass(mobileNavClass + '__section ' + mobileNavClass + '__section_add' + j);
        section.append($(additionalBlocks[j]).clone());
        additionalWrapper.append(section);
      }
    }
    
    cnt.append(additionalWrapper);
    cnt.wrapInner($('<div/>',{class:'container'}));
    cnt.addClass(mobileNavClass);

    $('body').append(cnt);
    $(cnt).css('top', $('.header').outerHeight());
    $(cnt).css('height', $(window).innerHeight() - $('.header').outerHeight());
    $(window).resize(function(){
      $(cnt).css('top', $('.header').outerHeight());
      $(cnt).css('height', $(window).innerHeight() - $('.header').outerHeight());
    });

    $('.mobile-nav-btn').click(function(){
      $(this).toggleClass('active');
      $('.mobile-nav').slideToggle();
    });

    $('.header-mobile-wrap').click(function () {
      $('.' + mobileNavClass).toggleClass('active');
      $(this).toggleClass('active');
    });

    function getItems(selector) {
      var clone = $(selector).clone();
      return clearClasses(clone);
    }

    function clearClasses(element) {
      var depth = 0;
      $(element).removeClass().addClass(mobileNavClass + '__list');
      clear($(element).children());

      function clear(childrens) {
        depth++;
        $(childrens).removeClass();
        $(childrens).each(function () {
          var $this = $(this);
          if ($this.is(':empty')) $(this).remove();
          if ($this.is('li')) $(this).addClass(mobileNavClass + '__item');
          if ($this.is('a')) $(this).addClass(mobileNavClass + '__link');
          if ($this.is('ul') && depth > 0) {
            var dropdownBtn = $('<button/>').addClass(mobileNavClass + '__dropdown-toggler');
            var parentLi = $(this).closest('li');
            dropdownBtn.click(function () {
              $this.toggleClass('active');
            });
            parentLi.append(dropdownBtn);

            $(this).addClass(mobileNavClass + '__dropdown');
            $(parentLi).addClass(mobileNavClass + '__parent');
          };
        });
        if ($(childrens).children().length) clear($(childrens).children());
      }
      return element;
    }
  }());

/*-- END: mobile nav --*/
});