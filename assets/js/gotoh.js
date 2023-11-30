var s1 = document.getElementById("seqA");
var s2 = document.getElementById("seqB");
var match = document.getElementById("match");
var mismatch = document.getElementById("mismatch");
var gapIntro = document.getElementById("gap-intro");
var gapExtend = document.getElementById("gap-extend");

const tableD = document.getElementById('tableD');
const tableQ = document.getElementById('tableQ');
const tableP = document.getElementById('tableP');


createTables()
s1.addEventListener("keyup", createTables);
s2.addEventListener("keyup", createTables);
match.addEventListener("keyup", wipeTables);
mismatch.addEventListener("keyup", wipeTables);
gapIntro.addEventListener("keyup", wipeTables);
gapExtend.addEventListener("keyup", wipeTables);


function createHeader(name, sub) {
  var subscript = document.createElement('sub');
  var d = document.createElement('P');
  subscript.textContent = sub;
  d.textContent = name;
  d.appendChild(subscript);
  return d

}

function createTables() {
  var d = createHeader("D", "i,j")
  var q = createHeader("Q", "i,j")
  var p = createHeader("P", "i,j")

  createTable("tableD", d);
  createTable("tableQ", q);
  createTable("tableP", p);
}

function createTable(tid, headContent) {
    const table = document.getElementById(tid);
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
                td.appendChild(headContent)
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
                const newDiv = document.createElement('div');
                newDiv.classList.add("full-parent")
                newDiv.style.zIndex=1;
                const newSpan = document.createElement('span');
                newSpan.classList.add("smallText")
                newDiv.appendChild(newSpan)


                var input = document.createElement("input");
                input.name = "member" + row + "-" + col;
                input.style.backgroundColor = "transparent"
                input.style.zIndex=2;

                td.appendChild(input);
                td.appendChild(newDiv)
                newDiv.addEventListener('click', function() {
            // Toggle the 'highlight' class
                  newDiv.classList.toggle('selectedTracebackCell');
                  newDiv.style.border = null;
                });

            }
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
}
function checkTable() {
    var s1 = document.getElementById("seqA").value;
    var s2 = document.getElementById("seqB").value;
    var match = parseInt(document.getElementById("match").value);
    var mismatch = parseInt(document.getElementById("mismatch").value);
    var gapIntro = parseInt(document.getElementById("gap-intro").value);
    var gapExtend = parseInt(document.getElementById("gap-extend").value);

    matrices = gotohTable(s1, s2, match, mismatch, gapIntro, gapExtend);
    for (let key in matrices) {
      const table = document.getElementById(`table${key}`);
      matrix = matrices[key];
      for (let row = 0; row < s1.length + 1; row++){
          for (let col = 0; col < s2.length + 1; col++){
              const cellElement = table.rows[row+1].cells[col+1]
              let current = cellElement.childNodes[0].value;
              if (current === "-inf"){
                current = Number.NEGATIVE_INFINITY;
              } else if (current === "inf") {
                current = Infinity;
              }
              let expected = matrix[row][col]
              if (current == "" || current == null) {
                  cellElement.style.backgroundColor = "var(--wrong-answer)"
              } else if (Number(current) == expected){
                  cellElement.style.backgroundColor = "var(--right-answer)"
              } else {
                  cellElement.style.backgroundColor = "var(--wrong-answer)"

              }

          }

      }
    }



}


function fillTable() {
    var s1 = document.getElementById("seqA").value;
    var s2 = document.getElementById("seqB").value;
    var match = parseInt(document.getElementById("match").value);
    var mismatch = parseInt(document.getElementById("mismatch").value);
    var gapIntro = parseInt(document.getElementById("gap-intro").value);
    var gapExtend = parseInt(document.getElementById("gap-extend").value);

    matrices = gotohTable(s1, s2, match, mismatch, gapIntro, gapExtend);
    for (let key in matrices) {
      const table = document.getElementById(`table${key}`);
      matrix = matrices[key];
      for (let row = 0; row < s1.length + 1; row++){
          for (let col = 0; col < s2.length + 1; col++){
              const cellElement = table.rows[row+1].cells[col+1]
              let expected = matrix[row][col]
              if (expected == -Infinity) {
                expected = "-inf"
              }

              cellElement.childNodes[0].value = expected;
          }
      }
    }
}


