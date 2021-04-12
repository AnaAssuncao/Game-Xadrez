import networkUtils from "./NetworkUtils.js"
import MethodsHTTP from "./MethodsHTTP.js"
const httpMethods = new MethodsHTTP()

class Router{
    constructor(){
        this.pref=(window.location.hostname==="127.0.0.1")?"http://localhost:3030/api/v1":"https://xadrez-server.herokuapp.com/api/v1"
        this.query=null
        this.wakeUp=this.pref +"/wakeUp"
        this.startNewRoom= this.pref +"/startGame/startNewRoom"
        this.connectInARoom= this.pref + "/startGame/connectInARoom"
        this.updateMovement= this.pref + "/movementGame/updateMovement"
        this.incorrectMovement= this.pref +"/movementGame/incorrectMovement"
        this.giveUpGame= this.pref +"/giveUpGame"
        this.endGame= this.pref +"/endGame"
        this.playerWin= this.pref +"/playerWin"
        this.reconnectRoom= this.pref + "/reconnectRoom"
        this.prefGetmovement= this.pref +"/movementGame/getMovement?"
        this.prefStatusGame= this.pref +"/statusGame?"
        this.getMovement = null
        this.statusGame = null
    }

    updateQuery(params){this.query=Object.keys(params)
        .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(params[key]))
        .join("&")
        this.getMovement = this.prefGetmovement+this.query
        this.statusGame = this.prefStatusGame+this.query
    }
}

class NetworkSetup{
    constructor(){
        this.codes={
            room:null,
            player:null
        }
        this.routerUrl= new Router()
    }
    updateCodes(statusCodes){
        this.codes.room=statusCodes.roomCode
        this.codes.player=statusCodes.playerCode
    }
}

