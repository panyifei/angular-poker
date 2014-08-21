var pokerModule=angular.module("Poker",[]);


function pokerRouteConfig($routeProvider){
    $routeProvider.
    when('/', {
      controller: ReadyController,
      templateUrl: 'ready.html'
    }).
    when('/startGame/', {
      controller: StartGameController,
      templateUrl: 'startGame.html'
    }).
    otherwise({
        redirectTo:'/'
    });
}
pokerModule.config(pokerRouteConfig);
//路由配置


    function Card(suit,value){
        this.suit=suit;
        this.value=value;
        this.ifChoose=false;
    }//卡牌
    Card.Suit=["Clubs","Diamonds","Hearts","Spades"];
    Card.Value=[1,2,3,4,5,6,7,8,9,10,11,12,13];

    function Deck(){
        var cards= this.cards=[];

        Card.Suit.forEach(function(suit,index,array){
            Card.Value.forEach(function(value,index,array){
                cards.push(new Card(suit,value));
             });
        });
    }//牌组
    Deck.prototype.shuffle=function(){
        var deck=this.cards,len=deck.length;
        for (var i = len - 1; i > 0; i--) {
            var r = Math.floor(Math.random()*(i+1)),temp;
            temp=deck[i],deck[i]=deck[r],deck[r]=temp;
        };
        return this;
    }//洗牌函数
    


function ReadyController($scope){

}