function wipeTable(tid) {
    if (typeof tid === 'undefined') {return ""}
    const table = document.getElementById(tid);
    var s1 = document.getElementById("seqA").value;
    var s2 = document.getElementById("seqB").value;
    for (let row = 0; row < s1.length + 1; row++) {
        for (let col = 0; col < s2.length + 1; col++) {
            const cellElement = table.rows[row + 1].cells[col + 1]
            cellElement.style.backgroundColor = null;
            cellElement.childNodes[0].value = "";
            cellElement.childNodes[1].style.backgroundColor = null;
            cellElement.childNodes[1].style.border = null;
        }
    }
}

function wipeTables() {
  wipeTable("tableD");
  wipeTable("tableQ");
  wipeTable("tableP");

}

function gotohTable(seqA, seqB, matchScore, mismatchScore, gapIntro, gapExtend) {
  // Initialize matrices D, Q, and P
  matchScore = Number(matchScore);
  mismatchScore = Number(mismatchScore);
  gapIntro = Number(gapIntro);
  gapExtend = Number(gapExtend);
  var D = [];
  var Q = [];
  var P = [];

  for (var i = 0; i <= seqA.length; i++) {
    D[i] = [];
    Q[i] = [];
    P[i] = [];
    if (i > 0) {
      P[i][0] = 0;
      Q[i][0] = Number.NEGATIVE_INFINITY;
      D[i][0] = gapIntro + (gapExtend * i)
    } else {
      D[i][0] = 0;
      P[i][0] = 0;
      Q[i][0] = 0;
    }
  }
  for (var i = 1; i <= seqB.length; i++) {
    Q[0][i] = 0;
    P[0][i] = Number.NEGATIVE_INFINITY;
    D[0][i] = gapIntro + (gapExtend * i)
  }



  // Fill in matrices D, Q, and P
for (var i = 1; i <= seqA.length; i++) {
  for (var j = 1; j <= seqB.length; j++) {
      // Calculate scores for match, mismatch, and gap
      var matchMisMatchScore = D[i - 1][j - 1] + (seqA[i - 1] === seqB[j - 1] ? matchScore : mismatchScore);
      Q[i][j] = Math.max(D[i][j-1] + gapIntro + gapExtend, Q[i][j-1] + gapExtend)

      P[i][j] = Math.max(D[i-1][j] + gapIntro + gapExtend, P[i-1][j] + gapExtend)
      // Update matrices D, Q, and P
      D[i][j] = Math.max(matchMisMatchScore, P[i][j], Q[i][j]);

    }
  }
  // Return matrices D, Q, and P
  return { D: D, Q: Q, P: P };
}


function swapTableMode(tid, tracebackMode) {
  const table = document.getElementById(tid);
  var s1 = document.getElementById("seqA").value;
  var s2 = document.getElementById("seqB").value;
  if (tracebackMode) {
    for (let row = 0; row < s1.length + 1; row++) {
      for (let col = 0; col < s2.length + 1; col++) {
          const cellElement = table.rows[row + 1].cells[col + 1]
          const ip = cellElement.childNodes[0];
          const div = cellElement.childNodes[1];
          div.style.zIndex = 2;
          ip.style.zIndex = 1;

      }
  }

  } else {
    for (let row = 0; row < s1.length + 1; row++) {
      for (let col = 0; col < s2.length + 1; col++) {
          const cellElement = table.rows[row + 1].cells[col + 1]
          const ip = cellElement.childNodes[0];
          const div = cellElement.childNodes[1];
          div.style.zIndex = 1;
          ip.style.zIndex = 2;

      }

  }

  }

}
function swapTableModes(traceBackMode) {
  swapTableMode("tableD", traceBackMode);
  swapTableMode("tableQ", traceBackMode);
  swapTableMode("tableP", traceBackMode);
}



const toggleCheckbox = document.getElementById('tracebackToggle');
const divToHide = document.getElementById('tableCheckBtn');
const divToShow = document.getElementById('tracebackCheckBtn');

 toggleCheckbox.addEventListener('change', function() {
      // If the checkbox is checked, show divToShow and hide divToHide
      if (toggleCheckbox.checked) {
        divToShow.classList.remove('hidden');
        divToHide.classList.add('hidden');
        swapTableModes(true);
      } else {
        // If the checkbox is not checked, hide divToShow and show divToHide
        divToShow.classList.add('hidden');
        divToHide.classList.remove('hidden');
        swapTableModes(false);

      }
    });


