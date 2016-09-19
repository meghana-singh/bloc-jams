
var pointsArray = document.getElementsByClassName('point');

var revealPoint = function (point) {
    point.style.opacity = 1;
    point.style.transform = "scaleX(1) translateY(0)";
    point.style.msTransform = "scaleX(1) translateY(0)";
    point.style.WebkitTransform = "scaleX(1) translateY(0)";
};

/****************Animate function ***************************/
var animatePoints = function (points) {
    forEach(points, revealPoint);    //foreach(array, function)
};

/**********************************************************************************/
/* Once the page is loaded, make the animation visible when the user scrolls down */
/**********************************************************************************/
window.onload = function() {
     // Automatically animate the points on a tall screen where scrolling can't trigger the animation
     if (window.innerHeight > 950) {
         animatePoints(pointsArray);
     }
    
    //Get the first element that is associated with the class:selling-points.
    //Use the position of this element which is relative to the viewport for starting the animation - making visible the selling points.
    
    var sellingPoints = document.getElementsByClassName('selling-points')[0];
    var scrollDistance = sellingPoints.getBoundingClientRect().top - window.innerHeight + 200;
    
    //Event listener listens for scroll event and calls the function for animation.
    window.addEventListener("scroll", function(event) {
                            console.log("Current offset from the top is " + sellingPoints.getBoundingClientRect().top + " pixels");
                            if (document.documentElement.scrollTop || document.body.scrollTop >= scrollDistance) {
                            //if (document.body.scrollTop >= scrollDistance) {
                            //if (document.documentElement.scrollTop) {
                                animatePoints(pointsArray);   
                            }
                        });
}


/* animatePoints();*/