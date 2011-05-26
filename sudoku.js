$(function($) {

var makeSudoku, makeSudokuRow, makeSudokuCell, makeNoteBox, showNotes,
	isValidSudokuChar, getkey, checkSetAndMark, clearProblem, sudokuCheck,
	getRowFor, getColumnFor, getSquareFor, getSquareBase, getCell,
	populateSudoku;

makeSudoku = window.makeSudoku = function(id, puzzle) {
	// Creates a sudoku puzzle within the element with the given id, replacing any existing content.  Should probably be a div, or suchlike.
	var base = $('#'+id).empty()
		,t = $('<table class="sudoku"></table>').appendTo(base)
		;
	
	for (var i = 1; i < 10; i++) {
		t.append(makeSudokuRow(id, i));
	}
	
	makeNoteBox(id);
	
	$('<button>Check for errors</button>').click(function(e) {
		e.preventDefault();
		sudokuCheck(id);
	}).appendTo(base);
}

makeSudokuRow = function(id, y) {
	var row = $('<tr class="sudokurow' + y + '"></tr>');
	for (var ii=1; ii < 10; ii++) {
		row.append(makeSudokuCell(id, ii, y));
	}
	return row;
}
makeSudokuCell = function(id, x, y) {
	return $('<td class="sudokucolumn' + x + ' sudokusquare' + getSquareBase(y) + getSquareBase(x) + '"></td>').append(
		$('<input class="sudokucell' + y + x + '" maxlength="1" value="">')
			.keypress(isValidSudokuChar)
			.click(function(e) { showNotes(id, x, y); })
	);
}
var notes = {};
makeNoteBox = function(id) {
	var box = document.createElement('div');
	notes[id] = box;
}
showNotes = function(id, x, y) {
	
}

isValidSudokuChar = function(e) {
	var key = e.which
		,pattern = "123456789".toLowerCase()
		,keychar
		;
	if (key == null) {
		return;
	}	
	keychar = String.fromCharCode(key).toLowerCase();
	// check pattern
	if (pattern.indexOf(keychar) != -1) {
		return;
	}
	// control keys
	if ( key==null || key==0 || key==8 || key==9 || key==13 || key==27 ) {
		return;
	}
	
	e.preventDefault();
}

sudokuCheck = function(id) {
	$('#'+id+' .problem').removeClass('problem');
	
	for(var i = 1; i < 10; i++) {
		checkSetAndMark(getRowFor(id, 1, i));
		checkSetAndMark(getColumnFor(id, i, 1));
		checkSetAndMark(getSquareFor(id
									 ,1 + ((i - 1) % 3) * 3
									 ,getSquareBase(i)
						));
	}
}
checkSetAndMark = function(a) {
	var alreadySeen = {};
	a.each(function(i, cell) {
		cell = $(cell);
		var val = cell.val();
		if(val == "") { return; }
		if(alreadySeen[val]) {
			a.filter('[value="' + val + '"]').closest('td').addClass('problem');
		}
		alreadySeen[val] = true;
	});
}
getRowFor = function(id, x, y) {
	return $('#' + id + ' .sudokurow' + y + ' input');
}
getColumnFor = function(id,x,y) {
	return $('#' + id + ' .sudokucolumn' + x + ' input');
}
getSquareFor = function(id, x, y) {
	return $('#' + id + ' .sudokusquare' + getSquareBase(y) + getSquareBase(x) + ' input');
}
getCell = function(id, x, y) {
	return $('#' + id + ' input.sudokucell' + y + x); 
}
getSquareBase = function(i) {
	if (i < 4) { return 1; }
	if (i < 7) { return 4; }
	if (i < 10) { return 7; }
}
populateSudoku = window.populateSudoku = function(id, puzzle) {
	var puzzlearray = puzzle.split('');
	for(var ii = 0; ii < puzzlearray.length; ii++) {
		var x = (ii % 9) + 1
			,y = (Math.floor(ii/9) % 9) + 1
			,cell = getCell(id, x, y)
			,v
			;
		if (puzzlearray[ii] == 0) {
			v = '';
			cell.attr('disabled', false).removeClass('provided');
		} else {
			v = puzzlearray[ii];
			cell.attr('disabled', true).addClass('provided');
		}
		cell.val(v);
	}
}

});
