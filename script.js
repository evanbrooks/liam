// (function(){

  // Constants
  var fric_constant = 0.91;
  var spring_constant = 0.0008;
  var targ_spring_constant = 0.004;
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
  var wall_thickness = wind.w / 8
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
      var horiz_centerer = (wind.w / 2) - 4 * arrange17spacer;
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
    wall_thickness = wind.w / 8;

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
    var i = this;
    i.move = function(go) {
      i.pos = { x: go.x,
                y: go.y };
      //$("#log").html(build_tform(i.pos.x, i.pos.y, i.pos.vel));
      i.el.style.webkitTransform = build_tform(i.pos.x, i.pos.y, i.pos.vel);
      return i;
    };
    i.make_draggable = function(phys) {
      i.physics = phys;
      if (this_is_an_iphone) {
        doc.body.addEventListener('touchmove',i.drag,false);
        i.el.addEventListener('touchstart',i.start,false);
        doc.body.addEventListener('touchend',i.end,false);
      }
      else {
        i.el.addEventListener('mousedown',i.start,false);
        doc.body.addEventListener('mouseup',i.end,false);
        doc.body.addEventListener('mousemove',i.drag,false);
      }
    };
    i.start = function(e) {
      e.preventDefault();
      if (this_is_an_iphone) finger(e);

      // If animating right now
      i.el.style.webkitAnimationPlayState = "paused";
      i.move({x: i.$el.offset().left, y: i.$el.offset().top});
      i.el.style.webkitAnimationName = "";
      i.vel = {x:0, y:0};

      // Begin drag
      i.off = {x: mouse.x - i.pos.x, y: mouse.y - i.pos.y};
      i.am_dragging = true;
      i.didnt_move = true;
    };
    i.drag = function(e) {
      if (this_is_an_iphone) finger(e);
      if (i.am_dragging) {
        i.didnt_move = false;
        i.currT = get_time();
        i.T =  i.currT - i.lastT;
        i.vel = {x: (mouse.x - pmouse.x)/i.T, y: (mouse.y - pmouse.y)/i.T};
        i.move({ x:mouse.x - i.off.x, y: mouse.y - i.off.y });
        i.lastT = i.currT;
      }
    };
    i.end = function() {
      i.el.style.webkitAnimationPlayState = "running";
      if (i.am_dragging) {
        i.am_dragging = false;
        i.anim_list = [];
        console.log(i.dist);
        i.coast();
      }
    };
    function reachedWall() {
        return ( Math.abs(i.vel.x) < 0.1 && Math.abs(i.vel.y) < 0.1 &&
             (Math.abs(i.pos.x - inset.x) < 0.5 || Math.abs(i.pos.x - (wind.w - inset.x)) < 0.5));
    }

    function reachedTarget() {
        return ( Math.abs(i.vel.x) + Math.abs(i.vel.y) < 0.5 &&
                 Math.abs(i.xdist) + Math.abs(i.ydist) < 0.5 );
    }
    i.coast = function() {
      var counter = 0;
      i.anim_list = [];
      i.ydist = Math.abs(i.targ.y - i.pos.y);
      i.xdist = Math.abs(i.targ.x - i.pos.x);

      while ( !reachedTarget() ) {
        // spring towards center of gravity

        i.ydist = Math.abs(i.targ.y - i.pos.y);
        i.xdist = Math.abs(i.targ.x - i.pos.x);
        i.dist = Math.sqrt(i.xdist*i.xdist + i.ydist*i.ydist);
        
        springwall(i);
        gravitate(i);


        i.vel.x *= fric_constant;
        i.vel.y *= fric_constant;

        // if (isNaN(i.vel.x)) i.vel.x = 0;
        // if (isNaN(i.vel.y)) i.vel.y = 0;
        // if (isNaN(i.pos.x)) i.pos.x = 0;
        // if (isNaN(i.pos.y)) i.pos.y = 0;

        i.pos.x += i.vel.x * tick;
        i.pos.y += i.vel.y * tick;

        var copied = {x: i.pos.x, y: i.pos.y, vel: {x:i.vel.x, y:i.vel.y}};
        i.anim_list.push(copied);

        counter++;
        if (counter > 1000) {
          // console.log("Looped more than 1000 times: cancelling!");
          break;
        }
      }

      // console.log(i.anim_list.length);

      //$head.append(build_css(i, i.anim_list));

      var css = build_css(i, i.anim_list);
      insert_css(i.anim_id, css);

      var t = (i.anim_list.length)/60;
      if (t < 1 || isNaN(t)) t = 1;
      //i.$el.css("-webkit-animation", i.anim_id +" "+ t +"s linear 1");
      i.el.style.webkitAnimationName = i.anim_id;
      i.el.style.webkitAnimationDuration = t +"s";
      i.el.style.webkitAnimationTimingFunction = "linear";

      // Move to end position for when animation has completed
      i.move(i.targ);

    };
    i.chat = function() {
      // 
    };
    i.initiate = function() {
      i.selector = selector;
      i.$el = $("#" + selector);
      i.el = doc.getElementById(selector);
      i.inner = i.el.getElementsByClassName("inner")[0];
      i.physics = false;
      i.size = {w: i.el.offsetWidth, h: i.el.offsetHeight};
      i.pos = {x:0, y:0};
      i.vel = {x:0, y:0};
      i.targ = {x:0, y:0};
      i.T = 0;
      i.anim_list = [];
      i.lastT = 0;
      i.currT = 0;
      i.anim_id = "anim_0";
      i.chatting = false;
      i.el.addEventListener("webkitAnimationEnd", function(){
        i.el.style.webkitAnimationName = "";
        remove_node(i.anim_id);
      });
      i.make_draggable(true);
    };
    i.initiate();
  }
  function gravitate(i) {
    var springiness = i.dist * targ_spring_constant;
    var ypercent = (i.targ.y - i.pos.y)/(i.xdist + i.ydist);
    var xpercent = (i.targ.x - i.pos.x)/(i.xdist + i.ydist);

    i.vel.x += xpercent * springiness;
    i.vel.y += ypercent * springiness;
  }

  function springwall(i) {
    var xspring = 0, yspring = 0;
    var xdist = i.pos.x, ydist = i.pos.y;

    // X Position
    if (xdist < wall_thickness) {
      xspring = (wall_thickness - xdist) * spring_constant;
    }
    else if (xdist > wind.w - wall_thickness) {
      xdist = wind.w - i.pos.x;
      xspring = - (wall_thickness - xdist) * spring_constant;
    }   
    else {
      xspring = 0;
    }

    // Y Position
    if (ydist < wall_thickness) {
      yspring = (wall_thickness - ydist) * spring_constant;
    }
    else if (ydist > wind.h - wall_thickness) {
      ydist = wind.h - i.pos.y;
      yspring = - (wall_thickness - ydist) * spring_constant;
    }   
    else {
      yspring = 0;
    }


    i.vel.x += xspring;
    i.vel.y += yspring;
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
        ~~(y * 1000)/1000 +"px,0) "+
        //"rotate("+ ~~(-a*100)/100 +"rad) " +
        //"scale(1,"+ ~~(v*100)/100 +")" +
        " ";
  }

  // function build_counter_tform(vel) {
  //   vel = typeof vel !== 'undefined' ? vel : {x: 0, y: 0};
  //   var a = Math.atan2(vel.x,vel.y);
  //     return "rotate("+ ~~(a*100)/100 +"rad) ";
  // }



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

    // Build counter-rotate css
    // css += "@-webkit-keyframes "+thing.anim_counter_id+" {";
    // for (i = 0; i < len; i++) {
    //   css += ~~(i/len * 10000)/100 + "% {";
    //   css += "-webkit-transform: " + build_counter_tform(list[i].vel)+";}\n ";
    // }
    // css += "}";

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

// })();
