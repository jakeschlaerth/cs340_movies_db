const baseURL = `http://localhost:19191`;  
//const baseURL = `http://flip3.engr.oregonstate.edu:19191` // (or wherever you run the server) when live  
// `http://localhost:19191` when local

// basic get request, builds table
var req = new XMLHttpRequest();

req.open("GET", baseURL, true);
req.setRequestHeader("table_name", "movies", false);    // set what table we are requesting
req.onload = (e) => {
    if (req.readyState === 4) {
        if (req.status === 200) {
            var response = JSON.parse(req.responseText);
            var allRows = response.rows
            makeTable(allRows);

        } else {
            console.log(baseURL)
            console.error(req.statusText);
        }
    }
};
req.send();


// reference for table
const table = document.getElementById('moviesTable');

const makeTable = (allRows) => {
    for (var row = 0; row < allRows.length; row++) {
        var currentRow = allRows[row];
        makeRow(currentRow, table);
    };
}; 

const makeRow = (currentRow, table) => {
    // reference for moviesTable body
    var tbody = table.firstElementChild;
    // new row
    var row = document.createElement("tr");

    // id will be hidden
    // new cell
    var idCell = document.createElement("td");
    // new cell text
    var idCellText = document.createTextNode(currentRow.movie_id);
    // hide cell
    idCell.style.visibility = "hidden";
    // append text to cell
    idCell.appendChild(idCellText);
    // append cell to row
    row.appendChild(idCell);

    // make cell for each datum
    makeCell(currentRow.title, row);
    makeCell(currentRow.release_year, row);
    let director_id = currentRow.director_id;

    makeCell(currentRow.director, row); // TODO look up a director ID, currently hardcoded
    makeCell(currentRow.composer, row); // TODO look up a composer ID
    // makeCell(currentRow.genres, row);   // parse all genre instances with this movieID

    // view genres button
    viewGenresButton = document.createElement("button");
    viewGenresButton.innerHTML = "View genres";
    viewGenresButton.id = "viewGenresButton";
    // new cell
    var viewGenresCell = document.createElement("td");
    // append button to cell
    viewGenresCell.appendChild(viewGenresButton);
    // append cell to row
    row.append(viewGenresCell);

    // view Actors button
    viewActorsButton = document.createElement("button");
    viewActorsButton.innerHTML = "View actors";
    viewActorsButton.id = "viewActorsButton";
    // new cell
    var viewActorsCell = document.createElement("td");
    // append button to cell
    viewActorsCell.appendChild(viewActorsButton);
    // append cell to row
    row.append(viewActorsCell);

    // update button
    updateButton = document.createElement("button");
    updateButton.innerHTML = "update";
    updateButton.id = "updateButton";
    // new cell
    var updateCell = document.createElement("td");
    // append button to cell
    updateCell.appendChild(updateButton);
    // append cell to row
    row.append(updateCell);

    // delete button
    deleteButton = document.createElement("button");
    deleteButton.innerHTML = "delete";
    deleteButton.id = "deleteButton";
    // new cell
    var deleteCell = document.createElement("td")
    // append button to cell
    deleteCell.appendChild(deleteButton)
    // append cell to row
    row.append(deleteCell)

    // append row to tbody
    tbody.appendChild(row)
};

const makeCell = (data, row) => {
    // new cell
    var cell = document.createElement("td");
    // new cell text
    var cellText = document.createTextNode(data);
    // append text to cell
    cell.appendChild(cellText);
    // append cell to row
    row.appendChild(cell);
};

const deleteTable = (allRows) => {
    // set
    currentDataRow = table.firstElementChild.firstElementChild. nextElementSibling;
    while (true) {
        if (currentDataRow.nextElementSibling == null) {
            currentDataRow.remove();
            break;
        }
        currentDataRow.nextElementSibling.remove();
    }
};

