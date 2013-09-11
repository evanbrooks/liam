
  // Constants
  var fric_constant = 0.91;
  var spring_constant = 0.0008;
  var targ_spring_constant = 0.0008;
  var stretch_constant = 0.1;
  var FPS = 60;
  var switch_time = 10;
  var inset = {x: 30, y: 50};

  var arrange17 = [
    // Numeral 1
    {x: -1, y: 1},
    {x: 0, y: 0},
    {x: 0, y: 1},
    {x: 0, y: 2},
    {x: 0, y: 3},
    {x: 0, y: 4},
    {x: 0, y: 5},

    // Top bar
    {x: 2, y: 0},
    {x: 3, y: 0},
    {x: 4, y: 0},
    {x: 5, y: 0},

    // Squiggle
    {x: 4.95, y: 0.92},
    {x: 4.63, y: 1.78},
    {x: 4.08, y: 2.52},
    {x: 3.53, y: 3.25},
    {x: 3.14, y: 4.09},
    {x: 3.00, y: 5.00},

  ];
  var arrange17spacer = 80;

  var arrangeMsg = [
    {x: 0, y: 0}, // h
    {x: 1, y: 0}, // a
    {x: 2, y: 0}, // p
    {x: 3, y: 0}, // p
    {x: 4, y: 0}, // y

    {x: 0, y: 1}, // b
    {x: 1, y: 1}, // i
    {x: 2, y: 1}, // r
    {x: 3, y: 1}, // t
    {x: 4, y: 1}, // h
    {x: 5, y: 1}, // d
    {x: 6, y: 1}, // a
    {x: 7, y: 1}, // y

    {x: 0, y: 2}, // l
    {x: 1, y: 2}, // i
    {x: 2, y: 2}, // a
    {x: 3, y: 2}, // m

  ];

  var thing = [];

  // Utilities
  var doc = document;
  var reset = {x:0, y:0};
  var wind = {w: window.innerWidth, h: window.innerHeight};
  var bumper = wind.w / 8
  var mouse = {x:0, y:0};
  var pmouse = {x:0, y:0};
  var tick = 1000 / FPS;
  var box1, gravitator;
  var this_is_an_iphone = isiPhone();

  $(function(){
    if (this_is_an_iphone) x = 1; //$("body").on("touchmove", finger);
    else                   doc.body.addEventListener("mousemove", cursor, false);
    
    for (var i = 17; i > 0; i--) {
      thing[i-1] = new Physical("box" + i);

      var x = Math.random() * wind.w;
      var y = Math.random() * wind.h;
      thing[i-1].move({x: x, y: y});

      thing[i-1].vel = {
        x: (Math.random() * 4 - 2),
        y: (Math.random() * 4 - 2)
      };

    }
    resize();



    var toggle = true;
    function switch_toggle(){
      $("head style").remove();
      if (toggle) {
        set_position("numeral");
        toggle = false;
      }
      else {
        set_position("message");
        toggle = true;
      }
    }
    setInterval(switch_toggle, switch_time * 1000);

    //thing1.move({x: wind.w - 200, y: wind.h*2/3}).coast();
    //thing2.move({x: 200, y: wind.h/3}).coast();

    window.onresize = resize;
  });






  function set_position(pos) {

    for (var i = 17; i > 0; i--) {
      thing[i-1].vel = {
        x: (Math.random() * 4 - 2),
        y: (Math.random() * 4 - 2)
      };
    }

    if (pos == "numeral") {
      var horiz_centerer = (wind.w / 2) - 2 * arrange17spacer;
      var vert_centerer = (wind.h / 2) - 3 * arrange17spacer;

      for (var i = 17; i > 0; i--) {
        var targx = arrange17[i-1].x * arrange17spacer + horiz_centerer;
        var targy = arrange17[i-1].y * arrange17spacer + vert_centerer;
        thing[i-1].targ = {x: targx, y: targy};
      }

      for (var i = 17; i > 0; i--) {
        thing[i-1].coast();
      }

    }

    if (pos == "message") {
      var horiz_centerer = (wind.w / 2) - 3 * arrange17spacer;
      var vert_centerer = (wind.h / 2) - 1.5 * arrange17spacer;

      for (var i = 17; i > 0; i--) {
        var targx = arrangeMsg[i-1].x * arrange17spacer + horiz_centerer;
        var targy = arrangeMsg[i-1].y * arrange17spacer + vert_centerer;
        thing[i-1].targ = {x: targx, y: targy};
      }

      for (var i = 17; i > 0; i--) {
        thing[i-1].coast();
      }
    }

  }





  function cursor(e) {
    pmouse = mouse;
    mouse = { x: e.pageX, y: e.pageY };
  }

  function finger(e) {
    e.preventDefault();
    if (e.changedTouches) {
      pmouse = mouse;
      mouse = { x: e.changedTouches[0].pageX, y: e.changedTouches[0].pageY };
    }
  }







  var after;
  function resize() {
    wind = {w: window.innerWidth, h: window.innerHeight};
    bumper = wind.w / 8;

    if (wind.w < 500) {
      arrange17spacer = 40;
    }
    else {
      arrange17spacer = 80;
    }

    clearTimeout(after);
    after = setTimeout(reset_after_resize, 200);
  }
  function reset_after_resize() {
    set_position("message");
  }














  function Physical(selector) {
    var self = this;
    self.move = function(go) {
      self.pos = { x: go.x,
                y: go.y };
      //$("#log").html(build_tform(self.pos.x, self.pos.y, self.pos.vel));
      self.el.style.webkitTransform = build_tform(self.pos.x, self.pos.y, self.pos.vel);
      return self;
    };
    self.make_draggable = function(phys) {
      self.physics = phys;
      if (this_is_an_iphone) {
        doc.body.addEventListener('touchmove',self.drag,false);
        self.el.addEventListener('touchstart',self.start,false);
        doc.body.addEventListener('touchend',self.end,false);
      }
      else {
        self.el.addEventListener('mousedown',self.start,false);
        doc.body.addEventListener('mouseup',self.end,false);
        doc.body.addEventListener('mousemove',self.drag,false);
      }
    };
    self.start = function(e) {
      e.preventDefault();
      if (this_is_an_iphone) finger(e);

      // If animating right now, puase animation and move to correct spot
      self.el.style.webkitAnimationPlayState = "paused";
      self.move({x: self.$el.offset().left, y: self.$el.offset().top});
      self.el.style.webkitAnimationName = "";
      self.vel = {x:0, y:0};

      // Begin drag
      self.off = {x: mouse.x - self.pos.x, y: mouse.y - self.pos.y};
      self.am_dragging = true;
      self.didnt_move = true;
    };
    self.drag = function(e) {
      if (this_is_an_iphone) finger(e);
      if (self.am_dragging) {
        self.didnt_move = false;
        self.currT = get_time();
        self.T =  self.currT - self.lastT;
        self.vel = {x: (mouse.x - pmouse.x)/self.T, y: (mouse.y - pmouse.y)/self.T};
        self.move({ x:mouse.x - self.off.x, y: mouse.y - self.off.y });
        self.lastT = self.currT;
      }
    };
    self.end = function() {
      self.el.style.webkitAnimationPlayState = "running";
      if (self.am_dragging) {
        self.am_dragging = false;
        self.coast();
      }
    };


    function reachedWall() {
        return ( Math.abs(self.vel.x) < 0.1 && Math.abs(self.vel.y) < 0.1 &&
             (Math.abs(self.pos.x - inset.x) < 0.5 || Math.abs(self.pos.x - (wind.w - inset.x)) < 0.5));
    }

    // Returns true when animation should be completed and cleaned up
    function reachedTarget() {
        return ( Math.abs(self.vel.x) + Math.abs(self.vel.y) < 0.5 &&
                 Math.abs(self.xdist) + Math.abs(self.ydist) < 0.5 );
    }


    self.coast = function() {
      var counter = 0;
      self.anim_list = [];
      self.ydist = Math.abs(self.targ.y - self.pos.y);
      self.xdist = Math.abs(self.targ.x - self.pos.x);

      while ( !reachedTarget() ) {
        // spring towards center of gravity

        self.ydist = Math.abs(self.targ.y - self.pos.y);
        self.xdist = Math.abs(self.targ.x - self.pos.x);
        self.dist = Math.sqrt(self.xdist*self.xdist + self.ydist*self.ydist);
        
        springwall(self);
        gravitate(self);


        // if (isNaN(self.vel.x)) self.vel.x = 0;
        // if (isNaN(self.vel.y)) self.vel.y = 0;
        // if (isNaN(self.pos.x)) self.pos.x = 0;
        // if (isNaN(self.pos.y)) self.pos.y = 0;

        // Apply friction
        self.vel.x *= fric_constant;
        self.vel.y *= fric_constant;

        // Update position based on size of 'tick'
        self.pos.x += self.vel.x * tick;
        self.pos.y += self.vel.y * tick;

        // Copy properties into list for animation
        var copied = {x: self.pos.x, y: self.pos.y};
        self.anim_list.push(copied);

        counter++;
        if (counter > 1000) {
          // console.log("Looped more than 1000 times: cancelling!");
          break;
        }
      }

      // Build and insert CSS animation
      var css = build_css(self, self.anim_list);
      insert_css(self.anim_id, css);

      // Build and apply CSS property referencing animation
      var t = (self.anim_list.length)/60;
      if (t < 1 || isNaN(t)) t = 1;
      self.el.style.webkitAnimationName = self.anim_id;
      self.el.style.webkitAnimationDuration = t +"s";
      self.el.style.webkitAnimationTimingFunction = "linear";

      // Move to end position, for when animation has completed
      self.move(self.targ);

    };
    self.initiate = function() {
      self.selector = selector;                // Div id name
      self.$el = $("#" + selector);            // Jquery object
      self.el = doc.getElementById(selector);  // DOM Node
      self.inner = self.el.getElementsByClassName("inner")[0];
      self.physics = false;                    // Whether it responds to physics
      self.size = {                            // Div size
        w: self.el.offsetWidth,
        h: self.el.offsetHeight
      };
      self.pos = {x:0, y:0};                   // Position
      self.vel = {x:0, y:0};                   // Velocity
      self.targ = {x:0, y:0};                  // Target velocity
      self.T = 0;                              // Time
      self.anim_list = [];                     // List of animation properties
      self.lastT = 0;                          // previous Time
      self.currT = 0;                          // current Time
      self.anim_id = "anim_0";                 // Name of animation

      self.el.addEventListener("webkitAnimationEnd", function(){
        self.el.style.webkitAnimationName = "";
        remove_node(self.anim_id);
      });
      self.make_draggable(true);
    };
    self.initiate();
  }








  function gravitate(i) {
    var springiness = i.dist * targ_spring_constant;
    var ypercent = (i.targ.y - i.pos.y)/(i.xdist + i.ydist);
    var xpercent = (i.targ.x - i.pos.x)/(i.xdist + i.ydist);

    i.vel.x += xpercent * springiness;
    i.vel.y += ypercent * springiness;
  }






  function springwall(it) {
    var xspring, yspring;

    // X Position
    if      (it.pos.x < bumper)            xspring = bumper - it.pos.x;
    else if (it.pos.x > wind.w - bumper)   xspring = -bumper + (wind.w - it.pos.x);
    else                                   xspring = 0;

    // Y Position
    if      (it.pos.y < bumper)            yspring = bumper - it.pos.y;
    else if (it.pos.y > wind.h - bumper)   yspring = -bumper + (wind.h - it.pos.y);
    else                                   yspring = 0;

    // Update velocity
    it.vel.x += xspring * spring_constant;
    it.vel.y += yspring * spring_constant;
  }













  // Reset
  // -----
  function reset(obj) {
    obj.x = 0;
    obj.y = 0;
  }


  // Time utility functions
  // ----------------------
  function get_time() {
    if (window.performance) return performance.now();
    else return Date.now();
  }


  // Transformation Utility functions
  // --------------------------------

  function build_tform(x,y,vel) {
    vel = typeof vel !== 'undefined' ? vel : {x: 0, y: 0};
    var v = 1 + stretch_constant*(Math.sqrt(vel.x*vel.x + vel.y*vel.y));
    var a = Math.atan2(vel.x,vel.y);
      return "translate3d("+
        ~~(x * 1000)/1000 +"px,"+
        ~~(y * 1000)/1000 +"px,0) ";
  }


  // CSS Utility functions
  // ---------------------

  function build_css(thing, list) {
    var len = list.length;
    thing.anim_id = thing.selector + "-anim_" + (parseInt(thing.anim_id.split("_")[1], 10) + 1);

    // Build first css
    var css = "";
    css += "@-webkit-keyframes "+thing.anim_id+" {";
    for (i = 0; i < len; i++) {
      css += ~~(i/len * 10000)/100 + "% {";
      css += "-webkit-transform: " + build_tform(list[i].x, list[i].y, list[i].vel)+";}\n ";
    }
    css += "}\n";

    return css;
  }

  function insert_css(id, css) {
      var style = doc.createElement('style');
      style.type = 'text/css';
      style.id = id;
      style.className = "animstyle";
      if (style.styleSheet){
        style.styleSheet.cssText = css;
      } else {
        style.appendChild(doc.createTextNode(css));
      }
      doc.head.appendChild(style);
  }

  function remove_node(id) {
    n = doc.getElementById(id);
    if (n) n.parentNode.removeChild(n);
  }

  function isiPhone(){
    return (
        //Detect iPhone
        (navigator.platform.indexOf("iPhone") != -1) ||
        //Detect iPod
        (navigator.platform.indexOf("iPod") != -1)
    );
  }

