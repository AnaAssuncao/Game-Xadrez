import {verifyCheckInFakeBoard,newFakeChessBoard} from "./FakeChessBoard.js"

function verifyCheckMate(nameKing,colorKing,checks,chessBoard=this.chessBoard,piecesBoard=this.piecesBoard, statusGame=this.statusGame){
    const positionInitialKing = piecesBoard.pieces[nameKing].position
    for(let i=0;i< piecesBoard.pieces[nameKing].refMovements.length;i++){
        const refIdInitialKing= piecesBoard.pieces[nameKing].position
        const newRefIdKing = piecesBoard.pieces[nameKing].refMovements[i]
        const fakeChessBoard = newFakeChessBoard(refIdInitialKing,newRefIdKing,chessBoard) //FALSO CHESSBOARD PARA CONFERÊNCIA DO REI
        if(verifyCheckInFakeBoard(fakeChessBoard,newRefIdKing,colorKing) === false){//se na nova refId do rei não tem check, não há checkMate
            return false 
        }
    }

    if(checks.qt===1)
        for(let refId in chessBoard.reference){
            if(chessBoard.reference[refId]!==null && chessBoard.reference[refId].color===colorKing && chessBoard.reference[refId].name!=="King")
            {
                for(let refMovementFriend of chessBoard.reference[refId].refMovements){
                    for(let refIdPossiblePath of statusGame.checkKing.refIdPathsToCheck){
                        if(refMovementFriend===refIdPossiblePath){
                            const fakeChessBoard = newFakeChessBoard(refId,refMovementFriend,chessBoard)
                            if(verifyCheckInFakeBoard(fakeChessBoard,positionInitialKing,colorKing) === false){//se na nova refId do rei não tem check, não há checkMate
                                return false 
                            }
                        }
                    }
                }
            }
        }
    return true
}

export default verifyCheckMate