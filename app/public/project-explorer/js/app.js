let currentPage = window.location.href;
window.onload = function(){
    if(currentPage.includes('register.html')){
        register()
    }
    if(currentPage.includes('index.html')){
        index()
    }
    if(currentPage.includes('login.html')){
        loginHtml ()
    }
    if(currentPage.includes('createproject.html')){
        createProject()
    }
    if(currentPage.includes('viewproject.html')){
        viewProject()
    }
}

let register = function () { 
        document.getElementById('inputState');
        fetch('/api/programs', {
            method: 'GET',
            header: {
                'Content-Type': 'application/json',
            }
        })
            .then((response) => response.json())
            .then(function (response) {
                for (let i = 0; i < response.length; i++) {
                    let programList = document.createElement('option');
                    programList.innerHTML = response[i];
                    document.getElementById('inputState').appendChild(programList);
                }
            })
        let inputYear = document.getElementById('Year');
        fetch('/api/graduationYears', {
            method: 'GET',
            header: {
                'Content-Type': 'application/json',
            }
        })
            .then((response) => response.json())
            .then(function (response) {
                for (let i = 0; i < response.length; i++) {
                    let yearList = document.createElement('option');
                    yearList.innerHTML = response[i];
                    inputYear.appendChild(yearList);
                }
            })
    
    const signupForm = document.getElementById("signupForm")
    const error_Alert = document.getElementById("errormsg")
    error_Alert.style.display = "none"; // hide the div display 
    function postData(event) {  // form submit handler
        event.preventDefault();
        let info = {
            firstname: document.getElementsByName("firstName")[0].value,
            lastname: document.getElementsByName("lastName")[0].value,
            email: document.getElementsByName("email")[0].value,
            password: document.getElementsByName("password")[0].value,
            matricNumber: document.getElementsByName("matricNumber")[0].value,
            program: document.getElementsByName("program")[0].value,
            graduationYear: document.getElementsByName("graduationYear")[0].value,
        }
        console.log(info);
        fetch("/api/register", {
            method: 'POST',
            body: JSON.stringify(info),        // All form data // turn values to json format
            headers: {
                'Content-Type': 'application/json',
            },
        })

            .then(response => response.json())
            .then(response => {
                if (response.status === "ok") {
                    // storing the id in a cookie with the name uid.
                    document.cookie = `uid=${response.data.id}; path=/`;

                    console.log(document.cookie);
                    window.location.replace('index.html');

                    // windows.location.replace('index.html'); 

                } else if (response.status !== "ok") {
                    console.log(response.errors);
                    let errors = response.errors.map(error => error);


                    errors.forEach(error => {
                        //loop through returned array, append answer to error div
                        error_Alert.innerHTML += `<strong>${error}</strong><br>`
                    })
                    error_Alert.style.display = "block";
                }
                
            })
             
    }
    signupForm.addEventListener("submit", postData) 
}

