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
match.addEventListener("keyup", wipeTable);
mismatch.addEventListener("keyup", wipeTable);
gapIntro.addEventListener("keyup", wipeTable);
gapExtend.addEventListener("keyup", wipeTable);


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

                var input = document.createElement("input");
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
    var match = parseInt(document.getElementById("match").value);
    var mismatch = parseInt(document.getElementById("mismatch").value);
    var gapIntro = parseInt(document.getElementById("gap-intro").value);
    var gapExtend = parseInt(document.getElementById("gap-extend").value);
    console.log(s1, s2, match, mismatch, gapIntro, gapExtend)

    matrices = gotohTable(s1, s2, match, mismatch, gapIntro, gapExtend);
    for (let key in matrices) {
      const table = document.getElementById(`table${key}`);
      matrix = matrices[key];
      for (let row = 0; row < s1.length + 1; row++){
          for (let col = 0; col < s2.length + 1; col++){
              const cellElement = table.rows[row+1].cells[col+1]
              let current = cellElement.childNodes[0].value;
              console.log(current);
              if (current === "-inf"){
                current = Number.NEGATIVE_INFINITY;
              } else if (current === "inf") {
                current = Infinity;
              }
              if (key == "Q" && row == 0){
                  console.log(current);
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

function wipeTable(tid) {
    const table = document.getElementById(tid);
    var s1 = document.getElementById("seqA").value;
    var s2 = document.getElementById("seqB").value;
    for (let row = 0; row < s1.length + 1; row++) {
        for (let col = 0; col < s2.length + 1; col++) {
            const cellElement = table.rows[row + 1].cells[col + 1]
            cellElement.style.backgroundColor = "white"
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
