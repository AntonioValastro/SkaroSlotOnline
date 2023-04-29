(function () {
    let items = new Array();
    let mute = true;
    let soundtrack = document.getElementById("mp3_soundtrack");

    for(let i=0; i < 7; i++){
        items.push('0');
    }

    for(let i=0; i < 3; i++){
        items.push('7');
    }

    for(let i=0; i < 8; i++){
        items.push('6');
    }

    for(let i=0; i < 12; i++){
        items.push('5');
    }

    for(let i=0; i < 16; i++){
        items.push('4');
    }

    for(let i=0; i < 18; i++){
        items.push('3');
        items.push('2');
        items.push('1');
    }


    const doors = document.querySelectorAll('.door');
    const saldo =  document.getElementById("saldo");

    var items_matrix = [['00','00','00'],['00','00','00'],['00','00','00'],['00','00','00'],['00','00','00']];
    var items_counter = 0;
    var n_spin = 0;
    var saldo_corrente = 1000;
    var importo_giocato = 20;
    
    document.querySelector('#spinner').addEventListener('click', init);
    document.querySelector('#spinner').addEventListener('click', spin);
    document.querySelector('#overlay').addEventListener('click', overlayOff);

    
  
    function init(firstInit = true, groups = 1, duration = 1) {

        
        saldo.textContent =  saldo_corrente + " Crediti";
        //console.clear()
        console.log(items_matrix)
      for (const door of doors) {
        const boxes = door.querySelector('.boxes');
        const boxesClone = boxes.cloneNode(false);
        
        
        
        if(n_spin ==14)
            n_spin=0;
        else
            n_spin++;
        let pool = [ items_matrix[parseInt(n_spin/3)][n_spin%3]];
        //console.log(pool)

  
        if (!firstInit) {
          const arr = [];
          for (let n = 0; n < (groups > 0 ? groups : 1); n++) {
            arr.push(...items);
          }
          pool.push(...shuffle(arr));
          //console.log(pool)
          boxesClone.addEventListener(
            'transitionstart',
            function () {
              door.dataset.spinned = '1';
              this.querySelectorAll('.box').forEach((box) => {
                box.style.filter = 'blur(1px)';
              });
            },
            { once: true }
          );
  
          boxesClone.addEventListener(
            'transitionend',
            function () {
              this.querySelectorAll('.box').forEach((box, index) => {
                box.style.filter = 'blur(0)';
                if (index > 0) this.removeChild(box);
              });
            },
            { once: true }
          );
          
        items_counter++;
        }
  
        for (let i = pool.length - 1; i >= 0; i--) {
            let box;
            box = document.createElement('img');
            box.classList.add('box');
            box.style.width = door.clientWidth + 'px';
            box.style.height = door.clientHeight + 'px';
            box.src = "../rsc/img/"+pool[i]+".png";
            box.id="item"+pool[i];
            box.dataset.position = items_counter;
            //console.log(items_counter)
            items_matrix[parseInt((items_counter-1)/3)][(items_counter)%3] = pool[pool.length-1]
            boxesClone.appendChild(box);
        }
        boxesClone.style.transitionDuration = `${duration > 0 ? duration : 1}s`;
        boxesClone.style.transform = `translateY(-${door.clientHeight * (pool.length - 1)}px)`;
        door.replaceChild(boxesClone, boxes);
      }

      for(let i=0; i<5; i++){
        let tmp= items_matrix[i][2];
        items_matrix[i][2]=items_matrix[i][1];
        items_matrix[i][1] = tmp;
      }
      //console.log(items_matrix)
      
      if(firstInit==false)
        window.setTimeout(checkWin,5000);
    }
  
    async function spin() {
      items_counter = 0;
      saldo_corrente -= importo_giocato;
      init(false, 1, 2);
      document.getElementById("spinner").classList.add("disabled");
      
      for (const door of doors) {
        const boxes = door.querySelector('.boxes');
        const duration = parseInt(boxes.style.transitionDuration);
        boxes.style.transform = 'translateY(0)';
        await new Promise((resolve) => setTimeout(resolve, duration * 100));
      }
    }
  
    function shuffle([...arr]) {
      let m = arr.length;
      while (m) {
        const i = Math.floor(Math.random() * m--);
        [arr[m], arr[i]] = [arr[i], arr[m]];
      }
      return arr;
    }

    function checkWin(){
        window.setTimeout(checkLine1,100);
    }

    function deactivate_win(){
        let items = document.getElementsByClassName("act");

        for(let i=items.length-1; i>=0; i--)
            items[i].classList.remove("act");
    }

    function checkLine1(){
        let firstElement = items_matrix[0][0], winningElement = 1;
        if(items_matrix[0][0] == "0"){
            firstElement = items_matrix[1][0];
            if(items_matrix[1][0] == "0"){
                firstElement = items_matrix[2][0];
                if(items_matrix[2][0] == "0"){
                    firstElement = items_matrix[3][0];
                    if(items_matrix[3][0] == "0")
                        firstElement = items_matrix[4][0];
                }
            }
        }
        
        //console.log("Line 1 First element: "+firstElement)
        for(let i=1; i<5; i++){
            //console.log("Line 1 New Item: "+items_matrix[i][0])
            if(items_matrix[i][0]==firstElement || items_matrix[i][0]=='0')
                winningElement++
            else
                break;
        }
        console.log(document.getElementById("door_3_0").childNodes[0].childNodes[0])
        //console.log("Line 1 Winning element: "+winningElement)
        if(winningElement > 2){
            
            document.getElementById("door_0_0").childNodes[1].childNodes[0].classList.add("act");
            document.getElementById("door_1_0").childNodes[1].childNodes[0].classList.add("act");
            document.getElementById("door_2_0").childNodes[1].childNodes[0].classList.add("act");
            if(winningElement>3){                    
                document.getElementById("door_3_0").childNodes[0].classList.add("act");
                if(winningElement > 4)
                    document.getElementById("door_4_0").childNodes[1].childNodes[0].classList.add("act");
            }
            win(firstElement,winningElement,1);
            window.setTimeout(deactivate_win,1000);
            window.setTimeout(checkLine2,1500);
        }
        else{
            window.setTimeout(checkLine2,100);
        }
         /*Activate elements
        let boxes = document.getElementsByClassName("box");
        console.log(boxes[0].dataset.position)

        let start_element = 2;
        for(let j = 0; j< winningElement; j++){
            boxes[start_element].classList.add("act");
            start_element += 3;
        }
        */
    }

    function checkLine2(){
        let winningElement = 1;
        let firstElement = items_matrix[0][1];
        
        if(items_matrix[0][1] == "0"){
            firstElement = items_matrix[1][1];
            if(items_matrix[1][1] == "0"){
                firstElement = items_matrix[2][1];
                if(items_matrix[2][1] == "0"){
                    firstElement = items_matrix[3][1];
                    if(items_matrix[3][1] == "0")
                        firstElement = items_matrix[4][1];
                }
            }
        }

        //console.log("Line 2 First element: "+firstElement)
        for(let i=1; i<5; i++){
            //console.log("Line 2 New Item: "+items_matrix[i][1])
            if(items_matrix[i][1]==firstElement || items_matrix[i][1]=='0')
                winningElement++
            else
                break;
        }
        //console.log("Line 2 Winning element: "+winningElement)
        if(winningElement > 2){
            document.getElementById("door_0_1").childNodes[1].childNodes[0].classList.add("act");
            document.getElementById("door_1_1").childNodes[1].childNodes[0].classList.add("act");
            document.getElementById("door_2_1").childNodes[1].childNodes[0].classList.add("act");
            if(winningElement>3){                    
                document.getElementById("door_3_1").childNodes[1].childNodes[0].classList.add("act");
                if(winningElement > 4)
                    document.getElementById("door_4_1").childNodes[1].childNodes[0].classList.add("act");
            }
            win(firstElement,winningElement,2);
            window.setTimeout(deactivate_win,1000);
            window.setTimeout(checkLine3,1500);
        }
        else{
            window.setTimeout(checkLine3,100);
        }
    }

    function checkLine3(){
        let winningElement = 1;
        let firstElement = items_matrix[0][2];

        
        if(items_matrix[0][2] == "0"){
            firstElement = items_matrix[1][2];
            if(items_matrix[1][2] == "0"){
                firstElement = items_matrix[2][2];
                if(items_matrix[2][2] == "0"){
                    firstElement = items_matrix[3][2];
                    if(items_matrix[3][2] == "0")
                        firstElement = items_matrix[4][2];
                }
            }
        }

        //console.log("Line 3 First element: "+firstElement)
        for(let i=1; i<5; i++){
            //console.log("Line 3 New Item: "+items_matrix[i][2])
            if(items_matrix[i][2]==firstElement || items_matrix[i][2]=='0')
                winningElement++
            else
                break;
        }
        //console.log("Line 3 Winning element: "+winningElement)
        if(winningElement > 2){
            document.getElementById("door_0_2").childNodes[1].childNodes[0].classList.add("act");
            document.getElementById("door_1_2").childNodes[1].childNodes[0].classList.add("act");
            document.getElementById("door_2_2").childNodes[1].childNodes[0].classList.add("act");
            if(winningElement>3){                    
                document.getElementById("door_3_2").childNodes[1].childNodes[0].classList.add("act");
                if(winningElement > 4)
                    document.getElementById("door_4_2").childNodes[1].childNodes[0].classList.add("act");
            }
            win(firstElement,winningElement,3);
            window.setTimeout(deactivate_win,1000);
            window.setTimeout(checkLine4,1500);
        }
        else{
            window.setTimeout(checkLine4,100);
        }
    }

    function checkLine4(){
        let winningElement = 1;
        let firstElement = items_matrix[0][2];

        
        if(items_matrix[0][2] == "0"){
            firstElement = items_matrix[1][1];
            if(items_matrix[1][1] == "0"){
                firstElement = items_matrix[2][0];
                if(items_matrix[2][0] == "0"){
                    firstElement = items_matrix[3][1];
                    if(items_matrix[3][1] == "0")
                        firstElement = items_matrix[4][2];
                }
            }
        }

        console.log("Line 4 First element: "+firstElement)
    
        if(items_matrix[1][1] == firstElement || items_matrix[1][1] == 0){
            winningElement++;
            if(items_matrix[2][0] == firstElement || items_matrix[2][0] == 0){
                winningElement++;
                if(items_matrix[3][1] == firstElement || items_matrix[3][1] == 0){
                    winningElement++;
                    if(items_matrix[4][2] == firstElement || items_matrix[4][2] == 0){
                        winningElement++;
                    }
                }
            }
        }

        console.log("Line 4 Winning element: "+winningElement)
        if(winningElement > 2){
                document.getElementById("door_0_2").childNodes[1].childNodes[0].classList.add("act");
                document.getElementById("door_1_1").childNodes[1].childNodes[0].classList.add("act");
                document.getElementById("door_2_0").childNodes[1].childNodes[0].classList.add("act");
                if(winningElement>3){                    
                    document.getElementById("door_3_1").childNodes[1].childNodes[0].classList.add("act");
                    if(winningElement > 4)
                        document.getElementById("door_4_2").childNodes[1].childNodes[0].classList.add("act");
                }
            win(firstElement,winningElement,4);        
            window.setTimeout(deactivate_win,1000);
            window.setTimeout(checkLine5,1500);
        }
        else{
            window.setTimeout(checkLine5,100);
        }
    }

    function checkLine5(){
        let winningElement = 1;
        let firstElement = items_matrix[0][0];

        
        if(items_matrix[0][0] == "0"){
            firstElement = items_matrix[1][1];
            if(items_matrix[1][1] == "0"){
                firstElement = items_matrix[2][2];
                if(items_matrix[2][2] == "0"){
                    firstElement = items_matrix[3][1];
                    if(items_matrix[3][1] == "0")
                        firstElement = items_matrix[4][0];
                }
            }
        }

        //console.log("Line 5 First element: "+firstElement)
    
        if(items_matrix[1][1] == firstElement || items_matrix[1][1] == 0){
            winningElement++;
            if(items_matrix[2][2] == firstElement || items_matrix[2][2] == 0){
                winningElement++;
                if(items_matrix[3][1] == firstElement || items_matrix[3][1] == 0){
                    winningElement++;
                    if(items_matrix[4][0] == firstElement || items_matrix[4][0] == 0){
                        winningElement++;
                    }
                }
            }
        }

        //console.log("Line 5 Winning element: "+winningElement)
        if(winningElement > 2){
                document.getElementById("door_0_0").childNodes[1].childNodes[0].classList.add("act");
                document.getElementById("door_1_1").childNodes[1].childNodes[0].classList.add("act");
                document.getElementById("door_2_2").childNodes[1].childNodes[0].classList.add("act");
                if(winningElement>3){                    
                    document.getElementById("door_3_1").childNodes[1].childNodes[0].classList.add("act");
                    if(winningElement > 4)
                        document.getElementById("door_4_0").childNodes[1].childNodes[0].classList.add("act");
                }
                win(firstElement,winningElement,5);  
                window.setTimeout(deactivate_win,1000);
                window.setTimeout(checkLine6,1500);
            }
            else{
                window.setTimeout(checkLine6,100);
            }
    }

    function checkLine6(){
        let winningElement = 1;
        let firstElement = items_matrix[0][2];

        
        if(items_matrix[0][2] == "0"){
            firstElement = items_matrix[1][2];
            if(items_matrix[1][2] == "0"){
                firstElement = items_matrix[2][1];
                if(items_matrix[2][1] == "0"){
                    firstElement = items_matrix[3][0];
                    if(items_matrix[3][0] == "0")
                        firstElement = items_matrix[4][0];
                }
            }
        }

        //console.log("Line 6 First element: "+firstElement)
    
        if(items_matrix[1][2] == firstElement || items_matrix[1][2] == 0){
            winningElement++;
            if(items_matrix[2][1] == firstElement || items_matrix[2][1] == 0){
                winningElement++;
                if(items_matrix[3][0] == firstElement || items_matrix[3][0] == 0){
                    winningElement++;
                    if(items_matrix[4][0] == firstElement || items_matrix[4][0] == 0){
                        winningElement++;
                    }
                }
            }
        }

        //console.log("Line 4 Winning element: "+winningElement)
        if(winningElement > 2){
                document.getElementById("door_0_2").childNodes[1].childNodes[0].classList.add("act");
                document.getElementById("door_1_2").childNodes[1].childNodes[0].classList.add("act");
                document.getElementById("door_2_1").childNodes[1].childNodes[0].classList.add("act");
                if(winningElement>3){                    
                    document.getElementById("door_3_0").childNodes[0].classList.add("act");
                    if(winningElement > 4)
                        document.getElementById("door_4_0").childNodes[1].childNodes[0].classList.add("act");
                }
            win(firstElement,winningElement,6);        
            window.setTimeout(deactivate_win,1000);
            window.setTimeout(checkLine7,1500);
        }
        else{
            window.setTimeout(checkLine7,100);
        }
    }

    function checkLine7(){
        let winningElement = 1;
        let firstElement = items_matrix[0][0];

        
        if(items_matrix[0][0] == "0"){
            firstElement = items_matrix[1][0];
            if(items_matrix[1][0] == "0"){
                firstElement = items_matrix[2][1];
                if(items_matrix[2][1] == "0"){
                    firstElement = items_matrix[3][2];
                    if(items_matrix[3][2] == "0")
                        firstElement = items_matrix[4][2];
                }
            }
        }

        //console.log("Line 6 First element: "+firstElement)
    
        if(items_matrix[1][0] == firstElement || items_matrix[1][0] == 0){
            winningElement++;
            if(items_matrix[2][1] == firstElement || items_matrix[2][1] == 0){
                winningElement++;
                if(items_matrix[3][2] == firstElement || items_matrix[3][2] == 0){
                    winningElement++;
                    if(items_matrix[4][2] == firstElement || items_matrix[4][2] == 0){
                        winningElement++;
                    }
                }
            }
        }

        //console.log("Line 7 Winning element: "+winningElement)
        if(winningElement > 2){
                document.getElementById("door_0_0").childNodes[1].childNodes[0].classList.add("act");
                document.getElementById("door_1_0").childNodes[1].childNodes[0].classList.add("act");
                document.getElementById("door_2_1").childNodes[1].childNodes[0].classList.add("act");
                if(winningElement>3){                    
                    document.getElementById("door_3_2").childNodes[1].childNodes[0].classList.add("act");
                    if(winningElement > 4)
                        document.getElementById("door_4_2").childNodes[1].childNodes[0].classList.add("act");
                }
            win(firstElement,winningElement,7);    
            window.setTimeout(deactivate_win,1000);
            window.setTimeout(checkLine8,1500);
        }
        else{
            window.setTimeout(checkLine8,100);
        }
    }

    function checkLine8(){
        let winningElement = 1;
        let firstElement = items_matrix[0][1];

        
        if(items_matrix[0][1] == "0"){
            firstElement = items_matrix[1][1];
            if(items_matrix[1][1] == "0"){
                firstElement = items_matrix[2][2];
                if(items_matrix[2][2] == "0"){
                    firstElement = items_matrix[3][1];
                    if(items_matrix[3][1] == "0")
                        firstElement = items_matrix[4][1];
                }
            }
        }

        //console.log("Line  First element: "+firstElement)
    
        if(items_matrix[1][1] == firstElement || items_matrix[1][1] == 0){
            winningElement++;
            if(items_matrix[2][2] == firstElement || items_matrix[2][2] == 0){
                winningElement++;
                if(items_matrix[3][1] == firstElement || items_matrix[3][1] == 0){
                    winningElement++;
                    if(items_matrix[4][1] == firstElement || items_matrix[4][1] == 0){
                        winningElement++;
                    }
                }
            }
        }

        //console.log("Line 8 Winning element: "+winningElement)
        if(winningElement > 2){
                document.getElementById("door_0_1").childNodes[1].childNodes[0].classList.add("act");
                document.getElementById("door_1_1").childNodes[1].childNodes[0].classList.add("act");
                document.getElementById("door_2_2").childNodes[1].childNodes[0].classList.add("act");
                if(winningElement>3){                    
                    document.getElementById("door_3_1").childNodes[1].childNodes[0].classList.add("act");
                    if(winningElement > 4)
                        document.getElementById("door_4_1").childNodes[1].childNodes[0].classList.add("act");
                }
            win(firstElement,winningElement,8);    
            window.setTimeout(deactivate_win,1000);
            window.setTimeout(checkLine9,1500);
        }
        else{
            window.setTimeout(checkLine9,100);
        }
    }

    function checkLine9(){
        let winningElement = 1;
        let firstElement = items_matrix[0][1];

        
        if(items_matrix[0][1] == "0"){
            firstElement = items_matrix[1][1];
            if(items_matrix[1][1] == "0"){
                firstElement = items_matrix[2][0];
                if(items_matrix[2][0] == "0"){
                    firstElement = items_matrix[3][1];
                    if(items_matrix[3][1] == "0")
                        firstElement = items_matrix[4][1];
                }
            }
        }

        //console.log("Line  First element: "+firstElement)
    
        if(items_matrix[1][1] == firstElement || items_matrix[1][1] == 0){
            winningElement++;
            if(items_matrix[2][0] == firstElement || items_matrix[2][0] == 0){
                winningElement++;
                if(items_matrix[3][1] == firstElement || items_matrix[3][1] == 0){
                    winningElement++;
                    if(items_matrix[4][1] == firstElement || items_matrix[4][1] == 0){
                        winningElement++;
                    }
                }
            }
        }

        //console.log("Line 10 Winning element: "+winningElement)
        if(winningElement > 2){
                document.getElementById("door_0_1").childNodes[1].childNodes[0].classList.add("act");
                document.getElementById("door_1_1").childNodes[1].childNodes[0].classList.add("act");
                document.getElementById("door_2_0").childNodes[1].childNodes[0].classList.add("act");
                if(winningElement>3){                    
                    document.getElementById("door_3_1").childNodes[1].childNodes[0].classList.add("act");
                    if(winningElement > 4)
                        document.getElementById("door_4_1").childNodes[1].childNodes[0].classList.add("act");
                }
            win(firstElement,winningElement,9);   
            window.setTimeout(deactivate_win,1000);
            window.setTimeout(checkLine10,1500);
        }
        else{
            window.setTimeout(checkLine10,100);
        }
    }

    function checkLine10(){
        let winningElement = 1;
        let firstElement = items_matrix[0][1];

        
        if(items_matrix[0][1] == "0"){
            firstElement = items_matrix[1][2];
            if(items_matrix[1][2] == "0"){
                firstElement = items_matrix[2][2];
                if(items_matrix[2][2] == "0"){
                    firstElement = items_matrix[3][2];
                    if(items_matrix[3][2] == "0")
                        firstElement = items_matrix[4][1];
                }
            }
        }

        //console.log("Line 10 First element: "+firstElement)
    
        if(items_matrix[1][2] == firstElement || items_matrix[1][2] == 0){
            winningElement++;
            if(items_matrix[2][2] == firstElement || items_matrix[2][2] == 0){
                winningElement++;
                if(items_matrix[3][2] == firstElement || items_matrix[3][2] == 0){
                    winningElement++;
                    if(items_matrix[4][1] == firstElement || items_matrix[4][1] == 0){
                        winningElement++;
                    }
                }
            }
        }

        //console.log("Line 10 Winning element: "+winningElement)
        if(winningElement > 2){
                document.getElementById("door_0_1").childNodes[1].childNodes[0].classList.add("act");
                document.getElementById("door_1_2").childNodes[1].childNodes[0].classList.add("act");
                document.getElementById("door_2_2").childNodes[1].childNodes[0].classList.add("act");
                if(winningElement>3){                    
                    document.getElementById("door_3_2").childNodes[1].childNodes[0].classList.add("act");
                    if(winningElement > 4)
                        document.getElementById("door_4_1").childNodes[1].childNodes[0].classList.add("act");
                }
            win(firstElement,winningElement,10);    
            window.setTimeout(deactivate_win,1000);
            window.setTimeout(checkLine11,1500);
        }
        else{
            window.setTimeout(checkLine11,100);
        }
    }

    function checkLine11(){
        let winningElement = 1;
        let firstElement = items_matrix[0][1];

        
        if(items_matrix[0][1] == "0"){
            firstElement = items_matrix[1][0];
            if(items_matrix[1][0] == "0"){
                firstElement = items_matrix[2][0];
                if(items_matrix[2][0] == "0"){
                    firstElement = items_matrix[3][0];
                    if(items_matrix[3][0] == "0")
                        firstElement = items_matrix[4][1];
                }
            }
        }

        //console.log("Line  First element: "+firstElement)
    
        if(items_matrix[1][0] == firstElement || items_matrix[1][0] == 0){
            winningElement++;
            if(items_matrix[2][0] == firstElement || items_matrix[2][0] == 0){
                winningElement++;
                if(items_matrix[3][0] == firstElement || items_matrix[3][0] == 0){
                    winningElement++;
                    if(items_matrix[4][1] == firstElement || items_matrix[4][1] == 0){
                        winningElement++;
                    }
                }
            }
        }

        //console.log("Line 8 Winning element: "+winningElement)
        if(winningElement > 2){
                document.getElementById("door_0_1").childNodes[1].childNodes[0].classList.add("act");
                document.getElementById("door_1_0").childNodes[1].childNodes[0].classList.add("act");
                document.getElementById("door_2_0").childNodes[1].childNodes[0].classList.add("act");
                if(winningElement>3){                    
                    document.getElementById("door_3_0").childNodes[0].classList.add("act");
                    if(winningElement > 4)
                        document.getElementById("door_4_1").childNodes[1].childNodes[0].classList.add("act");
                }
            win(firstElement,winningElement,11);
            window.setTimeout(deactivate_win,1000);
            //window.setTimeout(checkLine9,1500);
            window.setTimeout(enableSpinner,100);
        }
        else{
            window.setTimeout(enableSpinner,100);
        }
    }

    function enableSpinner(){
        document.getElementById("spinner").classList.remove("disabled");
    }

    function win(winning_item, winning_number, line){
        console.log("Winning item: "+winning_item)
        console.log("Winning number: "+winning_number)
        console.log("Vinti "+ 50*winning_number+" in linea "+line)

        const mp3 = document.getElementById("mp3");

        
 
        if(winning_item == "7"){
            let overlay = document.getElementById("overlay");
            overlay.style.display = "flex";
            overlay.textContent = "Hai culo!";
        }
        else{
            if(winning_item == 1){
                if(winning_number == 3){
                    crediti_vinti = 4;
                }
                else if(winning_number == 4){
                    crediti_vinti = 8;
                }
                else if(winning_number == 5){
                    crediti_vinti = 14;
                }
            }
            else if(winning_item == 2){
                if(winning_number == 3){
                    crediti_vinti = 6;
                }
                else if(winning_number == 4){
                    crediti_vinti = 10;
                }
                else if(winning_number == 5){
                    crediti_vinti = 18;
                }}
            else if(winning_item == 3){
                if(winning_number == 3){
                    crediti_vinti = 6;
                }
                else if(winning_number == 4){
                    crediti_vinti = 12;
                }
                else if(winning_number == 5){
                    crediti_vinti = 24;
                }}
            if(winning_item == 4){
                if(winning_number == 3){
                    crediti_vinti = 8;
                }
                else if(winning_number == 4){
                    crediti_vinti = 14;
                }
                else if(winning_number == 5){
                    crediti_vinti = 28;
                }
                mp3.src="../rsc/mp3/marco_sound.mp3";
                mp3.play();
            }
            else if(winning_item == 5){
                if(winning_number == 3){
                    crediti_vinti = 10;
                }
                else if(winning_number == 4){
                    crediti_vinti = 18;
                }
                else if(winning_number == 5){
                    crediti_vinti = 50;
                }}
            else if(winning_item == 6){
                if(winning_number == 3){
                    crediti_vinti = 20;
                }
                else if(winning_number == 4){
                    crediti_vinti = 40;
                }
                else if(winning_number == 5){
                    crediti_vinti = 100;
                }}
            

            saldo_corrente += crediti_vinti;
            saldo.textContent = saldo_corrente+" Crediti";

            let display = document.getElementById("display");
            display.textContent = "Vinti "+crediti_vinti+" in linea "+line;
        }

        window.setTimeout(overlayOff, 2000);
    }

    function overlayOff(){
        document.getElementById("overlay").style.display = "none";
        if( mute == true){
            mute = false;
            console.log("start sound")
            soundtrack.play();
        }
    }
  
    init();
  })();
  