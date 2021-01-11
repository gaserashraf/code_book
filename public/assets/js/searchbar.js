let inputSearch=document.getElementById("Search");

inputSearch.onfocus=()=>{
    inputSearch.classList.add("active");
    inputSearch.classList.remove("dactive");
}
inputSearch.onfocusout=()=>{
    inputSearch.classList.remove("active");
    inputSearch.classList.add("dactive");
}