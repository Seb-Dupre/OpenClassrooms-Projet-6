const gallery = document.querySelector(".gallery")



/*recupere*/
async function fetchData() {
    const response = await fetch("http://localhost:5678/api/works");
    return await response.json();
  }
  fetchData();
  
  /*Affichage et creation des elements*/
  async function displayData() {
    const arrayWorks = await fetchData();
    arrayWorks.forEach((data) => {
      const figure = document.createElement("figure");
      const img = document.createElement("img");
      const figcaption = document.createElement("figcaption");
      img.src = data.imageUrl;
      figcaption.textContent = data.title;
      figure.appendChild(img);
      figure.appendChild(figcaption);
      gallery.appendChild(figure);
    });
  }
  
  displayData();