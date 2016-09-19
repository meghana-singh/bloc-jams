
/****************Animate function ***************************/
var animatePoints = function () {
     var revealPoint = function() {
         // #7
         $(this).css({
             opacity: 1,
             transform: 'scaleX(1) translateY(0)'
         });
     };
  $.each($('.point'), revealPoint);    
};

/**********************************************************************************/
/* Once the page is loaded, make the animation visible when the user scrolls down */
/**********************************************************************************/
/* Use jQuery library and its methods to do the same functions that javascript does.*/

$(window).load(function () {
     // Automatically animate the points on a tall screen where scrolling can't trigger the animation
     if ($(window).height > 950) {
         animatePoints();
     }
    
    //Get the first element that is associated with the class:selling-points.
    //Use the position of this element which is relative to the viewport for starting the animation - making visible the selling points.
    var scrollDistance = $('.selling-points').offset().top - $(window).height() + 200;
    
    //Event listener listens for scroll event and calls the function for animation.
    $(window).scroll(function(event) {
            if ($(window).scrollTop() >= scrollDistance) {
                animatePoints();
            }
    });
});


/* animatePoints();*/
