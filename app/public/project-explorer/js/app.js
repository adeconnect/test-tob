const firstname = document.getElementById('firstname');
const lastname = document.getElementById('lastname');
const email = document.getElementById('email');
const password = document.getElementById('password');
const matricNumber = document.getElementById('matricNumber');
const selectProgram = document.getElementById('program');
const selectGraduationYear = document.getElementById('graduationYear');
const form = document.getElementById('signupForm');
const logout = document.getElementById("logout");
const username = document.getElementById("username");
const show = document.getElementsByClassName("show");
const loginForm = document.getElementById('loginForm');
const projectForm = document.getElementById('createProjectForm');
const projectPathName = '/project-explorer/createproject.html';
const showcase = document.getElementsByClassName('showcase');
const viewProjectId = getProjectId();

window.addEventListener('load', () => {

  cookieId = getCookie();

  if (cookieId !== "") {
    getData(cookieId)
  } else {
    console.log("User not logged in");
  }
})

if (form) {
  form.addEventListener('submit', (e) => {

    e.preventDefault();
  
    getRegistration();
  })  
}

if (window.location.pathname === projectPathName) {
  const cookieId = getCookie();
  if (cookieId === '') {
    newProjectPathName = '/project-explorer/login.html';
    window.location.pathname = newProjectPathName;
  } else {
    projectForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const projectData = getProjectData();
      verifyProjectData(projectData);
    })
  }
}

if (window.location.pathname === '/project-explorer/index.html') {

  getProjectList();

}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    verifyLoginData()
  })
}

logout.addEventListener('click', () => {
  document.cookie = 'uid' + '=; path=/;';
  window.location.replace('index.html');
})

if (window.location.pathname === '/project-explorer/viewproject.html') {

  projectDetails();

}

function getPrograms() {

  const programs = '/api/programs';
  fetch(programs)
  .then((response) => {
    if (response.status === 200) {
      return response.json();
    }
    else {
      throw new Error('Unable to fetch the program data')
    }
  })
  .then((programData) => {
    for (let i = 0; i < programData.length; i++) {
      selectProgram.children[i].textContent = programData[i]
    }
  })
  .catch((err) => {
    // console.log('Error: ', err.message);
  })

}

function getGraduationYears() {

  const graduationYears = '/api/graduationYears';
  fetch(graduationYears)
  .then((response) => {
    if (response.status === 200) {
      return response.json();
    } else {
      throw new Error('Unable to fetch graduation years data');
    }
  })
  .then((graduationData) => {
    for (let i = 0; i < graduationData.length; i++) {
      selectGraduationYear.children[i].textContent = graduationData[i];
    }
  })
  .catch((err) => {
    // 
  })
}

function getRegistration() {
  
  const register = '/api/register';

  const data = {
    "firstname": firstname.value.trim(),
    "lastname": lastname.value.trim(),
    "email": email.value.trim(),
    "password": password.value.trim(),
    "matricNumber": matricNumber.value.trim(),
    "program": selectProgram.value,
    "graduationYear": selectGraduationYear.value
  }

  fetch(register, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {"Content-type": "application/json; charset=UTF-8"}
  })
  .then((response) => {
    return response.json();
  })
  .then((userData) => {
    if (userData.status === "ok") {
      let userId = userData.data.id;
      let key = "uid"
      let value = encodeURIComponent(userId)
      document.cookie = `${key}=${value};path=/`;
      window.location.replace('index.html');
    } else {
      error1 = userData.errors[0];
      error2 = userData.errors[1];

      showError(error1, error2);
    } 
  })
}

function showError(errorMessage1, errorMessage2) {

errorAlert = document.getElementById('error');
p1 = document.createElement('p');
p2 = document.createElement('p');
errorAlert.classList.add('alert', 'alert-danger');
p1.innerText = errorMessage1;
p2.innerText = errorMessage2;
errorAlert.appendChild(p1);
errorAlert.appendChild(p2);
}

