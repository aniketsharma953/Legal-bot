document.addEventListener("DOMContentLoaded", function () {
  // Set your target values for each counter
  const targetValues = [5, 75, 90];

  // Set the speed of the counter animation (lower value for faster animation)
  const speed = 100;

  targetValues.forEach((target, index) => {
    const counterElement = document.getElementById(`counter${index + 1}`);
    const countElement = counterElement.querySelector(".count");

    let count = 0;

    const updateCounter = () => {
      const increment = target / speed;
      count += increment;

      if (count >= target) {
        count = target;
        clearInterval(counterInterval);
      }

      countElement.innerText = Math.round(count);
    };

    const counterInterval = setInterval(updateCounter, 1000 / speed);
  });
});
function slideToNewPage() {
  window.location.href = "newpage.html";
}
document.addEventListener("DOMContentLoaded", function () {
  const checkbox = document.getElementById("checkbox");

  checkbox.addEventListener("change", function () {
    if (checkbox.checked) {
      document.body.classList.add("dark-mode");
      // document.getElementById('card1').style.boxShadow = '10px 10px 5px white';
      // document.getElementById('card2').style.boxShadow = '10px 10px 5px white';
    } else {
      document.body.classList.remove("dark-mode");
      // document.getElementById('card1').style.boxShadow = '10px 10px 5px grey';
      // document.getElementById('card2').style.boxShadow = '10px 10px 5px grey';
    }
  });
});
