// reference for movies table
const table = document.getElementById('genresTable');

// sample data
var allRows = [
    {
        genreID: "thriller",    // will be genreID
        movieID: "Pulp Fiction",    // will be movieID
    },
    {
        genreID: "action",
        movieID: "Pulp Fiction",
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
    makeCell(currentRow.movieID, row);
    makeCell(currentRow.genreID, row);

    console.log("hello")
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

makeTable(allRows);