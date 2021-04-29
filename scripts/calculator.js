let displayMain = document.querySelector("#displayMain");

console.log(displayMain);

function initializeButtonEvents(){
  let buttons = Array.from(document.querySelectorAll("button"));

  buttons.forEach(button  => {
    button.addEventListener('click', (e) => {
      console.log(e.target.id);
    });
  });
}

displayMain.textContent = "0";
initializeButtonEvents();