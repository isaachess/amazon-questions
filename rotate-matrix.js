// Given a square matrix of numbers, rotate the matrix either one position clockwise around its center point, or 90 degrees around its center point.
//
// Reads from stdin. Give inputs in the following order:
//
// 1. Rotation style: 90 means 90-degree rotation, 1 means 1 position.
// 2. How many rows to expect in the matrix (integer).
// 3. Then give each row of the matrix, one line at a time (each value must be an integer).
// 4. After the program evalutes, you may repeat the steps as many times as you wish.
//
// Example (1 position rotation)
//
// 1 2 3
// 2 3 4
// 3 4 5
//
// will output:
//
// 2 1 2
// 3 3 3
// 4 5 4

// Example (90-degree rotation)
//
// 1 2 3
// 2 3 4
// 3 4 5
//
// will output:
//
// 3 2 1
// 4 3 2
// 5 4 3

var readline = require('readline');

var ROTATION_STYLE,
    MATRIX_LINES,
    MATRIX_LINES_ZERO_INDEXED,
    CURRENT_MATRIX_LINE,
    MATRIX_LINE_LENGTH,
    MATRIX;

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Read from stdin

resetInputs();
rl.on('line', function(line) {
    if (!ROTATION_STYLE) return storeRotationStyle(line);
    if (!MATRIX_LINES) return storeMatrixLines(line);
    if (CURRENT_MATRIX_LINE < MATRIX_LINES) return addMatrixLine(line);
    throw new Error('Cannot interpret input.');
});

function resetInputs() {
    MATRIX_LINES = null;
    CURRENT_MATRIX_LINE = 0;
    MATRIX_LINE_LENGTH = null;
    MATRIX = {};
    GLOBAL_K = null;
    ROTATION_STYLE = null;
}

function storeRotationStyle(line) {
    var rotationStyle = Number(line);
    if (isNaN(rotationStyle) && rotationStyle != 1 && rotationStyle != 90 ) throw new Error('Expected rotation style, accepts value 1 or 90.');
    ROTATION_STYLE = rotationStyle;
}

function storeMatrixLines(line) {
    var lines = Number(line);
    if (isNaN(lines)) throw new Error('Expected integer of how many lines to expect for matrix.');
    MATRIX_LINES = lines;
    MATRIX_LINES_ZERO_INDEXED = lines - 1;
}

function addMatrixLine(line) {
    var matrixLine = line.split(' ');
    if (matrixLine.length != MATRIX_LINES) throw new Error('The matrix must be square, and each line in the matrix must be of the same length.');
    matrixLine = matrixLine.forEach(function(str, index) {
        var num = Number(str);
        if (isNaN(num)) throw new Error('Matrix lines must only consist of numbers.');
        MATRIX[matrixLocationKey(CURRENT_MATRIX_LINE, index)] = num;
    });
    CURRENT_MATRIX_LINE = CURRENT_MATRIX_LINE + 1;
    if (CURRENT_MATRIX_LINE == MATRIX_LINES) {
        rotateMatrix(MATRIX, MATRIX_LINES_ZERO_INDEXED, ROTATION_STYLE);
        resetInputs();
    }
}

// Do the rotation

function rotateMatrix(oldMatrix, matrixLines, rotationStyle) {
    var matrixSize = range(matrixLines); // Why does js not have a built-in 'range' function? Ugh.
    var newMatrix = {};
    matrixSize.forEach(function(rowIndex) {
        matrixSize.forEach(function(colIndex) {
            addRotatedInfo(oldMatrix, newMatrix, matrixLines, rotationStyle, rowIndex, colIndex);
        });
    });
    printMatrix(newMatrix, matrixSize);
}

