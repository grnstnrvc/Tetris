const singleBlockSize = 22;
const blockActualParam = 20;
const wellColumns = 10;
const wellRows = 22;
var well ;
var isGameOver=false;
var frameCount=0;
let downFC=0;
var score=0;
const intialSpeed=65;
var gameSpeed = intialSpeed;
var isGameWon=false;
var totalLinesCleared =0;
var currentPiece = null;
var nextPiece = null;
var tetrisCount = 0;
var currentLevel=1;
var levelIncreased = true;
var generatedBlocksCount = 0;

//  I J L O S T Z
const shapes = [ 
    [],
    [ [1,1,1,1],[0,0,0,0],[0,0,0,0],[0,0,0,0] ],
    [ [2,0,0],[2,2,2],[0,0,0]],
    [ [0,0,3],[3,3,3],[0,0,0]],
    [ [4,4],[4,4]],
    [ [0,5,5],[5,5,0],[0,0,0]],
    [ [6,6,6],[0,6,0],[0,0,0]] ,
    [ [7,7,0],[0,7,7],[0,0,0]]    
];

const fixedScores = [
    0,
    40,
    100,
    300,
    1200
];

const levels = [
    0,
    gameSpeed-20,
    gameSpeed-33,
    gameSpeed-45,
]

const levelTargets= {
    level1:{tcount: 1,  score:1* fixedScores[4]},
    level2:{tcount: 3,  score:3* fixedScores[4]},
    level3:{tcount: 6,  score:6* fixedScores[4]},
    level4:{tcount: 10, score:10*fixedScores[4]}
}

const colors =[
    'none',
    'cyan',
    'blue',
    'orange',
    'yellow',
    'green',
    'purple',
    'red'
];



class Piece{
    x;
    y;
    color;
    shape;
    ctx;
    id;
    rBottom;

    constructor(ctx){
        this.ctx = ctx;
        this.spawn();
        this.x=3;
        this.y=0; 
        this.rBottom = 0;
    }

    spawn(){
        this.id = this.generateRandom(colors.length - 1);
        this.shape = shapes[this.id];
        this.color = colors[this.id]
    }

    draw(){
        // console.table(this.shape);
        this.ctx.fillStyle = this.color;        
        this.shape.forEach((row, y) => {
            row.forEach((value,x) => {
                if(value > 0){
                    //well[y][x]=value;                    
                    ctx.fillRect(this.x*(singleBlockSize) + x*(singleBlockSize),this.y*(singleBlockSize) + y*(singleBlockSize),blockActualParam, blockActualParam);
                }
            })
        });
    }

    drawInNext(Piece){
        let offset=singleBlockSize*2
        let offsetY=singleBlockSize*1
        nextCtx.clearRect(0,0,nextCanvas.width,nextCanvas.height)
        nextCtx.fillStyle = Piece.color;        
        Piece.shape.forEach((row, y) => {
            row.forEach((value,x) => {
                if(value > 0){
                    //well[y][x]=value;                    
                    nextCtx.fillRect(offset+ x*(singleBlockSize) ,offsetY+ y*(singleBlockSize) ,blockActualParam, blockActualParam);
                }
            })
        });
    }

    move(p){        
        // console.table(p.shape)
        if(this.validLR(p)){
            if(this.validLRPieces(p)){
                // console.log('inside');
                this.x = p.x;
                this.y = p.y;
                this.shape = p.shape;
                return true;
            }        
        }        
        return false;
    }

    generateRandom(max){
        generatedBlocksCount++;
        if(generatedBlocksCount%20==0) return 1;
        return Math.floor(Math.random()*max + 1)
    }

    validLR(p){                

        let leftX, rightX=0, leftY=-1;
        for(let col=0;col<p.shape[0].length;col++){
            let sum=0;
            for(let row = 0; row<p.shape.length; row++){
                sum += p.shape[row][col];
                if(p.shape[row][col]>0 && leftY<0) leftY=row;
            }
            if(sum>0){
                leftX = col;                
                break                
            }          
        }
        for(let col=p.shape[0].length-1;col>=0;col--){
            let sum=0;
            for(let row = 0; row<p.shape.length; row++){
                sum += p.shape[row][col];
            }
            if(sum>0){
                rightX++;                              
            }          
        }
          
        if(p.x + leftX < 0 || p.x + leftX + rightX > wellColumns) return false;        
        return true;
    }

    validLRPieces(p){
        let leftPoints=[];
        let rightPoints=[];
        for(let row =0; row<p.shape.length; row++){
            for(let col=0; col<p.shape[row].length;col++){
                if(p.shape[row][col]>0){
                    leftPoints.push([p.x+col,p.y+row])
                    break;
                }
            }
        }
        for(let row =0; row<p.shape.length; row++){
            for(let col=p.shape[row].length-1; col>=0;col--){
                if(p.shape[row][col]>0){
                    rightPoints.push([p.x+col,p.y+row])
                    break;
                }
            }
        }

        for (const item of leftPoints) {            
            if(well[item[1]][item[0]]>0){                
                return false
            }
        }
        for (const item of rightPoints) {            
            if(well[item[1]][item[0]]>0){
                return false
            }
        }
        // console.log(p.x,p.y);
         //console.table(leftPoints);
        return true;
    }

    reachedBottom(p){
        
        for (let i = p.shape.length-1; i >=0 ; i--) {
            const element = p.shape[i];
            const sum = element.reduce((a, b) => a + b, 0)
            if(sum > 0){
                if(p.y+i+1 >= wellRows){                    
                    //this.freeze(p);
                    // console.table(well)
                    return 1;
                }

                let currentY;
                currentY = p.y + i;
                for(let k =0; k<element.length;k++){
                    if(element[k] > 0){
                        if(well[currentY+1][p.x +k]>0){
                        //this.freeze(p);                        
                        return 1;
                    }
                    }
                    
                }              
                
            }
        }
        return 0;

        // for (let y = 0; y < p.shape.length; y++) {
        //     const row = p.shape[y];
        //     for (let x = 0; x < row.length; x++) {
        //         const item = p.shape[y][x];
        //             if(item > 0){
        //                 if(p.y>=15){
        //                     this.freeze(p)
        //                     return 1;
        //                 }
        //             }
        //     }            
        // }
        // return 0;
    }

    reachedEnd(p){        
        if(p.y == 12){
            console.log('reached end');
            this.freeze(p);
            return true
        }
    }



    freeze(p){        
        p.shape.forEach((row, y) => {
            row.forEach((value,x) => {
                if(value > 0){
                    well[p.y + y][p.x + x]=value;                                        
                }
            })
        });
    }

}