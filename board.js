class Board{
    ctx;
    well;
    piece;

    constructor(ctx){
        this.ctx = ctx;  
        this.getNewPiece();            
    }

    draw(){
        this.drawGridLines();
        this.piece.draw();
        this.piece.drawInNext(nextPiece);
        this.drawBoard();
    }

    drawGridLines(){
        for (let x = 0; x < wellColumns; x++) {
            for (let y = 0; y < wellRows; y++) {
                this.ctx.fillStyle="rgba(0,0,0,0.5)";
                this.ctx.fillRect(x*(singleBlockSize) ,y*(singleBlockSize) ,blockActualParam, blockActualParam);                                
            }            
        }
    }

    drawBoard(){        
        
        for (let x = 0; x < wellColumns; x++) {
            for (let y = 0; y < wellRows; y++) {
                if (well[y][x] > 0){
                    ctx.fillStyle = colors[well[y][x]];
                    ctx.fillRect(x*(singleBlockSize),y*(singleBlockSize), blockActualParam , blockActualParam);
                }
                
            }
            
        }
        this.isLineComplete();
        this.isGameFinished();
    }

    getNewPiece(){
        if(!nextPiece){
            currentPiece = new Piece(this.ctx);
            nextPiece = new Piece(this.ctx);
            this.piece = currentPiece;
        }else{
            currentPiece = nextPiece
            this.piece = currentPiece;
            nextPiece = new Piece(this.ctx);;
        }
        
    }

    getEmptyBoard(){
        return Array.from({length: wellRows}, ()=> Array(wellColumns).fill(0) )
    }

    isLineComplete(){        

        let lines = []
        for (let x = 0; x < wellRows; x++) {
            let isComp = true;
            for (let y = 0; y < wellColumns; y++) {
                if (well[x][y] == 0){
                    isComp = false;
                    // console.log(`${x}: false`);
                }
            }
            if(isComp)lines.push(x);            
        }

        //will only enter inside if a line is cleared        
        if(lines.length>0) {
            
            totalLinesCleared++;    
            for(let k=0; k<lines.length;k++){
                well.splice(lines[k],1);                
                well.unshift(Array(wellColumns).fill(0));
            }    

            //audio
            // if(lines.length==4){
            //     audio_fourlines.currentTime=0
            //     audio_fourlines.play()
            // }else{
            //     //play oneline one
            //     audio_oneline.currentTime=0
            //     audio_oneline.play()
            // }


            //when a tetris is made
            if(lines.length==4){
                score.textContent = parseInt(score.textContent)+ fixedScores[4];
                tetrisCount++;    
                if(tetrisCount==levelTargets.level1.tcount && currentLevel==1){
                    gameSpeed=levels[1];
                    levelElement.textContent = parseInt(levelElement.textContent) + 1;
                    currentLevel++;    levelIncreased=true;
                }
                if(tetrisCount==levelTargets.level2.tcount && currentLevel==2){
                    gameSpeed=levels[2];
                    levelElement.textContent = parseInt(levelElement.textContent) + 1;  
                    currentLevel++;  levelIncreased=true;
                }
                if(tetrisCount==levelTargets.level3.tcount && currentLevel==3){
                    gameSpeed=levels[3];
                    levelElement.textContent = parseInt(levelElement.textContent) + 1;    
                    currentLevel++;levelIncreased=true;
                }

            }else{//increase score
                score.textContent = parseInt(score.textContent)+ fixedScores[lines.length];
            }                                                

            //changing level based on score
            let intScore = parseInt(score.textContent);
            if(intScore>=levelTargets.level1.score && currentLevel==1){
                gameSpeed=levels[1];
                levelElement.textContent = parseInt(levelElement.textContent) + 1;
                currentLevel++;levelIncreased=true;

            }
            if(intScore>=levelTargets.level2.score && currentLevel==2){
                gameSpeed=levels[2];
                levelElement.textContent = parseInt(levelElement.textContent) + 1;  
                currentLevel++;  levelIncreased=true;
            }
            if(intScore>=levelTargets.level3.score && currentLevel==3){
                gameSpeed=levels[3];
                levelElement.textContent = parseInt(levelElement.textContent) + 1;    
                currentLevel++;levelIncreased=true;
            }

            //game won
            if((tetrisCount>=levelTargets.level4.tcount || parseInt(score.textContent)>=levelTargets.level4.score) && currentLevel==4){            
                isGameWon=true;
            }

    };
        return 1
    }


    rotate(piece) {
        // Clone with JSON for immutability.
        let p = JSON.parse(JSON.stringify(piece));
    
        // Transpose matrix
        for (let y = 0; y < p.shape.length; ++y) {
          for (let x = 0; x < y; ++x) {
            [p.shape[x][y], p.shape[y][x]] = [p.shape[y][x], p.shape[x][y]];
          }
        }

        // Reverse the order of the columns.
    p.shape.forEach(row => row.reverse());
    return p;
  }

    isGameFinished(){
        let sum;
        sum = well[1].reduce((a, b) => a + b, 0);        
        if(sum>0){
            isGameOver=true;  
        }
    }
}