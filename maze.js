let currentNode; let destination; let myMaze; let mySize;
let canvas = document.getElementById('maze-canvas'); let ctx = canvas.getContext("2d");
canvas.style.background = "black";

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('maze-button').addEventListener('click', () => {
        generateMaze();    
    });
    document.getElementById('clear-button').addEventListener('click', () => {
        clear();    
    });
});

class Node {
  constructor(rowNum, colNum, mazeGrid) {
    this.rowNum = rowNum;
    this.colNum = colNum;
    this.mazeGrid = mazeGrid;
    this.visited = false;
    this.nodeBorders = { tw: true, bw: true, lw: true, rw: true };
  }

  isNeighbor() {
    let row = this.rowNum; let col = this.colNum; 
    let arrMaze = this.mazeGrid;
    let top, bottom, left, right; let nearbyNeighbors = [];
    if (row !== 0) top = arrMaze[row - 1][col];
    else top = undefined;
    if (row !== arrMaze.length - 1) bottom = arrMaze[row + 1][col];
    else bottom = undefined;
    if (col !== 0) left = arrMaze[row][col - 1];
    else left = undefined;
    if (col !== arrMaze.length - 1) right = arrMaze[row][col + 1];
    else right = undefined;
    if (top && !top.visited) nearbyNeighbors.push(top);
    if (bottom && !bottom.visited) nearbyNeighbors.push(bottom);
    if (left && !left.visited) nearbyNeighbors.push(left);
    if (right && !right.visited) nearbyNeighbors.push(right);
    if (nearbyNeighbors.length !== 0) return nearbyNeighbors[Math.floor(Math.random() * nearbyNeighbors.length)];
    else return undefined;
  }

  rmBorder(firstNode, secondNode) {
    let x = firstNode.colNum - secondNode.colNum;
    if (x === 1) {
      firstNode.nodeBorders.lw = false; secondNode.nodeBorders.rw = false;
    } else if (x === -1) {
      firstNode.nodeBorders.rw = false; secondNode.nodeBorders.lw = false;
    }
    let y = firstNode.rowNum - secondNode.rowNum;
    if (y === 1) {
      firstNode.nodeBorders.tw = false; secondNode.nodeBorders.bw = false;
    } 
    else if (y === -1) {
      firstNode.nodeBorders.bw = false; secondNode.nodeBorders.tw = false;
    }
  }

  drawTW(x, y, columns) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 675 / columns, y);
    ctx.stroke();
  }

  drawBW(x, y, columns, rows) {
    ctx.beginPath();
    ctx.moveTo(x, y + 675 / rows);
    ctx.lineTo(x + 675 / columns, y + 675 / rows);
    ctx.stroke();
  }

  drawLW(x, y, rows) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + 675 / rows);
    ctx.stroke();
  }

  drawRW(x, y, columns, rows) {
    ctx.beginPath();
    ctx.moveTo(x + 675 / columns, y);
    ctx.lineTo(x + 675 / columns, y + 675 / rows);
    ctx.stroke();
  }

  tip(columns) {
    ctx.fillStyle = "pink"; 
    ctx.fillRect((this.colNum * 675) / columns, (this.rowNum * 675) / columns, 675 / columns, 675 / columns);
  }

  viewNode(rows, columns) {
    let x = (this.colNum * 675) / columns; let y = (this.rowNum * 675) / rows;
    ctx.fillStyle = "black"; ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 2;
    if (this.nodeBorders.tw)  
      this.drawTW(x, y, columns);
    if (this.nodeBorders.bw) 
      this.drawBW(x, y, columns, rows);
    if (this.nodeBorders.lw) 
      this.drawLW(x, y, rows);
    if (this.nodeBorders.rw) 
      this.drawRW(x, y, columns, rows);
    if (this.visited)
      ctx.fillRect(x, y, 675 / columns, 675 / rows);
  }
}

class Maze {
  constructor(amount) {
    this.amount = amount;
    this.mazeArray = [];
    this.mazeStack = [];
  }

  createNodes() {
    for (let r = 0; r < this.amount; r++) {
      let mazeRow = [];
      for (let c = 0; c < this.amount; c++) {
        let nd = new Node(r, c, this.mazeArray);
        mazeRow.push(nd);
      }
      this.mazeArray.push(mazeRow);
    }
    currentNode = this.mazeArray[0][0];
  }

  draw() {
    currentNode.visited = true;
    for (let r = 0; r < this.amount; r++) {
      for (let c = 0; c < this.amount; c++) {
        let mazeArray = this.mazeArray;
        mazeArray[r][c].viewNode(this.amount, this.amount);
      }
    }
    let otherNode = currentNode.isNeighbor();
    if (otherNode) {
      otherNode.visited = true;
      this.mazeStack.push(currentNode);
      currentNode.tip(this.amount);
      currentNode.rmBorder(currentNode, otherNode);
      currentNode = otherNode;
    } 
    else if (this.mazeStack.length > 0) {
      currentNode = this.mazeStack.pop();
      currentNode.tip(this.amount);
    }
    if (this.mazeStack.length === 0) {
      return;
    }
    window.requestAnimationFrame(() => {
      this.draw();
    });
  }
}
  
function generateMaze() {
  let amount = document.getElementById('dimension').value;
  if(amount < 4 || amount == null){
    alert('Please insert a valid input');
  }
  else {
    amount = parseInt(amount); 
    myMaze = new Maze(amount);
    myMaze.createNodes();
    myMaze.draw();
    document.getElementById("clear-button").disabled = false;
    document.getElementById("maze-button").disabled = true;
  }
}

function clear() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  document.getElementById("clear-button").disabled = true;
  document.getElementById("maze-button").disabled = false;
}
