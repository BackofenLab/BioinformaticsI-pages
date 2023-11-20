
 function getRandomNumber(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

function displayRandomImage(svgImage, left, top, scale, rotation, zindex=-99, image_id=null) {
    // Get a reference to the "img" folder
    var imgFolder = "assets/img/";

    // List of SVG image file names in the "img" folder
    // Choose a random SVG image from the list
    // Create an image element and set its attributes
    if (image_id) {
      var image = document.createElement("object");
      image.id = image_id
      image.data = imgFolder + svgImage; // Replace with your SVG file path
      image.type = "image/svg+xml";

    } else {
      var image = new Image();
      image.src = imgFolder + svgImage;
      image.style.width = "100px"
      image.style.transform = `rotate(${rotation}deg)`;
      image.style.transform += ` scale(${scale})`;
    }



    image.className = "random-image";
    image.style.position = "fixed";
    image.style.zIndex = zindex;
    image.style.left = left + "%"; // Adjust as needed
    image.style.top = top + "%"; // Adjust as needed

    // Add a click event listener to make the image disappear
    image.addEventListener("click", function() {
       image.style.display = "none"; // Hide the object when clicked
       document.body.removeChild(image);
    });

    // Append the image to the body
    document.body.appendChild(image);
}

function determineTheme(){
  const currentTime = new Date();
  const currentMonth = currentTime.getMonth(); // Get the month (0-11)
  if (currentMonth == 9){
    halloweenTheme()
  }
  if (currentMonth == 11){
    christmasTheme()
  }

}

function halloweenTheme(){
  displayRandomImage("bat.svg", 10, 10, 1.5, 25);
  displayRandomImage("bat.svg", 2, 30, 2, -30);
  displayRandomImage("bat.svg", 25, 60, 1, 10);
  displayRandomImage("witch.svg", 85, 20, 2, 8);
  var w = window.innerWidth;
  if (w < 450) {
    var pos = 60;
  } else {
    var pos = 80;
  }
  displayRandomImage("pumpkin.svg", pos, 70, 3, 8, zindex=1, image_id="pumpkin-svg");
  document.documentElement.style.setProperty('--ufr-main-blue', "#171512");
  document.documentElement.style.setProperty('--active-item-color', "rgb(219, 134, 7)");
  document.documentElement.style.setProperty('--selector-color', "rgba(219, 134, 7, 0.3)");
  document.documentElement.style.setProperty('--selectedCell', "rgb(219, 134, 7, 0.4)");
  document.documentElement.style.setProperty('--font-family', 'Creepster,"Source Sans Pro",Calibri,Candara,Arial,sans-serif');
  document.body.style.backgroundImage = "url('assets/img/GraveYard.svg')";
  document.body.style.backgroundSize = "cover"
  document.body.style.backgroundAttachment = "fixed"
  document.body.style.backgroundPosition = "center bottom"
    var svgObject = document.getElementById("pumpkin-svg");
  var scrollTimeout;
  svgObject.onload = function() {
    var svgDocument = svgObject.contentDocument;
    // Access and manipulate elements in the SVG
    if (svgDocument) {
        var svgElement = svgDocument.querySelector("svg");
        svgElement.onclick = function() {
        // Remove the SVG element from the DOM
        parent = svgElement.parentNode

        parent.removeChild(svgElement);
        svgObject.remove();

        };

        const eye1 = svgElement.getElementById('tofill1');
        const eye2 = svgElement.getElementById('tofill2');
        const eye3 = svgElement.getElementById('tofill3');
        const eye4 = svgElement.getElementById('tofill4');

        eye1.style.fill = "black"
        eye2.style.fill = "black"
        eye3.style.fill = "black"
        eye4.style.fill = "black"

        document.addEventListener('scroll', function() {
            eye1.style.fill = "#ffee0a";
            eye2.style.fill = "#ffee0a";
            eye3.style.fill = "#ffee0a";
            eye4.style.fill = "#ffee0a";
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(function() {
            eye1.style.fill = 'black';
            eye2.style.fill = "black";
            eye3.style.fill = "black";
            eye4.style.fill = "black";
            }, 200);
        });
            // You can now access and manipulate elements in the SV
    }
};


}



function christmasTheme(){

  //document.documentElement.style.setProperty('--ufr-main-blue', "#007550");
  //document.documentElement.style.setProperty('--active-item-color', "#007550");
  document.documentElement.style.setProperty('--exercise-bg-color', "white");

  document.body.style.backgroundColor = "#0F8A5F";
  var script = document.createElement('script');

  // Set the source attribute to the URL of snowflakes.js
  script.src = 'assets/js/snowflakes.js';
  script.onload = function() {
    letItSnow();
  };
  document.head.appendChild(script);
  document.body.style.backgroundImage = "url('assets/img/WinterWonderland.svg')";
  document.body.style.backgroundSize = "cover"
  document.body.style.backgroundAttachment = "fixed"
  document.body.style.backgroundPosition = "center bottom"
  var w = window.innerWidth;
  if (w < 450) {
    var pos = 60;
  } else {
    var pos = 80;
  }
  displayRandomImage("reindeer.svg", pos, 75, 1, 0, zindex=1, image_id="reindeer-svg");
  document.documentElement.style.setProperty('--font-family', 'Festive,"Source Sans Pro",Calibri,Candara,Arial,sans-serif');
  var svgObject = document.getElementById("reindeer-svg");
  var scrollTimeout;
  svgObject.onload = function() {
    var svgDocument = svgObject.contentDocument;
    // Access and manipulate elements in the SVG
    if (svgDocument) {
        var svgElement = svgDocument.querySelector("svg");
        svgElement.onclick = function() {
        // Remove the SVG element from the DOM
        svgElement.parentNode.removeChild(svgElement);
        svgObject.remove();

        };


        const rect = svgElement.getElementById('reindeerNose');
        document.addEventListener('scroll', function() {
            rect.style.fill = "#e30613";
            rect.style.stroke = "#e30613"
            rect.style.strokeWidth = 1;
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(function() {
            rect.style.fill = '#4e3824';
            rect.style.stroke = "none"


            }, 200);
        });
            // You can now access and manipulate elements in the SV
    }
};





}


window.onload = determineTheme()
