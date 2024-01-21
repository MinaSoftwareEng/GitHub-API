let reposData = [];
let itemsPerPage = 10;
let currentPage = 1;

async function requestUserProfile() {
  const userProfile = await fetch(`https://api.github.com/users/gamemann`);
  const userinfo = await userProfile.json();
  const img = document.createElement("img");
  img.src = "https://avatars.githubusercontent.com/u/6509565?v=4";
  const userName = document.createElement("li");
  userName.className = "list-item";
  userName.textContent = userinfo.name;
  const bio = document.createElement("li");
  bio.className = "list-item";
  bio.textContent = userinfo.bio.slice(0, 72);
  const div = document.createElement("div");
  div.className = "divContainer";
  div.appendChild(img);
  div.appendChild(userName);
  div.appendChild(bio);
  document.querySelector(".profile").appendChild(div);
}
requestUserProfile();
/////////////////////////////////////////////////////////////////////////
async function dataTable() {
  await requestUserRepos();
  console.log(reposData);
  //pagination starts here
  const pages = [];
  for (let i = 0; i <= Math.ceil(reposData.length / itemsPerPage); i++) {
    pages.push(i);
  }
  const indexOfLastPage = currentPage * itemsPerPage;
  const indexOfFirstPage = indexOfLastPage - itemsPerPage;
  const currentItems = reposData.slice(indexOfFirstPage, indexOfLastPage);

  // Clear the container element
  document.getElementById("container").innerHTML = "";
  // Loop over the currentItems array and create the elements for each item
  currentItems.forEach((item) => {
    // Create a div element with the class innerContainer
    let innerContainer = document.createElement("div");
    innerContainer.className = "innerContainer";
    // Create a li element with the repo name
    let repoName = document.createElement("li");
    repoName.className = "list-group-item";
    repoName.textContent = `Repo: ${item.url}`;
    // Create a li element with the repo description
    let repoDesc = document.createElement("li");
    repoDesc.className = "list-group-item";
    repoDesc.textContent = `Description: ${item.desc.slice(0, 50)}...`;
    // Append the li elements to the innerContainer
    innerContainer.appendChild(repoName);
    innerContainer.appendChild(repoDesc);
    // Check if the item has any topics
    if (item.topics.length > 0) {
      // Loop over the topics and create a button element for each one
      for (let j = 0; j < item.topics.length; j++) {     
        let button = document.createElement("button");
        button.innerHTML = item.topics[j];
        button.classList.add("items");
        // Append the button element to the innerContainer       
        innerContainer.appendChild(button)
      }
    }
    // Append the innerContainer element to the container element
    document.getElementById("container").appendChild(innerContainer);
  });
}
dataTable();

const prevBtn = () => {
  if ((currentPage - 1) * itemsPerPage) {
    currentPage--;
    dataTable();
  }
};
const nextBtn = () => {
  if ((currentPage * itemsPerPage) / reposData.length) {
    currentPage++;
    dataTable();
  }
};
document.getElementById("prevBtn").addEventListener("click", prevBtn, false);
document.getElementById("nextBtn").addEventListener("click", nextBtn, false);

async function requestUserRepos() {
  const data = await fetch(`https://api.github.com/users/gamemann/repos`);
  const res = await data.json();
  for (let i in res) {
    let obj = {
      url: res[i].name,
      desc: res[i].description,
      topics: res[i].topics,
    };
    reposData.push(obj);
  }
}
