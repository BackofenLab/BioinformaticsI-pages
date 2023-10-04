var s1 = document.getElementById("seqA");
var s2 = document.getElementById("seqB");
var match = document.getElementById("match");
var mismatch = document.getElementById("mismatch");
var gap = document.getElementById("gap");
const table = document.getElementById('table1');


createTable()
s1.addEventListener("keyup", createTable);
s2.addEventListener("keyup", createTable);
match.addEventListener("keyup", wipeTable);
mismatch.addEventListener("keyup", wipeTable);
gap.addEventListener("keyup", wipeTable);
function createTable() {
    const table = document.getElementById('table1');
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }

    var s1 = document.getElementById("seqA").value;
    var s2 = document.getElementById("seqB").value;
    s1 = "-" + s1
    s2 = "-" + s2
    for (let row = 0; row < s1.length + 1; row++) {
        const tr = document.createElement('tr');
        for (let col = 0; col < s2.length + 1; col++) {
            var td;
            if ( row == 0 && col == 0 ) {
                td = document.createElement('th')
                td.textContent = "D(ij)";
            } else if (row == 0) {
                td = document.createElement('th');

                td.textContent = s2[col-1];
            } else if (col == 0) {
                td = document.createElement('td');

                td.textContent = s1[row-1];
                td.style.fontWeight = "bold";
                td.style.width = "5%"
                td.style.textAlign = "center";
                td.style.border = "2px solid";

            } else {
                td = document.createElement('td');

                var input = document.createElement("input");
                input.type = "number";
                input.name = "member" + row + "-" + col;
                input.style.backgroundColor = "transparent"
                td.appendChild(input);
            }
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
}
function checkTable() {
    var s1 = document.getElementById("seqA").value;
    var s2 = document.getElementById("seqB").value;
    var match = document.getElementById("match").value;
    var mismatch = document.getElementById("mismatch").value;
    var gap = document.getElementById("gap").value;
    matrix = needlemanWunsch(s1, s2, match, mismatch, gap);
    const table = document.getElementById('table1');
    for (let row = 0; row < s1.length + 1; row++){
        for (let col = 0; col < s2.length + 1; col++){
            const cellElement = table.rows[row+1].cells[col+1]
            let current = cellElement.childNodes[0].value
            let expected = matrix[row][col]
            if (current == "" || current == null) {
                cellElement.style.backgroundColor = "rgba(255, 0, 0, 0.4)"
            } else if (current == expected){
                cellElement.style.backgroundColor = "rgb(221,255,221)"
            } else {
                cellElement.style.backgroundColor = "rgba(255, 0, 0, 0.4)"

            }

        }

    }
}

function wipeTable() {
    const table = document.getElementById('table1');
    var s1 = document.getElementById("seqA").value;
    var s2 = document.getElementById("seqB").value;
    for (let row = 0; row < s1.length + 1; row++) {
        for (let col = 0; col < s2.length + 1; col++) {
            const cellElement = table.rows[row + 1].cells[col + 1]
            cellElement.style.backgroundColor = "white"
        }
    }
}

function needlemanWunsch(seqA, seqB, matchScore, mismatchScore, gapPenalty) {
    matchScore = Number(matchScore);
    mismatchScore = Number(mismatchScore);
    gapPenalty = Number(gapPenalty);
    const rows = seqA.length + 1;
    const cols = seqB.length + 1;

    // Initialize the matrix with zeros
    const matrix = new Array(rows);
    for (let i = 0; i < rows; i++) {
        matrix[i] = new Array(cols).fill(0);
    }

    // Initialize the first row and column with gap penalties
    for (let i = 1; i < rows; i++) {
        matrix[i][0] = matrix[i - 1][0] + gapPenalty;
    }
    for (let j = 1; j < cols; j++) {
        matrix[0][j] = matrix[0][j - 1] + gapPenalty;
    }

    // Fill in the rest of the matrix using dynamic programming
    for (let i = 1; i < rows; i++) {
        for (let j = 1; j < cols; j++) {
            const match = seqA[i - 1] === seqB[j - 1] ? matchScore : mismatchScore;
            matrix[i][j] = Math.max(
                matrix[i - 1][j - 1] + match, // diagonal move (match/mismatch)
                matrix[i - 1][j] + gapPenalty, // up move (gap in seqB)
                matrix[i][j - 1] + gapPenalty // left move (gap in seqA)
            );
        }
    }

    return matrix;
}