function getCookie() {

  const cookieName = "uid";
  const cookieArr = document.cookie.split(";");
  for (let i = 0; i < cookieArr.length; i++) {
    let cookiePair = cookieArr[i].split("=")

    if (cookieName === cookiePair[0].trim()) {
      return cookiePair[1];
    } else {
      return "";
    }
  }
}

function getData(id) {

const cookieApi = `/api/users/${id}`;

fetch(cookieApi)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    showUserFirstname(data.firstname)
  })
}

function showUserFirstname(name) {
  
  for (let i = 0; i < show.length; i++) {
    show[i].classList.add("d-none")
  }

  logout.classList.remove("d-none")
  username.textContent = `Hi ${name}`
}

function verifyLoginData() {

  const loginEmail = document.getElementById('loginEmail');
  const loginPassword = document.getElementById('loginPassword');

  const loginData = {
    'email': loginEmail.value.trim(),
    'password': loginPassword.value.trim()
  }

  fetch('/api/login', {
  method: 'POST',
  body: JSON.stringify(loginData),
  headers: {"Content-type": "application/json; charset=UTF-8"}
  })
  .then((response) => {
    if (response.status === 200) {
    return response.json();
  } else {
    const loginError = document.getElementById('loginError');
    loginError.classList.remove('d-none');
    loginError.textContent = "Invalid email/password";
  }
  })
  .then((loginDetails) => {
    const loginId = loginDetails.data.id;
    const key = 'uid'
    const value = encodeURIComponent(loginId);
    document.cookie = `${key}=${value};path=/`;
    window.location.replace('index.html')
  })
}

function getProjectData() {

const projectName = document.getElementById('projectName');
const projectAbstract = document.getElementById('projectAbstract');
const projectAuthors = document.getElementById('projectAuthors');
const projectTags = document.getElementById('projectTags');

const projectNameValue = projectName.value.trim();
const projectAbstractValue = projectAbstract.value.trim();
const projectAuthorsValue = projectAuthors.value.trim();
const projectTagsValue = projectTags.value.trim();

const projectAuthorsValueArray = projectAuthorsValue.split(',').map((item) => {
  return item.trim();
})
const projectTagsValueArray = projectTagsValue.split(' ').map((item) => {
  return item.trim()
})

const projectData = {
  "name": projectNameValue,
  "abstract": projectAbstractValue,
  "authors": projectAuthorsValueArray,
  "tags": projectTagsValueArray,
}

return projectData;

}

function verifyProjectData(projectData) {

const projectApi = '/api/projects'

fetch(projectApi, {
  method: 'POST',
  body : JSON.stringify(projectData),
  headers: {"Content-type": "application/json; charset=UTF-8"}
})
.then((response) => {
  if (response.status !== 200) {
    return response.json();
  } else {
    window.location.replace('index.html');
  }
})
.then((data) => {
  const projectError = document.getElementById('projectError');
  projectError.classList.remove('d-none');
  projectError.textContent = data.errors;
})
}


function getProjectList() {

  fetch('/api/projects')
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    createElements(data)
  })
}

