const gallery = document.querySelector('.gallery')
const filters = document.querySelector('.filters')

/*Recuperation des works */
async function fetchWorks () {
  const response = await fetch('http://localhost:5678/api/works')
  return await response.json()
}
fetchWorks()
// Ajout apres soutenance
let project = null
async function getProject (invalidate = false) {
  if (!project || invalidate) {
    project = await fetchWorks()
  }
  return project
}

/*Affichage et creation des works*/
async function displayWorks () {
  gallery.innerText = ''
  const works = await getProject()
  works.forEach(work => {
    createWorks(work)
  })
}
displayWorks()

function createWorks (work) {
  const figure = document.createElement('figure')
  const img = document.createElement('img')
  const figcaption = document.createElement('figcaption')
  img.src = work.imageUrl
  figcaption.textContent = work.title
  figure.appendChild(img)
  figure.appendChild(figcaption)
  gallery.appendChild(figure)
}

/* categories */

/* recupere les categories */
async function fetchCategories () {
  const response = await fetch('http://localhost:5678/api/categories')
  const json = await response.json()
  return json
}

fetchCategories()

// Ajout apres soutenance
let categories = null
async function getCategories () {
  if (!categories) {
    categories = await fetchCategories()
  }
  return categories
}
// créer et affiche les boutons de categories

async function displayCategory () {
  const categories = await getCategories()
  categories.forEach(category => {
    const divBtn = document.createElement('div')
    const btn = document.createElement('button')
    divBtn.classList.add('filter')
    btn.className = 'filter__button'
    btn.textContent = category.name
    btn.id = category.id
    filters.appendChild(divBtn)
    divBtn.appendChild(btn)
  })
}
displayCategory()

// filtre

async function categoryFilter () {
  const works = await getProject()
  const buttons = document.querySelectorAll('.filter__button')

  let index = 0
  buttons.forEach(button => {
    button.addEventListener('click', e => {
      buttons[index].classList.remove('filter__button-selected')
      buttonId = e.target.id
      gallery.innerText = ''
      if (buttonId !== '0') {
        const filteredWorks = works.filter(work => {
          return work.categoryId == buttonId
        })
        filteredWorks.forEach(work => {
          createWorks(work)
          buttons[buttonId].classList.add('filter__button-selected')
          index = buttonId
        })
      } else {
        displayWorks()
        index = 0
        buttons[index].classList.add('filter__button-selected')
      }
    })
  })
}
categoryFilter()

//si l'utilisateur se connecte
const loged = localStorage.getItem('token')
const logout = document.querySelector('.logout')
const edit = document.querySelectorAll('.edit')
console.log(loged)
if (loged.value !== '') {
  edit.forEach(hiddenEdit => {
    hiddenEdit.classList.remove('hidden')
    filters.classList.add('hidden')
  })
  logout.textContent = 'logout'
  logout.addEventListener('click', () => {
    logout.href = 'index.html'
    localStorage.removeItem('token')
    window.localStorage.loged = false
  })
}

//modal variable global
const button = document.querySelector('.edit-button')
const modalContainer = document.querySelector('.modal-container')
const closeButton = document.querySelector('.closing-button')
const removeModal = document.querySelector('.modal_remove-photo')
const addModal = document.querySelector('.modal_new-photo')
const addButton = document.querySelector('.add-button')
const backArrow = document.querySelector('.back-arrow')

//bouton navigation modal
button.addEventListener('click', e => {
  modalContainer.classList.remove('hidden')
})
closeButton.addEventListener('click', e => {
  modalContainer.classList.add('hidden')
  resetImgPreview()
})
backArrow.addEventListener('click', e => {
  addModal.classList.add('hidden')
  backArrow.classList.add('hidden')
  removeModal.classList.remove('hidden')
})
addButton.addEventListener('click', e => {
  removeModal.classList.add('hidden')
  addModal.classList.remove('hidden')
  backArrow.classList.remove('hidden')
})

