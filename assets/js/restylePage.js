
 function getRandomNumber(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

function displayRandomImage(svgImage, left, top, scale, rotation, zindex=-99) {
    // Get a reference to the "img" folder
    var imgFolder = "assets/img/";

    // List of SVG image file names in the "img" folder
    // Choose a random SVG image from the list
    // Create an image element and set its attributes
    var image = new Image();
    image.src = imgFolder + svgImage;
    image.style.width = "100px"
    image.style.transform = `rotate(${rotation}deg)`;
    image.style.transform += ` scale(${scale})`;
    image.className = "random-image";
    image.style.position = "fixed";
    image.style.zIndex = zindex;
    image.style.left = left + "%"; // Adjust as needed
    image.style.top = top + "%"; // Adjust as needed

    // Add a click event listener to make the image disappear
    image.addEventListener("click", function() {
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

}
function changeFontFamily(fontFamily) {
  const headerElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');

  headerElements.forEach(element => {
    element.style.fontFamily = fontFamily;
  });
}

function halloweenTheme(){
  displayRandomImage("bat.svg", 10, 10, 1.5, 25);
  displayRandomImage("bat.svg", 2, 30, 2, -30);
  displayRandomImage("bat.svg", 25, 60, 1, 10);
  displayRandomImage("bat.svg", 7, 70, 0.5, -5);
  displayRandomImage("bat.svg", 5, 73, 0.7, 8);
  displayRandomImage("witch.svg", 90, 20, 1.5, 8);
  displayRandomImage("pumpkin.svg", 90, 85, 3, 8, zindex=1);
  document.documentElement.style.setProperty('--ufr-main-blue', "#171512");
  document.documentElement.style.setProperty('--active-item-color', "rgb(219, 134, 7)");
  document.documentElement.style.setProperty('--selector-color', "rgba(219, 134, 7, 0.3)");
  document.documentElement.style.setProperty('--font-family', 'Creepster,"Source Sans Pro",Calibri,Candara,Arial,sans-serif');



}

window.onload = determineTheme()
