// admin layout control
$(document).ready(function(){
    $(".toggler").click(function(){
      const state = $(".sidenav").hasClass("sidenav-open");
      if(state)
      {
        $(".sidenav").removeClass("sidenav-open");
        $(".sidenav").addClass("sidenav-close");
  
        // section control
        $(".section").removeClass("section-open");
        $(".section").addClass("section-close");
      }
      else {
        $(".sidenav").removeClass("sidenav-close");
        $(".sidenav").addClass("sidenav-open");
  
        // section control
        $(".section").removeClass("section-close");
        $(".section").addClass("section-open");
      }
    });
  });
  