(function () {
    let itemsNormal = new Array();
    let itemsBonus = new Array();
    let mute = true;
    let soundtrack = document.getElementById("mp3_soundtrack");
    let scatterSpin =0;

    const mp3 = document.getElementById("mp3");

    function fillItems(items){
        for (let i = 0; i < 7; i++) {
            items.push('0');
        }

        for (let i = 0; i < 3; i++) {
            items.push('7');
        }

        for (let i = 0; i < 8; i++) {
            items.push('6');
        }

        for (let i = 0; i < 12; i++) {
            items.push('5');
        }

        for (let i = 0; i < 16; i++) {
            items.push('4');
        }

        for (let i = 0; i < 18; i++) {
            items.push('3');
            items.push('2');
            items.push('1');
        }
    }

    function fillItemsBonus(items){
        for (let i = 0; i < 7; i++) {
            items.push('0');
        }

        for (let i = 0; i < 0; i++) {
            items.push('7');
        }

        for (let i = 0; i < 8; i++) {
            items.push('6');
        }

        for (let i = 0; i < 12; i++) {
            items.push('5');
        }

        for (let i = 0; i < 16; i++) {
            items.push('4');
        }

        for (let i = 0; i < 18; i++) {
            items.push('3');
            items.push('2');
            items.push('1');
        }
    }

    fillItems(itemsNormal);
    fillItemsBonus(itemsBonus)

    const doors = document.querySelectorAll('.door');
    const saldo = document.getElementById("saldo_value");
    const overlay_scatter = document.getElementById("overlay_scatter");

    var items_matrix = [['00', '00', '00'], ['00', '00', '00'], ['00', '00', '00'], ['00', '00', '00'], ['00', '00', '00']];
    var items_counter = 0;
    var n_spin = 0;
    var saldo_corrente = 1000;
    var importo_giocato = 20;
    var round_win = 0;

    document.querySelector('#spinner').addEventListener('click', init, true);
    document.querySelector('#spinner').addEventListener('click', spin);
    document.querySelector('#overlay').addEventListener('click', overlayOff);
    overlay_scatter.style.display = "none";



    function init(firstInit = true, groups = 1, duration = 1, items = itemsNormal) {

        console.log("firstInit: "+firstInit)

        saldo.textContent = saldo_corrente;
        //console.clear()
        console.log(items_matrix)
        for (const door of doors) {
            const boxes = door.querySelector('.boxes');
            const boxesClone = boxes.cloneNode(false);



            if (n_spin == 14)
                n_spin = 0;
            else
                n_spin++;
            let pool = [items_matrix[parseInt(n_spin / 3)][n_spin % 3]];
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
                box.src = "./rsc/img/" + pool[i] + ".png";
                box.id = "item" + pool[i];
                box.dataset.position = items_counter;
                //console.log(items_counter)
                items_matrix[parseInt((items_counter - 1) / 3)][(items_counter) % 3] = pool[pool.length - 1]
                boxesClone.appendChild(box);
            }
            boxesClone.style.transitionDuration = `${duration > 0 ? duration : 1}s`;
            boxesClone.style.transform = `translateY(-${door.clientHeight * (pool.length - 1)}px)`;
            door.replaceChild(boxesClone, boxes);
        }

        for (let i = 0; i < 5; i++) {
            let tmp = items_matrix[i][2];
            items_matrix[i][2] = items_matrix[i][1];
            items_matrix[i][1] = tmp;
        }
        //console.log(items_matrix)

        if (firstInit == false)
            window.setTimeout(checkWin, 5000);
    }

    async function spin() {
        console.log("You click spin")
        round_win = 0;
        items_counter = 0;
        saldo_corrente -= importo_giocato;
        init(false, 1, 2);
        document.getElementById("spinner").classList.add("disabled");
        document.querySelector('#spinner').removeEventListener('click', init);
        document.querySelector('#spinner').removeEventListener('click', spin);

        mp3.src = "./rsc/mp3/random_wheel.mp3";
        mp3.play();
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

    function checkWin() {
        window.setTimeout(checkLine1, 100, items_matrix);
    }

    function deactivate_win() {
        //console.log("deact")
        let items = document.getElementsByClassName("act");

        for (let i = items.length - 1; i >= 0; i--)
            items[i].classList.remove("act");
    }

    function checkScatter() {
        console.log("Check scatter: Scatter spin - "+ scatterSpin)
        let winningElement = 0;
        let positions = new Array();

        for (let row = 0; row < 3; row++)
            for (let col = 0; col < 5; col++) {
                if (items_matrix[col][row] == "7") {
                    winningElement++;
                    positions.push(col);
                    positions.push(row);
                }
            }


        if (winningElement > 2) {
            document.getElementById("door_" + positions[0] + "_" + positions[1]).childNodes[1].childNodes[0].classList.add("act");
            document.getElementById("door_" + positions[2] + "_" + positions[3]).childNodes[1].childNodes[0].classList.add("act");
            document.getElementById("door_" + positions[4] + "_" + positions[5]).childNodes[1].childNodes[0].classList.add("act");
            if (winningElement > 3) {
                console.log(document.getElementById("door_" + positions[6] + "_" + positions[7]))
                document.getElementById("door_" + positions[6] + "_" + positions[7]).childNodes[1].childNodes[0].classList.add("act");
                if (winningElement > 4)
                    document.getElementById("door_" + positions[8] + "_" + positions[9]).childNodes[1].childNodes[0].classList.add("act");
            }
            //win(firstElement,winningElement,11);
            window.setTimeout(deactivate_win, 1000);
            if(scatterSpin > 0){
                scatterSpin = scatterSpin + winningElement - 1;
                console.log("num: "+ scatterSpin)
                spinBonus(scatterSpin);
            }
            else
                window.setTimeout(bonusFunction, 1100, winningElement);
        }
        else {
            if(scatterSpin > 0)
                spinBonus(--scatterSpin);
            else
                window.setTimeout(enableSpinner, 100);
        }
    }

    
    function bonusFunction(number) {
        console.log("Bonus Function")
        console.log(number)

        overlay_scatter.style.display = "flex";
        overlay_scatter.textContent = "Sono usciti " + number + " SCATTER che culo!";
        scatterSpin = number;
  
        window.setTimeout(spinBonus,4000,scatterSpin);

    }
    
    async function spinBonus(number){
        init();
        document.getElementById("spinner").classList.add("disabled");
        document.querySelector('#spinner').removeEventListener('click', init);
        document.querySelector('#spinner').removeEventListener('click', spin);
        if(number > 0){
            console.log("Spin Bonus: "+number)
            overlay_scatter.style.display = "none";
            round_win = 0;
            items_counter = 0;
            saldo_corrente -= importo_giocato;
            init(false, 1, 2, itemsBonus);

            mp3.src = "./rsc/mp3/random_wheel.mp3";
            mp3.play();
            for (const door of doors) {
                const boxes = door.querySelector('.boxes');
                boxes.style.transform = 'translateY(0)';
                const duration = parseInt(boxes.style.transitionDuration);
                await new Promise((resolve) => {setTimeout(resolve, duration * 100)});
            }
        }
        else{
            console.log("Finish spin")
            scatterSpin = 0;

            window.setTimeout(enableSpinner, 100);
        }
    }


    function enableSpinner() {
        let display = document.getElementById("display");
        let overlay = document.getElementById("overlay");
        if (round_win > 20) {
            overlay.style.display = "flex";
            overlay.textContent = "Hai vinto " + round_win + " crediti!";
            display.textContent = "Vinti " + round_win + " crediti";
            //window.setTimeout(overlayOff,30000);
        }
        else if (round_win == 0)
            display.textContent = "Riprova!";
        else {
            display.textContent = "Vinti " + round_win + " crediti";
        }
        document.querySelector('#spinner').addEventListener('click', init);
        document.querySelector('#spinner').addEventListener('click', spin);
        document.getElementById("spinner").classList.remove("disabled");
    }

    function win(winning_item, winning_number, line) {
        console.log("Winning item: " + winning_item)
        console.log("Winning number: " + winning_number)


        if (winning_item == 1) {
            if (winning_number == 3) {
                crediti_vinti = 4;
            }
            else if (winning_number == 4) {
                crediti_vinti = 8;
            }
            else if (winning_number == 5) {
                crediti_vinti = 14;
            }
            mp3.src = "./rsc/mp3/item_sound/angelo.mp3";
            mp3.play();
        }
        else if (winning_item == 2) {
            if (winning_number == 3) {
                crediti_vinti = 6;
            }
            else if (winning_number == 4) {
                crediti_vinti = 10;
            }
            else if (winning_number == 5) {
                crediti_vinti = 18;
            }
            mp3.src = "./rsc/mp3/item_sound/cippo.mp3";
            mp3.play();
        }
        else if (winning_item == 3) {
            if (winning_number == 3) {
                crediti_vinti = 6;
            }
            else if (winning_number == 4) {
                crediti_vinti = 12;
            }
            else if (winning_number == 5) {
                crediti_vinti = 24;
            }
            mp3.src = "./rsc/mp3/item_sound/fabio.mp3";
            mp3.play();
        }
        if (winning_item == 4) {
            if (winning_number == 3) {
                crediti_vinti = 8;
            }
            else if (winning_number == 4) {
                crediti_vinti = 14;
            }
            else if (winning_number == 5) {
                crediti_vinti = 28;
            }
            mp3.src = "./rsc/mp3/item_sound/marco.mp3";
            mp3.play();
        }
        else if (winning_item == 5) {
            if (winning_number == 3) {
                crediti_vinti = 10;
            }
            else if (winning_number == 4) {
                crediti_vinti = 18;
            }
            else if (winning_number == 5) {
                crediti_vinti = 50;
            }
        }
        else if (winning_item == 6) {
            if (winning_number == 3) {
                crediti_vinti = 20;
            }
            else if (winning_number == 4) {
                crediti_vinti = 40;
            }
            else if (winning_number == 5) {
                crediti_vinti = 100;
            }
        }

        round_win += crediti_vinti;
        saldo_corrente += crediti_vinti;
        saldo.textContent = saldo_corrente;

        let display = document.getElementById("display");
        display.textContent = "Vinti " + crediti_vinti + " in linea " + line;

        //window.setTimeout(overlayOff, 2000);
    }

    function overlayOff() {
        document.getElementById("overlay").style.display = "none";
        if (mute == true) {
            mute = false;
            console.log("start sound")
            soundtrack.play();
        }
    }

    init();

    /* CHECK LINES */
    function checkLine1(items_matrix) {
        let firstElement = items_matrix[0][0], winningElement = 1;
        if (items_matrix[0][0] == "0") {
            firstElement = items_matrix[1][0];
            if (items_matrix[1][0] == "0") {
                firstElement = items_matrix[2][0];
                if (items_matrix[2][0] == "0") {
                    firstElement = items_matrix[3][0];
                    if (items_matrix[3][0] == "0")
                        firstElement = items_matrix[4][0];
                }
            }
        }

        //console.log("Line 1 First element: " + firstElement)
        for (let i = 1; i < 5; i++) {
            //console.log("Line 1 New Item: "+items_matrix[i][0])
            if (items_matrix[i][0] == firstElement || items_matrix[i][0] == '0')
                winningElement++
            else
                break;
        }
        //console.log("Line 1 Winning element: "+winningElement)
        if (winningElement > 2 && firstElement != "7") {
            document.getElementById("door_0_0").childNodes[1].childNodes[0].classList.add("act");
            document.getElementById("door_1_0").childNodes[1].childNodes[0].classList.add("act");
            document.getElementById("door_2_0").childNodes[1].childNodes[0].classList.add("act");
            if (winningElement > 3) {
                document.getElementById("door_3_0").childNodes[1].childNodes[0].classList.add("act");
                if (winningElement > 4)
                    document.getElementById("door_4_0").childNodes[1].childNodes[0].classList.add("act");
            }
            win(firstElement, winningElement, 1);
            window.setTimeout(deactivate_win, 1000);
            window.setTimeout(checkLine2, 1500, items_matrix);
        }
        else {
            window.setTimeout(checkLine2, 100, items_matrix);
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

    function checkLine2(items_matrix) {
        let winningElement = 1;
        let firstElement = items_matrix[0][1];

        if (items_matrix[0][1] == "0") {
            firstElement = items_matrix[1][1];
            if (items_matrix[1][1] == "0") {
                firstElement = items_matrix[2][1];
                if (items_matrix[2][1] == "0") {
                    firstElement = items_matrix[3][1];
                    if (items_matrix[3][1] == "0")
                        firstElement = items_matrix[4][1];
                }
            }
        }
        //console.log("Line 2 First element: "+firstElement)
        for (let i = 1; i < 5; i++) {
            //console.log("Line 2 New Item: "+items_matrix[i][1])
            if (items_matrix[i][1] == firstElement || items_matrix[i][1] == '0')
                winningElement++
            else
                break;
        }
        //console.log("Line 2 Winning element: "+winningElement)
        if (winningElement > 2 && firstElement != "7") {
            document.getElementById("door_0_1").childNodes[1].childNodes[0].classList.add("act");
            document.getElementById("door_1_1").childNodes[1].childNodes[0].classList.add("act");
            document.getElementById("door_2_1").childNodes[1].childNodes[0].classList.add("act");
            if (winningElement > 3) {
                document.getElementById("door_3_1").childNodes[1].childNodes[0].classList.add("act");
                if (winningElement > 4)
                    document.getElementById("door_4_1").childNodes[1].childNodes[0].classList.add("act");
            }
            win(firstElement, winningElement, 2);
            window.setTimeout(deactivate_win, 1000);
            window.setTimeout(checkLine3, 1500, items_matrix);
        }
        else {
            window.setTimeout(checkLine3, 100, items_matrix);
        }
    }

    function checkLine3(items_matrix) {
        let winningElement = 1;
        let firstElement = items_matrix[0][2];


        if (items_matrix[0][2] == "0") {
            firstElement = items_matrix[1][2];
            if (items_matrix[1][2] == "0") {
                firstElement = items_matrix[2][2];
                if (items_matrix[2][2] == "0") {
                    firstElement = items_matrix[3][2];
                    if (items_matrix[3][2] == "0")
                        firstElement = items_matrix[4][2];
                }
            }
        }

        //console.log("Line 3 First element: "+firstElement)
        for (let i = 1; i < 5; i++) {
            //console.log("Line 3 New Item: "+items_matrix[i][2])
            if (items_matrix[i][2] == firstElement || items_matrix[i][2] == '0')
                winningElement++
            else
                break;
        }
        //console.log("Line 3 Winning element: "+winningElement)
        if (winningElement > 2 && firstElement != "7") {
            document.getElementById("door_0_2").childNodes[1].childNodes[0].classList.add("act");
            document.getElementById("door_1_2").childNodes[1].childNodes[0].classList.add("act");
            document.getElementById("door_2_2").childNodes[1].childNodes[0].classList.add("act");
            if (winningElement > 3) {
                document.getElementById("door_3_2").childNodes[1].childNodes[0].classList.add("act");
                if (winningElement > 4)
                    document.getElementById("door_4_2").childNodes[1].childNodes[0].classList.add("act");
            }
            win(firstElement, winningElement, 3);
            window.setTimeout(deactivate_win, 1000);
            window.setTimeout(checkLine4, 1500, items_matrix);
        }
        else {
            window.setTimeout(checkLine4, 100, items_matrix);
        }
    }

    function checkLine4(items_matrix) {
        let winningElement = 1;
        let firstElement = items_matrix[0][2];


        if (items_matrix[0][2] == "0") {
            firstElement = items_matrix[1][1];
            if (items_matrix[1][1] == "0") {
                firstElement = items_matrix[2][0];
                if (items_matrix[2][0] == "0") {
                    firstElement = items_matrix[3][1];
                    if (items_matrix[3][1] == "0")
                        firstElement = items_matrix[4][2];
                }
            }
        }

        //console.log("Line 4 First element: " + firstElement)

        if (items_matrix[1][1] == firstElement || items_matrix[1][1] == 0) {
            winningElement++;
            if (items_matrix[2][0] == firstElement || items_matrix[2][0] == 0) {
                winningElement++;
                if (items_matrix[3][1] == firstElement || items_matrix[3][1] == 0) {
                    winningElement++;
                    if (items_matrix[4][2] == firstElement || items_matrix[4][2] == 0) {
                        winningElement++;
                    }
                }
            }
        }

        //console.log("Line 4 Winning element: " + winningElement)
        if (winningElement > 2 && firstElement != "7") {
            document.getElementById("door_0_2").childNodes[1].childNodes[0].classList.add("act");
            document.getElementById("door_1_1").childNodes[1].childNodes[0].classList.add("act");
            document.getElementById("door_2_0").childNodes[1].childNodes[0].classList.add("act");
            if (winningElement > 3) {
                document.getElementById("door_3_1").childNodes[1].childNodes[0].classList.add("act");
                if (winningElement > 4)
                    document.getElementById("door_4_2").childNodes[1].childNodes[0].classList.add("act");
            }
            win(firstElement, winningElement, 4);
            window.setTimeout(deactivate_win, 1000);
            window.setTimeout(checkLine5, 1500, items_matrix);
        }
        else {
            window.setTimeout(checkLine5, 100, items_matrix);
        }
    }

    function checkLine5(items_matrix) {
        let winningElement = 1;
        let firstElement = items_matrix[0][0];

        if (items_matrix[0][0] == "0") {
            firstElement = items_matrix[1][1];
            if (items_matrix[1][1] == "0") {
                firstElement = items_matrix[2][2];
                if (items_matrix[2][2] == "0") {
                    firstElement = items_matrix[3][1];
                    if (items_matrix[3][1] == "0")
                        firstElement = items_matrix[4][0];
                }
            }
        }

        //console.log("Line 5 First element: "+firstElement)

        if (items_matrix[1][1] == firstElement || items_matrix[1][1] == 0) {
            winningElement++;
            if (items_matrix[2][2] == firstElement || items_matrix[2][2] == 0) {
                winningElement++;
                if (items_matrix[3][1] == firstElement || items_matrix[3][1] == 0) {
                    winningElement++;
                    if (items_matrix[4][0] == firstElement || items_matrix[4][0] == 0) {
                        winningElement++;
                    }
                }
            }
        }

        //console.log("Line 5 Winning element: "+winningElement)
        if (winningElement > 2 && firstElement != "7") {
            document.getElementById("door_0_0").childNodes[1].childNodes[0].classList.add("act");
            document.getElementById("door_1_1").childNodes[1].childNodes[0].classList.add("act");
            document.getElementById("door_2_2").childNodes[1].childNodes[0].classList.add("act");
            if (winningElement > 3) {
                document.getElementById("door_3_1").childNodes[1].childNodes[0].classList.add("act");
                if (winningElement > 4)
                    document.getElementById("door_4_0").childNodes[1].childNodes[0].classList.add("act");
            }
            win(firstElement, winningElement, 5);
            window.setTimeout(deactivate_win, 1000);
            window.setTimeout(checkLine6, 1500, items_matrix);
        }
        else {
            window.setTimeout(checkLine6, 100, items_matrix);
        }
    }

    function checkLine6(items_matrix) {
        let winningElement = 1;
        let firstElement = items_matrix[0][2];

        if (items_matrix[0][2] == "0") {
            firstElement = items_matrix[1][2];
            if (items_matrix[1][2] == "0") {
                firstElement = items_matrix[2][1];
                if (items_matrix[2][1] == "0") {
                    firstElement = items_matrix[3][0];
                    if (items_matrix[3][0] == "0")
                        firstElement = items_matrix[4][0];
                }
            }
        }

        //console.log("Line 6 First element: "+firstElement)

        if (items_matrix[1][2] == firstElement || items_matrix[1][2] == 0) {
            winningElement++;
            if (items_matrix[2][1] == firstElement || items_matrix[2][1] == 0) {
                winningElement++;
                if (items_matrix[3][0] == firstElement || items_matrix[3][0] == 0) {
                    winningElement++;
                    if (items_matrix[4][0] == firstElement || items_matrix[4][0] == 0) {
                        winningElement++;
                    }
                }
            }
        }

        //console.log("Line 4 Winning element: "+winningElement)
        if (winningElement > 2 && firstElement != "7") {
            document.getElementById("door_0_2").childNodes[1].childNodes[0].classList.add("act");
            document.getElementById("door_1_2").childNodes[1].childNodes[0].classList.add("act");
            document.getElementById("door_2_1").childNodes[1].childNodes[0].classList.add("act");
            if (winningElement > 3) {
                document.getElementById("door_3_0").childNodes[1].childNodes[0].classList.add("act");
                if (winningElement > 4)
                    document.getElementById("door_4_0").childNodes[1].childNodes[0].classList.add("act");
            }
            win(firstElement, winningElement, 6);
            window.setTimeout(deactivate_win, 1000);
            window.setTimeout(checkLine7, 1500, items_matrix);
        }
        else {
            window.setTimeout(checkLine7, 100, items_matrix);
        }
    }

    function checkLine7(items_matrix) {
        let winningElement = 1;
        let firstElement = items_matrix[0][0];


        if (items_matrix[0][0] == "0") {
            firstElement = items_matrix[1][0];
            if (items_matrix[1][0] == "0") {
                firstElement = items_matrix[2][1];
                if (items_matrix[2][1] == "0") {
                    firstElement = items_matrix[3][2];
                    if (items_matrix[3][2] == "0")
                        firstElement = items_matrix[4][2];
                }
            }
        }

        //console.log("Line 6 First element: "+firstElement)

        if (items_matrix[1][0] == firstElement || items_matrix[1][0] == 0) {
            winningElement++;
            if (items_matrix[2][1] == firstElement || items_matrix[2][1] == 0) {
                winningElement++;
                if (items_matrix[3][2] == firstElement || items_matrix[3][2] == 0) {
                    winningElement++;
                    if (items_matrix[4][2] == firstElement || items_matrix[4][2] == 0) {
                        winningElement++;
                    }
                }
            }
        }

        //console.log("Line 7 Winning element: "+winningElement)
        if (winningElement > 2 && firstElement != "7") {
            document.getElementById("door_0_0").childNodes[1].childNodes[0].classList.add("act");
            document.getElementById("door_1_0").childNodes[1].childNodes[0].classList.add("act");
            document.getElementById("door_2_1").childNodes[1].childNodes[0].classList.add("act");
            if (winningElement > 3) {
                document.getElementById("door_3_2").childNodes[1].childNodes[0].classList.add("act");
                if (winningElement > 4)
                    document.getElementById("door_4_2").childNodes[1].childNodes[0].classList.add("act");
            }
            win(firstElement, winningElement, 7);
            window.setTimeout(deactivate_win, 1000);
            window.setTimeout(checkLine8, 1500, items_matrix);
        }
        else {
            window.setTimeout(checkLine8, 100, items_matrix);
        }
    }

    function checkLine8(items_matrix) {
        let winningElement = 1;
        let firstElement = items_matrix[0][1];


        if (items_matrix[0][1] == "0") {
            firstElement = items_matrix[1][1];
            if (items_matrix[1][1] == "0") {
                firstElement = items_matrix[2][2];
                if (items_matrix[2][2] == "0") {
                    firstElement = items_matrix[3][1];
                    if (items_matrix[3][1] == "0")
                        firstElement = items_matrix[4][1];
                }
            }
        }

        //console.log("Line  First element: "+firstElement)

        if (items_matrix[1][1] == firstElement || items_matrix[1][1] == 0) {
            winningElement++;
            if (items_matrix[2][2] == firstElement || items_matrix[2][2] == 0) {
                winningElement++;
                if (items_matrix[3][1] == firstElement || items_matrix[3][1] == 0) {
                    winningElement++;
                    if (items_matrix[4][1] == firstElement || items_matrix[4][1] == 0) {
                        winningElement++;
                    }
                }
            }
        }

        //console.log("Line 8 Winning element: "+winningElement)
        if (winningElement > 2 && firstElement != "7") {
            document.getElementById("door_0_1").childNodes[1].childNodes[0].classList.add("act");
            document.getElementById("door_1_1").childNodes[1].childNodes[0].classList.add("act");
            document.getElementById("door_2_2").childNodes[1].childNodes[0].classList.add("act");
            if (winningElement > 3) {
                document.getElementById("door_3_1").childNodes[1].childNodes[0].classList.add("act");
                if (winningElement > 4)
                    document.getElementById("door_4_1").childNodes[1].childNodes[0].classList.add("act");
            }
            win(firstElement, winningElement, 8);
            window.setTimeout(deactivate_win, 1000);
            window.setTimeout(checkLine9, 1500, items_matrix);
        }
        else {
            window.setTimeout(checkLine9, 100, items_matrix);
        }
    }

    function checkLine9(items_matrix) {
        let winningElement = 1;
        let firstElement = items_matrix[0][1];


        if (items_matrix[0][1] == "0") {
            firstElement = items_matrix[1][1];
            if (items_matrix[1][1] == "0") {
                firstElement = items_matrix[2][0];
                if (items_matrix[2][0] == "0") {
                    firstElement = items_matrix[3][1];
                    if (items_matrix[3][1] == "0")
                        firstElement = items_matrix[4][1];
                }
            }
        }

        //console.log("Line  First element: "+firstElement)

        if (items_matrix[1][1] == firstElement || items_matrix[1][1] == 0) {
            winningElement++;
            if (items_matrix[2][0] == firstElement || items_matrix[2][0] == 0) {
                winningElement++;
                if (items_matrix[3][1] == firstElement || items_matrix[3][1] == 0) {
                    winningElement++;
                    if (items_matrix[4][1] == firstElement || items_matrix[4][1] == 0) {
                        winningElement++;
                    }
                }
            }
        }

        //console.log("Line 10 Winning element: "+winningElement)
        if (winningElement > 2 && firstElement != "7") {
            document.getElementById("door_0_1").childNodes[1].childNodes[0].classList.add("act");
            document.getElementById("door_1_1").childNodes[1].childNodes[0].classList.add("act");
            document.getElementById("door_2_0").childNodes[1].childNodes[0].classList.add("act");
            if (winningElement > 3) {
                document.getElementById("door_3_1").childNodes[1].childNodes[0].classList.add("act");
                if (winningElement > 4)
                    document.getElementById("door_4_1").childNodes[1].childNodes[0].classList.add("act");
            }
            win(firstElement, winningElement, 9);
            window.setTimeout(deactivate_win, 1000);
            window.setTimeout(checkLine10, 1500, items_matrix);
        }
        else {
            window.setTimeout(checkLine10, 100, items_matrix);
        }
    }

    function checkLine10(items_matrix) {
        let winningElement = 1;
        let firstElement = items_matrix[0][1];


        if (items_matrix[0][1] == "0") {
            firstElement = items_matrix[1][2];
            if (items_matrix[1][2] == "0") {
                firstElement = items_matrix[2][2];
                if (items_matrix[2][2] == "0") {
                    firstElement = items_matrix[3][2];
                    if (items_matrix[3][2] == "0")
                        firstElement = items_matrix[4][1];
                }
            }
        }

        //console.log("Line 10 First element: "+firstElement)

        if (items_matrix[1][2] == firstElement || items_matrix[1][2] == 0) {
            winningElement++;
            if (items_matrix[2][2] == firstElement || items_matrix[2][2] == 0) {
                winningElement++;
                if (items_matrix[3][2] == firstElement || items_matrix[3][2] == 0) {
                    winningElement++;
                    if (items_matrix[4][1] == firstElement || items_matrix[4][1] == 0) {
                        winningElement++;
                    }
                }
            }
        }

        //console.log("Line 10 Winning element: "+winningElement)
        if (winningElement > 2 && firstElement != "7") {
            document.getElementById("door_0_1").childNodes[1].childNodes[0].classList.add("act");
            document.getElementById("door_1_2").childNodes[1].childNodes[0].classList.add("act");
            document.getElementById("door_2_2").childNodes[1].childNodes[0].classList.add("act");
            if (winningElement > 3) {
                document.getElementById("door_3_2").childNodes[1].childNodes[0].classList.add("act");
                if (winningElement > 4)
                    document.getElementById("door_4_1").childNodes[1].childNodes[0].classList.add("act");
            }
            win(firstElement, winningElement, 10);
            window.setTimeout(deactivate_win, 1000);
            window.setTimeout(checkLine11, 1500, items_matrix);
        }
        else {
            window.setTimeout(checkLine11, 100, items_matrix);
        }
    }

    function checkLine11(items_matrix) {
        let winningElement = 1;
        let firstElement = items_matrix[0][1];


        if (items_matrix[0][1] == "0") {
            firstElement = items_matrix[1][0];
            if (items_matrix[1][0] == "0") {
                firstElement = items_matrix[2][0];
                if (items_matrix[2][0] == "0") {
                    firstElement = items_matrix[3][0];
                    if (items_matrix[3][0] == "0")
                        firstElement = items_matrix[4][1];
                }
            }
        }

        //console.log("Line  First element: "+firstElement)

        if (items_matrix[1][0] == firstElement || items_matrix[1][0] == 0) {
            winningElement++;
            if (items_matrix[2][0] == firstElement || items_matrix[2][0] == 0) {
                winningElement++;
                if (items_matrix[3][0] == firstElement || items_matrix[3][0] == 0) {
                    winningElement++;
                    if (items_matrix[4][1] == firstElement || items_matrix[4][1] == 0) {
                        winningElement++;
                    }
                }
            }
        }

        //console.log("Line 8 Winning element: "+winningElement)
        if (winningElement > 2 && firstElement != "7") {
            document.getElementById("door_0_1").childNodes[1].childNodes[0].classList.add("act");
            document.getElementById("door_1_0").childNodes[1].childNodes[0].classList.add("act");
            document.getElementById("door_2_0").childNodes[1].childNodes[0].classList.add("act");
            if (winningElement > 3) {
                document.getElementById("door_3_0").childNodes[1].childNodes[0].classList.add("act");
                if (winningElement > 4)
                    document.getElementById("door_4_1").childNodes[1].childNodes[0].classList.add("act");
            }
            win(firstElement, winningElement, 11);
            window.setTimeout(deactivate_win, 1000);
            window.setTimeout(checkScatter, 1500);
        }
        else {
            window.setTimeout(checkScatter, 100);
        }
    }
})();

