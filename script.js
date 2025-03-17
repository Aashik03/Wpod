const menu=document.getElementById("menuBtn");
const enter=document.getElementById("center");
const screen=document.getElementById("screen");
menu.addEventListener("click",()=>{
    alert("Hi");
    screen.innerHTML="<input id='search' type='text' placeholder='type a song'>";
});
enter.addEventListener("click",()=>{
    screen.innerHTML="<h1>You are ugly</h1>";
});