function getScoringAndSeqs() {
    var s1 = document.getElementById("seqA").value;
    var s2 = document.getElementById("seqB").value;
    var match = parseInt(document.getElementById("match").value);
    var mismatch = parseInt(document.getElementById("mismatch").value);
    var gapIntro = parseInt(document.getElementById("gap-intro").value);
    var gapExtend = parseInt(document.getElementById("gap-extend").value);
    scoring = {"seqA": s1, "seqB": s2, "match": match, "mismatch": mismatch, "gap_introduction": gapIntro, "gap_extension": gapExtend}
    return scoring

}

function buildTracbackPathes(){
  var scoring = getScoringAndSeqs();
  matrices = gotohTable(
    scoring["seqA"],
    scoring["seqB"],
    scoring["match"],
    scoring["mismatch"],
    scoring["gap_introduction"],
    scoring["gap_extension"],
  )

  list_pathes = buildAllTracebackPathsCorrect(
    scoring["seqA"], scoring["seqB"], scoring, matrices["D"], matrices["P"], matrices["Q"]
  );
  return list_pathes;
}

function unpackTracebacks(traceback_paths, seqA, seqB) {
  var D = [];
  var Q = [];
  var P = [];

  for (var i = 0; i <= seqA.length; i++) {
    D[i] = [];
    Q[i] = [];
    P[i] = [];
    for (var j = 0; j <= seqB.length; j++) {
      D[i][j] = 0;
      Q[i][j] = 0;
      P[i][j] = 0;
    }
  }
  var matrices = { "D": D, "Q": Q, "P": P };


  for (let p = 0; p < traceback_paths.length; p++) {
      var path = traceback_paths[p];
      for (let x = 0; x < path.length; x++) {
        var m = path[x][0];
        var i = path[x][1][0];
        var j = path[x][1][1];
        matrices[m][i][j] = 1;
    }


  }
  return matrices
}


function checkTracebackTable(tid, s1, s2){
  const table = document.getElementById(`table${tid}`);
  var l = []
    for (let row = 0; row < s1.length + 1; row++) {
        for (let col = 0; col < s2.length + 1; col++) {
            const cellElement = table.rows[row + 1].cells[col + 1]
            const tbdiv = cellElement.childNodes[1]
            if (tbdiv.classList.contains('selectedTracebackCell')){
              l.push([tid, [row, col]])
            }
        }
    }
  return l
}

function checkTracebacks(){
  scoring = getScoringAndSeqs()
  traceback_paths = buildTracbackPathes();
  d = checkTracebackTable("D", scoring["seqA"], scoring["seqB"])
  q = checkTracebackTable("Q", scoring["seqA"], scoring["seqB"])
  p = checkTracebackTable("P", scoring["seqA"], scoring["seqB"])
  const concatenatedArray = [...d, ...q, ...p];
  var correct = false;
  for (let p = 0; p < traceback_paths.length; p++) {
    if (arraysEqualIgnoreOrder(traceback_paths[p], concatenatedArray)) {
      correct = true;
    }
  }
  var color;
  if (correct){
    color = "green"

  } else {
    color = "red"
  }

  var path = concatenatedArray;
  for (let x = 0; x < path.length; x++) {
    var m = path[x][0];
    var i = path[x][1][0];
    var j = path[x][1][1];
    highlightCell(`table${m}`, i, j, color)
  }



}

function stringifyArray(arr) {
  const [type, coordinates] = arr;
  const [a, b] = coordinates;
  return `${type}(${a},${b})`;
}

function arraysEqualIgnoreOrder(arr1, arr2) {
  arr1s = []
  arr2s = []


  arr1.forEach((arr) => {
    const result = stringifyArray(arr);
    arr1s.push(result);
  });
  arr2.forEach((arr) => {
    const result = stringifyArray(arr);
    arr2s.push(result);
  });

  const set1 = new Set(arr1s);
  const set2 = new Set(arr2s);
  if (set1.size !== set2.size) {
    return false;
  }

  for (const item of set1) {
    if (!set2.has(item)) {

      return false;
    }
  }

  return true;
}


function highlightTraceBacks() {
  traceback_paths = buildTracbackPathes();
  for (let p = 0; p < Math.min(traceback_paths.length, 10); p++) {
      var path = traceback_paths[p];
      for (let x = 0; x < path.length; x++) {
        var m = path[x][0];
        var i = path[x][1][0];
        var j = path[x][1][1];
        highlightCell(`table${m}`, i, j, p)
      }



  }
}

