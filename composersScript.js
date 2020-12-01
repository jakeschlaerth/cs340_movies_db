const baseURL = `http://localhost:19191`;
//const baseURL =  `http://flip3.engr.oregonstate.edu:19191` // (or wherever you run the server) when live   
// `http://localhost:19191` when local

// basic get request, builds table
var req = new XMLHttpRequest();

req.open("GET", baseURL, true);
req.setRequestHeader("table_name", "composers", false);    // set what table we are requesting
req.onload = (e) => {
    if (req.readyState === 4) {
        if (req.status === 200) {
            var response = JSON.parse(req.responseText);
            var allRows = response.rows
            makeTable(allRows);

        } else {
            console.error(req.statusText);
        }
    }
};
req.send();


// reference for table
const table = document.getElementById('composersTable');

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
    var idCellText = document.createTextNode(currentRow.composer_id);
    // hide cell
    idCell.style.visibility = "hidden";
    // append text to cell
    idCell.appendChild(idCellText);
    // append cell to row
    row.appendChild(idCell);

    // make cell for each datum
    makeCell(currentRow.first_name, row);
    makeCell(currentRow.last_name, row);

    // view movies button
    viewMoviesButton = document.createElement("button");
    viewMoviesButton.innerHTML = "View movies";
    viewMoviesButton.id = "viewMoviesButton";
    // new cell
    var viewMoviesCell = document.createElement("td");
    // append button to cell
    viewMoviesCell.appendChild(viewMoviesButton);
    // append cell to row
    row.append(viewMoviesCell);

    // update button
    updateButton = document.createElement("button");
    updateButton.innerHTML = "edit";
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

// delete all entries in table
const deleteTable = (allRows) => {
    // set
    currentDataRow = table.firstElementChild.firstElementChild;
    while (true) {
        if (currentDataRow.nextElementSibling == null) {
            currentDataRow.remove();
            break;
        }
        currentDataRow.nextElementSibling.remove();
    }
};

// submit row POST request, add row
const newRowSubmit = document.getElementById('addComposerForm');
newRowSubmit.addEventListener('submit', (e) => {
    e.preventDefault();
    var req = new XMLHttpRequest();
    var payload = {
        first_name: null,
        last_name: null,
        table_name: "composers"
    };
    payload.first_name = document.getElementById("firstNameInput").value;
    payload.last_name = document.getElementById("lastNameInput").value;
    req.open("POST", baseURL, true);
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
    // if it is an update button, send a PUT request to the server
    if (target.id == "updateButton") {
        onUpdate(target);
    };
    // if it is a delete button, send a delete request to the server
    if (target.id == "deleteButton") {
        onDelete(target)
    };
});

var updateBool = false; 
const onUpdate = (target) => {
    if (updateBool == true) {
        alert("You are already updating a row!");
        return;
    }
    updateBool = true;
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

    // starts pointing at first_name field
    var currentElement = updateRow.firstElementChild.nextElementSibling;

    // new form
    updateForm = document.createElement("form");
    // append form to document
    document.body.appendChild(updateForm);

    // first_name label
    var first_name_label = document.createElement("label");
    first_name_label.innerText = "first name:"
    // first_name field
    var first_name_input = document.createElement("input");
    // first_name field input type
    first_name_input.setAttribute("type", "text");
    // first_name of field
    first_name_input.first_name = "first_name";
    // first_name field old value
    first_name_input.defaultValue = currentElement.innerText;
    // append
    first_name_label.appendChild(first_name_input);
    updateForm.appendChild(first_name_label);

    // iterate through siblings
    currentElement = currentElement.nextElementSibling;

    // last_name label
    var last_name_label = document.createElement("label");
    last_name_label.innerText = "last name:"
    // last_name field
    var last_name_input = document.createElement("input");
    // last_name field input type
    last_name_input.setAttribute("type", "text");
    // last_name of field
    last_name_input.last_name = "last_name";
    // last_name field old value
    last_name_input.defaultValue = currentElement.innerText;
    // append
    last_name_label.appendChild(last_name_input);
    updateForm.appendChild(last_name_label);

    // submit button
    var updateSubmit = document.createElement("input");
    updateSubmit.setAttribute("type", "submit");
    updateSubmit.value = "submit";
    // append
    updateForm.appendChild(updateSubmit);

    updateSubmit.addEventListener('click', (e) => {
        e.preventDefault();

        var req = new XMLHttpRequest();
        var payload = {
            first_name: first_name_input.value,
            last_name: last_name_input.value,
            composer_id: updateID,
            table_name: "composers"
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
                    updateBool = false;
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

const onDelete = (target) => {
    //             button cell       row        id cell           id value
    var deleteID = target.parentNode.parentNode.firstElementChild.innerHTML;
    var req = new XMLHttpRequest();
    var payload = {
        composer_id: deleteID,
        table_name: "composers"
    };

    var fkConflict = false;
    // can this composer be deleted?
    req.open("GET", baseURL, true);
    req.setRequestHeader("table_name", "movies", false);    // set what table we are requesting
    req.onload = (e) => {
        if (req.readyState === 4) {
            if (req.status === 200) {
                var response = JSON.parse(req.responseText);
                var allRows = response.rows
                // iterate through all movies, check for deleteID in composer_id
                var i;
                for (i = 0; i < allRows.length; i++) {
                    if (allRows[i].composer_id == deleteID) {
                        alert(`Sorry, ${allRows[i].composer} cannot be deleted while listed as the director of ${allRows[i].title}`);
                        fkConflict = true;
                    }
                }
                if (!fkConflict) {
                    sendDeleteRequest(deleteID);
                }
            } else {
                console.log(baseURL)
                console.error(req.statusText);
            }
        }
    };
    req.send();
};

sendDeleteRequest = (deleteID) => {
    var del_req = new XMLHttpRequest();
    var payload = {
        composer_id: deleteID,
        table_name: "composers"
    };
    del_req.open("DELETE", baseURL, true);
    del_req.setRequestHeader('Content-Type', 'application/json');
    del_req.onload = (e) => {
        if (del_req.readyState === 4) {
            if (del_req.status === 200) {
                // this is where the magic happens
                var response = JSON.parse(del_req.responseText);
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
    del_req.send(JSON.stringify(payload));
}