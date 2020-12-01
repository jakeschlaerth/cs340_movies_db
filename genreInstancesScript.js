// reference for movies table
const baseURL = `http://localhost:19191`;
// const baseURL = `http://flip1.engr.oregonstate.edu:19191`  

const table = document.getElementById('genresTable');

var req = new XMLHttpRequest();

req.open("GET", baseURL, true);
req.setRequestHeader("table_name", "genre_instances", false);    // set what table we are requesting
req.onload = (e) => {
    if (req.readyState === 4) {
        if (req.status === 200) {
            var response = JSON.parse(req.responseText);
            var allRows = response.rows
            console.log('success');
            makeTable(allRows);
            console.log(allRows);
        } else {
            console.log(baseURL)
            console.error(req.statusText);
        }
    }
};
req.send();

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
    // var idCell = document.createElement("td");
    // // new cell text
    // var idCellText = document.createTextNode(currentRow.genreID);
    // // hide cell
    // idCell.style.visibility = "hidden";
    // // append text to cell
    // idCell.appendChild(idCellText);
    // // append cell to row
    // row.appendChild(idCell);

    // make cell for each datum
    makeCell(currentRow.title, row);
    makeCell(currentRow.name, row);

    // delete button is unnecessary on genreInstances
    // deleteButton = document.createElement("button");
    // deleteButton.innerHTML = "delete";
    // deleteButton.id = "deleteButton";
    // new cell
    // var deleteCell = document.createElement("td")
    // // append button to cell
    // deleteCell.appendChild(deleteButton)
    // // append cell to row
    // row.append(deleteCell)

    // // append row to tbody
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