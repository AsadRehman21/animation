$(document).ready(function () {
    var h, i, o, r;
    function s() {
        (h = $(window).innerHeight()), (i = $(window).innerWidth()), (o = $(".ph-chart").offset().top), (r = $(".testimonial-outer-wrapper").offset().top);
    }
    s(),
        $(window).on("resize", function () {
            s();
        }),
        $(".js-panel-switcher").on("mouseenter", "li button", function (e) {
            var t = $(this).data("trigger");
            $(this).closest(".js-panel-switcher").addClass("mobile-expanded");
            $('.js-callout-circle[data-panel="' + t + '"]').siblings().attr("data-state", "collapsed"),
            $('.js-callout-circle[data-panel="' + t + '"]').attr("data-state", "expanded");
        }),

        $('.js-panel-switcher').on("focusin", "li button", function() {
            $(this).addClass('no-before');
            var t = $(this).data("trigger");
            $(this).closest(".js-panel-switcher").addClass("mobile-expanded");
            $('.js-callout-circle[data-panel="' + t + '"]').siblings().attr("data-state", "collapsed"),
            $('.js-callout-circle[data-panel="' + t + '"]').attr("data-state", "expanded");
        }),

        $(".js-panel-switcher").on("keypress", "li button",function(e) {
            if(e.key === 'Enter') {
                var t = $(this).data("trigger");
                $('.js-callout-circle[data-panel="' + t + '"] .inner .desc').attr({ "role":"alert", "aria-live":"assertive" });
            }
        }),

        $('.js-panel-switcher').on("focusout", "li button", function() {
            if($(this).hasClass('no-before')){
                $(this).removeClass('no-before');
                var t = $(this).data("trigger");
                $('.js-callout-circle[data-panel="' + t + '"] .inner .desc').removeAttr('role aria-live');
            }
        }),

        $(".js-exit-panel").on("click", function (t) {
            t.preventDefault(), $(this).closest(".js-panel-switcher").removeClass("mobile-expanded"), $(".js-callout-circle").attr("data-state", "collapsed");
        }),
        $(".suspicious-six").on("mousemove", function (t) {
            i > 769 && e(t, ".magnifying-glass", this, 200);
        }),
        $(".testimonial-images").on("mousemove", function (t) {
            i > 769 && (e(t, ".image-parallax-1", this, 50), e(t, ".image-parallax-2", this, 80), e(t, ".image-parallax-3", this, 100), e(t, ".image-parallax-4", this, 50));
        });
    function e(t, n, u, p) {
        var a = $(u),
            w = t.pageX - a.offset().left,
            g = t.pageY - a.offset().top;
        TweenMax.to(n, 1, { x: ((w - a.width() / 2) / a.width()) * p, y: ((g - a.height() / 2) / a.height()) * p });
    }
    var f = $(".ph-chart"),
        c = $(".testimonial-outer-wrapper"),
        l = !1,
        d = !1;
    $(window).on("scroll", function () {
        if (i < 769) {
            var t = $(window).scrollTop() + $(window).innerHeight() * 0.6;
            if (!l && t > o) {
                var n = f.innerWidth() / 1.5;
                l = !0;
            }
            if (!d && t > r) {
                var n = c.innerWidth();
                d = !0;
            }
        }
    });
});
//# sourceMappingURL=/s/files/1/0209/8446/t/220/assets/we-believe.js.map?v=8761762961862739093