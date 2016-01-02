// 1 2 3 4 5
// 6 7 8 9 10
// 1 2 3 4 5
// 1 2 3 4 5
// 1 2 3 4 5
//
// [[1, 2, 3, 4, 5], [6, 7, 8, 9, 10]]

var matrix = [[1, 2, 3, 4, 5], [6, 7, 8, 9, 10]]
var k = 3

dupes = testOrthogonalDuplicates(matrix, k)
console.log('dupes', dupes)

function testOrthogonalDuplicates(matrix, k) {
    if (k < 1) return false;

    var rowLength = matrix[0].length;
    var matrixLength = matrix.length;
    return matrix.some(function(row, rowIndex) {
        return row.some(function(num, numIndex) {
            return anyOrthogonalDuplicate(matrix, rowIndex, numIndex);
        });
    });
}

function anyOrthogonalDuplicate(matrix, rowIndex, numIndex) {
    console.log(rowIndex, numIndex);
    return false;
}