function addRotatedInfo(oldMatrix, newMatrix, matrixLines, rotationStyle, rowIndex, colIndex) {
    var distanceFromEdge = getEdgeDistance(matrixLines, rowIndex, colIndex);
    var effectiveMatrixSize = effectiveSizeAtLocation(matrixLines, rowIndex, colIndex, distanceFromEdge);
    var effectiveRowIndex = rowIndex - distanceFromEdge;
    var effectiveColIndex = colIndex - distanceFromEdge;
    var rotationFunction = (rotationStyle == 90) ? rotate90Degrees : rotateOnePosition;
    var rowColChanges = rotationFunction(effectiveMatrixSize, effectiveRowIndex, effectiveColIndex);
    newMatrix[matrixLocationKey(rowIndex+rowColChanges.row, colIndex+rowColChanges.col)] = oldMatrix[matrixLocationKey(rowIndex, colIndex)];
    return newMatrix;
}

function rotateOnePosition(effectiveMatrixSize, effectiveRowIndex, effectiveColIndex) {
    // If you're in the center
    if (effectiveMatrixSize == 0) {
        return adjustRowCol(0, 0);
    }
    // If you're top row, not last column
    else if (effectiveRowIndex == 0 && effectiveColIndex < effectiveMatrixSize) {
        return adjustRowCol(0, 1);
    }
    // If you're last column, but not bottom row
    else if (effectiveRowIndex < effectiveMatrixSize && effectiveColIndex == effectiveMatrixSize) {
        return adjustRowCol(1, 0);
    }
    // If you're bottom row, but not first column
    else if (effectiveRowIndex == effectiveMatrixSize && effectiveColIndex > 0) {
        return adjustRowCol(0, -1);
    }
    // If you're first column, but not top row
    else if (effectiveRowIndex > 0 && effectiveColIndex == 0) {
        return adjustRowCol(-1, 0);
    }
}

function rotate90Degrees(effectiveMatrixSize, effectiveRowIndex, effectiveColIndex) {
    // If you're in the center
    if (effectiveMatrixSize == 0) {
        return adjustRowCol(0, 0);
    }
    // If you're on the top row
    else if (effectiveRowIndex == 0) {
        return adjustRowCol(effectiveColIndex, effectiveMatrixSize - effectiveColIndex);
    }
    // If you're on the right column
    else if (effectiveColIndex == effectiveMatrixSize) {
        return adjustRowCol(effectiveMatrixSize - effectiveRowIndex, 0 - effectiveRowIndex);
    }
    // If you're on the bottom row
    else if (effectiveRowIndex == effectiveMatrixSize) {
        return adjustRowCol(effectiveColIndex - effectiveMatrixSize, 0 - effectiveColIndex);
    }
    // If you're in the left column
    else if (effectiveColIndex == 0) {
        return adjustRowCol(0 - effectiveRowIndex, effectiveMatrixSize - effectiveRowIndex);
    }
}

function adjustRowCol(rowAdjustment, colAdjustment) {
    return {
        row: rowAdjustment,
        col: colAdjustment
    };
}

function effectiveSizeAtLocation(matrixLines, rowIndex, colIndex, distanceFromEdge) {
    return matrixLines - 2*distanceFromEdge;
}

function getEdgeDistance(matrixLines, rowIndex, colIndex) {
    var rowDistanceFrom0 = rowIndex - 0;
    var rowDistanceFromEnd = Math.abs(rowIndex - matrixLines);
    var colDistanceFrom0 = colIndex - 0;
    var colDistanceFromEnd = Math.abs(colIndex - matrixLines);
    return Math.min(rowDistanceFrom0, rowDistanceFromEnd, colDistanceFrom0, colDistanceFromEnd);
}

// Helpers

function range(num) {
    var array = [];
    for (var i=0; i<=num; i++) {
        array.push(i);
    }
    return array;
}

function matrixLocationKey(row, col) {
    return ['r', row, 'c', col].join('');
}

function printMatrix(matrix, matrixSize) {
    console.log('-------- Rotated Matrix --------');
    matrixSize.forEach(function(rowIndex) {
        console.log(printRow(matrix, matrixSize, rowIndex));
    });
}

function printRow(matrix, matrixSize, rowIndex) {
    var toPrint = matrixSize.map(function(colIndex) {
        return matrix[matrixLocationKey(rowIndex, colIndex)];
    }).join(' ');
    return toPrint;
}

