var s1 = document.getElementById("seqA");
var s2 = document.getElementById("seqB");
var match = document.getElementById("match");
var mismatch = document.getElementById("mismatch");
var gapIntro = document.getElementById("gap-intro");
var tbtoggle = document.getElementById("tracebackToggle");
const tableD = document.getElementById('tableD');



createTables()
s1.addEventListener("keyup", createTables);
s2.addEventListener("keyup", createTables);
match.addEventListener("keyup", wipeTables);
mismatch.addEventListener("keyup", wipeTables);
gapIntro.addEventListener("keyup", wipeTables);


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
  createTable("tableD", d);

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
                var subscript = document.createElement('sub');
                subscript.textContent = col-1;

                td.textContent = s2[col-1];
                td.appendChild(subscript);

            } else if (col == 0) {
                td = document.createElement('td');
                var subscript = document.createElement('sub');
                subscript.textContent = row-1;

                td.textContent = s1[row-1];
                td.style.fontWeight = "bold";
                td.style.width = "5%"
                td.style.textAlign = "center";
                td.style.border = "2px solid";
                td.appendChild(subscript)

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

    matrix = smithWatermanMatrix(s1, s2, match, mismatch, gapIntro, gapExtend);
    const table = document.getElementById(`tableD`);
    for (let row = 0; row < s1.length + 1; row++){
        for (let col = 0; col < s2.length + 1; col++){
            const cellElement = table.rows[row+1].cells[col+1]
            let current = cellElement.childNodes[0].value;
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


function fillTable() {
    var s1 = document.getElementById("seqA").value;
    var s2 = document.getElementById("seqB").value;
    var match = parseInt(document.getElementById("match").value);
    var mismatch = parseInt(document.getElementById("mismatch").value);
    var gapPenalty = parseInt(document.getElementById("gap-intro").value);

    matrix = smithWatermanMatrix(s1, s2, match, mismatch, gapPenalty);

    const table = document.getElementById(`tableD`);

    for (let row = 0; row < s1.length + 1; row++){
        for (let col = 0; col < s2.length + 1; col++){
            const cellElement = table.rows[row+1].cells[col+1]
            let expected = matrix[row][col]


            cellElement.childNodes[0].value = expected;
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
}

function smithWatermanMatrix(sequence1, sequence2, matchScore, mismatchScore, gapPenalty) {
    const numRows = sequence1.length + 1;
    const numCols = sequence2.length + 1;

    // Initialize the scoring matrix with zeros
    const matrix = Array.from({ length: numRows }, () => Array(numCols).fill(0));

    // Fill in the matrix with scores
    for (let i = 1; i < numRows; i++) {
        for (let j = 1; j < numCols; j++) {
            const match = matrix[i - 1][j - 1] + (sequence1[i - 1] === sequence2[j - 1] ? matchScore : mismatchScore);
            const deleteScore = matrix[i - 1][j] + gapPenalty;
            const insertScore = matrix[i][j - 1] + gapPenalty;

            matrix[i][j] = Math.max(0, match, deleteScore, insertScore);
        }
    }
    return matrix
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
}




const toggleCheckbox = document.getElementById('tracebackToggle');
const divToHide = document.getElementById('tableCheckBtn');
const divToShow = document.getElementById('tracebackCheckBtn');

function determineMode(divToShow, divToHide) {
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
}

determineMode(divToShow, divToHide);

toggleCheckbox.addEventListener('change', function(){determineMode(divToShow, divToHide)});


function getScoringAndSeqs() {
    var s1 = document.getElementById("seqA").value;
    var s2 = document.getElementById("seqB").value;
    var match = parseInt(document.getElementById("match").value);
    var mismatch = parseInt(document.getElementById("mismatch").value);
    var gapIntro = parseInt(document.getElementById("gap-intro").value);
    scoring = {"seqA": s1, "seqB": s2, "match": match, "mismatch": mismatch, "gap_introduction": gapIntro}
    return scoring

}

function buildTracbackPathes(){
  var scoring = getScoringAndSeqs();
  matrix = smithWatermanMatrix(
    scoring["seqA"],
    scoring["seqB"],
    scoring["match"],
    scoring["mismatch"],
    scoring["gap_introduction"],
  )

  list_pathes = buildAllTracebackPathsCorrect(
    scoring["seqA"], scoring["seqB"], scoring, matrix
  );
  return list_pathes;
}



function checkTracebackTable(tid, s1, s2){
  const table = document.getElementById(`table${tid}`);
  var l = []
    for (let row = 0; row < s1.length + 1; row++) {
        for (let col = 0; col < s2.length + 1; col++) {
            const cellElement = table.rows[row + 1].cells[col + 1]
            const tbdiv = cellElement.childNodes[1]
            if (tbdiv.classList.contains('selectedTracebackCell')){
              l.push([row, col])
            }
        }
    }
  return l
}



function stringifyArray(arr) {
  const [a, b] = arr;
  return `(${a},${b})`;
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



function highlightCell(tid, i, j, color) {
  const table = document.getElementById(tid);
    const cellElement = table.rows[i+1].cells[j+1];
    cellElement.childNodes[1].style.border = `2px solid ${color}`;
}

function previousCellsCorrect(seq1, seq2, scoring, swMatrix, cell) {
    const prevCells = [];
    const [row, column] = cell;

    const top = row > 0 ? [row - 1, column] : null;
    const left = column > 0 ? [row, column - 1] : null;
    const diagonal = row > 0 && column > 0 ? [row - 1, column - 1] : null;

    const curVal = swMatrix[row][column];
    const charFirst = seq1[row - 1];
    const charSecond = seq2[column - 1];
    const matchScore = charFirst === charSecond ? scoring.match : scoring.mismatch;
    const gapScore = scoring.gap_introduction;

    if (diagonal) {
        const diagonalVal = swMatrix[diagonal[0]][diagonal[1]];
        if (diagonalVal + matchScore === curVal) {
            prevCells.push(diagonal);
        }
    }

    if (top) {
        const topVal = swMatrix[top[0]][top[1]];
        if (topVal + gapScore === curVal) {
            prevCells.push(top);
        }
    }

    if (left) {
        const leftVal = swMatrix[left[0]][left[1]];
        if (leftVal + gapScore === curVal) {
            prevCells.push(left);
        }
    }

    return prevCells;
}

function buildAllTracebackPathsCorrect(seq1, seq2, scoring, swMatrix) {
    const listTracebackPaths = [];

    const flat = [].concat(...swMatrix);
    const maxVal = Math.max(...flat);

    if (maxVal === 0) {
        return [[]];
    }

    const frontier = [];

    for (let rowIndex = 0; rowIndex < swMatrix.length; rowIndex++) {
        for (let columnIndex = 0; columnIndex < swMatrix[rowIndex].length; columnIndex++) {
            if (swMatrix[rowIndex][columnIndex] === maxVal) {
                frontier.push([[rowIndex, columnIndex]]);
            }
        }
    }
    while (frontier.length > 0) {
        const partialPath = frontier.pop();
        const lastCellPartial = partialPath[partialPath.length - 1];
        const nextSteps = previousCellsCorrect(seq1, seq2, scoring, swMatrix, lastCellPartial);
        console.log(lastCellPartial, nextSteps)

        for (const nextStep of nextSteps) {
            const newTracebackPath = [...partialPath, nextStep];
            const [row, column] = nextStep;
            const matrixValue = swMatrix[row][column];

            if (matrixValue === 0) {
                listTracebackPaths.push(newTracebackPath);
            } else {
                frontier.push(newTracebackPath);
            }
        }
    }
    console.log(listTracebackPaths)

    return listTracebackPaths;
}

var l1 = document.getElementById("alignment-line1");
var l2 = document.getElementById("alignment-line2");
const edges = document.getElementById("alignment-edges")

function addAlignmentEdges(){
  line1 = l1.value;
  line2 = l2.value;
  var alignmentString = "";
  for (var i = 0; i < line1.length; i++) {
      var char1 = line1[i];
      var char2 = line2[i];


      if (char1 === "-" || char2 === "-" || char2 === undefined) {
          // Whitespace if either character is "-"
          alignmentString += " ";
      } else if (char1 === char2) {
          // "|" if characters match
          alignmentString += "|";
      } else {
          // ":" if characters don't match
          alignmentString += ":";
      }
  }
  edges.value = alignmentString;
  edges.setAttribute('value', 'defaultValue');


}
addAlignmentEdges()
l1.addEventListener("keyup", addAlignmentEdges);
l2.addEventListener("keyup", addAlignmentEdges);


function checkTracebacks(){
  scoring = getScoringAndSeqs()
  traceback_paths = buildTracbackPathes();
  path = checkTracebackTable("D", scoring["seqA"], scoring["seqB"])
  var correct = false;
  for (let p = 0; p < traceback_paths.length; p++) {
    //console.log(traceback_paths[p])
    if (arraysEqualIgnoreOrder(traceback_paths[p], path)) {
      correct = true;
    }
  }
  var color;
  if (correct){
    color = "green"

  } else {
    color = "red"
  }
  for (let x = 0; x < path.length; x++) {
    var i = path[x][0];
    var j = path[x][1];
    highlightCell(`tableD`, i, j, color)
  }
  if (correct & l1.value.length > 0 & l2.value.length > 0) {
      var [as1, as2] = buildAlignmentCorrect(scoring["seqA"], scoring["seqB"], path)
      if (as1 === l1.value & as2 === l2.value) {
        l1.style.backgroundColor = "var(--right-answer)"
        l2.style.backgroundColor = "var(--right-answer)"
        edges.style.backgroundColor = "var(--right-answer)"
      } else {
        l1.style.backgroundColor = "var(--wrong-answer)"
        l2.style.backgroundColor = "var(--wrong-answer)"
        edges.style.backgroundColor = "var(--wrong-answer)"
      }

  }

}


function buildAlignmentCorrect(seq1, seq2, alignmentPath) {
    let alignSeq1 = "";
    let alignSeq2 = "";
    if (!alignmentPath.length) {
        return ["", ""];
    }

    let prevCell = alignmentPath[0];
    console.log(alignmentPath)

    for (let i = 1; i < alignmentPath.length; i++) {
        let prevRow = prevCell[0];
        let prevColumn = prevCell[1];

        let cell = alignmentPath[i];
        let row = cell[0];
        let column = cell[1];

        if (row > prevRow && column > prevColumn) {
            alignSeq1 += seq1[row - 1];
            alignSeq2 += seq2[column - 1];
        } else if (row > prevRow) {
            alignSeq1 += seq1[row - 1];
            alignSeq2 += "-";
        } else if (column > prevColumn) {
            alignSeq1 += "-";
            alignSeq2 += seq2[column - 1];
        }

        prevCell = cell;
    }

    return [alignSeq1, alignSeq2];
}



