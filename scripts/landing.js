var animatePoints = function () {
    "use strict";
    var points = document.getElementsByClassName('point');
        
    for (var i=0; i<points.length; i++) {
      revealPoint(i);    
    }
    
    function revealPoint (pointIndex) {
        points[pointIndex].style.opacity = 1;
        points[pointIndex].style.transform = "scaleX(1) translateY(0)";
        points[pointIndex].style.msTransform = "scaleX(1) translateY(0)";
        points[pointIndex].style.WebkitTransform = "scaleX(1) translateY(0)";
    }
};

/* animatePoints();*/