let index = async function(){
    
        let logOutEl = document.createElement("a");
        let check = document.cookie.split("=");
        if (check[0] === "uid" && check[1]) {
            let response =  await fetch(`/api/users/${check[1]}`);
            let result =  await response.json()
            console.log(result);
            let greetEl = document.createElement("span");
            greetEl.innerHTML = `<span id="username" class = "nav navbar-nav navbar-right ml-4">Hi, ${result.firstname}</span>`;
            let headerNav = document.getElementById('headerNav');
            let userStatus = document.getElementById('userStatus');
            logOutEl.innerText = "Logout";
            logOutEl.class = "nav navbar-nav navbar-right";
            userStatus.classList.add('invisible');

            headerNav.appendChild(logOutEl);
            headerNav.appendChild(greetEl);


        }
        logOutEl.onclick = () => {
            document.cookie = "uid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/"
            window.location.replace('index.html');
            
        }
       // step 9 
if (window.location.href.includes('index.html')){
    //  let projectList = document.getElementsByClassName("showcase")
    //   const project_authors = document.getElementById("project_authors");
    fetch('/api/projects/', { //GET projects. All of them. Although, we are gonna be working with the first 4
      method: 'GET',
      headers: {
      'Content-Type': 'application/json',
  }
  })
  .then(response => response.json())
  .then(function(response){
    console.log(response)
    document.getElementsByClassName('showcase')[0].innerHTML = ""; // Clear previous cards 
    for (let i = 0; i < 4; i++) {
      // card contents
                  let projectTitle = document.createElement('h5');
                  let projectTitleLink = document.createElement("a");
                  projectTitle.append(projectTitleLink);
                  projectTitleLink.href = `viewproject.html?id=${response[i].id}`;
                  projectTitleLink.className = "card-title text-primary";
                  projectTitleLink.textContent = response[i].name;
                  let projectAuthor = document.createElement('h6');
                  projectAuthor.className = "card-subtitle mb-2 text-muted";
                  projectAuthor.textContent = response[i].authors;
                  let projectAbstract = document.createElement('p')
                  projectAbstract.className = "card-text";
                  projectAbstract.textContent = response[i].abstract
                  let projectTags = document.createElement('a')
                  projectTags.href =`#`
                  projectTags.className = "card-text";
                  projectTags.textContent = response[i].tags
                  // Create card body div
                  let cardBody = document.createElement('div');
                  cardBody.className = "card-body";
                  let generalCardBodyDiv = document.createElement('div');
                  generalCardBodyDiv.className = "col-md-3 col-sm-12 col-lg-3 pb-4"
                  // Create card main div
                  let cardMain = document.createElement('div');
                  cardMain.className = "card";
                  //  cardMain.classList.add("col");
                 // Append all appendables
                 generalCardBodyDiv.appendChild(cardMain);
                 cardMain.appendChild(cardBody);
                 cardBody.appendChild(projectTitle);
                 cardBody.appendChild(projectAuthor);
                 cardBody.appendChild(projectAbstract);
                 cardBody.appendChild(projectTags);
                 document.getElementsByClassName("showcase")[0].appendChild(generalCardBodyDiv);
    }
  })
  .catch(error => {
      console.log(error);
  })  
  }        
        
        
         
}



    let loginHtml = function() {
        let loginEl = document.getElementById('loginForm');
        let errorEl = document.getElementById('errormsg');
        errorEl.style.display = "none";


        function infoData(event) {
            event.preventDefault()
            let info = {
                email: document.getElementsByName("email")[0].value,
                password: document.getElementsByName("password")[0].value,
            }
            fetch("/api/login", {
                method: 'POST',
                body: JSON.stringify(info),        // All form data // turn values to json format
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(response => response.json())
                .then(result => {
                    if (result.status === 'ok') {
                        document.cookie = `uid=${result.data.id}; path=/`;
                        window.location.replace('index.html');
                    }
                    else if (result.status !== 'ok') {
                        errorEl.style.display = 'block';
                        errorEl.textContent = 'Invalid email/password';
                    }
                })
                
        }
        loginEl.addEventListener('submit', infoData)
    }
    

    let createProject = function() {

        let alertDiv = document.getElementById("err");
        alertDiv.style.display = "none" 
        console.log(alertDiv);
        const projectId = document.getElementById("createProjectForm");
        // Check cookie
        if (document.cookie){
          let cookieValue = document.cookie
          cookieValue = cookieValue.split("=");
          cookieValue = cookieValue[1];
          if (cookieValue !== "undefined" || cookieValue !== "") {
            function submitProject(event) {
              event.preventDefault()
              let project_Details = {
                name: document.getElementById("name").value,
                abstract: document.getElementById("abstract").value,
                tags: document.getElementById("tags").value.split(","),
                authors: document.getElementById("authors").value.split(","),
            }
            fetch("/api/projects", {
              method: "POST",
              body: JSON.stringify(project_Details),
              headers: {
                  'content-type': 'application/json'
              }
          })
          .then(response => response.json())
          .then(response => {
            if(response.status === "ok"){
              window.location.replace('index.html')
          } if(response.status !== "ok"){
            //console.log(response.errors)
               let errorMessage = response.errors.map(error => error)
               errorMessage.forEach(error => {
                    alertDiv.innerHTML += `<strong>${error}</strong><br>`
                  //console.log( `<strong>${error}</strong><br>`)
               })
               alertDiv.classList = "alert alert-danger" // add css classes
               alertDiv.style.display = "block"
             
          }           
          })
            }
          }
        }
        else {
          window.location.replace('login.html')
      }
      projectId.addEventListener("submit", submitProject)
    }


    let viewProject = function(){
        //step 10

    const queryString = window.location.search; // retrive the website link
    const params = new URLSearchParams(queryString); 
    console.log(params)
          let pId = params.get("id");
          fetch(`/api/projects/${pId}`, { //Use the actual id for the GET method. 
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
        }
        })
            .then(response => response.json())
            // console.log(response.json())
            .then(function(response) {
              let projectName = response.name;
              document.getElementById("project_name").innerHTML = projectName;
              let projectAuthors = response.authors;
              document.getElementById("project_authors").innerHTML = projectAuthors;
              let projectTags = response.tags;
              document.getElementById("project_tags").innerHTML = projectTags;
              let projectAbstract = response.abstract;
              document.getElementById("project_abstract").innerHTML = projectAbstract;
              fetch(`/api/users/${response.createdBy}`, { //Use the actual id for the GET method for createdBy. 
                  method: 'GET',
                  headers: {
                  'Content-Type': 'application/json',
              }
              })
              .then(response => response.json())
              .then(function(response) {
                  // texts replacements
                  let projectAuthor = `${response.firstname} ${response.lastname}`;
                  document.getElementById("project_author").innerHTML = projectAuthor;
              })
              .catch(error => {
                  console.log(error);
              })
      });
  }