function StartGameController($scope){
    var deck = new Deck().shuffle();
    $scope.ifYourTurn=false;
    $scope.ifEnemyTurn=false;
    $scope.enemyCards = deck.cards.splice(26);
    $scope.yourCards = deck.cards;
    $scope.enemyPlayedCards = [];
    $scope.yourPlayedCards = [];
    $scope.ifCasual=true;//是否随便出
    $scope.youText=["你好"];
    $scope.enemyPicture="enemyStart.jpg";
    $scope.youBoom=false;
    var ss=$scope.youText;
    $scope.enemyText=["Enemy:你也好"];
    $scope.youPicture="youStart.jpg";
    $scope.ifGameOver=false;

    function youLose(){
        $scope.youText=["呜呜~~"];
        $scope.enemyPicture="enemyWin.jpg";
        $scope.enemyText=["Enemy:你输了"];
        $scope.youPicture="youLose.jpg";
        document.getElementById("doNotHave").disabled=true;
    }//你输了

    $scope.enemyPlay=function(){
        $scope.enemyPlayedCards=[];
        var valueArr=getCardValue();
        var yourPCCount=$scope.yourPlayedCards.length;
        var tempArr= valueArr.filter(function(x){ return x[0]>$scope.yourPlayedCards[0].value&&x[1]==yourPCCount});
        console.log(tempArr);
        if(tempArr[0]!=undefined){//如果找到了可以压的，出最小的
            $scope.enemyText[0]="Enemy:大你！";
            $scope.enemyPicture="enemyBig.jpg";//改变图片
            var value=tempArr[0][0];
            console.log(value);
            for(var i=0;i<$scope.enemyCards.length;i++){
                if(value==$scope.enemyCards[i].value){
                      $scope.enemyPlayedCards.push($scope.enemyCards[i]);
                      }
            }//得到最终数出卡片
            $scope.enemyCards=$scope.enemyCards.filter(function(x) { return  x.value!=value });
            //从牌堆中删去.
            enemyPlayEnd();
            if($scope.enemyCards.length==0){
                 youLose();
            }
        }else{
            var boomArr= valueArr.filter(function(x){ return x[1]==4&&yourPCCount!=4});
            if(boomArr[0]!=undefined){
                $scope.enemyText[0]="Enemy:炸死你!!哈哈";
                $scope.enemyPicture="boom.gif";//改变图片
                var value=boomArr[0][0];
                console.log(value);
                for(var i=0;i<$scope.enemyCards.length;i++){
                    if(value==$scope.enemyCards[i].value){
                          $scope.enemyPlayedCards.push($scope.enemyCards[i]);
                          }
                }//得到最终数出卡片
                $scope.enemyCards=$scope.enemyCards.filter(function(x) { return  x.value!=value });
                //从牌堆中删去.
                enemyPlayEnd();
                if($scope.enemyCards.length==0){
                     youLose();
                }
            }else{
                $scope.enemyPicture="enemyDoNot.jpg";//改变图片
                $scope.enemyText[0]="Enemy:小哥我不要了";
                $scope.ifCasual=true;//让我随便出
                $scope.ifYourTurn=true;
                $scope.ifEnemyTurn=false;
                document.getElementById("doNotHave").disabled=true;
            }
        }
        
    };//敌人对于我出的牌进行反抗
    function enemyPlayEnd(){
        $scope.ifYourTurn=true;
        $scope.ifEnemyTurn=false;
        $scope.ifCasual=false;//让我反击
        document.getElementById("doNotHave").disabled=false;
    }//一些收尾工作

    $scope.play=function(){
        $scope.yourPlayedCards=[];
        removeChoose($scope.yourCards);
        $scope.ifYourTurn=false;
        $scope.ifEnemyTurn=true;
        console.log($scope.youBoom);
        if($scope.youBoom){
            $scope.youPicture="boom.gif";//改变图片
            $scope.youText=["炸弹!"];
            $scope.youBoom=false;
        }else{
            $scope.youPicture="youBig.jpg";//改变图片
        }


        document.getElementById("start").disabled=true;
        if($scope.yourCards.length==0){
            $scope.youText=["哈哈,So easy~真象只有一个!"];
            $scope.enemyText=["Enemy:你赢了"];
            $scope.enemyPicture="enemyLose.jpg";
            $scope.youPicture="youWin.jpg";
            $scope.ifGameOver=true;
        }
        if(!$scope.ifGameOver){
            $scope.enemyPlay();
        }
    };//你出一次牌

    function removeChoose(yourCards){
        var cicle=false;
        for(var i=0;i<yourCards.length;i++){
            if(yourCards[i]['ifChoose']==true){
                $scope.yourPlayedCards=$scope.yourPlayedCards.concat(yourCards.splice(i, 1));
                cicle=true;
                break;
            }
        }
        if(cicle)removeChoose(yourCards);
    }//删去出掉的牌,添加进已出牌组

    $scope.doNotHave=function(){
        $scope.ifYourTurn=false;
        $scope.ifEnemyTurn=true;
        $scope.ifCasual=true;//对面随便出牌
        $scope.youText=["要不起"];
        $scope.youPicture="youDoNot.jpg";//改变图片
        enemyJustPlay();
    };//你没牌可出


    $scope.changeState=function(row){

        $scope.yourCards[row].ifChoose=!$scope.yourCards[row].ifChoose;
        //先得到选中的牌
        var readyCards=[];
        for(var i=0;i<$scope.yourCards.length;i++){
            if($scope.yourCards[i]['ifChoose']==true){
                readyCards.push($scope.yourCards[i]);
            }
        }//你选择好的牌
        if($scope.ifCasual){//如果对手不要,我随便出

            if(checkJustPlay(readyCards)){
                $scope.youText[0]="可以这么出";
                document.getElementById("start").disabled=false;
            }else{
                $scope.youText[0]="不可以这么出";
                document.getElementById("start").disabled=true;
            }
        }else{
            if($scope.ifYourTurn==true&&$scope.ifEnemyTurn==false&&compare(readyCards,$scope.enemyPlayedCards)){
                $scope.youText=["管上！"];
                document.getElementById("start").disabled=false;
            }else{
                document.getElementById("start").disabled=true;
            }
        }

    }//点击某张牌修改状态,顺便比较看是否可以出

    $scope.refresh=function(){
        location.reload();
    }

    function enemyJustPlay(){
        $scope.yourPlayedCards=[];
        $scope.enemyPlayedCards=[];
        enemyChoosePay();
        if($scope.enemyCards.length==0){
            youLose();
        }
        $scope.ifYourTurn=true;
        $scope.ifEnemyTurn=false;
        $scope.ifCasual=false;//我不能随便出
        document.getElementById("start").disabled=true;
    }//我不要或者对手第一次出牌

    function enemyChoosePay(){
        if($scope.enemyCards.length==0){
        }else{
            var valueArr=getCardValue();
            console.log(valueArr);
            var value=valueArr[0][0];
            console.log(value);
            for(var i=0;i<$scope.enemyCards.length;i++){
                if(value==$scope.enemyCards[i].value){
                      $scope.enemyPlayedCards.push($scope.enemyCards[i]);
                      }
            }//得到最终数出卡片
            $scope.enemyCards=$scope.enemyCards.filter(function(x) { return  x.value!=value });
            //从牌堆中删去.
        }
    }//选出最小的牌并打出去


    function getCardValue(){
        var valueArr=[];
        for(var i=1;i<14;i++){
                var counter=getCardCount(i,$scope.enemyCards);
                if(counter!==0)
                valueArr.push([i,counter]);
        }
        valueArr.sort(function(a,b){
        if(a[1]>b[1]) return 1;
        if(a[1]<b[1]) return -1;
        //if(a[1]==b[1])  return 0;
        if(a[1]==b[1]){
            if(a[0]>b[0]) return 1;
            else return -1;
            }
        });
        return valueArr;
    }//选出应该打出的数字,返回的是数组

    function getCardCount(value,cards){
        var counter=0;
        for(var i=0;i<cards.length;i++){
            if(cards[i].value==value){
                counter++;
            }
        }
        return counter;
    }//数出某个值的个数

    function checkJustPlay(readyCards){
        switch(readyCards.length)
            {
            case 1:
                    return true;
                break;
            case 2:
                if(readyCards[0].value==readyCards[1].value){
                    return true;
                }else{
                    return false;
                }
                break;
            case 3:
                console.log("3张?");
                if(readyCards[0].value==readyCards[1].value&&readyCards[0].value==readyCards[2].value){
                    return true;
                }else{
                    return false;
                }
                break;
            case 4:
                if(readyCards[0].value==readyCards[1].value&&readyCards[0].value==readyCards[2].value&&readyCards[0].value==readyCards[3].value){
                    console.log("炸子啊?!");
                    return true;
                }else{
                    return false;
                }
                break;
            default:
                console.log("会不会玩?");
                return false;
                //break;
            }
    }//判断随便出的时候能不能出.

    function compare(readyCards,playedCards){
        console.log("开始检测");
        if(readyCards.length!==playedCards.length){//如果长度不等
            console.log("长度不等");
            if(readyCards.length===4){//如果想出的牌有4个
                console.log("有4个啦");
                var value = readyCards[0].value;
                var ifBoob = readyCards.every(function(x){ return x.value===value});
                if(ifBoob){//如果是炸子的话,就大
                    $scope.youBoom=true;
                    $scope.youText[0]="炸死他!!";
                    return true;
                }
            }
        }else{//长度相等
            switch(readyCards.length)
            {
            case 1:
                if(readyCards[0].value>playedCards[0].value){
                    console.log("一张比你大");
                    return true;
                }
                break;
            case 2:
                if(readyCards[0].value==readyCards[1].value&&readyCards[0].value>playedCards[0].value){
                    console.log("二张比你大");
                    return true;
                }else{
                    return false;
                }
                break;
            case 3:
                if(readyCards[0].value==readyCards[1].value&&readyCards[0].value==readyCards[2].value&&readyCards[0].value>playedCards[0].value){
                    console.log("三张比你大");
                    return true;
                }else{
                    return false;
                }
                break;
            case 4:
                if(readyCards[0].value==readyCards[1].value&&readyCards[0].value==readyCards[2].value&&readyCards[0].value==readyCards[3].value&&readyCards[0].value>playedCards[0].value){
                    $scope.youText[0]="炸子比他大,不虚";
                    return true;
                }else{
                    return false;
                }
                break;
            }
        }
        return false;
    }//比较是否比人家的牌大,前一个为候选牌组


    //初始化各个方法结束
    //机器人先出牌,设置为你的牌回合
    enemyJustPlay();
    //处理一下我的牌组
    $scope.yourCards.sort(function(a,b){
        if(a.value>b.value) return 1;
        if(a.value<b.value) return -1;
        if(a.value==b.value) return 0;
    });
}

