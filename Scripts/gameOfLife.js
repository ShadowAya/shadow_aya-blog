var squares = [
    [0,1,1,1,0]
];

window.addEventListener('load', () => {

    var content = document.getElementById('content');
    update(); console.log(squares);
    update(); console.log(squares);
    update(); console.log(squares);

});

function vyhul(nevim) {
    let hovna = [];
    let kunda;

    for (let y = 0; y < nevim.length; y++) {
        kunda = [];
        for (let x = 0; x < nevim[y].length; x++) {
            kunda.push(nevim[y][x]); 
        }
        hovna.push(kunda);
    }
    return hovna;
}

function expandBoard(board) {
    
    let returnArray = [];
    let emptyArray = [];
    let initialBoardX = board[0].length;
    let initialBoardY = board.length;

    for (let i = 0; i < initialBoardX+2; i++) {
        emptyArray.push(0);
    }

    returnArray.push(emptyArray);

    board.forEach(element => {
        element.push(0);
        element.unshift(0);
        returnArray.push(element);
    });
    returnArray.push(emptyArray);

    return returnArray;
}

function update() {

    let squaresCopy = expandBoard(vyhul(squares));
    let squaresCopyExpanded = expandBoard(vyhul(squaresCopy));

    for (let y = 0; y < squaresCopyExpanded.length-2; y++) {
        
        y++;

        for (let x = 0; x < squaresCopyExpanded[y].length-2; x++) {

            x++;

            let neighbours = [
                squaresCopyExpanded[y-1][x+1],
                squaresCopyExpanded[y][x+1],
                squaresCopyExpanded[y+1][x+1],
                squaresCopyExpanded[y-1][x],
                squaresCopyExpanded[y+1][x],
                squaresCopyExpanded[y-1][x-1],
                squaresCopyExpanded[y][x-1],
                squaresCopyExpanded[y+1][x-1]
            ].reduce((a,b) => a + b, 0);

            if (squaresCopyExpanded[y][x] == 0 & neighbours == 3) {
                squaresCopy[y-1][x-1] = 1;
            } else if (squaresCopyExpanded[y][x] == 1 & (neighbours < 2 | neighbours > 3)) {
                squaresCopy[y-1][x-1] = 0;
            }
            x--;
        }
        y--;
        
    }
    if (squaresCopy[0].reduce((a,b) => a + b, 0) == 0) {
        squaresCopy = squaresCopy.slice(1);
    }
    if (squaresCopy[squaresCopy.length-1].reduce((a,b) => a + b, 0) == 0) {
        squaresCopy = squaresCopy.slice(0,-1);
    }

    let cut;
    cut = true;
    squaresCopyChecker = [];
    for (let index = 0; index < squaresCopy.length; index++) {
        const element = squaresCopy[index];
        
        if (element[0]==0) {
            squaresCopyChecker.push(element.slice(1));
        } else {
            cut = false;
            break;
        }

    }
    if (cut) {
        squaresCopy = squaresCopyChecker;
    }

    cut = true;
    squaresCopyChecker = [];
    for (let index = 0; index < squaresCopy.length; index++) {
        const element = squaresCopy[index];
        
        if (element[squaresCopy[index].length-1]==0) {
            squaresCopyChecker.push(element.slice(0,-1));
        } else {
            cut = false;
            break;
        }

    }
    if (cut) {
        squaresCopy = squaresCopyChecker;
    }

    squares = squaresCopy;

}