//Affichage des works dans la modal
const worksModal = document.querySelector('.modal-works')
async function displayWorksModal () {
  worksModal.innerHTML = ''
  const works = await getProject()
  works.forEach(work => {
    const figure = document.createElement('figure')
    const img = document.createElement('img')
    const i = document.createElement('span')
    i.classList.add('fa-solid', 'fa-trash-can', 'trash-can')
    figure.appendChild(img)
    figure.appendChild(i)
    img.src = work.imageUrl
    i.id = work.id
    //modifier apres soutenance, la fonctionalité de la fonction deleteWorks, fait desormé partie de displayWorksModal
    i.addEventListener('click', e => {
      id = i.id
      fetch('http://localhost:5678/api/works/' + id, {
        method: 'DELETE',
        headers: {
          'content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      }).then(async response => {
        if (response.ok) {
          await getProject(true)
          displayWorksModal()
          displayWorks()
        }
      })
    })
    worksModal.appendChild(figure)
  })
}

displayWorksModal()

// add photo

const imgPreview = document.querySelector('.choose-photo img')
const fileInput = document.querySelector('.choose-photo input')
const fileLabel = document.querySelector('.modal-label-span')
const fileIcon = document.querySelector('.choose-photo .fa-image')
const fileInfoSize = document.querySelector('.format-info')
const form = document.querySelector('.modal_new-photo form')
const title = document.querySelector('.modal_new-photo #title')
const category = document.querySelector('.modal_new-photo #category')
const validateFormsBtn = document.querySelector('.modal_new-photo button')
//image preview
fileInput.addEventListener('change', () => {
  const file = fileInput.files[0]
  if (file) {
    //ajout apres soutenance
    const maxSize = 4 * 1024 * 1024
    if (file.size > maxSize) {
      resetImgPreview()
      return
    }
    //ajout apres soutenance
    const validImageTypes = ['image/jpeg', 'image/png']
    if (!validImageTypes.includes(file.type)) {
      resetImgPreview()
      return
    }

    const reader = new FileReader()
    reader.onload = function (e) {
      imgPreview.src = e.target.result
      fileInput.classList.add('hidden')
      fileLabel.classList.add('hidden')
      fileIcon.classList.add('hidden')
      fileInfoSize.classList.add('hidden')
    }
    reader.readAsDataURL(file)
  }
})
//reset image preview

function resetImgPreview () {
  imgPreview.src = ''
  fileInput.value = ''
  fileInput.classList.remove('hidden')
  fileLabel.classList.remove('hidden')
  fileIcon.classList.remove('hidden')
  fileInfoSize.classList.remove('hidden')
  validateFormsBtn.classList.add('grayed')
}
//categories

async function displayCategoryModal () {
  const select = document.querySelector('.modal_new-photo select')
  const categories = await getCategories()
  categories.forEach(category => {
    const option = document.createElement('option')
    option.value = category.id
    option.textContent = category.name
    select.appendChild(option)
  })
}
displayCategoryModal()

//verify if all form fiekd are completed and change the button state
function verifyFormFields () {
  form.addEventListener('input', () => {
    if (title.value !== '' && category.value !== '' && fileInput.value !== '') {
      validateFormsBtn.classList.remove('grayed')
      validateFormsBtn.disabled = false
    } else {
      validateFormsBtn.classList.add('grayed')
      validateFormsBtn.disabled = true
    }
  })
}

verifyFormFields()

//add new works
function newWorks () {
  form.addEventListener('submit', async e => {
    e.preventDefault()
    const formData = new FormData(form)

    console.log(formData)

    fetch('http://localhost:5678/api/works', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      },
      body: formData
    }).then(async response => {
      if (response.ok) {
        await getProject(true)
        displayWorksModal()
        displayWorks()
        clearFormField()
        console.log(response)
      }
    })
  })
}
newWorks()

//clear form fiels after successfull addition of a work
async function clearFormField () {
  title.value = ''
  category.value = ''
  modalContainer.classList.add('hidden')
  resetImgPreview()
}
