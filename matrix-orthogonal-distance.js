// 1 2 3 4 5
// 6 7 1 9 10
//
// [[1, 2, 3, 4, 5], [6, 7, 8, 9, 10]]

var matrix = [[1, 2, 3, 4, 5], [6, 7, 1, 9, 10]]
var k = 2

dupes = testOrthogonalDuplicates(matrix, k)
console.log('dupes', dupes)

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
