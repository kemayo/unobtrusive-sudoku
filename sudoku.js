base2.DOM.bind(document);

makeSudoku = function(id, puzzle) {
	// Creates a sudoku puzzle within the element with the given id, replacing any existing content.  Should probably be a div, or suchlike.
	var base = document.getElementById(id);
	var ci;
	for (ci=0; ci<base.childNodes.length; ci++) {
		base.removeChild(base.childNodes[ci]);
	}
	
	var t = document.createElement('table');
	base2.DOM.bind(t);
	t.addClass('sudoku');
	var tbody = document.createElement('tbody');
	t.appendChild(tbody);
	var i = 1;
	for (i=1; i < 10; i++) {
		makeSudokuRow(id, tbody, i)
	}
	base.appendChild(t);
	
	makeNoteBox(id);
	
	var checkButton = document.createElement('button');
	checkButton.appendChild(document.createTextNode("Check for errors"));
	checkButton.onclick = function() { sudokuCheck(id); return false; }
	base.appendChild(checkButton);
}
makeSudokuRow = function(id, table, y) {
	var row = document.createElement('tr');
	base2.DOM.bind(row);
	row.addClass('sudokurow'+y);
	var ii = 1;
	for (ii=1; ii < 10; ii++) {
		makeSudokuCell(id, row, ii, y);
	}
	table.appendChild(row);
}
makeSudokuCell = function(id, row, x, y) {
	var cell = document.createElement('td');
	base2.DOM.bind(cell);
	cell.addClass('sudokucolumn'+x);
	var input = document.createElement('input');
	base2.DOM.bind(input);
	input.addClass('sudokucell' + y + x);
	input.onkeypress = isValidSudokuChar;
	input.onclick = function(event) { showNotes(id,x,y); }
	input.maxLength = 1;
	input.value = '';
	cell.appendChild(input);
	row.appendChild(cell);
}
var notes = new Object;
makeNoteBox = function(id) {
	var box = document.createElement('div');
	notes[id] = box;
}
showNotes = function(id, x, y) {
	
}
function getkey(e)
{
	if (window.event) {
		return window.event.keyCode;
	} else if (e) {
		return e.which;
	} else {
		return null;
	}
}
isValidSudokuChar = function(e) {
	var key, keychar;
	key = getkey(e);
	if (key == null) { return true; }
	keychar = String.fromCharCode(key).toLowerCase();
	var pattern="123456789";
	pattern = pattern.toLowerCase();
	// check pattern
	if (pattern.indexOf(keychar) != -1)
		return true;
	// control keys
	if ( key==null || key==0 || key==8 || key==9 || key==13 || key==27 )
		return true;
	return false;
}
clearProblem = function(element) {
	element.removeClass('problem');
}
sudokuCheck = function(id) {
	document.matchAll('#'+id+' .problem').forEach(clearProblem);
	var i;
	for(i=1; i<10; i++) {
		checkSetAndMark(getRowFor(id, 1, i));
		checkSetAndMark(getColumnFor(id, i, 1));
		checkSetAndMark(getSquareFor(id, ((i-1)%3)*3, (Math.floor((i-1)/3) % 3) + 1));
	}
}
checkSetAndMark = function(a) {
	var i;
	var alreadySeen = new Array();
	for(i=1; i < a.length; i++) {
		var v = a[i].value;
		if (v != '') {
			if(alreadySeen[v]) {
				a[alreadySeen[v]].parentNode.addClass('problem');
				a[i].parentNode.addClass('problem');
			}
			alreadySeen[v] = i;
		}
	}
}
getRowFor = function(id,x,y) {
	var i = 1;
	var row = new Array();
	for (i=1; i < 10; i++) {
		row[i] = getCell(id,i,y);
	}
	return row;
}
getColumnFor = function(id,x,y) {
	var i = 1;
	var column = new Array();
	for (i=1; i < 10; i++) {
		column[i] = getCell(id,x,i);
	}
	return column;
}
getSquareFor = function(id,x,y) {
	var i;
	var square = new Array();
	for (i=0; i < 9; i++) {
		square[i+1] = getCell(id, getSquareBase(x)+(i%3), getSquareBase(y)+(Math.floor(i/3)%3))
	}
	return square;
}
getCell = function(id,x,y) {
	return document.matchSingle('#'+id+' input.sudokucell'+y+x);
}
getSquareBase = function(i) {
	if (i < 4) { return 1; }
	if (i < 7) { return 4; }
	if (i < 10) { return 7; }
}
populateSudoku = function(id, puzzle) {
	var puzzlearray = puzzle.split('');
	var ii;
	for(ii=0; ii<puzzlearray.length; ii++) {
		var x = (ii % 9) + 1;
		var y = (Math.floor(ii/9) % 9) + 1;
		var cell = getCell(id, x, y);
		var v;
		if (puzzlearray[ii] == 0) {
			v = '';
			cell.disabled = false;
			cell.removeClass('provided');
		} else {
			v = puzzlearray[ii];
			cell.disabled = true;
			cell.addClass('provided');
		}
		cell.value = v;
	}
}