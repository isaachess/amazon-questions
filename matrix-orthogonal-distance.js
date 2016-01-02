// Given a matrix of numbers, and an integer k, determine whether any duplicate numbers lie within k orthogonal distance of each other.
//
// Reads from stdin. Give inputs in the following order:
//
// 1. How many rows to expect in the matrix (integer).
// 2. Then give each row of the matrix, one line at a time (each value must be an integer).
// 3. Specify k (integer).
// 4. After the program evalutes, you may repeat the steps as many times as you wish.
//
// Example
//
// 1 2 3 4 5
// 6 7 8 9 10
// 3 4 1 23 15
//
// 3, 4, and 1 are duplicates in this matrix. All are 4 orthogonal distance away.

var readline = require('readline');

var MATRIX_LINES, MATRIX_LINE_LENGTH, MATRIX, GLOBAL_K;

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

resetInputs();
rl.on('line', function(line) {
    if (!MATRIX_LINES) return storeMatrixLines(line);
    if (MATRIX.length < MATRIX_LINES) return addMatrixLine(line);
    if (!GLOBAL_K) return addKAndStart(line);
    throw new Error('Cannot interpret input.');
});

function resetInputs() {
    MATRIX_LINES = null;
    MATRIX_LINE_LENGTH = null
    MATRIX = [];
    GLOBAL_K = null;
}

function storeMatrixLines(line) {
    var lines = Number(line);
    if (isNaN(lines)) throw new Error('First input must be integer of how many lines to expect for matrix.');
    MATRIX_LINES = lines;
}

function addMatrixLine(line) {
    var matrixLine = line.split(' ')
    matrixLine = matrixLine.map(function(str) {
        var num = Number(str);
        if (isNaN(num)) throw new Error('Matrix lines must only consist of numbers.');
        return num;
    });
    if (!MATRIX_LINE_LENGTH) MATRIX_LINE_LENGTH = matrixLine.length;
    if (matrixLine.length != MATRIX_LINE_LENGTH) throw new Error('Each line in the matrix must be of the same length.');
    MATRIX.push(matrixLine);
}

function addKAndStart(line) {
    var k = Number(line);
    if (isNaN(k)) throw new Error('k must be integer');
    GLOBAL_K = k;
    var dupes = testOrthogonalDuplicates(MATRIX, GLOBAL_K);
    console.log(dupes)
    resetInputs()
}

function testOrthogonalDuplicates(matrix, k) {
    if (k < 1) return false;

    var rowLength = matrix[0].length;
    var matrixLength = matrix.length;
    return matrix.some(function(row, rowIndex) {
        return row.some(function(num, numIndex) {
            return anyOrthogonalDuplicate(matrix, k, rowIndex, numIndex);
        });
    });
}

function anyOrthogonalDuplicate(matrix, k, rowIndex, numIndex) {
    var numbersToCheck = getOrthogonalNumbers(matrix, k, rowIndex, numIndex);
    return numbersToCheck.some(function(num) {
        return num == matrix[rowIndex][numIndex];
    });
}

function getOrthogonalNumbers(matrix, k, rowIndex, numIndex, numbersSoFar, rowIndexThisCheck) {
    var effectiveKThisRow = orthogonalNumbersThisRow(k, rowIndex, rowIndexThisCheck);
    if (!numbersSoFar) numbersSoFar = [];
    if (typeof rowIndexThisCheck === 'undefined') rowIndexThisCheck = rowIndex - k;

    if (rowIndexThisCheck < 0) return getOrthogonalNumbers(matrix, k, rowIndex, numIndex, numbersSoFar, rowIndexThisCheck + 1);
    if (pastFinalRow(matrix, rowIndex, rowIndexThisCheck, k)) return numbersSoFar;
    var rowCopy = matrix[rowIndexThisCheck].slice();
    var newNumbers;
    if (rowIndexThisCheck == rowIndex) {
        newNumbers = sameRowNumbers(rowCopy, numIndex, effectiveKThisRow);
    } else {
        newNumbers = differentRowNumbers(rowCopy, numIndex, effectiveKThisRow);
    }
    return getOrthogonalNumbers(matrix, k, rowIndex, numIndex, numbersSoFar.concat(newNumbers), rowIndexThisCheck + 1);
}

function sameRowNumbers(rowCopy, numIndex, effectiveKThisRow) {
    var before = rowCopy.slice(minNumIndex(numIndex, effectiveKThisRow), numIndex);
    var after = rowCopy.slice(numIndex+1, maxNumIndex(numIndex, effectiveKThisRow, rowCopy.length));
    return before.concat(after);
}

function differentRowNumbers(rowCopy, numIndex, effectiveKThisRow) {
    return rowCopy.slice(minNumIndex(numIndex, effectiveKThisRow), maxNumIndex(numIndex, effectiveKThisRow, rowCopy.length));
}

function pastFinalRow(matrix, rowIndex, rowIndexThisCheck, k) {
    if (rowIndexThisCheck == rowIndex + (k + 1)) return true;
    if (rowIndexThisCheck + 1 > matrix.length) return true;
    return false;
}

function orthogonalNumbersThisRow(k, rowIndex, rowIndexThisCheck) {
    return k - Math.abs(rowIndex - rowIndexThisCheck);
}

function minNumIndex(numIndex, effectiveKThisRow) {
    var idealMinIndex = numIndex - effectiveKThisRow;
    return (idealMinIndex < 0) ? 0 : idealMinIndex;
}

function maxNumIndex(numIndex, effectiveKThisRow, rowLength) {
    var idealMaxIndex = numIndex + effectiveKThisRow + 1;
    return (idealMaxIndex > rowLength) ? rowLength : idealMaxIndex;
}