function highlightCell(tid, i, j, color) {
  const table = document.getElementById(tid);
    const cellElement = table.rows[i+1].cells[j+1];
    cellElement.childNodes[1].style.border = `2px solid ${color}`;
}

function buildAllTracebackPathsCorrect(seq1, seq2, scoring, dMatrix, pMatrix, qMatrix) {
    const listTracebackPaths = [];

    const cell = ["D", [dMatrix.length - 1, dMatrix[0].length - 1]];
    const frontier = [ [cell] ];

    while (frontier.length) {
        const partialPath = frontier.pop();
        const lastCellPartial = partialPath[partialPath.length - 1];
        const nextSteps = previousCellsCorrect(seq1, seq2, scoring, dMatrix, pMatrix, qMatrix, lastCellPartial);
        for (const nextStep of nextSteps) {
            const newTracebackPath = partialPath.concat([nextStep]);
            if (nextStep[0] === "D" && nextStep[1][0] === 0 && nextStep[1][1] === 0) {
                listTracebackPaths.push(newTracebackPath);
            } else {
                frontier.push(newTracebackPath);
            }
        }
    }

    return listTracebackPaths;
}



function previousCellsCorrect(seq1, seq2, scoring, dMatrix, pMatrix, qMatrix, cell) {
    const matchScore = scoring["match"];
    const mismatchScore = scoring["mismatch"];
    const gapIntro = scoring["gap_introduction"];
    const gapExtend = scoring["gap_extension"];

    const prevCells = [];
    const cellMatrix = cell[0];
    const cellCoordinates = cell[1];

    const [row, column] = cellCoordinates;

    if (cellMatrix === "D") {
        if (row === 0) {
            prevCells.push(["D", [row, column - 1]]);
        } else if (column === 0) {
            prevCells.push(["D", [row - 1, column]]);
        } else {
            const cellValue = dMatrix[row][column];
            const charFirst = seq1[row - 1];
            const charSecond = seq2[column - 1];
            const matchScoreDiag = charFirst === charSecond ? matchScore : mismatchScore;

            if (cellValue === dMatrix[row - 1][column - 1] + matchScoreDiag) {
                prevCells.push(["D", [row - 1, column - 1]]);
            }
            if (cellValue === pMatrix[row][column]) {
                prevCells.push(["P", [row, column]]);
            }
            if (cellValue === qMatrix[row][column]) {
                prevCells.push(["Q", [row, column]]);
            }
        }
    } else if (cellMatrix === "P") {
        const cellValue = pMatrix[row][column];
        if (cellValue === dMatrix[row - 1][column] + gapIntro + gapExtend) {
            prevCells.push(["D", [row - 1, column]]);
        }
        if (cellValue === pMatrix[row - 1][column] + gapExtend) {
            prevCells.push(["P", [row - 1, column]]);
        }
    } else {
        const cellValue = qMatrix[row][column];
        if (cellValue === dMatrix[row][column - 1] + gapIntro + gapExtend) {
            prevCells.push(["D", [row, column - 1]]);
        }
        if (cellValue === qMatrix[row][column - 1] + gapExtend) {
            prevCells.push(["Q", [row, column - 1]]);
        }
    }

    return prevCells;
}

function tableMove(event) {
        const currentCell = event.target.parentElement;
        const currentRow = currentCell.parentElement;
        const currentRowIndex = currentRow.rowIndex;
        const currentCellIndex = currentCell.cellIndex;
        const table = currentRow.parentElement;

        let nextCell;

        switch (event.key) {
          case 'ArrowUp':
            nextCell = table.rows[currentRowIndex - 1]?.cells[currentCellIndex];
            break;
          case 'ArrowDown':
            nextCell = table.rows[currentRowIndex + 1]?.cells[currentCellIndex];
            break;
          case 'ArrowLeft':
            nextCell = currentCellIndex > 0 ? currentRow.cells[currentCellIndex - 1] : null;
            break;
          case 'ArrowRight':
            nextCell = currentRow.cells[currentCellIndex + 1];
            break;
          default:
            break;
        }

        if (nextCell && nextCell.querySelector('input')) {
          nextCell.querySelector('input').focus();
          event.preventDefault();
        }
}


document.addEventListener('DOMContentLoaded', function () {
      const tabled = document.getElementById('tableD');
      tabled.addEventListener('keydown', tableMove);
      const tableq = document.getElementById('tableQ');
      tableq.addEventListener('keydown', tableMove);
      const tablep = document.getElementById('tableP');
      tablep.addEventListener('keydown', tableMove);
});
