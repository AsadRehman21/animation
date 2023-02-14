(function (i, c, o, h) {
    function n(t, e) {
        (this.settings = null),
            (this.options = i.extend({}, n.Defaults, e)),
            (this.$element = i(t)),
            (this._handlers = {}),
            (this._plugins = {}),
            (this._supress = {}),
            (this._current = null),
            (this._speed = null),
            (this._coordinates = []),
            (this._breakpoint = null),
            (this._width = null),
            (this._items = []),
            (this._clones = []),
            (this._mergers = []),
            (this._widths = []),
            (this._invalidated = {}),
            (this._pipe = []),
            (this._drag = { time: null, target: null, pointer: null, stage: { start: null, current: null }, direction: null }),
            (this._states = { current: {}, tags: { initializing: ["busy"], animating: ["busy"], dragging: ["interacting"] } }),
            i.each(
                ["onResize", "onThrottledResize"],
                i.proxy(function (s, r) {
                    this._handlers[r] = i.proxy(this[r], this);
                }, this)
            ),
            i.each(
                n.Plugins,
                i.proxy(function (s, r) {
                    this._plugins[s.charAt(0).toLowerCase() + s.slice(1)] = new r(this);
                }, this)
            ),
            i.each(
                n.Workers,
                i.proxy(function (s, r) {
                    this._pipe.push({ filter: r.filter, run: i.proxy(r.run, this) });
                }, this)
            ),
            this.setup(),
            this.initialize();
    }
    (n.Defaults = {
        items: 3,
        loop: !1,
        center: !1,
        rewind: !1,
        checkVisibility: !0,
        mouseDrag: !0,
        touchDrag: !0,
        pullDrag: !0,
        freeDrag: !1,
        margin: 0,
        stagePadding: 0,
        merge: !1,
        mergeFit: !0,
        autoWidth: !1,
        startPosition: 0,
        rtl: !1,
        smartSpeed: 250,
        fluidSpeed: !1,
        dragEndSpeed: !1,
        responsive: {},
        responsiveRefreshRate: 200,
        responsiveBaseElement: c,
        fallbackEasing: "swing",
        slideTransition: "",
        info: !1,
        nestedItemSelector: !1,
        itemElement: "div",
        stageElement: "div",
        refreshClass: "owl-refresh",
        loadedClass: "owl-loaded",
        loadingClass: "owl-loading",
        rtlClass: "owl-rtl",
        responsiveClass: "owl-responsive",
        dragClass: "owl-drag",
        itemClass: "owl-item",
        stageClass: "owl-stage",
        stageOuterClass: "owl-stage-outer",
        grabClass: "owl-grab",
    }),
        (n.Width = { Default: "default", Inner: "inner", Outer: "outer" }),
        (n.Type = { Event: "event", State: "state" }),
        (n.Plugins = {}),
        (n.Workers = [
            {
                filter: ["width", "settings"],
                run: function () {
                    this._width = this.$element.width();
                },
            },
            {
                filter: ["width", "items", "settings"],
                run: function (t) {
                    t.current = this._items && this._items[this.relative(this._current)];
                },
            },
            {
                filter: ["items", "settings"],
                run: function () {
                    this.$stage.children(".cloned").remove();
                },
            },
            {
                filter: ["width", "items", "settings"],
                run: function (t) {
                    var e = this.settings.margin || "",
                        s = !this.settings.autoWidth,
                        r = this.settings.rtl,
                        a = { width: "auto", "margin-left": r ? e : "", "margin-right": r ? "" : e };
                    !s && this.$stage.children().css(a), (t.css = a);
                },
            },
            {
                filter: ["width", "items", "settings"],
                run: function (t) {
                    var e = (this.width() / this.settings.items).toFixed(3) - this.settings.margin,
                        s = null,
                        r = this._items.length,
                        a = !this.settings.autoWidth,
                        l = [];
                    for (t.items = { merge: !1, width: e }; r--; )
                        (s = this._mergers[r]), (s = (this.settings.mergeFit && Math.min(s, this.settings.items)) || s), (t.items.merge = s > 1 || t.items.merge), (l[r] = a ? e * s : this._items[r].width());
                    this._widths = l;
                },
            },
            {
                filter: ["items", "settings"],
                run: function () {
                    var t = [],
                        e = this._items,
                        s = this.settings,
                        r = Math.max(2 * s.items, 4),
                        a = 2 * Math.ceil(e.length / 2),
                        l = s.loop && e.length ? (s.rewind ? r : Math.max(r, a)) : 0,
                        d = "",
                        p = "";
                    for (l /= 2; l > 0; ) t.push(this.normalize(t.length / 2, !0)), (d += e[t[t.length - 1]][0].outerHTML), t.push(this.normalize(e.length - 1 - (t.length - 1) / 2, !0)), (p = e[t[t.length - 1]][0].outerHTML + p), (l -= 1);
                    (this._clones = t), i(d).addClass("cloned").appendTo(this.$stage), i(p).addClass("cloned").prependTo(this.$stage);
                },
            },
            {
                filter: ["width", "items", "settings"],
                run: function () {
                    for (var t = this.settings.rtl ? 1 : -1, e = this._clones.length + this._items.length, s = -1, r = 0, a = 0, l = []; ++s < e; )
                        (r = l[s - 1] || 0), (a = this._widths[this.relative(s)] + this.settings.margin), l.push(r + a * t);
                    this._coordinates = l;
                },
            },
            {
                filter: ["width", "items", "settings"],
                run: function () {
                    var t = this.settings.stagePadding,
                        e = this._coordinates,
                        s = { width: Math.ceil(Math.abs(e[e.length - 1])) + 2 * t, "padding-left": t || "", "padding-right": t || "" };
                    this.$stage.css(s);
                },
            },
            {
                filter: ["width", "items", "settings"],
                run: function (t) {
                    var e = this._coordinates.length,
                        s = !this.settings.autoWidth,
                        r = this.$stage.children();
                    if (s && t.items.merge) for (; e--; ) (t.css.width = this._widths[this.relative(e)]), r.eq(e).css(t.css);
                    else s && ((t.css.width = t.items.width), r.css(t.css));
                },
            },
            {
                filter: ["items"],
                run: function () {
                    this._coordinates.length < 1 && this.$stage.removeAttr("style");
                },
            },
            {
                filter: ["width", "items", "settings"],
                run: function (t) {
                    (t.current = t.current ? this.$stage.children().index(t.current) : 0), (t.current = Math.max(this.minimum(), Math.min(this.maximum(), t.current))), this.reset(t.current);
                },
            },
            {
                filter: ["position"],
                run: function () {
                    this.animate(this.coordinates(this._current));
                },
            },
            {
                filter: ["width", "position", "items", "settings"],
                run: function () {
                    var t,
                        e,
                        s,
                        r,
                        a = this.settings.rtl ? 1 : -1,
                        l = 2 * this.settings.stagePadding,
                        d = this.coordinates(this.current()) + l,
                        p = d + this.width() * a,
                        u = [];
                    for (s = 0, r = this._coordinates.length; s < r; s++)
                        (t = this._coordinates[s - 1] || 0), (e = Math.abs(this._coordinates[s]) + l * a), ((this.op(t, "<=", d) && this.op(t, ">", p)) || (this.op(e, "<", d) && this.op(e, ">", p))) && u.push(s);
                    this.$stage.children(".active").removeClass("active"),
                        this.$stage.children(":eq(" + u.join("), :eq(") + ")").addClass("active"),
                        this.$stage.children(".center").removeClass("center"),
                        this.settings.center && this.$stage.children().eq(this.current()).addClass("center");
                },
            },
        ]),
        (n.prototype.initializeStage = function () {
            (this.$stage = this.$element.find("." + this.settings.stageClass)),
                this.$stage.length ||
                    (this.$element.addClass(this.options.loadingClass),
                    (this.$stage = i("<" + this.settings.stageElement + ">", { class: this.settings.stageClass }).wrap(i("<div/>", { class: this.settings.stageOuterClass }))),
                    this.$element.append(this.$stage.parent()));
        }),
        (n.prototype.initializeItems = function () {
            var t = this.$element.find(".owl-item");
            if (t.length)
                return (
                    (this._items = t.get().map(function (e) {
                        return i(e);
                    })),
                    (this._mergers = this._items.map(function () {
                        return 1;
                    })),
                    void this.refresh()
                );
            this.replace(this.$element.children().not(this.$stage.parent())), this.isVisible() ? this.refresh() : this.invalidate("width"), this.$element.removeClass(this.options.loadingClass).addClass(this.options.loadedClass);
        }),
        (n.prototype.initialize = function () {
            if ((this.enter("initializing"), this.trigger("initialize"), this.$element.toggleClass(this.settings.rtlClass, this.settings.rtl), this.settings.autoWidth && !this.is("pre-loading"))) {
                var t, e, s;
                (t = this.$element.find("img")), (e = this.settings.nestedItemSelector ? "." + this.settings.nestedItemSelector : h), (s = this.$element.children(e).width()), t.length && s <= 0 && this.preloadAutoWidthImages(t);
            }
            this.initializeStage(), this.initializeItems(), this.registerEventHandlers(), this.leave("initializing"), this.trigger("initialized");
        }),
        (n.prototype.isVisible = function () {
            return !this.settings.checkVisibility || this.$element.is(":visible");
        }),
        (n.prototype.setup = function () {
            var t = this.viewport(),
                e = this.options.responsive,
                s = -1,
                r = null;
            e
                ? (i.each(e, function (a) {
                      a <= t && a > s && (s = Number(a));
                  }),
                  (r = i.extend({}, this.options, e[s])),
                  typeof r.stagePadding == "function" && (r.stagePadding = r.stagePadding()),
                  delete r.responsive,
                  r.responsiveClass && this.$element.attr("class", this.$element.attr("class").replace(new RegExp("(" + this.options.responsiveClass + "-)\\S+\\s", "g"), "$1" + s)))
                : (r = i.extend({}, this.options)),
                this.trigger("change", { property: { name: "settings", value: r } }),
                (this._breakpoint = s),
                (this.settings = r),
                this.invalidate("settings"),
                this.trigger("changed", { property: { name: "settings", value: this.settings } });
        }),
        (n.prototype.optionsLogic = function () {
            this.settings.autoWidth && ((this.settings.stagePadding = !1), (this.settings.merge = !1));
        }),
        (n.prototype.prepare = function (t) {
            var e = this.trigger("prepare", { content: t });
            return (
                e.data ||
                    (e.data = i("<" + this.settings.itemElement + "/>")
                        .addClass(this.options.itemClass)
                        .append(t)),
                this.trigger("prepared", { content: e.data }),
                e.data
            );
        }),
        (n.prototype.update = function () {
            for (
                var t = 0,
                    e = this._pipe.length,
                    s = i.proxy(function (a) {
                        return this[a];
                    }, this._invalidated),
                    r = {};
                t < e;

            )
                (this._invalidated.all || i.grep(this._pipe[t].filter, s).length > 0) && this._pipe[t].run(r), t++;
            (this._invalidated = {}), !this.is("valid") && this.enter("valid");
        }),
        (n.prototype.width = function (t) {
            switch ((t = t || n.Width.Default)) {
                case n.Width.Inner:
                case n.Width.Outer:
                    return this._width;
                default:
                    return this._width - 2 * this.settings.stagePadding + this.settings.margin;
            }
        }),
        (n.prototype.refresh = function () {
            this.enter("refreshing"),
                this.trigger("refresh"),
                this.setup(),
                this.optionsLogic(),
                this.$element.addClass(this.options.refreshClass),
                this.update(),
                this.$element.removeClass(this.options.refreshClass),
                this.leave("refreshing"),
                this.trigger("refreshed");
        }),
        (n.prototype.onThrottledResize = function () {
            c.clearTimeout(this.resizeTimer), (this.resizeTimer = c.setTimeout(this._handlers.onResize, this.settings.responsiveRefreshRate));
        }),
        (n.prototype.onResize = function () {
            return (
                !!this._items.length &&
                this._width !== this.$element.width() &&
                !!this.isVisible() &&
                (this.enter("resizing"), this.trigger("resize").isDefaultPrevented() ? (this.leave("resizing"), !1) : (this.invalidate("width"), this.refresh(), this.leave("resizing"), void this.trigger("resized")))
            );
        }),
        (n.prototype.registerEventHandlers = function () {
            i.support.transition && this.$stage.on(i.support.transition.end + ".owl.core", i.proxy(this.onTransitionEnd, this)),
                this.settings.responsive !== !1 && this.on(c, "resize", this._handlers.onThrottledResize),
                this.settings.mouseDrag &&
                    (this.$element.addClass(this.options.dragClass),
                    this.$stage.on("mousedown.owl.core", i.proxy(this.onDragStart, this)),
                    this.$stage.on("dragstart.owl.core selectstart.owl.core", function () {
                        return !1;
                    })),
                this.settings.touchDrag && (this.$stage.on("touchstart.owl.core", i.proxy(this.onDragStart, this)), this.$stage.on("touchcancel.owl.core", i.proxy(this.onDragEnd, this)));
        }),
        (n.prototype.onDragStart = function (t) {
            var e = null;
            t.which !== 3 &&
                (i.support.transform
                    ? ((e = this.$stage
                          .css("transform")
                          .replace(/.*\(|\)| /g, "")
                          .split(",")),
                      (e = { x: e[e.length === 16 ? 12 : 4], y: e[e.length === 16 ? 13 : 5] }))
                    : ((e = this.$stage.position()), (e = { x: this.settings.rtl ? e.left + this.$stage.width() - this.width() + this.settings.margin : e.left, y: e.top })),
                this.is("animating") && (i.support.transform ? this.animate(e.x) : this.$stage.stop(), this.invalidate("position")),
                this.$element.toggleClass(this.options.grabClass, t.type === "mousedown"),
                this.speed(0),
                (this._drag.time = new Date().getTime()),
                (this._drag.target = i(t.target)),
                (this._drag.stage.start = e),
                (this._drag.stage.current = e),
                (this._drag.pointer = this.pointer(t)),
                i(o).on("mouseup.owl.core touchend.owl.core", i.proxy(this.onDragEnd, this)),
                i(o).one(
                    "mousemove.owl.core touchmove.owl.core",
                    i.proxy(function (s) {
                        var r = this.difference(this._drag.pointer, this.pointer(s));
                        i(o).on("mousemove.owl.core touchmove.owl.core", i.proxy(this.onDragMove, this)), (Math.abs(r.x) < Math.abs(r.y) && this.is("valid")) || (s.preventDefault(), this.enter("dragging"), this.trigger("drag"));
                    }, this)
                ));
        }),
        (n.prototype.onDragMove = function (t) {
            var e = null,
                s = null,
                r = null,
                a = this.difference(this._drag.pointer, this.pointer(t)),
                l = this.difference(this._drag.stage.start, a);
            this.is("dragging") &&
                (t.preventDefault(),
                this.settings.loop
                    ? ((e = this.coordinates(this.minimum())), (s = this.coordinates(this.maximum() + 1) - e), (l.x = ((((l.x - e) % s) + s) % s) + e))
                    : ((e = this.settings.rtl ? this.coordinates(this.maximum()) : this.coordinates(this.minimum())),
                      (s = this.settings.rtl ? this.coordinates(this.minimum()) : this.coordinates(this.maximum())),
                      (r = this.settings.pullDrag ? (-1 * a.x) / 5 : 0),
                      (l.x = Math.max(Math.min(l.x, e + r), s + r))),
                (this._drag.stage.current = l),
                this.animate(l.x));
        }),
        (n.prototype.onDragEnd = function (t) {
            var e = this.difference(this._drag.pointer, this.pointer(t)),
                s = this._drag.stage.current,
                r = (e.x > 0) ^ this.settings.rtl ? "left" : "right";
            i(o).off(".owl.core"),
                this.$element.removeClass(this.options.grabClass),
                ((e.x !== 0 && this.is("dragging")) || !this.is("valid")) &&
                    (this.speed(this.settings.dragEndSpeed || this.settings.smartSpeed),
                    this.current(this.closest(s.x, e.x !== 0 ? r : this._drag.direction)),
                    this.invalidate("position"),
                    this.update(),
                    (this._drag.direction = r),
                    (Math.abs(e.x) > 3 || new Date().getTime() - this._drag.time > 300) &&
                        this._drag.target.one("click.owl.core", function () {
                            return !1;
                        })),
                this.is("dragging") && (this.leave("dragging"), this.trigger("dragged"));
        }),
        (n.prototype.closest = function (t, e) {
            var s = -1,
                r = 30,
                a = this.width(),
                l = this.coordinates();
            return (
                this.settings.freeDrag ||
                    i.each(
                        l,
                        i.proxy(function (d, p) {
                            return (
                                e === "left" && t > p - r && t < p + r
                                    ? (s = d)
                                    : e === "right" && t > p - a - r && t < p - a + r
                                    ? (s = d + 1)
                                    : this.op(t, "<", p) && this.op(t, ">", l[d + 1] !== h ? l[d + 1] : p - a) && (s = e === "left" ? d + 1 : d),
                                s === -1
                            );
                        }, this)
                    ),
                this.settings.loop || (this.op(t, ">", l[this.minimum()]) ? (s = t = this.minimum()) : this.op(t, "<", l[this.maximum()]) && (s = t = this.maximum())),
                s
            );
        }),
        (n.prototype.animate = function (t) {
            var e = this.speed() > 0;
            this.is("animating") && this.onTransitionEnd(),
                e && (this.enter("animating"), this.trigger("translate")),
                i.support.transform3d && i.support.transition
                    ? this.$stage.css({ transform: "translate3d(" + t + "px,0px,0px)", transition: this.speed() / 1e3 + "s" + (this.settings.slideTransition ? " " + this.settings.slideTransition : "") })
                    : e
                    ? this.$stage.animate({ left: t + "px" }, this.speed(), this.settings.fallbackEasing, i.proxy(this.onTransitionEnd, this))
                    : this.$stage.css({ left: t + "px" });
        }),
        (n.prototype.is = function (t) {
            return this._states.current[t] && this._states.current[t] > 0;
        }),
        (n.prototype.current = function (t) {
            if (t === h) return this._current;
            if (this._items.length === 0) return h;
            if (((t = this.normalize(t)), this._current !== t)) {
                var e = this.trigger("change", { property: { name: "position", value: t } });
                e.data !== h && (t = this.normalize(e.data)), (this._current = t), this.invalidate("position"), this.trigger("changed", { property: { name: "position", value: this._current } });
            }
            return this._current;
        }),
        (n.prototype.invalidate = function (t) {
            return (
                i.type(t) === "string" && ((this._invalidated[t] = !0), this.is("valid") && this.leave("valid")),
                i.map(this._invalidated, function (e, s) {
                    return s;
                })
            );
        }),
        (n.prototype.reset = function (t) {
            (t = this.normalize(t)) !== h && ((this._speed = 0), (this._current = t), this.suppress(["translate", "translated"]), this.animate(this.coordinates(t)), this.release(["translate", "translated"]));
        }),
        (n.prototype.normalize = function (t, e) {
            var s = this._items.length,
                r = e ? 0 : this._clones.length;
            return !this.isNumeric(t) || s < 1 ? (t = h) : (t < 0 || t >= s + r) && (t = ((((t - r / 2) % s) + s) % s) + r / 2), t;
        }),
        (n.prototype.relative = function (t) {
            return (t -= this._clones.length / 2), this.normalize(t, !0);
        }),
        (n.prototype.maximum = function (t) {
            var e,
                s,
                r,
                a = this.settings,
                l = this._coordinates.length;
            if (a.loop) l = this._clones.length / 2 + this._items.length - 1;
            else if (a.autoWidth || a.merge) {
                if ((e = this._items.length)) for (s = this._items[--e].width(), r = this.$element.width(); e-- && !((s += this._items[e].width() + this.settings.margin) > r); );
                l = e + 1;
            } else l = a.center ? this._items.length - 1 : this._items.length - a.items;
            return t && (l -= this._clones.length / 2), Math.max(l, 0);
        }),
        (n.prototype.minimum = function (t) {
            return t ? 0 : this._clones.length / 2;
        }),
        (n.prototype.items = function (t) {
            return t === h ? this._items.slice() : ((t = this.normalize(t, !0)), this._items[t]);
        }),
        (n.prototype.mergers = function (t) {
            return t === h ? this._mergers.slice() : ((t = this.normalize(t, !0)), this._mergers[t]);
        }),
        (n.prototype.clones = function (t) {
            var e = this._clones.length / 2,
                s = e + this._items.length,
                r = function (a) {
                    return a % 2 == 0 ? s + a / 2 : e - (a + 1) / 2;
                };
            return t === h
                ? i.map(this._clones, function (a, l) {
                      return r(l);
                  })
                : i.map(this._clones, function (a, l) {
                      return a === t ? r(l) : null;
                  });
        }),
        (n.prototype.speed = function (t) {
            return t !== h && (this._speed = t), this._speed;
        }),
        (n.prototype.coordinates = function (t) {
            var e,
                s = 1,
                r = t - 1;
            return t === h
                ? i.map(
                      this._coordinates,
                      i.proxy(function (a, l) {
                          return this.coordinates(l);
                      }, this)
                  )
                : (this.settings.center ? (this.settings.rtl && ((s = -1), (r = t + 1)), (e = this._coordinates[t]), (e += ((this.width() - e + (this._coordinates[r] || 0)) / 2) * s)) : (e = this._coordinates[r] || 0), (e = Math.ceil(e)));
        }),
        (n.prototype.duration = function (t, e, s) {
            return s === 0 ? 0 : Math.min(Math.max(Math.abs(e - t), 1), 6) * Math.abs(s || this.settings.smartSpeed);
        }),
        (n.prototype.to = function (t, e) {
            var s = this.current(),
                r = null,
                a = t - this.relative(s),
                l = (a > 0) - (a < 0),
                d = this._items.length,
                p = this.minimum(),
                u = this.maximum();
            this.settings.loop
                ? (!this.settings.rewind && Math.abs(a) > d / 2 && (a += -1 * l * d), (t = s + a), (r = ((((t - p) % d) + d) % d) + p) !== t && r - a <= u && r - a > 0 && ((s = r - a), (t = r), this.reset(s)))
                : this.settings.rewind
                ? ((u += 1), (t = ((t % u) + u) % u))
                : (t = Math.max(p, Math.min(u, t))),
                this.speed(this.duration(s, t, e)),
                this.current(t),
                this.isVisible() && this.update();
        }),
        (n.prototype.next = function (t) {
            (t = t || !1), this.to(this.relative(this.current()) + 1, t);
        }),
        (n.prototype.prev = function (t) {
            (t = t || !1), this.to(this.relative(this.current()) - 1, t);
        }),
        (n.prototype.onTransitionEnd = function (t) {
            if (t !== h && (t.stopPropagation(), (t.target || t.srcElement || t.originalTarget) !== this.$stage.get(0))) return !1;
            this.leave("animating"), this.trigger("translated");
        }),
        (n.prototype.viewport = function () {
            var t;
            return (
                this.options.responsiveBaseElement !== c
                    ? (t = i(this.options.responsiveBaseElement).width())
                    : c.innerWidth
                    ? (t = c.innerWidth)
                    : o.documentElement && o.documentElement.clientWidth
                    ? (t = o.documentElement.clientWidth)
                    : console.warn("Can not detect viewport width."),
                t
            );
        }),
        (n.prototype.replace = function (t) {
            this.$stage.empty(),
                (this._items = []),
                t && (t = t instanceof jQuery ? t : i(t)),
                this.settings.nestedItemSelector && (t = t.find("." + this.settings.nestedItemSelector)),
                t
                    .filter(function () {
                        return this.nodeType === 1;
                    })
                    .each(
                        i.proxy(function (e, s) {
                            (s = this.prepare(s)), this.$stage.append(s), this._items.push(s), this._mergers.push(1 * s.find("[data-merge]").addBack("[data-merge]").attr("data-merge") || 1);
                        }, this)
                    ),
                this.reset(this.isNumeric(this.settings.startPosition) ? this.settings.startPosition : 0),
                this.invalidate("items");
        }),
        (n.prototype.add = function (t, e) {
            var s = this.relative(this._current);
            (e = e === h ? this._items.length : this.normalize(e, !0)),
                (t = t instanceof jQuery ? t : i(t)),
                this.trigger("add", { content: t, position: e }),
                (t = this.prepare(t)),
                this._items.length === 0 || e === this._items.length
                    ? (this._items.length === 0 && this.$stage.append(t),
                      this._items.length !== 0 && this._items[e - 1].after(t),
                      this._items.push(t),
                      this._mergers.push(1 * t.find("[data-merge]").addBack("[data-merge]").attr("data-merge") || 1))
                    : (this._items[e].before(t), this._items.splice(e, 0, t), this._mergers.splice(e, 0, 1 * t.find("[data-merge]").addBack("[data-merge]").attr("data-merge") || 1)),
                this._items[s] && this.reset(this._items[s].index()),
                this.invalidate("items"),
                this.trigger("added", { content: t, position: e });
        }),
        (n.prototype.remove = function (t) {
            (t = this.normalize(t, !0)) !== h &&
                (this.trigger("remove", { content: this._items[t], position: t }),
                this._items[t].remove(),
                this._items.splice(t, 1),
                this._mergers.splice(t, 1),
                this.invalidate("items"),
                this.trigger("removed", { content: null, position: t }));
        }),
        (n.prototype.preloadAutoWidthImages = function (t) {
            t.each(
                i.proxy(function (e, s) {
                    this.enter("pre-loading"),
                        (s = i(s)),
                        i(new Image())
                            .one(
                                "load",
                                i.proxy(function (r) {
                                    s.attr("src", r.target.src), s.css("opacity", 1), this.leave("pre-loading"), !this.is("pre-loading") && !this.is("initializing") && this.refresh();
                                }, this)
                            )
                            .attr("src", s.attr("src") || s.attr("data-src") || s.attr("data-src-retina"));
                }, this)
            );
        }),
        (n.prototype.destroy = function () {
            this.$element.off(".owl.core"), this.$stage.off(".owl.core"), i(o).off(".owl.core"), this.settings.responsive !== !1 && (c.clearTimeout(this.resizeTimer), this.off(c, "resize", this._handlers.onThrottledResize));
            for (var t in this._plugins) this._plugins[t].destroy();
            this.$stage.children(".cloned").remove(),
                this.$stage.unwrap(),
                this.$stage.children().contents().unwrap(),
                this.$stage.children().unwrap(),
                this.$stage.remove(),
                this.$element
                    .removeClass(this.options.refreshClass)
                    .removeClass(this.options.loadingClass)
                    .removeClass(this.options.loadedClass)
                    .removeClass(this.options.rtlClass)
                    .removeClass(this.options.dragClass)
                    .removeClass(this.options.grabClass)
                    .attr("class", this.$element.attr("class").replace(new RegExp(this.options.responsiveClass + "-\\S+\\s", "g"), ""))
                    .removeData("owl.carousel");
        }),
        (n.prototype.op = function (t, e, s) {
            var r = this.settings.rtl;
            switch (e) {
                case "<":
                    return r ? t > s : t < s;
                case ">":
                    return r ? t < s : t > s;
                case ">=":
                    return r ? t <= s : t >= s;
                case "<=":
                    return r ? t >= s : t <= s;
            }
        }),
        (n.prototype.on = function (t, e, s, r) {
            t.addEventListener ? t.addEventListener(e, s, r) : t.attachEvent && t.attachEvent("on" + e, s);
        }),
        (n.prototype.off = function (t, e, s, r) {
            t.removeEventListener ? t.removeEventListener(e, s, r) : t.detachEvent && t.detachEvent("on" + e, s);
        }),
        (n.prototype.trigger = function (t, e, s, r, a) {
            var l = { item: { count: this._items.length, index: this.current() } },
                d = i.camelCase(
                    i
                        .grep(["on", t, s], function (u) {
                            return u;
                        })
                        .join("-")
                        .toLowerCase()
                ),
                p = i.Event([t, "owl", s || "carousel"].join(".").toLowerCase(), i.extend({ relatedTarget: this }, l, e));
            return (
                this._supress[t] ||
                    (i.each(this._plugins, function (u, w) {
                        w.onTrigger && w.onTrigger(p);
                    }),
                    this.register({ type: n.Type.Event, name: t }),
                    this.$element.trigger(p),
                    this.settings && typeof this.settings[d] == "function" && this.settings[d].call(this, p)),
                p
            );
        }),
        (n.prototype.enter = function (t) {
            i.each(
                [t].concat(this._states.tags[t] || []),
                i.proxy(function (e, s) {
                    this._states.current[s] === h && (this._states.current[s] = 0), this._states.current[s]++;
                }, this)
            );
        }),
        (n.prototype.leave = function (t) {
            i.each(
                [t].concat(this._states.tags[t] || []),
                i.proxy(function (e, s) {
                    this._states.current[s]--;
                }, this)
            );
        }),
        (n.prototype.register = function (t) {
            if (t.type === n.Type.Event) {
                if ((i.event.special[t.name] || (i.event.special[t.name] = {}), !i.event.special[t.name].owl)) {
                    var e = i.event.special[t.name]._default;
                    (i.event.special[t.name]._default = function (s) {
                        return !e || !e.apply || (s.namespace && s.namespace.indexOf("owl") !== -1) ? s.namespace && s.namespace.indexOf("owl") > -1 : e.apply(this, arguments);
                    }),
                        (i.event.special[t.name].owl = !0);
                }
            } else
                t.type === n.Type.State &&
                    (this._states.tags[t.name] ? (this._states.tags[t.name] = this._states.tags[t.name].concat(t.tags)) : (this._states.tags[t.name] = t.tags),
                    (this._states.tags[t.name] = i.grep(
                        this._states.tags[t.name],
                        i.proxy(function (s, r) {
                            return i.inArray(s, this._states.tags[t.name]) === r;
                        }, this)
                    )));
        }),
        (n.prototype.suppress = function (t) {
            i.each(
                t,
                i.proxy(function (e, s) {
                    this._supress[s] = !0;
                }, this)
            );
        }),
        (n.prototype.release = function (t) {
            i.each(
                t,
                i.proxy(function (e, s) {
                    delete this._supress[s];
                }, this)
            );
        }),
        (n.prototype.pointer = function (t) {
            var e = { x: null, y: null };
            return (
                (t = t.originalEvent || t || c.event),
                (t = t.touches && t.touches.length ? t.touches[0] : t.changedTouches && t.changedTouches.length ? t.changedTouches[0] : t),
                t.pageX ? ((e.x = t.pageX), (e.y = t.pageY)) : ((e.x = t.clientX), (e.y = t.clientY)),
                e
            );
        }),
        (n.prototype.isNumeric = function (t) {
            return !isNaN(parseFloat(t));
        }),
        (n.prototype.difference = function (t, e) {
            return { x: t.x - e.x, y: t.y - e.y };
        }),
        (i.fn.owlCarousel = function (t) {
            var e = Array.prototype.slice.call(arguments, 1);
            return this.each(function () {
                var s = i(this),
                    r = s.data("owl.carousel");
                r ||
                    ((r = new n(this, typeof t == "object" && t)),
                    s.data("owl.carousel", r),
                    i.each(["next", "prev", "to", "destroy", "refresh", "replace", "add", "remove"], function (a, l) {
                        r.register({ type: n.Type.Event, name: l }),
                            r.$element.on(
                                l + ".owl.carousel.core",
                                i.proxy(function (d) {
                                    d.namespace && d.relatedTarget !== this && (this.suppress([l]), r[l].apply(this, [].slice.call(arguments, 1)), this.release([l]));
                                }, r)
                            );
                    })),
                    typeof t == "string" && t.charAt(0) !== "_" && r[t].apply(r, e);
            });
        }),
        (i.fn.owlCarousel.Constructor = n);
})(window.Zepto || window.jQuery, window, document),
    (function (i, c, o, h) {
        var n = function (t) {
            (this._core = t),
                (this._interval = null),
                (this._visible = null),
                (this._handlers = {
                    "initialized.owl.carousel": i.proxy(function (e) {
                        e.namespace && this._core.settings.autoRefresh && this.watch();
                    }, this),
                }),
                (this._core.options = i.extend({}, n.Defaults, this._core.options)),
                this._core.$element.on(this._handlers);
        };
        (n.Defaults = { autoRefresh: !0, autoRefreshInterval: 500 }),
            (n.prototype.watch = function () {
                this._interval || ((this._visible = this._core.isVisible()), (this._interval = c.setInterval(i.proxy(this.refresh, this), this._core.settings.autoRefreshInterval)));
            }),
            (n.prototype.refresh = function () {
                this._core.isVisible() !== this._visible && ((this._visible = !this._visible), this._core.$element.toggleClass("owl-hidden", !this._visible), this._visible && this._core.invalidate("width") && this._core.refresh());
            }),
            (n.prototype.destroy = function () {
                var t, e;
                c.clearInterval(this._interval);
                for (t in this._handlers) this._core.$element.off(t, this._handlers[t]);
                for (e in Object.getOwnPropertyNames(this)) typeof this[e] != "function" && (this[e] = null);
            }),
            (i.fn.owlCarousel.Constructor.Plugins.AutoRefresh = n);
    })(window.Zepto || window.jQuery, window, document),
    (function (i, c, o, h) {
        var n = function (t) {
            (this._core = t),
                (this._loaded = []),
                (this._handlers = {
                    "initialized.owl.carousel change.owl.carousel resized.owl.carousel": i.proxy(function (e) {
                        if (e.namespace && this._core.settings && this._core.settings.lazyLoad && ((e.property && e.property.name == "position") || e.type == "initialized")) {
                            var s = this._core.settings,
                                r = (s.center && Math.ceil(s.items / 2)) || s.items,
                                a = (s.center && -1 * r) || 0,
                                l = (e.property && e.property.value !== h ? e.property.value : this._core.current()) + a,
                                d = this._core.clones().length,
                                p = i.proxy(function (u, w) {
                                    this.load(w);
                                }, this);
                            for (s.lazyLoadEager > 0 && ((r += s.lazyLoadEager), s.loop && ((l -= s.lazyLoadEager), r++)); a++ < r; ) this.load(d / 2 + this._core.relative(l)), d && i.each(this._core.clones(this._core.relative(l)), p), l++;
                        }
                    }, this),
                }),
                (this._core.options = i.extend({}, n.Defaults, this._core.options)),
                this._core.$element.on(this._handlers);
        };
        (n.Defaults = { lazyLoad: !1, lazyLoadEager: 0 }),
            (n.prototype.load = function (t) {
                var e = this._core.$stage.children().eq(t),
                    s = e && e.find(".owl-lazy");
                !s ||
                    i.inArray(e.get(0), this._loaded) > -1 ||
                    (s.each(
                        i.proxy(function (r, a) {
                            var l,
                                d = i(a),
                                p = (c.devicePixelRatio > 1 && d.attr("data-src-retina")) || d.attr("data-src") || d.attr("data-srcset");
                            this._core.trigger("load", { element: d, url: p }, "lazy"),
                                d.is("img")
                                    ? d
                                          .one(
                                              "load.owl.lazy",
                                              i.proxy(function () {
                                                  d.css("opacity", 1), this._core.trigger("loaded", { element: d, url: p }, "lazy");
                                              }, this)
                                          )
                                          .attr("src", p)
                                    : d.is("source")
                                    ? d
                                          .one(
                                              "load.owl.lazy",
                                              i.proxy(function () {
                                                  this._core.trigger("loaded", { element: d, url: p }, "lazy");
                                              }, this)
                                          )
                                          .attr("srcset", p)
                                    : ((l = new Image()),
                                      (l.onload = i.proxy(function () {
                                          d.css({ "background-image": 'url("' + p + '")', opacity: "1" }), this._core.trigger("loaded", { element: d, url: p }, "lazy");
                                      }, this)),
                                      (l.src = p));
                        }, this)
                    ),
                    this._loaded.push(e.get(0)));
            }),
            (n.prototype.destroy = function () {
                var t, e;
                for (t in this.handlers) this._core.$element.off(t, this.handlers[t]);
                for (e in Object.getOwnPropertyNames(this)) typeof this[e] != "function" && (this[e] = null);
            }),
            (i.fn.owlCarousel.Constructor.Plugins.Lazy = n);
    })(window.Zepto || window.jQuery, window, document),
    (function (i, c, o, h) {
        var n = function (t) {
            (this._core = t),
                (this._previousHeight = null),
                (this._handlers = {
                    "initialized.owl.carousel refreshed.owl.carousel": i.proxy(function (s) {
                        s.namespace && this._core.settings.autoHeight && this.update();
                    }, this),
                    "changed.owl.carousel": i.proxy(function (s) {
                        s.namespace && this._core.settings.autoHeight && s.property.name === "position" && this.update();
                    }, this),
                    "loaded.owl.lazy": i.proxy(function (s) {
                        s.namespace && this._core.settings.autoHeight && s.element.closest("." + this._core.settings.itemClass).index() === this._core.current() && this.update();
                    }, this),
                }),
                (this._core.options = i.extend({}, n.Defaults, this._core.options)),
                this._core.$element.on(this._handlers),
                (this._intervalId = null);
            var e = this;
            i(c).on("load", function () {
                e._core.settings.autoHeight && e.update();
            }),
                i(c).resize(function () {
                    e._core.settings.autoHeight &&
                        (e._intervalId != null && clearTimeout(e._intervalId),
                        (e._intervalId = setTimeout(function () {
                            e.update();
                        }, 250)));
                });
        };
        (n.Defaults = { autoHeight: !1, autoHeightClass: "owl-height" }),
            (n.prototype.update = function () {
                var t = this._core._current,
                    e = t + this._core.settings.items,
                    s = this._core.settings.lazyLoad,
                    r = this._core.$stage.children().toArray().slice(t, e),
                    a = [],
                    l = 0;
                i.each(r, function (d, p) {
                    a.push(i(p).height());
                }),
                    (l = Math.max.apply(null, a)),
                    l <= 1 && s && this._previousHeight && (l = this._previousHeight),
                    (this._previousHeight = l),
                    this._core.$stage.parent().height(l).addClass(this._core.settings.autoHeightClass);
            }),
            (n.prototype.destroy = function () {
                var t, e;
                for (t in this._handlers) this._core.$element.off(t, this._handlers[t]);
                for (e in Object.getOwnPropertyNames(this)) typeof this[e] != "function" && (this[e] = null);
            }),
            (i.fn.owlCarousel.Constructor.Plugins.AutoHeight = n);
    })(window.Zepto || window.jQuery, window, document),
    (function (i, c, o, h) {
        var n = function (t) {
            (this._core = t),
                (this._videos = {}),
                (this._playing = null),
                (this._handlers = {
                    "initialized.owl.carousel": i.proxy(function (e) {
                        e.namespace && this._core.register({ type: "state", name: "playing", tags: ["interacting"] });
                    }, this),
                    "resize.owl.carousel": i.proxy(function (e) {
                        e.namespace && this._core.settings.video && this.isInFullScreen() && e.preventDefault();
                    }, this),
                    "refreshed.owl.carousel": i.proxy(function (e) {
                        e.namespace && this._core.is("resizing") && this._core.$stage.find(".cloned .owl-video-frame").remove();
                    }, this),
                    "changed.owl.carousel": i.proxy(function (e) {
                        e.namespace && e.property.name === "position" && this._playing && this.stop();
                    }, this),
                    "prepared.owl.carousel": i.proxy(function (e) {
                        if (e.namespace) {
                            var s = i(e.content).find(".owl-video");
                            s.length && (s.css("display", "none"), this.fetch(s, i(e.content)));
                        }
                    }, this),
                }),
                (this._core.options = i.extend({}, n.Defaults, this._core.options)),
                this._core.$element.on(this._handlers),
                this._core.$element.on(
                    "click.owl.video",
                    ".owl-video-play-icon",
                    i.proxy(function (e) {
                        this.play(e);
                    }, this)
                );
        };
        (n.Defaults = { video: !1, videoHeight: !1, videoWidth: !1 }),
            (n.prototype.fetch = function (t, e) {
                var s = (function () {
                        return t.attr("data-vimeo-id") ? "vimeo" : t.attr("data-vzaar-id") ? "vzaar" : "youtube";
                    })(),
                    r = t.attr("data-vimeo-id") || t.attr("data-youtube-id") || t.attr("data-vzaar-id"),
                    a = t.attr("data-width") || this._core.settings.videoWidth,
                    l = t.attr("data-height") || this._core.settings.videoHeight,
                    d = t.attr("href");
                if (!d) throw new Error("Missing video URL.");
                if (
                    ((r = d.match(
                        /(http:|https:|)\/\/(player.|www.|app.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com|be\-nocookie\.com)|vzaar\.com)\/(video\/|videos\/|embed\/|channels\/.+\/|groups\/.+\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/
                    )),
                    r[3].indexOf("youtu") > -1)
                )
                    s = "youtube";
                else if (r[3].indexOf("vimeo") > -1) s = "vimeo";
                else {
                    if (!(r[3].indexOf("vzaar") > -1)) throw new Error("Video URL not supported.");
                    s = "vzaar";
                }
                (r = r[6]), (this._videos[d] = { type: s, id: r, width: a, height: l }), e.attr("data-video", d), this.thumbnail(t, this._videos[d]);
            }),
            (n.prototype.thumbnail = function (t, e) {
                var s,
                    r,
                    a,
                    l = e.width && e.height ? "width:" + e.width + "px;height:" + e.height + "px;" : "",
                    d = t.find("img"),
                    p = "src",
                    u = "",
                    w = this._core.settings,
                    g = function (z) {
                        (r = '<div class="owl-video-play-icon"></div>'),
                            (s = w.lazyLoad ? i("<div/>", { class: "owl-video-tn " + u, srcType: z }) : i("<div/>", { class: "owl-video-tn", style: "opacity:1;background-image:url(" + z + ")" })),
                            t.after(s),
                            t.after(r);
                    };
                if ((t.wrap(i("<div/>", { class: "owl-video-wrapper", style: l })), this._core.settings.lazyLoad && ((p = "data-src"), (u = "owl-lazy")), d.length)) return g(d.attr(p)), d.remove(), !1;
                e.type === "youtube"
                    ? ((a = "//img.youtube.com/vi/" + e.id + "/hqdefault.jpg"), g(a))
                    : e.type === "vimeo"
                    ? i.ajax({
                          type: "GET",
                          url: "//vimeo.com/api/v2/video/" + e.id + ".json",
                          jsonp: "callback",
                          dataType: "jsonp",
                          success: function (z) {
                              (a = z[0].thumbnail_large), g(a);
                          },
                      })
                    : e.type === "vzaar" &&
                      i.ajax({
                          type: "GET",
                          url: "//vzaar.com/api/videos/" + e.id + ".json",
                          jsonp: "callback",
                          dataType: "jsonp",
                          success: function (z) {
                              (a = z.framegrab_url), g(a);
                          },
                      });
            }),
            (n.prototype.stop = function () {
                this._core.trigger("stop", null, "video"),
                    this._playing.find(".owl-video-frame").remove(),
                    this._playing.removeClass("owl-video-playing"),
                    (this._playing = null),
                    this._core.leave("playing"),
                    this._core.trigger("stopped", null, "video");
            }),
            (n.prototype.play = function (t) {
                var e,
                    s = i(t.target),
                    r = s.closest("." + this._core.settings.itemClass),
                    a = this._videos[r.attr("data-video")],
                    l = a.width || "100%",
                    d = a.height || this._core.$stage.height();
                this._playing ||
                    (this._core.enter("playing"),
                    this._core.trigger("play", null, "video"),
                    (r = this._core.items(this._core.relative(r.index()))),
                    this._core.reset(r.index()),
                    (e = i('<iframe frameborder="0" allowfullscreen mozallowfullscreen webkitAllowFullScreen ></iframe>')),
                    e.attr("height", d),
                    e.attr("width", l),
                    a.type === "youtube"
                        ? e.attr("src", "//www.youtube.com/embed/" + a.id + "?autoplay=1&rel=0&v=" + a.id)
                        : a.type === "vimeo"
                        ? e.attr("src", "//player.vimeo.com/video/" + a.id + "?autoplay=1")
                        : a.type === "vzaar" && e.attr("src", "//view.vzaar.com/" + a.id + "/player?autoplay=true"),
                    i(e).wrap('<div class="owl-video-frame" />').insertAfter(r.find(".owl-video")),
                    (this._playing = r.addClass("owl-video-playing")));
            }),
            (n.prototype.isInFullScreen = function () {
                var t = o.fullscreenElement || o.mozFullScreenElement || o.webkitFullscreenElement;
                return t && i(t).parent().hasClass("owl-video-frame");
            }),
            (n.prototype.destroy = function () {
                var t, e;
                this._core.$element.off("click.owl.video");
                for (t in this._handlers) this._core.$element.off(t, this._handlers[t]);
                for (e in Object.getOwnPropertyNames(this)) typeof this[e] != "function" && (this[e] = null);
            }),
            (i.fn.owlCarousel.Constructor.Plugins.Video = n);
    })(window.Zepto || window.jQuery, window, document),
    (function (i, c, o, h) {
        var n = function (t) {
            (this.core = t),
                (this.core.options = i.extend({}, n.Defaults, this.core.options)),
                (this.swapping = !0),
                (this.previous = h),
                (this.next = h),
                (this.handlers = {
                    "change.owl.carousel": i.proxy(function (e) {
                        e.namespace && e.property.name == "position" && ((this.previous = this.core.current()), (this.next = e.property.value));
                    }, this),
                    "drag.owl.carousel dragged.owl.carousel translated.owl.carousel": i.proxy(function (e) {
                        e.namespace && (this.swapping = e.type == "translated");
                    }, this),
                    "translate.owl.carousel": i.proxy(function (e) {
                        e.namespace && this.swapping && (this.core.options.animateOut || this.core.options.animateIn) && this.swap();
                    }, this),
                }),
                this.core.$element.on(this.handlers);
        };
        (n.Defaults = { animateOut: !1, animateIn: !1 }),
            (n.prototype.swap = function () {
                if (this.core.settings.items === 1 && i.support.animation && i.support.transition) {
                    this.core.speed(0);
                    var t,
                        e = i.proxy(this.clear, this),
                        s = this.core.$stage.children().eq(this.previous),
                        r = this.core.$stage.children().eq(this.next),
                        a = this.core.settings.animateIn,
                        l = this.core.settings.animateOut;
                    this.core.current() !== this.previous &&
                        (l &&
                            ((t = this.core.coordinates(this.previous) - this.core.coordinates(this.next)),
                            s
                                .one(i.support.animation.end, e)
                                .css({ left: t + "px" })
                                .addClass("animated owl-animated-out")
                                .addClass(l)),
                        a && r.one(i.support.animation.end, e).addClass("animated owl-animated-in").addClass(a));
                }
            }),
            (n.prototype.clear = function (t) {
                i(t.target).css({ left: "" }).removeClass("animated owl-animated-out owl-animated-in").removeClass(this.core.settings.animateIn).removeClass(this.core.settings.animateOut), this.core.onTransitionEnd();
            }),
            (n.prototype.destroy = function () {
                var t, e;
                for (t in this.handlers) this.core.$element.off(t, this.handlers[t]);
                for (e in Object.getOwnPropertyNames(this)) typeof this[e] != "function" && (this[e] = null);
            }),
            (i.fn.owlCarousel.Constructor.Plugins.Animate = n);
    })(window.Zepto || window.jQuery, window, document),
    (function (i, c, o, h) {
        var n = function (t) {
            (this._core = t),
                (this._call = null),
                (this._time = 0),
                (this._timeout = 0),
                (this._paused = !0),
                (this._handlers = {
                    "changed.owl.carousel": i.proxy(function (e) {
                        e.namespace && e.property.name === "settings" ? (this._core.settings.autoplay ? this.play() : this.stop()) : e.namespace && e.property.name === "position" && this._paused && (this._time = 0);
                    }, this),
                    "initialized.owl.carousel": i.proxy(function (e) {
                        e.namespace && this._core.settings.autoplay && this.play();
                    }, this),
                    "play.owl.autoplay": i.proxy(function (e, s, r) {
                        e.namespace && this.play(s, r);
                    }, this),
                    "stop.owl.autoplay": i.proxy(function (e) {
                        e.namespace && this.stop();
                    }, this),
                    "mouseover.owl.autoplay": i.proxy(function () {
                        this._core.settings.autoplayHoverPause && this._core.is("rotating") && this.pause();
                    }, this),
                    "mouseleave.owl.autoplay": i.proxy(function () {
                        this._core.settings.autoplayHoverPause && this._core.is("rotating") && this.play();
                    }, this),
                    "touchstart.owl.core": i.proxy(function () {
                        this._core.settings.autoplayHoverPause && this._core.is("rotating") && this.pause();
                    }, this),
                    "touchend.owl.core": i.proxy(function () {
                        this._core.settings.autoplayHoverPause && this.play();
                    }, this),
                }),
                this._core.$element.on(this._handlers),
                (this._core.options = i.extend({}, n.Defaults, this._core.options));
        };
        (n.Defaults = { autoplay: !1, autoplayTimeout: 5e3, autoplayHoverPause: !1, autoplaySpeed: !1 }),
            (n.prototype._next = function (t) {
                (this._call = c.setTimeout(i.proxy(this._next, this, t), this._timeout * (Math.round(this.read() / this._timeout) + 1) - this.read())),
                    this._core.is("interacting") || o.hidden || this._core.next(t || this._core.settings.autoplaySpeed);
            }),
            (n.prototype.read = function () {
                return new Date().getTime() - this._time;
            }),
            (n.prototype.play = function (t, e) {
                var s;
                this._core.is("rotating") || this._core.enter("rotating"),
                    (t = t || this._core.settings.autoplayTimeout),
                    (s = Math.min(this._time % (this._timeout || t), t)),
                    this._paused ? ((this._time = this.read()), (this._paused = !1)) : c.clearTimeout(this._call),
                    (this._time += (this.read() % t) - s),
                    (this._timeout = t),
                    (this._call = c.setTimeout(i.proxy(this._next, this, e), t - s));
            }),
            (n.prototype.stop = function () {
                this._core.is("rotating") && ((this._time = 0), (this._paused = !0), c.clearTimeout(this._call), this._core.leave("rotating"));
            }),
            (n.prototype.pause = function () {
                this._core.is("rotating") && !this._paused && ((this._time = this.read()), (this._paused = !0), c.clearTimeout(this._call));
            }),
            (n.prototype.destroy = function () {
                var t, e;
                this.stop();
                for (t in this._handlers) this._core.$element.off(t, this._handlers[t]);
                for (e in Object.getOwnPropertyNames(this)) typeof this[e] != "function" && (this[e] = null);
            }),
            (i.fn.owlCarousel.Constructor.Plugins.autoplay = n);
    })(window.Zepto || window.jQuery, window, document),
    (function (i, c, o, h) {
        "use strict";
        var n = function (t) {
            (this._core = t),
                (this._initialized = !1),
                (this._pages = []),
                (this._controls = {}),
                (this._templates = []),
                (this.$element = this._core.$element),
                (this._overrides = { next: this._core.next, prev: this._core.prev, to: this._core.to }),
                (this._handlers = {
                    "prepared.owl.carousel": i.proxy(function (e) {
                        e.namespace && this._core.settings.dotsData && this._templates.push('<div class="' + this._core.settings.dotClass + '">' + i(e.content).find("[data-dot]").addBack("[data-dot]").attr("data-dot") + "</div>");
                    }, this),
                    "added.owl.carousel": i.proxy(function (e) {
                        e.namespace && this._core.settings.dotsData && this._templates.splice(e.position, 0, this._templates.pop());
                    }, this),
                    "remove.owl.carousel": i.proxy(function (e) {
                        e.namespace && this._core.settings.dotsData && this._templates.splice(e.position, 1);
                    }, this),
                    "changed.owl.carousel": i.proxy(function (e) {
                        e.namespace && e.property.name == "position" && this.draw();
                    }, this),
                    "initialized.owl.carousel": i.proxy(function (e) {
                        e.namespace &&
                            !this._initialized &&
                            (this._core.trigger("initialize", null, "navigation"), this.initialize(), this.update(), this.draw(), (this._initialized = !0), this._core.trigger("initialized", null, "navigation"));
                    }, this),
                    "refreshed.owl.carousel": i.proxy(function (e) {
                        e.namespace && this._initialized && (this._core.trigger("refresh", null, "navigation"), this.update(), this.draw(), this._core.trigger("refreshed", null, "navigation"));
                    }, this),
                }),
                (this._core.options = i.extend({}, n.Defaults, this._core.options)),
                this.$element.on(this._handlers);
        };
        (n.Defaults = {
            nav: !1,
            navText: ['<span aria-label="Previous">&#x2039;</span>', '<span aria-label="Next">&#x203a;</span>'],
            navSpeed: !1,
            navElement: 'button type="button" role="presentation"',
            navContainer: !1,
            navContainerClass: "owl-nav",
            navClass: ["owl-prev", "owl-next"],
            slideBy: 1,
            dotClass: "owl-dot",
            dotsClass: "owl-dots",
            dots: !0,
            dotsEach: !1,
            dotsData: !1,
            dotsSpeed: !1,
            dotsContainer: !1,
        }),
            (n.prototype.initialize = function () {
                var t,
                    e = this._core.settings;
                (this._controls.$relative = (e.navContainer ? i(e.navContainer) : i("<div>").addClass(e.navContainerClass).appendTo(this.$element)).addClass("disabled")),
                    (this._controls.$previous = i("<" + e.navElement + ">")
                        .addClass(e.navClass[0])
                        .html(e.navText[0])
                        .prependTo(this._controls.$relative)
                        .on(
                            "click",
                            i.proxy(function (s) {
                                this.prev(e.navSpeed);
                            }, this)
                        )),
                    (this._controls.$next = i("<" + e.navElement + ">")
                        .addClass(e.navClass[1])
                        .html(e.navText[1])
                        .appendTo(this._controls.$relative)
                        .on(
                            "click",
                            i.proxy(function (s) {
                                this.next(e.navSpeed);
                            }, this)
                        )),
                    e.dotsData || (this._templates = [i('<button role="button">').addClass(e.dotClass).append(i("<span>")).prop("outerHTML")]),
                    (this._controls.$absolute = (e.dotsContainer ? i(e.dotsContainer) : i("<div>").addClass(e.dotsClass).appendTo(this.$element)).addClass("disabled")),
                    this._controls.$absolute.on(
                        "click",
                        "button",
                        i.proxy(function (s) {
                            var r = i(s.target).parent().is(this._controls.$absolute) ? i(s.target).index() : i(s.target).parent().index();
                            s.preventDefault(), this.to(r, e.dotsSpeed);
                        }, this)
                    );
                for (t in this._overrides) this._core[t] = i.proxy(this[t], this);
            }),
            (n.prototype.destroy = function () {
                var t, e, s, r, a;
                a = this._core.settings;
                for (t in this._handlers) this.$element.off(t, this._handlers[t]);
                for (e in this._controls) e === "$relative" && a.navContainer ? this._controls[e].html("") : this._controls[e].remove();
                for (r in this.overides) this._core[r] = this._overrides[r];
                for (s in Object.getOwnPropertyNames(this)) typeof this[s] != "function" && (this[s] = null);
            }),
            (n.prototype.update = function () {
                var t,
                    e,
                    s,
                    r = this._core.clones().length / 2,
                    a = r + this._core.items().length,
                    l = this._core.maximum(!0),
                    d = this._core.settings,
                    p = d.center || d.autoWidth || d.dotsData ? 1 : d.dotsEach || d.items;
                if ((d.slideBy !== "page" && (d.slideBy = Math.min(d.slideBy, d.items)), d.dots || d.slideBy == "page"))
                    for (this._pages = [], t = r, e = 0, s = 0; t < a; t++) {
                        if (e >= p || e === 0) {
                            if ((this._pages.push({ start: Math.min(l, t - r), end: t - r + p - 1 }), Math.min(l, t - r) === l)) break;
                            (e = 0), ++s;
                        }
                        e += this._core.mergers(this._core.relative(t));
                    }
            }),
            (n.prototype.draw = function () {
                var t,
                    e = this._core.settings,
                    s = this._core.items().length <= e.items,
                    r = this._core.relative(this._core.current()),
                    a = e.loop || e.rewind;
                this._controls.$relative.toggleClass("disabled", !e.nav || s),
                    e.nav && (this._controls.$previous.toggleClass("disabled", !a && r <= this._core.minimum(!0)), this._controls.$next.toggleClass("disabled", !a && r >= this._core.maximum(!0))),
                    this._controls.$absolute.toggleClass("disabled", !e.dots || s),
                    e.dots &&
                        ((t = this._pages.length - this._controls.$absolute.children().length),
                        e.dotsData && t !== 0
                            ? this._controls.$absolute.html(this._templates.join(""))
                            : t > 0
                            ? this._controls.$absolute.append(new Array(t + 1).join(this._templates[0]))
                            : t < 0 && this._controls.$absolute.children().slice(t).remove(),
                        this._controls.$absolute.find(".active").removeClass("active"),
                        this._controls.$absolute.children().eq(i.inArray(this.current(), this._pages)).addClass("active"));
            }),
            (n.prototype.onTrigger = function (t) {
                var e = this._core.settings;
                t.page = { index: i.inArray(this.current(), this._pages), count: this._pages.length, size: e && (e.center || e.autoWidth || e.dotsData ? 1 : e.dotsEach || e.items) };
            }),
            (n.prototype.current = function () {
                var t = this._core.relative(this._core.current());
                return i
                    .grep(
                        this._pages,
                        i.proxy(function (e, s) {
                            return e.start <= t && e.end >= t;
                        }, this)
                    )
                    .pop();
            }),
            (n.prototype.getPosition = function (t) {
                var e,
                    s,
                    r = this._core.settings;
                return (
                    r.slideBy == "page"
                        ? ((e = i.inArray(this.current(), this._pages)), (s = this._pages.length), t ? ++e : --e, (e = this._pages[((e % s) + s) % s].start))
                        : ((e = this._core.relative(this._core.current())), (s = this._core.items().length), t ? (e += r.slideBy) : (e -= r.slideBy)),
                    e
                );
            }),
            (n.prototype.next = function (t) {
                i.proxy(this._overrides.to, this._core)(this.getPosition(!0), t);
            }),
            (n.prototype.prev = function (t) {
                i.proxy(this._overrides.to, this._core)(this.getPosition(!1), t);
            }),
            (n.prototype.to = function (t, e, s) {
                var r;
                !s && this._pages.length ? ((r = this._pages.length), i.proxy(this._overrides.to, this._core)(this._pages[((t % r) + r) % r].start, e)) : i.proxy(this._overrides.to, this._core)(t, e);
            }),
            (i.fn.owlCarousel.Constructor.Plugins.Navigation = n);
    })(window.Zepto || window.jQuery, window, document),
    (function (i, c, o, h) {
        "use strict";
        var n = function (t) {
            (this._core = t),
                (this._hashes = {}),
                (this.$element = this._core.$element),
                (this._handlers = {
                    "initialized.owl.carousel": i.proxy(function (e) {
                        e.namespace && this._core.settings.startPosition === "URLHash" && i(c).trigger("hashchange.owl.navigation");
                    }, this),
                    "prepared.owl.carousel": i.proxy(function (e) {
                        if (e.namespace) {
                            var s = i(e.content).find("[data-hash]").addBack("[data-hash]").attr("data-hash");
                            if (!s) return;
                            this._hashes[s] = e.content;
                        }
                    }, this),
                    "changed.owl.carousel": i.proxy(function (e) {
                        if (e.namespace && e.property.name === "position") {
                            var s = this._core.items(this._core.relative(this._core.current())),
                                r = i
                                    .map(this._hashes, function (a, l) {
                                        return a === s ? l : null;
                                    })
                                    .join();
                            if (!r || c.location.hash.slice(1) === r) return;
                            c.location.hash = r;
                        }
                    }, this),
                }),
                (this._core.options = i.extend({}, n.Defaults, this._core.options)),
                this.$element.on(this._handlers),
                i(c).on(
                    "hashchange.owl.navigation",
                    i.proxy(function (e) {
                        var s = c.location.hash.substring(1),
                            r = this._core.$stage.children(),
                            a = this._hashes[s] && r.index(this._hashes[s]);
                        a !== h && a !== this._core.current() && this._core.to(this._core.relative(a), !1, !0);
                    }, this)
                );
        };
        (n.Defaults = { URLhashListener: !1 }),
            (n.prototype.destroy = function () {
                var t, e;
                i(c).off("hashchange.owl.navigation");
                for (t in this._handlers) this._core.$element.off(t, this._handlers[t]);
                for (e in Object.getOwnPropertyNames(this)) typeof this[e] != "function" && (this[e] = null);
            }),
            (i.fn.owlCarousel.Constructor.Plugins.Hash = n);
    })(window.Zepto || window.jQuery, window, document),
    (function (i, c, o, h) {
        function n(l, d) {
            var p = !1,
                u = l.charAt(0).toUpperCase() + l.slice(1);
            return (
                i.each((l + " " + s.join(u + " ") + u).split(" "), function (w, g) {
                    if (e[g] !== h) return (p = !d || g), !1;
                }),
                p
            );
        }
        function t(l) {
            return n(l, !0);
        }
        var e = i("<support>").get(0).style,
            s = "Webkit Moz O ms".split(" "),
            r = {
                transition: { end: { WebkitTransition: "webkitTransitionEnd", MozTransition: "transitionend", OTransition: "oTransitionEnd", transition: "transitionend" } },
                animation: { end: { WebkitAnimation: "webkitAnimationEnd", MozAnimation: "animationend", OAnimation: "oAnimationEnd", animation: "animationend" } },
            },
            a = {
                csstransforms: function () {
                    return !!n("transform");
                },
                csstransforms3d: function () {
                    return !!n("perspective");
                },
                csstransitions: function () {
                    return !!n("transition");
                },
                cssanimations: function () {
                    return !!n("animation");
                },
            };
        a.csstransitions() && ((i.support.transition = new String(t("transition"))), (i.support.transition.end = r.transition.end[i.support.transition])),
            a.cssanimations() && ((i.support.animation = new String(t("animation"))), (i.support.animation.end = r.animation.end[i.support.animation])),
            a.csstransforms() && ((i.support.transform = new String(t("transform"))), (i.support.transform3d = a.csstransforms3d()));
    })(window.Zepto || window.jQuery, window, document),
    (function (i) {
        var c = {};
        function o(h) {
            if (c[h]) return c[h].exports;
            var n = (c[h] = { i: h, l: !1, exports: {} });
            return i[h].call(n.exports, n, n.exports, o), (n.l = !0), n.exports;
        }
        (o.m = i),
            (o.c = c),
            (o.d = function (h, n, t) {
                o.o(h, n) || Object.defineProperty(h, n, { enumerable: !0, get: t });
            }),
            (o.r = function (h) {
                typeof Symbol != "undefined" && Symbol.toStringTag && Object.defineProperty(h, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(h, "__esModule", { value: !0 });
            }),
            (o.t = function (h, n) {
                if ((1 & n && (h = o(h)), 8 & n || (4 & n && typeof h == "object" && h && h.__esModule))) return h;
                var t = Object.create(null);
                if ((o.r(t), Object.defineProperty(t, "default", { enumerable: !0, value: h }), 2 & n && typeof h != "string"))
                    for (var e in h)
                        o.d(
                            t,
                            e,
                            function (s) {
                                return h[s];
                            }.bind(null, e)
                        );
                return t;
            }),
            (o.n = function (h) {
                var n =
                    h && h.__esModule
                        ? function () {
                              return h.default;
                          }
                        : function () {
                              return h;
                          };
                return o.d(n, "a", n), n;
            }),
            (o.o = function (h, n) {
                return Object.prototype.hasOwnProperty.call(h, n);
            }),
            (o.p = ""),
            o((o.s = 0));
    })([
        function (i, c, o) {
            var h;
            (h = window),
                (i.exports = (function (n, t) {
                    "use strict";
                    n.fn.owlcarousel2_filter = function (e, s) {
                        var r = this.data("owl.carousel").settings;
                        this.trigger("destroy.owl.carousel"), this.oc2_filter_clone || (this.oc2_filter_clone = this.clone());
                        var a = this.oc2_filter_clone.children(e).clone();
                        this.empty().append(a).owlCarousel(r);
                    };
                })(h.jQuery));
        },
    ]),
    (function (i) {
        (i.fn.marquee = function (c) {
            return this.each(function () {
                var o = i.extend({}, i.fn.marquee.defaults, c),
                    h = i(this),
                    n,
                    t,
                    e,
                    s,
                    r,
                    a = 3,
                    l = "animation-play-state",
                    d = !1,
                    p = function (_, y, T) {
                        for (var S = ["webkit", "moz", "MS", "o", ""], j = 0; j < S.length; j++) S[j] || (y = y.toLowerCase()), _.addEventListener(S[j] + y, T, !1);
                    },
                    u = function (_) {
                        var y = [];
                        for (var T in _) _.hasOwnProperty(T) && y.push(T + ":" + _[T]);
                        return y.push(), "{" + y.join(",") + "}";
                    },
                    w = function () {
                        h.timer = setTimeout(E, o.delayBeforeStart);
                    },
                    g = {
                        pause: function () {
                            d && o.allowCss3Support ? n.css(l, "paused") : i.fn.pause && n.pause(), h.data("runningStatus", "paused"), h.trigger("paused");
                        },
                        resume: function () {
                            d && o.allowCss3Support ? n.css(l, "running") : i.fn.resume && n.resume(), h.data("runningStatus", "resumed"), h.trigger("resumed");
                        },
                        toggle: function () {
                            g[h.data("runningStatus") == "resumed" ? "pause" : "resume"]();
                        },
                        destroy: function () {
                            clearTimeout(h.timer), h.find("*").addBack().off(), h.html(h.find(".js-marquee:first").html());
                        },
                    };
                if (typeof c == "string") {
                    i.isFunction(g[c]) && (n || (n = h.find(".js-marquee-wrapper")), h.data("css3AnimationIsSupported") === !0 && (d = !0), g[c]());
                    return;
                }
                var z = {},
                    b;
                i.each(o, function (_, y) {
                    if (((b = h.attr("data-" + _)), typeof b != "undefined")) {
                        switch (b) {
                            case "true":
                                b = !0;
                                break;
                            case "false":
                                b = !1;
                                break;
                        }
                        o[_] = b;
                    }
                }),
                    o.speed && (o.duration = (parseInt(h.width(), 10) / o.speed) * 1e3),
                    (s = o.direction == "up" || o.direction == "down"),
                    (o.gap = o.duplicated ? parseInt(o.gap) : 0),
                    h.wrapInner('<div class="js-marquee"></div>');
                var A = h.find(".js-marquee").css({ "margin-right": o.gap, float: "left" });
                if ((o.duplicated && A.clone(!0).appendTo(h), h.wrapInner('<div style="width:100000px" class="js-marquee-wrapper"></div>'), (n = h.find(".js-marquee-wrapper")), s)) {
                    var v = h.height();
                    n.removeAttr("style"), h.height(v), h.find(".js-marquee").css({ float: "none", "margin-bottom": o.gap, "margin-right": 0 }), o.duplicated && h.find(".js-marquee:last").css({ "margin-bottom": 0 });
                    var x = h.find(".js-marquee:first").height() + o.gap;
                    o.startVisible && !o.duplicated
                        ? ((o._completeDuration = ((parseInt(x, 10) + parseInt(v, 10)) / parseInt(v, 10)) * o.duration), (o.duration = (parseInt(x, 10) / parseInt(v, 10)) * o.duration))
                        : (o.duration = ((parseInt(x, 10) + parseInt(v, 10)) / parseInt(v, 10)) * o.duration);
                } else (r = h.find(".js-marquee:first").width() + o.gap), (t = h.width()), o.startVisible && !o.duplicated ? ((o._completeDuration = ((parseInt(r, 10) + parseInt(t, 10)) / parseInt(t, 10)) * o.duration), (o.duration = (parseInt(r, 10) / parseInt(t, 10)) * o.duration)) : (o.duration = ((parseInt(r, 10) + parseInt(t, 10)) / parseInt(t, 10)) * o.duration);
                if ((o.duplicated && (o.duration = o.duration / 2), o.allowCss3Support)) {
                    var k = document.body || document.createElement("div"),
                        f = "marqueeAnimation-" + Math.floor(Math.random() * 1e7),
                        P = "Webkit Moz O ms Khtml".split(" "),
                        M = "animation",
                        m = "",
                        C = "";
                    if ((k.style.animation !== void 0 && ((C = "@keyframes " + f + " "), (d = !0)), d === !1)) {
                        for (var D = 0; D < P.length; D++)
                            if (k.style[P[D] + "AnimationName"] !== void 0) {
                                var I = "-" + P[D].toLowerCase() + "-";
                                (M = I + M), (l = I + l), (C = "@" + I + "keyframes " + f + " "), (d = !0);
                                break;
                            }
                    }
                    d && ((m = f + " " + o.duration / 1e3 + "s " + o.delayBeforeStart / 1e3 + "s infinite " + o.css3easing), h.data("css3AnimationIsSupported", !0));
                }
                var O = function () {
                        n.css("transform", "translateY(" + (o.direction == "up" ? v + "px" : "-" + x + "px") + ")");
                    },
                    L = function () {
                        n.css("transform", "translateX(" + (o.direction == "left" ? t + "px" : "-" + r + "px") + ")");
                    };
                o.duplicated
                    ? (s
                          ? o.startVisible
                              ? n.css("transform", "translateY(0)")
                              : n.css("transform", "translateY(" + (o.direction == "up" ? v + "px" : "-" + (x * 2 - o.gap) + "px") + ")")
                          : o.startVisible
                          ? n.css("transform", "translateX(0)")
                          : n.css("transform", "translateX(" + (o.direction == "left" ? t + "px" : "-" + (r * 2 - o.gap) + "px") + ")"),
                      o.startVisible || (a = 1))
                    : o.startVisible
                    ? (a = 2)
                    : s
                    ? O()
                    : L();
                var E = function () {
                    if (
                        (o.duplicated &&
                            (a === 1
                                ? ((o._originalDuration = o.duration),
                                  s ? (o.duration = o.direction == "up" ? o.duration + v / (x / o.duration) : o.duration * 2) : (o.duration = o.direction == "left" ? o.duration + t / (r / o.duration) : o.duration * 2),
                                  m && (m = f + " " + o.duration / 1e3 + "s " + o.delayBeforeStart / 1e3 + "s " + o.css3easing),
                                  a++)
                                : a === 2 && ((o.duration = o._originalDuration), m && ((f = f + "0"), (C = i.trim(C) + "0 "), (m = f + " " + o.duration / 1e3 + "s 0s infinite " + o.css3easing)), a++)),
                        s
                            ? o.duplicated
                                ? (a > 2 && n.css("transform", "translateY(" + (o.direction == "up" ? 0 : "-" + x + "px") + ")"), (e = { transform: "translateY(" + (o.direction == "up" ? "-" + x + "px" : 0) + ")" }))
                                : o.startVisible
                                ? a === 2
                                    ? (m && (m = f + " " + o.duration / 1e3 + "s " + o.delayBeforeStart / 1e3 + "s " + o.css3easing), (e = { transform: "translateY(" + (o.direction == "up" ? "-" + x + "px" : v + "px") + ")" }), a++)
                                    : a === 3 && ((o.duration = o._completeDuration), m && ((f = f + "0"), (C = i.trim(C) + "0 "), (m = f + " " + o.duration / 1e3 + "s 0s infinite " + o.css3easing)), O())
                                : (O(), (e = { transform: "translateY(" + (o.direction == "up" ? "-" + n.height() + "px" : v + "px") + ")" }))
                            : o.duplicated
                            ? (a > 2 && n.css("transform", "translateX(" + (o.direction == "left" ? 0 : "-" + r + "px") + ")"), (e = { transform: "translateX(" + (o.direction == "left" ? "-" + r + "px" : 0) + ")" }))
                            : o.startVisible
                            ? a === 2
                                ? (m && (m = f + " " + o.duration / 1e3 + "s " + o.delayBeforeStart / 1e3 + "s " + o.css3easing), (e = { transform: "translateX(" + (o.direction == "left" ? "-" + r + "px" : t + "px") + ")" }), a++)
                                : a === 3 && ((o.duration = o._completeDuration), m && ((f = f + "0"), (C = i.trim(C) + "0 "), (m = f + " " + o.duration / 1e3 + "s 0s infinite " + o.css3easing)), L())
                            : (L(), (e = { transform: "translateX(" + (o.direction == "left" ? "-" + r + "px" : t + "px") + ")" })),
                        h.trigger("beforeStarting"),
                        d)
                    ) {
                        n.css(M, m);
                        var _ = C + " { 100%  " + u(e) + "}",
                            y = n.find("style");
                        y.length !== 0 ? y.filter(":last").html(_) : i("head").append("<style>" + _ + "</style>"),
                            p(n[0], "AnimationIteration", function () {
                                h.trigger("finished");
                            }),
                            p(n[0], "AnimationEnd", function () {
                                E(), h.trigger("finished");
                            });
                    } else
                        n.animate(e, o.duration, o.easing, function () {
                            h.trigger("finished"), o.pauseOnCycle ? w() : E();
                        });
                    h.data("runningStatus", "resumed");
                };
                h.on("pause", g.pause), h.on("resume", g.resume), o.pauseOnHover && (h.on("mouseenter", g.pause), h.on("mouseleave", g.resume)), d && o.allowCss3Support ? E() : w();
            });
        }),
            (i.fn.marquee.defaults = {
                allowCss3Support: !0,
                css3easing: "linear",
                easing: "linear",
                delayBeforeStart: 1e3,
                direction: "left",
                duplicated: !1,
                duration: 5e3,
                speed: 0,
                gap: 20,
                pauseOnCycle: !1,
                pauseOnHover: !1,
                startVisible: !1,
            });
    })(jQuery),
    jQuery(function () {
        $(".bottom-scroller p").marquee({ duration: 3e4, delayBeforeStart: 0, direction: "left", duplicated: !0, startVisible: !0 });
        var i = new ScrollMagic.Controller(),
            c = new TimelineMax();
        c.fromTo(".text-section .scene-2", 1, { yPercent: 100 }, { yPercent: 0, ease: Linear.easeNone }, "+=1"), c.fromTo(".text-section .scene-3", 1, { yPercent: 100 }, { yPercent: 0, ease: Linear.easeNone }, "+=1");
        var o = new ScrollMagic.Scene({ triggerElement: ".sticky-head-section", triggerHook: "onLeave", duration: "100%" })
                .setPin(".sticky-head-section")
                .setTween(c)
                .on("start end", function (n) {
                    $(".pin-outer").toggleClass("pinned");
                })
                .addTo(i);

            h = $("#SmoothieMainContent .bottom-islide").slick({
                arrows: true,
                slidesToShow: 1,
                slidesToScroll: 1,
                fade: true,
                autoplay: false,
                prevArrow: '<button type="button" class="smoothie-btn-prev" data-role="none" aria-label="Previous Slide" role="button"><svg id="b1452a6e-ee8d-4031-9cd0-e7dc5f149903" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 14"><g id="e915ccdc-e9b0-4b3b-bf96-4dd4859109c8" data-name="Page-1"><g id="ab76f91f-977c-49ea-b359-3e0b4070ad92" data-name="Desktop-HD-Copy-4"><g id="a671275c-ab4e-4e2a-a6f8-c537811ed57c" data-name="Group-3-Copy-2"><path id="a4181871-ec13-422b-ad61-0b1f1eedea59" data-name="Fill-1" d="M0,7.14l0,.09v0l.05.09,0,0,.08.1L6.51,13.8a.69.69,0,0,0,1.18-.49.68.68,0,0,0-.2-.49L2.37,7.69H23.31a.69.69,0,1,0,0-1.38H2.37L7.49,1.18a.68.68,0,0,0,.2-.49A.7.7,0,0,0,7.49.2.68.68,0,0,0,7,0a.7.7,0,0,0-.49.2L.2,6.51l-.08.1v0l-.06.11v0l0,.09a1,1,0,0,0,0,.28" style="fill:#ff8b6a;fill-rule:evenodd"/></g></g></g></svg></button>',
                nextArrow: '<button type="button" class="smoothie-btn-next" data-role="none" aria-label="Next Slide" role="button"><svg id="a3a3d191-6d40-4c57-a826-49c0c9740b80" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 14"><g id="a7fdd962-7be7-401b-9342-bf0748a0e170" data-name="Page-1"><g id="a3cb27c0-4370-4d35-a0ab-359fe9f68378" data-name="Desktop-HD-Copy-4"><g id="ab715987-d8a9-4fbb-ac8d-09638d84d524" data-name="Group-3-Copy-2"><path id="b29254e2-4c3a-43cd-9f0a-5bcdd9c0bfc1" data-name="Fill-1" d="M24,6.86l0-.09v0l-.05-.09,0,0-.08-.1L17.49.2a.69.69,0,0,0-1.18.49.68.68,0,0,0,.2.49l5.12,5.13H.69a.69.69,0,0,0,0,1.38H21.63l-5.12,5.13a.68.68,0,0,0-.2.49.7.7,0,0,0,.2.49A.68.68,0,0,0,17,14a.7.7,0,0,0,.49-.2L23.8,7.49l.08-.1v0L24,7.26v0l0-.09a1,1,0,0,0,0-.28" transform="translate(0 0)" style="fill:#ff8b6a;fill-rule:evenodd"/></g></g></g></svg></button>',
                responsive: [
                  {
                    breakpoint: 1024,
                    settings: {
                      slidesToShow: 1,
                      slidesToScroll: 1,
                    },
                  },
                ],
                rows: 0
            });

            $(".filter-nav a").on("click", function (n) {
                n.preventDefault();
                // get the clicked filter class
                var t = $(this).data("owl-filter");
                $(".filter-nav li").removeClass("active"),
                $(this).parent().addClass("active"),
                $(".right-grid").removeClass("d-day").removeClass("d-anytime").removeClass("d-night");
                //filter slick slides based on user click for day , night and others
                $("#SmoothieMainContent .bottom-islide").slick('slickUnfilter');
                if(t == '.day'){
                    $("#SmoothieMainContent .bottom-islide").slick('slickFilter','.day');
                    $("#SmoothieMainContent .bottom-islide").slick("slickGoTo", 0);
                }
                else if(t == '.night'){
                    $("#SmoothieMainContent .bottom-islide").slick('slickFilter','.night');
                    $("#SmoothieMainContent .bottom-islide").slick("slickGoTo", 0);
                }
                else if(t == '.anytime'){
                    $("#SmoothieMainContent .bottom-islide").slick('slickFilter','.anytime');
                    $("#SmoothieMainContent .bottom-islide").slick("slickGoTo", 0);
                }
                else if(t == '.all-smooth-card'){
                    $("#SmoothieMainContent .bottom-islide").slick('slickUnfilter');
                }
            $('.bottom-carousel .smoothie-slider-footer').css('bottom','0');
            }),
            $(document).on("click",".bottom-carousel .right-grid .slick-arrow",function(e) {
               $('.bottom-carousel .slick-list .slick-track .slick-current.slick-active .b-hold a').trigger('focus');
            }),
            $("html").on("click", ".modal-cover", function (n) {
                n.preventDefault(),
                    $("body").removeClass("show-modalc"),
                    $("body").removeClass("m-day"),
                    $("body").removeClass("m-night"),
                    $("body").removeClass("m-anytime"),
                    $(".cards-holder li").removeClass("flip-card").removeClass("visible-card");
            });
    });