export default function InterfaceNetwork(){
    let networkConf = {}

    const time={
        endConnection:false,
        setToMovement:1000,
        setToFindAdv:1000,
        setToStatusGame:1000,
        limitForMovement:600,
        limitToFindAdv:600
    }

    const typeStatus={
        errServer:"errServer",
        movementAvailable:"movementAvailable",
        waitAgain:"waitAgain",
        endTimeAdv:"endTimeAdv",
        endTimeMove:"endTimeMove",
        giveUp:"giveUpGame",
        advPlayer: "advPlayer",
        incorrectMovement:"incorrectMovement"
    }


    this.sendServer={
        wakeUp: ()=>{
            networkConf = new NetworkSetup()
            const url = networkConf.routerUrl.wakeUp
            const msgRes = httpMethods.get(url)
        },
        startNewRoom: async(nickAndCode) =>{    
            const url = networkConf.routerUrl.startNewRoom
            // nickAndCode = {name:value, roomCode:value}
            const infMultiplayer = {
                playerName:nickAndCode.name,
                roomCode:nickAndCode.roomCode
            }
            const msgRes = await httpMethods.post(infMultiplayer,url)
            if(typeStatus.errServer===msgRes){
                const err=networkUtils.callFunctionByStatusServer(msgRes)
                return err
            }
            else{
                const paramFunstionStatus={
                    statusPlayerAdv:msgRes.statusPlayerAdv,
                    statusCodes:msgRes.statusCodes
                }
                const status=networkUtils.callFunctionByStatusRoom(msgRes.typeStatus,paramFunstionStatus)
                return status
            }
        },

        async connectInARoom(nickAndCode){
            const url = networkConf.routerUrl.connectInARoom
            // nickAndCode = {name:value, roomCode:value}
            const infMultiplayer = {
                playerName:nickAndCode.name,
                roomCode:nickAndCode.roomCode
            }
            const msgRes = await httpMethods.post(infMultiplayer,url)
            if(typeStatus.errServer===msgRes){
                const err=networkUtils.callFunctionByStatusServer(msgRes)
                return err
            }
            else{
                const paramFunstionStatus={
                    statusPlayerAdv:msgRes.statusPlayerAdv,
                    statusCodes:msgRes.statusCodes
                }
                const status= networkUtils.callFunctionByStatusRoom(msgRes.typeStatus,paramFunstionStatus)
                return status
            }
        },

        async checkGameReconnection(statusCode){
            const url = networkConf.routerUrl.reconnectRoom
            const msgRes = await httpMethods.post(statusCode,url)
            if(typeStatus.errServer===msgRes){
                const status=networkUtils.callFunctionByStatusServer(msgRes)
                return status
            }
            else{
                const paramFunstionStatus ={
                    statusPlayerAdv:msgRes.statusPlayerAdv,
                    qtMovements:msgRes.qtMovements,
                    statusCode:statusCode
                }
                const status=networkUtils.callFunctionByStatusRoom(msgRes.connection,paramFunstionStatus)
                return status
            } 
         },

        moveGame: async(move) =>{
            const url = networkConf.routerUrl.updateMovement
            const objSend={
                roomCode:networkConf.codes.room,
                playerCode:networkConf.codes.player,
                movement:move
            }
            const msgRes = await httpMethods.post(objSend,url)
            if(typeStatus.errServer===msgRes){
                const status=networkUtils.callFunctionByStatusServer(msgRes)
                return status
            }
            else{
                const status=networkUtils.callFunctionByStatusMovement(msgRes.typeStatus)
                return status
            } 
        },

        incorrectMovement:function(){
            const url = networkConf.routerUrl.incorrectMovement
            const objSend={
                roomCode:networkConf.codes.room,
                playerCode:networkConf.codes.player,
                incorrectMovement:true
            }
            const msgRes = httpMethods.post(objSend,url)
            if(typeStatus.errServer===msgRes){
                const err=networkUtils.callFunctionByStatusServer(msgRes)
                notifyFunctions(functionToCallBack.errConnection,err)
                return err
            }
        },

        giveUp: async() =>{
            const url = networkConf.routerUrl.giveUpGame
            const objSend={
                roomCode:networkConf.codes.room,
                playerCode:networkConf.codes.player,
                giveUp:true
            } 
            const msgRes = await httpMethods.post(objSend,url)
            if(typeStatus.errServer===msgRes){
                const err=networkUtils.callFunctionByStatusServer(msgRes)
                notifyFunctions(functionToCallBack.errConnection,err)
                return err
            }
            return msgRes
        },
        endGame: async() =>{
            const objSend={
                roomCode:networkConf.codes.room,
                playerCode:networkConf.codes.player,
                endGame:true
            } 
            const url = networkConf.routerUrl.endGame
            const msgRes = await httpMethods.post(objSend,url)
            if(typeStatus.errServer===msgRes){
                const err=networkUtils.callFunctionByStatusServer(msgRes)
                notifyFunctions(functionToCallBack.errConnection,err)
                return err
            }
            return msgRes
        },
        playerWin: async() =>{
            const objSend={
                roomCode:networkConf.codes.room,
                playerCode:networkConf.codes.player,
                playerWin:true
            } 
            const url = networkConf.routerUrl.playerWin
            const msgRes = await httpMethods.post(objSend,url)
            if(typeStatus.errServer===msgRes){
                const err=networkUtils.callFunctionByStatusServer(msgRes)
                notifyFunctions(functionToCallBack.errConnection,err)
                return err
            }
            return msgRes
        }
    }
   
    this.enableCalls={
        moveAdversary: ()=>{
            const url = networkConf.routerUrl.getMovement
            setTimeMoveAdv(url)
        },
        playerConnection: ()=>{
            const url = networkConf.routerUrl.statusGame
            setTimeToFindAdv(url)
        },
        statusGame: ()=>{ 
            const url = networkConf.routerUrl.statusGame
            setTimeStatusGame(url)
        }
    }

    function setTimeMoveAdv(url,timeCounter=0,timeLimitForMovement=time.limitForMovement){
        setTimeout(
            async()=>{
                const msgRes = await httpMethods.get(url)
                if(typeStatus.errServer===msgRes){
                    const err=networkUtils.callFunctionByStatusServer(msgRes)
                    notifyFunctions(functionToCallBack.errConnection,err)
                }
                else if(msgRes.typeStatus===typeStatus.movementAvailable){
                    const paramFunstionStatus={
                        move:msgRes.move
                    }
                    const status = networkUtils.callFunctionByStatusMovement(msgRes.typeStatus,paramFunstionStatus)
                    notifyFunctions(functionToCallBack.moveAdversary,status)
                }
                else if(msgRes.typeStatus===typeStatus.incorrectMovement){
                    const status = networkUtils.callFunctionByStatusMovement(msgRes.typeStatus)
                    notifyFunctions(functionToCallBack.moveAdversary,status)
                }
                else if(timeCounter===timeLimitForMovement){
                    const status = networkUtils.callFunctionByStatusGame(typeStatus.endTimeMove)
                    notifyFunctions(functionToCallBack.playerConnection,status)
                }
                else if(msgRes.statusGame.endGame.isEndGame===false){
                    timeCounter++
                    setTimeMoveAdv(url,timeCounter)
                }
            },time.setToMovement)
    }

    function setTimeToFindAdv(url,timeCounter=0,timeLimitToFindAdv=time.limitToFindAdv){
        setTimeout(
            async()=>{
                const msgRes = await httpMethods.get(url)
                if(typeStatus.errServer===msgRes){
                    const err=networkUtils.callFunctionByStatusServer(msgRes)
                    notifyFunctions(functionToCallBack.errConnection,err)
                }
                else if(msgRes.statusPlayerAdv.namePlayer!==null){
                    const paramFunstionStatus={
                        statusPlayerAdv:msgRes.statusPlayerAdv
                    }
                    const statusPlayerAdv= networkUtils.callFunctionByStatusGame(typeStatus.advPlayer,paramFunstionStatus)
                    notifyFunctions(functionToCallBack.playerConnection,statusPlayerAdv)
                }
                else if(timeCounter===timeLimitToFindAdv){
                    const status = networkUtils.callFunctionByStatusGame(typeStatus.endTimeAdv)
                    notifyFunctions(functionToCallBack.playerConnection,status)
                }
                else if(msgRes.statusGame.endGame.isEndGame===false){
                    timeCounter++
                    setTimeToFindAdv(url,timeCounter)
                }
            },time.setToFindAdv)
    }

    function setTimeStatusGame(url){
        const waitInf = 
        setInterval(
            async()=>{
                const status = await httpMethods.get(url)
                if(typeStatus.errServer===status){
                    clearInterval(waitInf) 
                    const err=networkUtils.callFunctionByStatusServer(status)
                    notifyFunctions(functionToCallBack.errConnection,err)
                }
                else if( status.statusGame.endGame.isEndGame===true){ 
                    clearInterval(waitInf)
                    const paramFunstionStatus={
                        endGame: status.statusGame.endGame
                    }
                    const statusGame =networkUtils.callFunctionByStatusGame(status.statusGame.endGame.type,paramFunstionStatus)
                    
                }
        },time.setToStatusGame)
    }

    const functionToCallBack= {
        moveAdversary:[],
        informationStart:[],
        giveUp:[],
        endGame:[],
        playerConnection:[], 
        errConnection:[],
        timeOutToMove:[]
    }

    this.subscribeMoveAdversary=function(fn){
        functionToCallBack.moveAdversary.push(fn)   
    }
    this.subscribeInformationStart=function(fn){
        functionToCallBack.informationStart.push(fn)
    }
    this.subscribeEndGame=function(fn){
        functionToCallBack.endGame.push(fn)
    }
    this.subscribeGiveUp=function(fn){
        functionToCallBack.giveUp.push(fn)
    }
    this.subscribePlayerConnection=function(fn){
        functionToCallBack.playerConnection.push(fn)
    }
    this.subscribeErrConnection=function(fn){
        functionToCallBack.errConnection.push(fn)
    }
    this.subscribeTimeOutToMove=function(fn){
        functionToCallBack.timeOutToMove.push(fn)
    }
    function notifyFunctions (objToCallBack,parameters){
        objToCallBack.forEach((fn)=>fn(parameters))
    }
    

    networkUtils.subscribeUpdateCode(updatesStartRoom)
    networkUtils.subscribeGiveUp(giveUpGame)
    networkUtils.subscribeTimeOutToMove(timeOutToMove)

    function updatesStartRoom(statusCode){
        networkConf.updateCodes(statusCode)
        networkConf.routerUrl.updateQuery(statusCode)
    }

    function giveUpGame(){
        notifyFunctions(functionToCallBack.giveUp)
    }

    function timeOutToMove(playerName){
        notifyFunctions(functionToCallBack.timeOutToMove,playerName)
    }

}