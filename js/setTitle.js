
const url = window.location.pathname;
let str = url.substring(url.lastIndexOf('/') + 1);
str = str.substring(0, str.length - 5);
document.getElementById("title").innerHTML = str;
