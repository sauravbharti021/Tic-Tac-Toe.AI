var oriBoard;
const human='0';
const ai='X';
var flag=0;

const winComb= [
    [2,5,8],  [0,1,2], [0,3,6], [0,4,8], [1,4,7],
    [2,4,6], [3,4,5], [6,7,8]
];

const cells=document.querySelectorAll('.cell');

startGame();

function startGame(){
    document.querySelector('.final').style.display= "none";
    // document.querySelector('.final .text').getElementsByClassName.innerText= "";

    oriBoard = Array.from(Array(9).keys());
    // console.log(oriBoard);

    for(var i=0; i<cells.length; i++){
        cells[i].innerText= '';
        cells[i].style.removeProperty('background-color');

        cells[i].addEventListener("click", Clicked_it, false);
    }
}

function Clicked_it(square) {

   if(typeof oriBoard[square.target.id]== "number"){
    turn(square.target.id, human);

    if( !checkWin(oriBoard, human) && !checkTie())
         turn(bestPlace(), ai); 
    } 

    // console.log(square.target.id);
   

}

function turn(squareID, player){
    oriBoard[squareID]=player;
    document.getElementById(squareID).innerText= player;

    let isgame_ended= checkWin(oriBoard, player);

    if(isgame_ended) gameOver(isgame_ended);
}

function checkWin(new_board, player){
    let plays= new_board.reduce((a, e, i) =>

        (e=== player) ? a.concat(i) : a, [] );

        let isgame_ended = null;

        for(let [index, win] of winComb.entries()){
            if(win.every( element => plays.indexOf(element)  > -1)  ){
                isgame_ended= {index : index, player:player};

                break;
            }
        }

        return isgame_ended;
    
}

function gameOver(isgame_ended){

    for(let index of winComb[isgame_ended.index]){
        document.getElementById(index).style.backgroundColor =
        isgame_ended.player == human ? "blue" : "red"; 
    }

    for(var i=0; i<cells.length; i++){
        cells[i].removeEventListener("click", Clicked_it, false);
    }

    declareWinner( isgame_ended.player == human ? "You won!" : "You lost");
    
}

function declareWinner(who){
    document.querySelector(".final").style.display= "block";
    document.querySelector(".final .text").innerText= who;
}

///////// Introducing minmax function
function bestPlace(){

    // return emptySquares() [0];
    return minimax(oriBoard, ai).index;
}

function emptySquares(){
    return oriBoard.filter( s => typeof s == 'number');
}

function checkTie(){
    if(emptySquares().length ==0){
        for(var i=0;i<cells.length; i++){
            cells[i].style.backgroundColor = "green";
			cells[i].removeEventListener('click', Clicked_it, false);
            
        }
        declareWinner("Tie Game!")  
        flag=1;
        return true;
    }

    return false;
}





function minimax(newBoard, player){
    var available_pos = emptySquares();

    if(checkWin(newBoard, human)) return {score: -10};
    else if(checkWin(newBoard, ai)){
        return {score: 10};
    }else if(available_pos.length === 0 ) {
        return {score : 0};
    }

    var moves = [];
    for(var i=0; i<available_pos.length;i++){
        var move= {};
        move.index = newBoard[available_pos[i]];
        newBoard[available_pos[i]] = player;
        
        if(player== ai){
            var res= minimax(newBoard, human);
            move.score = res.score;
        }else{
            var res= minimax(newBoard, ai);
            move.score = res.score;
        }

        newBoard[available_pos[i]] = move.index;
            moves.push(move);

    }

    var bestMove;

    if(player=== ai){
        var bestScore= -100000;
        for(var i=0;i<moves.length;i++){
            if(moves[i].score >bestScore){
                bestScore=moves[i].score;
                bestMove=i;
            }
        }
    }
    else{
        var bestScore= 100000;
        for(var i=0;i<moves.length;i++){
            if(moves[i].score <bestScore){
                bestScore=moves[i].score;
                bestMove=i;
            }
        }
    }


    return moves[bestMove];
}

