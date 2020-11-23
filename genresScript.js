// reference for movies table
const table = document.getElementById('genresTable');

// sample data
var allRows = [
    {
        genreID: 0,
        name: "thriller",
    },
    {
        genreID: 1,
        name: "action",
    }, 
    {
        genreID: 2,
        name: "comedy",
    },
    {
        genreID: 3,
        name: "sci-fi",
    },
    {
        genreID: 4,
        name: "fantasy",
    }
]

// build the table according to the allRows, an array of objects
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
    var idCellText = document.createTextNode(currentRow.genreID);
    // hide cell
    idCell.style.visibility = "hidden";
    // append text to cell
    idCell.appendChild(idCellText);
    // append cell to row
    row.appendChild(idCell);

    // make cell for each datum
    makeCell(currentRow.name, row);

    // edit button
    editButton = document.createElement("button");
    editButton.innerHTML = "edit";
    editButton.id = "editButton";
    // new cell
    var editCell = document.createElement("td")
    // append button to cell
    editCell.appendChild(editButton)
    // append cell to row
    row.append(editCell)

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
const newRowSubmit = document.getElementById('addGenreForm');
newRowSubmit.addEventListener('submit', (e) => {
    e.preventDefault();
    var req = new XMLHttpRequest();
    var payload = {
        name: null,
    };
    payload.name = document.getElementById("nameInput").value;

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

makeTable(allRows);