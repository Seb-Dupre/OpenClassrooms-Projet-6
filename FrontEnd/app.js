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
    gallery.innerText ="";
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
  // créer et affiche les boutons de categories 

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
    
    // filtre

    async function categoryFilter() {
      const works = await fetchWorks();
      const buttons = document.querySelectorAll(".filter__button")

      let index = 0;
      buttons.forEach(button => {
        button.addEventListener("click",(e)=>{
          buttons[index].classList.remove('filter__button-selected');
          buttonId = e.target.id;
          gallery.innerText ="";
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

//si l'utilisateur se connecte
const loged = window.localStorage.loged;
const logout = document.querySelector(".logout");
const edit = document.querySelectorAll("#edit");
console.log(loged)
if (loged == "true") {

  edit.forEach((hiddenEdit)=>{
  hiddenEdit.classList.remove("hidden");
  })
  logout.textContent = "logout";
  logout.addEventListener("click", () => {
    logout.href = 'index.html';
    localStorage.removeItem("token");
    window.localStorage.loged = false;
  });
}


//modal variable global
const button = document.querySelector(".edit-button");
const modalContainer = document.querySelector(".modal-container");
const closeButton = document.querySelector(".closing-button");
const removeModal = document.querySelector(".modal_remove-photo");
const addModal = document.querySelector(".modal_new-photo");
const addButton = document.querySelector(".add-button");
const backArrow = document.querySelector(".back-arrow");

//bouton navigation modal
button.addEventListener("click",(e)=>{
  modalContainer.classList.remove("hidden");
})
closeButton.addEventListener("click",(e)=>{
  modalContainer.classList.add("hidden");
});
backArrow.addEventListener("click",(e)=>{
  addModal.classList.add("hidden");
  backArrow.classList.add("hidden");
  removeModal.classList.remove("hidden");
  
});
addButton.addEventListener("click",(e)=>{
  removeModal.classList.add("hidden");
  addModal.classList.remove("hidden");
  backArrow.classList.remove("hidden");
})




//Affichage des works dans la modal
const worksModal = document.querySelector(".modal-works");
async function displayWorksModal() {
  worksModal.innerHTML ="";
  const works = await fetchWorks();
  works.forEach(work => {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const i = document.createElement("span");
    i.classList.add("fa-solid", "fa-trash-can", "trash-can");
    figure.appendChild(img);
    figure.appendChild(i);
    img.src = work.imageUrl;
    i.id = work.id;
    worksModal.appendChild(figure);
  }); 
  deleteWorks();
}
displayWorksModal();


function deleteWorks() {
  const trashAll = document.querySelectorAll(".trash-can");
  trashAll.forEach((trash) => {
    trash.addEventListener("click", (e) => {
      id = trash.id;
      fetch("http://localhost:5678/api/works/" + id, {method:"DELETE",headers:{"content-Type":"application/json",'Authorization': 'Bearer ' + localStorage.getItem('token'), }
      ,}) 
        .then((response) => {
          if (response.ok) {
            displayWorksModal();
            displayWorks();
          }

        })

    });
  });
}

// add photo

const imgPreview = document.querySelector(".modal-file img")
const fileInput = document.querySelector(".modal-file input")
const fileLabel = document.querySelector(".modal-file label")
const fileIcon = document.querySelector(".modal-file .fa-image")
const fileP = document.querySelector(".modal-file p")
const form = document.querySelector(".modal_new-photo form");
const title = document.querySelector(".modal_new-photo #title");
const category = document.querySelector(".modal_new-photo #category");


//preview image
fileInput.addEventListener("change",()=>{
  const file = fileInput.files[0]
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e){
      imgPreview.src = e.target.result
      fileInput.classList.add("hidden");
      fileLabel.classList.add("hidden");
      fileIcon.classList.add("hidden");
      fileP.classList.add("hidden");
    }
    reader.readAsDataURL(file);
  }
})

//categories


async function displayCategoryModal() {
    const select = document.querySelector(".modal_new-photo select");
    const categories = await fetchCategories();
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;
      select.appendChild(option);

    })}
    displayCategoryModal();


  //verify if all form fiekd are completed and change the button state
    function verifyFormFields() {
      const addButton = document.querySelector(".modal_new-photo button");
      form.addEventListener("input", () => {
        if (title.value !== "" && category.value !== "" && fileInput.value !== "") {
          addButton.classList.remove("grayed");
          addButton.disabled = false;
        } else {
          addButton.classList.add("grayed");
          addButton.disabled = true;
        }
      });
    }
    verifyFormFields();

    //add new works

    form.addEventListener("submit",async (e)=>{
      e.preventDefault()
      const formData = {
        image:fileInput.files[0],
        title:title.value,
        category:category.value,
      }
      console.log(form)
         fetch("http://localhost:5678/api/works", {
                method: "POST",
                headers:{"content-Type":"application/json",'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
                body:JSON.stringify(formData),
                
              })
              .then((response) => {
                if (response.ok) {
                  displayWorksModal();
                  displayWorks();
                }})

      })
      ;
 
    

