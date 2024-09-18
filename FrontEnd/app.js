const gallery = document.querySelector(".gallery")
const filters = document.querySelector(".filters")


/*Recuperation des works */
async function fetchWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    return await response.json();
  }
  fetchWorks();
  

  /*Affichage et creation des works*/
  async function displayWorks() {
    const works = await fetchWorks();
    works.forEach((work) => {
      createWorks(work);
    });
  }
  displayWorks();

  function createWorks(work) {
      const figure = document.createElement("figure");
      const img = document.createElement("img");
      const figcaption = document.createElement("figcaption");
      img.src = work.imageUrl;
      figcaption.textContent = work.title;
      figure.appendChild(img);
      figure.appendChild(figcaption);
      gallery.appendChild(figure);
    };
  

  /* categories */

  /* recupere les categories */
  async function fetchCategories() {
    const categories = localStorage.getItem("categories")
    if(categories){
      return JSON.parse(categories)
    }
    const response = await fetch("http://localhost:5678/api/categories"); 
    const json = await response.json();
    localStorage.setItem("categories", JSON.stringify(json))
    return json;
    
  }
  
  fetchCategories();
  /* créer et affiche les boutons de categories */

  async function displayCategory() {
    const categories = await fetchCategories();
    categories.forEach((category) => {
      const divBtn = document.createElement("div");
      const btn = document.createElement("button");
      divBtn.classList.add("filter") 
      btn.className = "filter__button";
      btn.textContent = category.name;
      btn.id = category.id;
      filters.appendChild(divBtn);
      divBtn.appendChild(btn);
    })}
    displayCategory()
    
    /* filtre */

    async function categoryFilter() {
      const works = await fetchWorks();
      const buttons = document.querySelectorAll(".filter__button")

      let index = 0;
      buttons.forEach(button => {
        button.addEventListener("click",(e)=>{
          buttons[index].classList.remove('filter__button-selected');
          buttonId = e.target.id;
          gallery.innerHTML ="";
          if(buttonId !== "0" ){
            const filteredWorks = works.filter((work)=>{
              return work.categoryId == buttonId;
            });
            filteredWorks.forEach(work => {
              createWorks(work);  
              buttons[buttonId].classList.add('filter__button-selected');
              index = buttonId;
            });
          } 
          else {displayWorks();
            index = 0;
            buttons[index].classList.add('filter__button-selected');

          }
        })       
      });
    }
    categoryFilter();
//rajouté les categories dans localStorage


const loged = window.localStorage.loged;
const logout = document.querySelector(".logout");
console.log(loged)
if (loged == "true") {
  logout.textContent = "logout";
  logout.addEventListener("click", () => {
    logout.href = 'index.html';
    localStorage.removeItem("token");
    window.localStorage.loged = false;
  });
}