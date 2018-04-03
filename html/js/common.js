// radio plugin
$.fn.radios = function(options){
    var defaults = {
        checkedClass: 'checked'
    };
    var opts = $.extend(defaults, options);
    return this.each(function(){
        var el = $(this),
            radioGroup = {};

        radioGroup[el.attr('name')] = el.attr('name');

        for(var i in radioGroup){
            $('input[name="'+ radioGroup[i] +'"]').each(function(){
                if($(this).is(":checked")){
                    $(this).parent().addClass(opts.checkedClass);
                }
                $(this).parent().click(function(){
                    $(this).addClass(opts.checkedClass).find('input:radio').attr('checked',true).end().siblings().removeClass(opts.checkedClass);
                    // $(this).addClass(opts.checkedClass).find('input:radio').attr('checked',true).end().parent().siblings().find("label").removeClass(opts.checkedClass);
                });
            });
        }
        // debugger;

    });
};
// checkbox plugin
$.fn.checkbox = function(options){
    var defaults = {
        checkedClass: 'checked'
    };
    var opts = $.extend(defaults, options);
    return this.each(function(){
        var el = $(this);
        var init = function(){
            var $checker = el.find(':checkbox');
            if($checker.is(':disabled')){
                el.addClass('disabled');
            }else{
                el.removeClass('disabled');
            }
            el.click(function(e){
                var isChecked = $checker.is(":checked");
                if(el.parents(".list").hasClass("form-checkbox")){
                    if (isChecked) {
                        $checker.attr("checked", "checked");
                        el.parents("li").addClass("checked").parents('.module-bild-text').removeClass('error');
                    } else {
                        $checker.removeAttr("checked");
                        el.parents("li").removeClass("checked");
                    }

                }else {
                    if ($checker.prop) {
                        $checker.prop("checked", isChecked);
                    } else {
                        if (isChecked) {
                            $checker.attr("checked", "checked");
                        } else {
                            $checker.removeAttr("checked");
                        }
                    }
                    if (isChecked) {
                        el.addClass(opts.checkedClass);
                    } else {
                        el.removeClass(opts.checkedClass);
                    }
                }
            });
        };
        init();
    });
};

var App = function() {
    // image slider
    var imageSlider = function() {
        $(".image-slider").bxSlider({
            auto: true,
            speed:1000,
            pause:4000,
            stopAutoOnClick:true,
            controls:false
        });
        // $(".image-slider2").bxSlider({
        //     auto: false,
        //     stopAutoOnClick:true,
        //     controls:true,
        //     pager: false
        // });

    };

    // checkbox and radio
    var Switch = function () {
        $(".radio").radios();
        $(".checkbox").checkbox();
    };

    var handleFancybox = function () {
        $(".fancy-box").css({"opacity":"1"})
        $(".fancy-box").css({"display":"none","opacity":"1"})
        var total = $(".image-slider2>li").length
        $(".image-slider2>li").each(
            function () {
                $(this).find(".pagination").html('<span>'+($(this).index()+1)+'</span>/<span>'+total+'</span>')
            }
        )
       //  var teaserL= $(this).parent().parent().index(".statistics");
       //  for(i=0;i<teaserL;i++){
       //      fancyB += $(".statistics").eq(i).find(".col-md-6").length;
       //  }
       //  num = fancyB+ $(this).parent().index();
       //  console.log(num)
       //
       //  $(".off").click(function () {
       //     $(".fancy-box").fadeOut();
       //      slider.destroySlider();
       // });

       $(".teaser-box").click(function(){
           $(".fancy-box").fadeIn();
           var fancyBL = 0;
           var teaserL= $(this).parent().parent().index(".statistics");
           for(i=0;i<teaserL;i++){
               fancyBL += $(".statistics").eq(i).find(".col-md-6").length;
           }
           num = fancyBL+ $(this).parent().index();
           slider = $(".image-slider2").bxSlider({
               pager:true,
               pagerType:'short',
               startSlide:num,
               auto: false,
               touchEnabled:false
               // stopAutoOnClick:true,
               // controls:true,
           });
           // if ($(window).width() < 991){
           //     $(".bx-viewport").unbind();
           //
           //     if(!! $(".fancy-box").length){
           //         var myTouchx = util.toucher(document.getElementById('xxx'));
           //         myTouchx.on('swipeLeft',function(){
           //             $('.fancy-box .bx-next').click();
           //             return false;
           //         }).on('swipeRight',function(){
           //             $('.fancy-box .bx-prev').click();
           //             return false;
           //         });
           //     }
           // }
       })
    };


    var rings = function () {
        var ctx = c6.getContext('2d');
        ctx.lineWidth = 2;
        ctx.textBaseline = 'top';

        var deg = 0;
        var timer = setInterval(function(){
            ctx.clearRect(0,0, 96, 96);
            ctx.beginPath();
            ctx.arc(48,48, 47, 0, 2*Math.PI);
            ctx.strokeStyle = '#fff';
            ctx.stroke();

            ctx.beginPath();
            deg += 3;
            ctx.arc(48, 48, 47, 0-Math.PI/2, deg*Math.PI/180-Math.PI/2);
            ctx.strokeStyle = '#99C9BE';
            ctx.stroke();
            if(deg>=360){
                clearInterval(timer);
                ctx.clearRect(0,0, 96, 96);
                $('.success-icon').delay(600).show(0);
            }
        },4);

        // (function(){
        //     $('.success-icon').delay(1100).show(0);
        // })();
    };

    var xxx = function () {

        if ($(window).width() < 991){
            if(!! $("#xxx").length){
                var myTouchx = util.toucher(document.getElementById('xxx'));
                myTouchx.on('swipeLeft',function(){
                    $('#xxx .bx-prev').click();
                    return false;
                }).on('swipeRight',function(){
                    $('#xxx .bx-next').click();
                    return false;
                });
            }
        }
    };

    // var i = function () {
    //     $("div.radio").find("label").addClass('radio')
    //     $("div.radio").find("label").find("input").after('<i class="round-icon"></i>');
    //     $("div.radio").removeClass("radio")
    // }

    return {
        init:function () {
            imageSlider();
            Switch();
            handleFancybox();
            // rings();
        },
    }
}();

window.onload = function () {

}

jQuery(document).ready(function() {
    App.init();
});