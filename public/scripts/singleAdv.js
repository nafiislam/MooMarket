

function openCity(evt, cityName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
}

// Show the current tab, and add an "active" class to the button that opened the tab
document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}                                                                           


// Open the Modal
function openModal(id) {
  document.getElementById("myModal"+id).style.display = "block";
}

// Close the Modal
function closeModal(id) {
  document.getElementById("myModal"+id).style.display = "none";
}

var slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
n = parseInt(n);
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("demo");
  var captionText = document.getElementById("caption");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
  captionText.innerHTML = dots[slideIndex-1].alt;
}

function increaseValue() {
var value = parseInt(document.getElementById('number').value, 10);
value = isNaN(value) ? 0 : value;
value++;
document.getElementById('number').value = value;
}

function decreaseValue() {
    var value = parseInt(document.getElementById('number').value, 10);
    value = isNaN(value) ? 0 : value;
    value < 1 ? value = 1 : '';
    value--;
    document.getElementById('number').value = value;
}

AOS.init({
    offset: 200,
    duration: 600,
    easing: "ease-in-out",
});

const button = document.getElementById('myButton');
let isClicked = false;

button.addEventListener('click', function() {
  if (isClicked) {
      // Toggle off the 'clicked' class when the button is clicked again
      button.classList.remove('clicked');
  } else {
      // Toggle on the 'clicked' class when the button is initially clicked
      button.classList.add('clicked');
  }
  
  // Update the clicked state
  isClicked = !isClicked;
});

const rangeInput = document.querySelectorAll(".range-input1 input"),
priceInput = document.querySelectorAll(".price-input1 input"),
range = document.querySelector(".slider1 .progress1");
let priceGap = 50000;

priceInput.forEach(input =>{
  input.addEventListener("input", e =>{
      let minPrice = parseInt(priceInput[0].value),
      maxPrice = parseInt(priceInput[1].value);
      
      if((maxPrice - minPrice >= priceGap) && maxPrice <= rangeInput[1].max){
          if(e.target.className === "input-min1"){
              rangeInput[0].value = minPrice;
              range.style.left = ((minPrice / rangeInput[0].max) * 100) + "%";
          }else{
              rangeInput[1].value = maxPrice;
              range.style.right = 100 - (maxPrice / rangeInput[1].max) * 100 + "%";
          }
      }
  });
});

rangeInput.forEach(input =>{
  input.addEventListener("input", e =>{
      let minVal = parseInt(rangeInput[0].value),
      maxVal = parseInt(rangeInput[1].value);

      if((maxVal - minVal) < priceGap){
          if(e.target.className === "range-min1"){
              rangeInput[0].value = maxVal - priceGap
          }else{
              rangeInput[1].value = minVal + priceGap;
          }
      }else{
          priceInput[0].value = minVal;
          priceInput[1].value = maxVal;
          range.style.left = ((minVal / rangeInput[0].max) * 100) + "%";
          range.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + "%";
      }
  });
});



const rangeInput1 = document.querySelectorAll(".range-input2 input"),
weightInput = document.querySelectorAll(".price-input2 input"),
range1 = document.querySelector(".slider2 .progress2");
let weightGap = 100;

weightInput.forEach(input =>{
  input.addEventListener("input", e =>{
      let minWeight = parseInt(weightInput[0].value),
      maxWeight = parseInt(weightInput[1].value);
      
      if((maxWeight - minWeight >= weightGap) && maxWeight <= rangeInput1[1].max){
          if(e.target.className === "input-min2"){
              rangeInput1[0].value = minWeight;
              range1.style.left = ((minWeight / rangeInput1[0].max) * 100) + "%";
          }else{
              rangeInput1[1].value = maxWeight;
              range1.style.right = 100 - (maxWeight / rangeInput1[1].max) * 100 + "%";
          }
      }
  });
});

rangeInput1.forEach(input =>{
  input.addEventListener("input", e =>{
      let minVal = parseInt(rangeInput1[0].value),
      maxVal = parseInt(rangeInput1[1].value);

      if((maxVal - minVal) < weightGap){
          if(e.target.className === "range-min2"){
            rangeInput1[0].value = maxVal - weightGap
          }else{
            rangeInput1[1].value = minVal + weightGap;
          }
      }else{
          weightInput[0].value = minVal;
          weightInput[1].value = maxVal;
          range1.style.left = ((minVal / rangeInput1[0].max) * 100) + "%";
          range1.style.right = 100 - (maxVal / rangeInput1[1].max) * 100 + "%";
      }
  });
});

const rangeInput2 = document.querySelectorAll(".range-input3 input"),
ageInput = document.querySelectorAll(".price-input3 input"),
range2 = document.querySelector(".slider3 .progress3");
let ageGap= 4;

ageInput.forEach(input =>{
  input.addEventListener("input", e =>{
      let minAge = parseInt(ageInput[0].value),
      maxAge = parseInt(ageInput[1].value);
      
      if((maxAge - minAge >= ageGap) && maxAge <= rangeInput2[1].max){
          if(e.target.className === "input-min3"){
              rangeInput2[0].value = minAge;
              range2.style.left = ((minAge / rangeInput2[0].max) * 100) + "%";
          }else{
              rangeInput2[1].value = maxAge;
              range2.style.right = 100 - (maxAge / rangeInput2[1].max) * 100 + "%";
          }
      }
  });
});

rangeInput2.forEach(input =>{
  input.addEventListener("input", e =>{
      let minVal = parseInt(rangeInput2[0].value),
      maxVal = parseInt(rangeInput2[1].value);

      if((maxVal - minVal) < ageGap){
          if(e.target.className === "range-min3"){
            rangeInput2[0].value = maxVal - ageGap
          }else{
            rangeInput2[1].value = minVal + ageGap;
          }
      }else{
          ageInput[0].value = minVal;
          ageInput[1].value = maxVal;
          range2.style.left = ((minVal / rangeInput2[0].max) * 100) + "%";
          range2.style.right = 100 - (maxVal / rangeInput2[1].max) * 100 + "%";
      }
  });
});
