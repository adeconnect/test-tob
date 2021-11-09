// setting the register.html

const path = window.location.href
if (path.includes("register.html")) {
    window.onload = function () {
        document.getElementById("program").innerHTML = ""; // to clear the program values
        document.getElementById("graduationYear").innerHTML = ""; // to clear the graduation year values

        // fetching programs

        fetch("/api/programs", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(res => 
            {return res.json()})
        .then(function(data){
            data.forEach(prog => {
                let listEL = document.createElement("option")
                listEL.value = prog;
                listEL.text = prog; 
                document.getElementById("program").appendChild(listEL);

            });
        })
        .catch(error => {console.log(error)})


        // fetching graduation years
                
        fetch("/api/graduationYears", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(res => 
            {return res.json()})
        .then(function(data){
            data.forEach(grad => {
                let listEL = document.createElement("option")
                listEL.value = grad;
                listEL.text = grad; 
                document.getElementById("graduationYear").appendChild(listEL);

            });
        })
        .catch(error => {console.log(error)})
    } 

    // Add event listener when the button is clicked.
    const signupFormEL = document.getElementById("signupForm"); // selecting the needed tags
    const signupAlertEL = document.getElementById("signup-alert");
    signupAlertEL.style.display = "none";

    function afterSubmission(e) {
        e.preventDefault();
        let UserResponse = {

            "firstname": document.getElementById("firstname").value,
          
            "lastname": document.getElementById("lastname").value,
          
            "email": document.getElementById("email").value,
          
            "password": document.getElementById("password").value,
          
            "matricNumber": document.getElementById("matricNumber").value,
          
            "program": document.getElementById("program").value,
          
            "graduationYear": document.getElementById("graduationYear").value
          
        }

        fetch("/api/register", {
            method: 'POST',
            body: JSON.stringify(UserResponse), // makes the data readable and converts it to string
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(res => res.json())
        .then((response) => {
            if (response.status === "ok") {
                document.cookie = `uid=${response.data.id}; path=/ `; // stores in uid
                window.location.replace('index.html'); // go back to index.html
            } else if (response.status !== "ok") {
                signupAlertEL.style.display = "block";
                
                mainErr = response.errors.toString().replaceAll(",", "<br>");
                
                signupAlertEL.innerHTML = mainErr; // Supposed to print error message.
            }
        } )
        .catch(error => {console.log(error)})   
    }
    signupFormEL.addEventListener("submit", afterSubmission);   
}
// for the nav bar  set up
if (document.cookie) {
    function getCookie(cookiee) {
        var name = cookiee + "=";
        var ca = document.cookie.split(';');
        for(var i = 0; i <ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) == ' ') {
            c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
          }
        }
        return null;
      }
      let checkCookie = getCookie("uid")
      let cookieExists = checkCookie ? true : false;
        if (cookieExists === true) {
            fetch(`/api/users/${checkCookie}`, { //Fetch data using GET method
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                }
            })
            .then(res => res.json())
            .then(function(response) {
                //console.log(response)
                document.getElementById("login").style.visibility = "hidden";
                document.getElementById("signup").style.visibility = "hidden";
                let nameWelcome = document.getElementById("username")
                nameWelcome.innerHTML = `<b>Hi, ${response.firstname}</b>`;
                document.getElementById("logout").style.display = "block";
                document.getElementById("username").style.display = "block";
            })
            .catch(error => {
                console.log(error);
            })
        }

        // When user clicks the logout link
        let logout = document.getElementById("logout");
        function HandleLogout(event) {
            event.preventDefault();
            // Delete cookie
            document.cookie = "uid=; expires=Thu, 01 Jan 2000 00:00:00 UTC; path=/;";
            // Redirect to index.html
            window.location.replace('index.html');
            document.getElementById("login").style.visibility = "visible";
            document.getElementById("signup").style.visibility = "visible";
        }
        logout.addEventListener('click', HandleLogout);
}

//setting the login.html
if (window.location.href.includes("login.html")) {
    let login = document.getElementById("loginForm")
    let dangerAlert = document.getElementById("dangerAlert")
    dangerAlert.style.display = "none"
    window.onload = function () {
        function loginClick(e) {
            e.preventDefault();
            const data = new FormData(e.target);
            const value = Object.fromEntries(data.entries());
            fetch("/api/login", {
                method: 'POST',
                body: JSON.stringify(value), // makes the data readable and converts it to string
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then(response => response.json())
            .then((response) => {
                if(response.status === "ok") {
                    console.log(response.data)
                    document.cookie = `uid=${response.data.id}; domain=; path=/`;
                    window.location.replace("index.html")
                } else {
                    dangerAlert.innerHTML = "invalid email/password"
                    dangerAlert.style.display = "block"
                }
            })
            .catch(error => console.log(error))
            
        }
        login.addEventListener('submit', loginClick)
    }

}

// Create project page edits
if (window.location.href.includes('createproject.html')) {
    window.onload = function () {
        // Step 8 - Limit ability to create project to only logged users
        // Check if cookie id exists
        let cookieCheck = document.cookie.split(';').some((item) => item.trim().startsWith('uid='));
        if (!cookieCheck) {
            window.location.replace('login.html'); // redirect user to login.html page if cookie doesn't exist
        }
        // Step 7 - Create and post projects
        const createProjectForm = document.getElementById("createProjectForm"); // Get the form element that I will listen to
        const createprojectAlert = document.getElementById("createproject-alert");
        createprojectAlert.style.display = "none";

        function handleSubmit(event) {
            event.preventDefault();
            let tagsInput = (document.getElementById("tags").value).split(",");
            let authorsInput = (document.getElementById("authors").value).split(",");

            let projectInfo = {
                name :  document.getElementById("name").value,
                abstract : document.getElementById("abstract").value,
                tags : tagsInput,
                authors : authorsInput,
            }
            
            
            fetch('/api/projects', {
                method: 'POST',
                body: JSON.stringify(projectInfo), // All form data
                headers: {
                    'Content-Type': 'application/json',
                },
                })
                .then((response) => response.json())
                .then (response => {
                    if (response.status === "ok") {
                        console.log(response.data)
                        window.location.replace('index.html'); // redirect user to index.html page
                    } else if (response.status !== "ok") {
                        createprojectAlert.style.display = "block";
                        let mainErr = (response.errors).toString().replaceAll(',','<br>');
                        console.log(mainErr)
                        createprojectAlert.innerHTML = mainErr; // Supposed to print error message.
                        }
                })
                .catch(error => {
                    console.log(error);
                })
        }
        createProjectForm.addEventListener('submit', handleSubmit);
    } 
}

// Index.html page setup
if (window.location.href.includes("index.html")) {
    window.onload = function() {
        fetch("/api/projects", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(res => res.json())
        .then((response) => {
            console.log(response)
            let show = document.getElementsByClassName("showcase")[0]
            show.innerHTML = "" //clears previous html
            for(let i = 0; i < 4; i++) {
                //title tag
                let projectTitle = document.createElement("a");
                projectTitle.href = `viewproject.html?id=${response[i].id}`;
                projectTitle.className ="card-title";
                projectTitle.textContent = response[i].name;
                
                //author tag
                let authorTag = document.createElement("h6");
                authorTag.className = "card-subtitle";
                authorTag.textContent = response[i].authors;

                //abstract tag
                let abstractTag = document.createElement("p");
                abstractTag.className = "card-text";
                abstractTag.textContent = response[i].abstract;

                //tags tag
                let tagsTag = document.createElement("p");
                tagsTag.className = "card-text"
                tagsTag.textContent = response[i].tags;
                
                //cardbody div
                let cardDiv = document.createElement("div");
                cardDiv.className = "card-body"

                //parent card
                let card = document.createElement("div");
                card.className = "card";
                card.classList.add("col");
                
                //appending the events
                card.appendChild(cardDiv);
                cardDiv.appendChild(projectTitle);
                cardDiv.appendChild(authorTag);
                cardDiv.appendChild(abstractTag);
                cardDiv.appendChild(tagsTag); 
                show.appendChild(card);
            }
        })
        .catch(error => {
            console.log(error)
        })
    }    
}

// View project page edits
if (window.location.href.includes('viewproject.html')) {
    window.onload = function () {
        let params = new URLSearchParams(document.location.search.substring(1));
        let theId = params.get("id");

        fetch(`/api/projects/${theId}`, { 
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
        }
        })
            .then(response => response.json())
            .then(function(response) {
                // define and store texts replacements
                let projectName = response.name;
                document.getElementById("project_name").innerHTML = projectName;
                let projectAuthors = response.authors;
                document.getElementById("project_authors").innerHTML = projectAuthors;
                let projectTags = response.tags;
                document.getElementById("project_tags").innerHTML = projectTags;
                let projectAbstract = response.abstract;
                document.getElementById("project_abstract").textContent = projectAbstract;


                fetch(`/api/users/${response.createdBy}`, { //Use the actual id for the GET method for createdBy. Not sure of the end of this URL
                    method: 'GET',
                    headers: {
                    'Content-Type': 'application/json',
                }
                })
                    .then(response => response.json())
                    .then(function(response) {
                        // define and store texts replacements
                        let projectAuthor = `${response.firstname} ${response.lastname}`;
                        document.getElementById("project_author").textContent = projectAuthor;
                    })
                    .catch(error => {
                        console.log(error);
                    })
            });
            
                
    } 
}