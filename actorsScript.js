const baseURL = `http://localhost:19191`;
// `http://flip2.engr.oregonstate.edu:19191` (or wherever you run the server) when live  
// `http://localhost:19191` when local

// basic get request, builds table
var req = new XMLHttpRequest();

req.open("GET", baseURL, true);
req.setRequestHeader("table_name", "actors", false);    // set what table we are requesting
req.onload = (e) => {
    if (req.readyState === 4) {
        if (req.status === 200) {
            var response = JSON.parse(req.responseText);
            var allRows = response.rows
            console.log(response);
            makeTable(allRows);

        } else {
            console.error(req.statusText);
        }
    }
};
req.send();


// reference for table
const table = document.getElementById('actorsTable');

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
    var idCellText = document.createTextNode(currentRow.actor_id);
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


// submit row POST request, add row
const newRowSubmit = document.getElementById('addActorForm');
newRowSubmit.addEventListener('submit', (e) => {
    e.preventDefault();
    var req = new XMLHttpRequest();
    var payload = {
        first_name: null,
        last_name: null,
    };
    payload.first_name = document.getElementById("firstNameInput").value;
    payload.last_name = document.getElementById("lastNameInput").value;

    req.open("POST", `http://localhost:19191/add_actor`, true);
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