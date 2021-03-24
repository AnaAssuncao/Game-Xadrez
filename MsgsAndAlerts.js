
const colors={
    White:"Brancas",
    Black:"Pretas"
}

const roomAndCode={
    roomWithOnePlayer:()=> "Esta sala já foi criada, conecta ao jogador",
    roomUnavailable:()=>"Nesta sala já está acontecendo um jogo, tente outro código",
    connectedRoom:(code)=>"Conectado a sala " + code,
    noExistRoom:()=>"Está sala não existe, cria esta sala.",
    waitAgain:()=>"Não é sua vez de jogar, aguarde." 
}

const connection={
    connectedServer:()=>"Erro no servidor, tente mais tarde",
    place:()=>"Jogo Local",
    waitAdv:()=>"Aguardando adversário",
    connected:()=>"Conectado com "
}

const checksPiece={
    checkMate:(color)=> "Xeque-Mate nas Peças " + colors[color],
    check:(color)=>"Xeque nas Peças " + colors[color],
    noCheck:()=>""
}

const checksPlayers={
    checkMate:(namePlayer)=>"Xeque-Mate no jogador " + namePlayer,
    check:(namePlayer)=>"Xeque no jogador " + namePlayer,
    noCheck:()=>""
}

const drawGame={
    draw:()=>"Jogo empatado"
}

const giveUp={
    giveUpPlayer:(namePlayer)=>"Desistência do Jogador " + namePlayer
}
    
const endGame={
    winPiece:(color)=>"Vitória das Peças " + colors[color],
    winPlayer:(namePlayer)=>"Vitória do jogador " + namePlayer
}

const startGame={
    startGame:()=>"Jogo iniciado",
    colorPlayer:(color)=>"A cor da sua Peça é " + colors[color],
    noAdv:()=> "Sem adversario"
}

const movement={
    movementPiece:(color)=>"Movimento das Peças " + colors[color],
    movementPlayer:(color,name)=>"Movimento das Peças " + colors[color] + " Jodador " + name,
    return:(color)=>"Retorno das Peças " + colors[color],
    nextColor:(color)=>"Vez das Peças " + colors[color],
    nextPlayer:(color,name)=>"Vez das Peças " + colors[color]+" Vez do jogador " + name,
    movementIncorret:(color)=>"Erro na jogada das Peças " + colors[color]
}

export default {
    roomAndCode,
    connection,
    checksPiece,
    checksPlayers,
    drawGame,
    endGame,
    giveUp,
    startGame,
    movement
}
