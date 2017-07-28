$(function($) {

  var mark2web = {
    
    // page elements
    sidebar_id: $("#sidebar"),
    content_id: $("#content"),
    back_to_top_id: $("#back_to_top"),
    loading_id: $("#loading"),
    error_id: $("#error"),
    prog_id : $('#progress'),
   
    // display elements
    highlight_code: true,
    sidebar: true, // mobile hide
    back_to_top_button: true,
    save_progress: true, 
    flip_chapter:true,

    // data
    link_list:[],

    // initialize function
    run: initialize
  };

  function initialize() {
    // initialize sidebar 
    if (mark2web.sidebar) {
      init_sidebar_section();
    }

    // initialize back_to_top button
    if (mark2web.back_to_top_button) {
      init_back_to_top_button();
    }

    // intialize flip_chapter
    if(mark2web.flip_chapter){
      init_flip_chapter();
    }

    // intialize progress
    if(mark2web.save_progress){
      init_save_progress();
    }

    // intialize highligh.js
    if (mark2web.highlight_code) {
      hljs.initHighlightingOnLoad();
    }

    // hashchange listener
    router();
    $(window).on('hashchange', router);
  }

  function li_create_linkage(li_tag, header_level) {
    // add custom id and class attributes
    html_safe_tag = replace_symbols(li_tag.text());
    li_tag.attr("id", html_safe_tag);
    li_tag.attr("class", "link");

    // add click listener - on click scroll to relevant header section
    li_tag.click(function() {
      // scroll to relevant section
      var header = $("h" + header_level + "." + li_tag.attr("id"));
      $('html, body').animate({
        scrollTop: header.offset().top
      }, 300);

      // highlight the relevant section
      original_color = header.css("color");
      header.animate({ color: "#ED1C24", }, 500, function() {
        // revert back to orig color
        $(this).animate({color: original_color}, 2500);
      });
    });
  }

  function create_page_anchors() {
    // create page anchors by matching li's to headers
    // if there is a match, create click listeners
    // and scroll to relevant sections

    // go through header level 2 and 3
    
    // parse all headers
    var headers = [];
    $(mark2web.content_id.selector + ' h2').map(function() {
      var header=$(this).text();
      headers.push(header);
      $(this).addClass(replace_symbols(header));
      //this.id=replace_symbols(header);
    });  

      // parse and set links between li and h2
      // $(mark2web.content_id.selector + ' ul li').map(function() {
      //   for (var j = 0; j < headers.length; j++) {
      //     if (headers[j] === $(this).text()) {
      //       li_create_linkage($(this), i);
      //     }
      //   }
      // });
      // inner page nav
    if (headers.length !== 0) {
      var p_tag=$('<p>Contents:</p>').insertAfter('#content h1');
      var ul_tag = $('<ul></ul>')
        .insertAfter(p_tag)
        .addClass('content-toc')
        .attr('id', 'content-toc');
      for (var j = 0; j < headers.length; j++) {
        var li_tag = $("<li></li>")
          .html(headers[j]);
        ul_tag.append(li_tag);
        li_create_linkage(li_tag, 2);
      }

    }
  }

  function normalize_paths() {
    // images
    mark2web.content_id.find("img").map(function() {

      // var src = $(this).attr("src").replace("./", "");
      // not begin with http
      if ($(this).attr("src").slice(0, 4) !== "http") {
        $(this).attr("src", "docs/" + $(this).attr("src"));
        // var base_dir = 'doc';
        // var src = $(this).attr("src");
        // docs/how_does_it_work"->docs
        // var url = location.hash.replace("#", "");
        // var base_dir = url.split("/")[0];
        // split and extract base dir
        // url = url.split("/");
        //docs
        // var base_dir = url.slice(0, url.length - 1).toString();

        // normalize the path (i.e. make it absolute)
        // $(this).attr("src", base_dir + "/" + src);
        
      }
    });
  }

  function compile_into_dom(path, data) {
    hide_errors();

    // render and h1-6 will auto add id attr
    mark2web.content_id.html(marked(data));

    // set document.title
    var title= $(mark2web.content_id.selector+" h1").text();
    if(title!==mark2web.document_title){
      document.title = title+ " - " +mark2web.document_title;
    }

    stop_loading();

    // images/xx.png->docs/images/xx.png
    normalize_paths();

    // 
    create_page_anchors();

    // 代码高亮
    if (mark2web.highlight_code) {
      $('pre code').each(function(i, block) {
        hljs.highlightBlock(block);
      });
    }

    // 隐藏首页“上一章”&末页“下一章”
    var hash=location.hash;
    if(hash===mark2web.link_list[0]||hash===''){
      $('#pageup').css('display', 'none');
    }else{
      $('#pageup').css('display', 'inline-block');
    }
    if(hash===mark2web.link_list[mark2web.link_list.length-1]){
      $('#pagedown').css('display', 'none');
    }else{
      $('#pagedown').css('display', 'inline-block');
    }
  }

  function router() {

    // window scrollTo top
    window.scrollTo(0, 0);

    // progress reset
    // if (mark2web.save_progress && store.get('list-progress') !== location.hash) {
    //   store.set('list-progress', location.hash);
    //   store.set('page-progress', 0);
    // }

    // ajax url
    var path = location.hash.replace("#", "./");

    // default page if hash is empty
    // var current_page = location.pathname.split("/").pop();
    
    // if (location.pathname === "/index.html") {
    //   path = location.pathname.replace("index.html", mark2web.index);
    //   normalize_paths();
    //   //console.log("location.pathname change to readme.md")
    // } else 
    if (path === "") {
      path = location.pathname + mark2web.index;
      // normalize_paths();
    } else {
      path = path + ".md";
    }

    // 取消scroll事件的监听函数
    // 防止改变下面的变量perc的值
    // $(window).off('scroll');

    // get md file to render 
    show_loading();
    $.get(path, function(data) {
      compile_into_dom(path, data);
    }).fail(function() {
      show_error("Opps! ... File not found!");
      stop_loading();
    });
  }

  function updateProgress(perc) {
    mark2web.prog_id.css({width: perc * 100 + '%'});
    store.set('page-progress', perc);
  } 

  function init_save_progress() {
  
    // scroll listener
    // hash change rerender #content will trigger window scroll
    $(window).on('scroll', function() {
      var $w = $(window);
      var wh = $w.height();
      var h = $('body').height();
      var sHeight = h - wh;
      window.requestAnimationFrame(function(){
        // var perc = Math.max(0, Math.min(1, $w.scrollTop() / sHeight));
        var perc = $w.scrollTop() / sHeight;
        updateProgress(perc);
      });
    });
  }

  function init_flip_chapter() {

    // click listener
    $('#pageup').on('click',function(){
      var hash = location.hash;
      for(var i=0;i<mark2web.link_list.length;i++){
        // empty
        if(hash==='') break;
        // no flip
        if(hash===mark2web.link_list[i]) break;
      }
      location.hash=mark2web.link_list[i-1];
    });

    $('#pagedown').on('click',function(){
      var hash = location.hash;
      for(var i=0;i<mark2web.link_list.length;i++){
        if(hash==='') break;
        if(hash===mark2web.link_list[i]) break;
      }
      location.hash=mark2web.link_list[i+1];
    });
  }

  function init_back_to_top_button() {
    mark2web.back_to_top_id.show();
    mark2web.back_to_top_id.on("click", function() {
      $("body, html").animate({
        scrollTop: 0
      }, 200);
    });
  }

  function create_link_list(){
    
    mark2web.sidebar_id.find('li a').map(function(){
      
      var index=this.href.indexOf('#doc');
      // only push begin with #doc
      if(index!==-1){
        mark2web.link_list.push(this.href.slice(index));
      }
    })
  }

  function init_sidebar_section() {
    $.get(mark2web.sidebar_file, function(data) {
      mark2web.sidebar_id.html(marked(data));

      // sidebar link list
      create_link_list()

    }, "text").fail(function() {
      alert("Opps! can't find the sidebar file to display!");
    });
  }

  function replace_symbols(text) {
    // replace symbols with underscore
    return text.replace(/[&\/\\#,+=()$~%.'":*?<>{}\ \]\[]/g, "_");
  }

  function show_error(err_msg) {
    mark2web.error_id.html(err_msg);
    mark2web.error_id.show();
  }

  function hide_errors() {

    mark2web.error_id.hide();
  }

  function show_loading() {
    mark2web.loading_id.show();
    mark2web.content_id.html("");  // clear content

    // infinite loop until clearInterval() is called on loading
    mark2web.loading_interval = setInterval(function() {
      mark2web.loading_id.fadeIn(1000).fadeOut(1000);
    }, 2000);

  }

  function stop_loading() {
    clearInterval(mark2web.loading_interval);
    mark2web.loading_id.hide();
  }
  // var perc = mark2web.save_progress ? store.get('page-progress') || 0 : 0;

  window.mark2web = mark2web;
});