function createElements(data) {

  const cardBody = document.getElementsByClassName('card-body');

  const projectTitle1 = document.createElement('h5');
  const projectTitle2 = document.createElement('h5');
  const projectTitle3 = document.createElement('h5');
  const projectTitle4 = document.createElement('h5');
  const projectLink1 = document.createElement('a');
  const projectLink2 = document.createElement('a');
  const projectLink3 = document.createElement('a');
  const projectLink4 = document.createElement('a');
 
  
  projectTitle1.className += 'card-title'
  projectLink1.setAttribute('href', `viewproject.html?id=${data[0].id}`);
  projectTitle1.appendChild(projectLink1);
  projectLink1.textContent = data[0].name
  cardBody[0].replaceChild(projectTitle1, cardBody[0].children[0]);

  // project author
  cardBody[0].children[1].textContent = `${data[0].authors[0]}, ${data[0].authors[1]}`

  // project body
  cardBody[0].children[2].textContent = `${data[0].abstract}`;

  // project tags
  cardBody[0].children[3].textContent = `${data[0].tags[0]}`;
  cardBody[0].children[4].remove()
  cardBody[0].children[4].remove()

  //  second project card summary
  
  // project title
  
  projectTitle2.className += 'card-title'
  projectLink2.setAttribute('href', `viewproject.html?id=${data[1].id}`);
  projectTitle2.appendChild(projectLink2);
  projectLink2.textContent = data[1].name
  cardBody[1].replaceChild(projectTitle2, cardBody[1].children[0]);

  // project author
  cardBody[1].children[1].textContent = `${data[1].authors[0]}, ${data[1].authors[1]}`

  // project body
  cardBody[1].children[2].textContent = `${data[1].abstract}`;

  // project tags
  cardBody[1].children[3].textContent = `${data[1].tags[0]}`;
  cardBody[1].children[4].textContent = `${data[1].tags[1]}`;
  cardBody[1].children[5].textContent = `${data[1].tags[2]}`;


  //  third project card summary
  
  // project title
  
  projectTitle3.className += 'card-title'
  projectLink3.setAttribute('href', `viewproject.html?id=${data[2].id}`);
  projectTitle3.appendChild(projectLink3);
  projectLink3.textContent = data[2].name
  cardBody[2].replaceChild(projectTitle3, cardBody[2].children[0]);

  // project author
  cardBody[2].children[1].textContent = `${data[2].authors[0]}, ${data[2].authors[1]}`

  // project body
  cardBody[2].children[2].textContent = `${data[2].abstract}`;

  // project tags
  cardBody[2].children[3].textContent = `${data[2].tags[0]}`;
  cardBody[2].children[3].textContent = `${data[2].tags[1]}`;
  cardBody[2].children[3].textContent = `${data[2].tags[2]}`;


  //  fourth project card summary
  
  // project title

  projectTitle4.className += 'card-title'
  projectLink4.setAttribute('href', `viewproject.html?id=${data[3].id}`);
  projectTitle4.appendChild(projectLink4);
  projectLink4.textContent = data[3].name
  cardBody[3].replaceChild(projectTitle4, cardBody[3].children[0]);

  // project author
  cardBody[3].children[1].textContent = `${data[3].authors[0]}, ${data[3].authors[1]}`

  // project body
  cardBody[3].children[2].textContent = `${data[3].abstract}`;

  // project tags
  cardBody[3].children[3].textContent = `${data[3].tags[0]}`;
  cardBody[3].children[3].textContent = `${data[3].tags[1]}`;
  cardBody[3].children[3].textContent = `${data[3].tags[2]}`;

}

function getProjectId() {

  const projectUrl = window.location.href;
  const url = new URL(projectUrl)
  const search_params = url.searchParams
  const projectId = search_params.get('id') 
  return projectId;

}

function projectDetails() {

  const id = getProjectId();
    
  fetch(`/api/projects/${id}`)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    const projectName = document.getElementById("project_name");
    const projectInfo = document.getElementById("project_abstract");
    const projectOwners = document.getElementById("project_authors");
    const projectLinks = document.getElementById("project_tags");

    projectName.textContent = data.name;
    projectInfo.textContent = data.abstract;
    projectOwners.textContent = data.authors;
    projectLinks.textContent = data.tags;
    return data
  })
  .then((data2) => {
    
    const projectCreator = data2.createdBy;

    fetch(`/api/users/${projectCreator}`)
    .then((response) => {
      return response.json();
    })
    .then((creatorData) => {
      projectAuthor = document.getElementById("project_author");
      projectAuthor.textContent = creatorData.firstname + ' ' + creatorData.lastname;
    })

  })

}

getPrograms();
getGraduationYears();

    