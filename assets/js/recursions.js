
function getRandomNumber(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

function createArray(table, size, name) {
  // Create a table element

  // Create a table row (the header row)
  var headrow = table.insertRow(0)
  var row = table.insertRow(1)
  row.id = name


  // Add header cells with integers from 0 to 10
  for (var i = 0; i <= size; i++) {
    td = document.createElement('td');
    th = document.createElement('th')

    var input = document.createElement("input");
    input.type = "number";
    input.id = name + i;
    input.style.backgroundColor = "transparent"
    td.appendChild(input);
    row.appendChild(td)
    th = document.createElement('th');
    var subscript = document.createElement('sub');
    th.textContent = "a";
    subscript.textContent = i;
    th.appendChild(subscript);
    headrow.appendChild(th);

  }

}

function accessArray(arrayName) {
  var tableRow = document.getElementById(arrayName);
  var rowDataArray = [];

  // Iterate through the table cells within the row.
  var cells = tableRow.getElementsByTagName('td');
  for (var i = 0; i < cells.length; i++) {
    rowDataArray.push(cells[i].childNodes[0].value);
  }
  return rowDataArray;
}

function linearRecursion(a0, d, x) {
  if (x <= 1) {
    return [a0];
  }

  const sequence = [a0];

  for (let n = 1; n < x; n++) {
    const an = sequence[n - 1] + d;
    sequence.push(an);
  }

  return sequence;
}



function checkLinearRecursion() {
  const a0 = parseFloat(document.getElementById("linRecA0").value);
  const x = parseInt(document.getElementById("linRecX").value);
  const d = parseFloat(document.getElementById("linRecD").value);
  const lrtable = document.getElementById('lin-rec-table');
  const expected = linearRecursion(a0, d, x);

  console.log("expected ", expected);

  for (let i = 0; i < lrtable.rows[1].cells.length; i++) {
    const cellElement = lrtable.rows[1].cells[i];
    const current = parseFloat(cellElement.childNodes[0].value);
    const ei = expected[i];

    if (i >= x) {
      if (current === "" || current === null) {
        cellElement.style.backgroundColor = "var(--right-answer)";
      } else {
        cellElement.style.backgroundColor = "var(--wrong-answer)";
      }
    } else {
      if (current === "" || current === null) {
        cellElement.style.backgroundColor = "var(--wrong-answer)";
      } else if (current === ei) {
        cellElement.style.backgroundColor = "var(--right-answer)";
      } else {
        cellElement.style.backgroundColor = "var(--wrong-answer)";
      }
    }
  }
}

function createMaxMatrix() {
    const table = document.getElementById('maxTable');
    table.style.margin = "auto"
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }
    for (let row = 0; row <= 2; row++) {
        const tr = document.createElement('tr');
        for (let col = 0; col <= 2; col++) {
            var td;
            if ( row == 0 && col == 0 ) {
                td = document.createElement('th')
                var subscript = document.createElement('sub');
                subscript.textContent = "i,j";
                td.textContent = "D";
                td.appendChild(subscript);

            } else if (row == 0) {
                td = document.createElement('th');

                td.textContent = col;
            } else if (col == 0) {
                td = document.createElement('td');

                td.textContent = row;
                td.style.fontWeight = "bold";
                td.style.width = "10%"
                td.style.textAlign = "center";
                td.style.border = "2px solid";

            } else {
                td = document.createElement('td');

                var input = document.createElement("input");
                input.type = "number";
                input.name = "member" + row + "-" + col;
                input.style.backgroundColor = "transparent"
                if ((row != 2) || (col != 2)) {
                  input.disabled = true;
                  input.value = getRandomNumber(0, 10);
                }
                td.appendChild(input);

            }
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
}

function checkMaxMatrix(){
  const maxTable = document.getElementById('maxTable');
  console.log(maxTable.rows[1].cells[2].children[0].value)
  first = parseInt(maxTable.rows[1].cells[1].children[0].value) + 2;
  second = parseInt(maxTable.rows[1].cells[2].children[0].value) + 3;
  third = parseInt(maxTable.rows[2].cells[1].children[0].value) + 1;
  result = Math.max(first, second, third);
  cellElement = maxTable.rows[2].cells[2];
  current = parseInt(cellElement.children[0].value);
  console.log(current, result)
  if (current == "" || current == null) {
      cellElement.style.backgroundColor = "var(--wrong-answer)";
  } else if (current == result){
          cellElement.style.backgroundColor = "var(--right-answer)";


  } else {
    cellElement.style.backgroundColor = "var(--wrong-answer)";
  }




}


// To add the table to a specific HTML element, you can do something like this:
var lrTable = document.getElementById('lin-rec-table');
createArray(lrTable, 10, "linRecTable")// Replace 'table-container' with the ID of the element where you want to insert the table-container
createMaxMatrix()


        // Function to display a random SVG image at a random position