// submit row POST request, add row
const newRowSubmit = document.getElementById('addMovieForm');
newRowSubmit.addEventListener('submit', (e) => {
    e.preventDefault();
    var req = new XMLHttpRequest();
    var payload = {
        title: null,
        releaseYear: null,
        director: null,
        composer: null,
        genres: null,
    };
    payload.name = document.getElementById("titleInput").value;
    payload.releaseYear = document.getElementById("releaseYearInput").value;
    payload.director = document.getElementById("directorInput").value;
    payload.composer = document.getElementById("composerInput").value;
    payload.genres = document.getElementById("genresInput").value;

    req.open("POST", baseURL, true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.onload = (e) => {
        if (req.readyState === 4) {
            if (req.status === 200) {
                // this is where the magic happens
                var response = JSON.parse(req.responseText);
                // return success or failure here
            } else {
                console.error(req.statusText);
            }
        }
    };
    req.send(JSON.stringify(payload));
});

table.addEventListener('click', (event) => {
    let target = event.target;
    if (target.id == "updateButton") {
        onUpdate(target);
    };
    if (target.id == "deleteButton") {
        onDelete(target)
    };
    // if it is an update button, send a PUT request to the server
    // if it is a delete button, send a delete request to the server

    // delete table
    // make table again
});

// populates director drop down menu on update form
getDirectors = (currentDir) => {
    var req = new XMLHttpRequest();
    req.open("GET", baseURL, true);
    req.setRequestHeader("table_name", "directors", false);    // set what table we are requesting
    req.onload = (e) => {
        if (req.readyState === 4) {
            if (req.status === 200) {
                // this is where the magic happens              
                var response = JSON.parse(req.responseText);
               var directorArray = response.rows;
               directorSelect = document.querySelector("#directorSelect");
               var i;
               for (i=0; i < directorArray.length; i++)
               {
                    dropdownOption = document.createElement("option");
                    dropdownOption.innerHTML = `${directorArray[i].first_name} ${directorArray[i].last_name}`;
                    dropdownOption.value = directorArray[i].director_id;
                    // set default option
                    if (`${directorArray[i].first_name} ${directorArray[i].last_name}` === currentDir) {
                       dropdownOption.defaultSelected = true;
                   }
                    // append
                    directorSelect.appendChild(dropdownOption);
               }
               // find prev director
                for (i = 0; i < directorArray.length; i++)
                {

                }
               directorSelect.selected
            } else {
                console.log(baseURL)
                console.error(req.statusText);
            }
        }
    };
    req.send();
}

// populates composer dropdown menu
getComposers = (currentCom) => {
    var req = new XMLHttpRequest();
    req.open("GET", baseURL, true);
    req.setRequestHeader("table_name", "composers", false);    // set what table we are requesting
    req.onload = (e) => {
        if (req.readyState === 4) {
            if (req.status === 200) {
                // this is where the magic happens              
                var response = JSON.parse(req.responseText);
                var composerArray = response.rows;
                composerSelect = document.querySelector("#composerSelect");
                var i;
                for (i = 0; i < composerArray.length; i++) {
                    dropdownOption = document.createElement("option");
                    dropdownOption.innerHTML = `${composerArray[i].first_name} ${composerArray[i].last_name}`;
                    dropdownOption.value = composerArray[i].composer_id;
                    if (`${composerArray[i].first_name} ${composerArray[i].last_name}` === currentCom) {
                        dropdownOption.defaultSelected = true;
                    }

                    // append
                    composerSelect.appendChild(dropdownOption);
                }
            } else {
                console.log(baseURL)
                console.error(req.statusText);
            }
        }
    };
    req.send();
}

const onUpdate = (target) => {
    //              button cell       row
    var updateRow = target.parentNode.parentNode

    //             button cell       row        id cell           id value
    var updateID = target.parentNode.parentNode.firstElementChild.innerHTML;

    // new header
    updateHeader = document.createElement("h1");
    // text content of header
    updateHeader.innerHTML = "Update Form";
    // append header to body
    document.body.appendChild(updateHeader);

    // starts pointing at title field
    var currentElement = updateRow.firstElementChild.nextElementSibling;
    
    // new form
    updateForm = document.createElement("form");
    // append form to document
    document.body.appendChild(updateForm);

    // title label
    var titleLabel = document.createElement("label");
    titleLabel.innerText = "title:"
    // title field
    var titleInput = document.createElement("input");
    // title field input type
    titleInput.setAttribute("type", "text");
    // title of field
    titleInput.name = "title";
    // title field old value
    titleInput.defaultValue = currentElement.innerText;
    // append
    titleLabel.appendChild(titleInput);
    updateForm.appendChild(titleLabel);

    // iterate through siblings
    currentElement = currentElement.nextElementSibling;

    // year label
    var yearLabel = document.createElement("label");
    yearLabel.innerText = "year:"
    // year field
    var yearInput = document.createElement("input");
    // year field input type
    yearInput.setAttribute("type", "number");
    // year of field
    yearInput.name = "year";
    // year field old value
    yearInput.defaultValue = currentElement.innerText;
    // append
    yearLabel.appendChild(yearInput);
    updateForm.appendChild(yearLabel);

    // iterate through siblings
    currentElement = currentElement.nextElementSibling;

    var currentDir = currentElement.innerHTML;
    // director label
    var directorLabel = document.createElement("label");
    directorLabel.innerText = "director:"
    // director field
    var directorSelect = document.createElement("select");
    directorSelect.id = "directorSelect";
    // populate dropdown
    getDirectors(currentDir);
    // name of field
    directorSelect.name = "director";
    // append
    directorLabel.appendChild(directorSelect);
    updateForm.appendChild(directorLabel);

    // iterate through siblings
    currentElement = currentElement.nextElementSibling;

    var currentCom = currentElement.innerHTML;
    // composer label
    var composerLabel = document.createElement("label");
    composerLabel.innerText = "composer:"
    // composer field
    var composerSelect = document.createElement("select");
    composerSelect.id = "composerSelect";
    // populate dropdown
    getComposers(currentCom);
    // name of field
    composerSelect.name = "composer";
    // composer field old value
    // composerInput.defaultValue = currentElement.innerText;
    // append
    composerLabel.appendChild(composerSelect);
    updateForm.appendChild(composerLabel);
    

    // iterate through siblings
    currentElement = currentElement.nextElementSibling;


   
    // submit button
    var updateSubmit = document.createElement("input");
    updateSubmit.setAttribute("type", "submit");
    updateSubmit.value = "submit";
    // append
    updateForm.appendChild(updateSubmit);

    updateSubmit.addEventListener('click', (e) => {
        e.preventDefault();
        var req = new XMLHttpRequest();
        var updateURL = baseURL;
        var payload = {
            title: titleInput.value,
            release_year: yearInput.value,
            director_id: directorSelect.value,
            composer_id: composerSelect.value,
            movie_id: updateID,
            table_name: "movies"
        };
        req.open("PUT", baseURL, true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.onload = (e) => {
            if (req.readyState === 4) {
                if (req.status === 200) {
                    // this is where the magic happens
                    var response = JSON.parse(req.responseText);
                    allRows = response.rows;
                    // remove old table
                    deleteTable(allRows);
                    // rebuild from scratch
                    makeTable(allRows);

                } else {
                    console.error(req.statusText);
                }
            }
        }
        req.send(JSON.stringify(payload));
        updateHeader.remove();
        updateForm.remove();
    });
};