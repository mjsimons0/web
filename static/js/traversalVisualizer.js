function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// We must create node objects, all contained in a graph assigning each node a number, linearly, as to maintain their ordering.
let traversal="conv_funnel"
let graph = []
let numbToNodeObject = {}
let numbToElement = {}
let currentNumb=1



function coords(number) {
  // Validate input
  if (number < 1 || number > 1352) {
    throw new Error("Invalid number. Please enter a number between 1 and 1653.");
  }

  // Calculate row and column
  const row = Math.ceil(number / 52) - 1;
  const column = (number - 1) % 52;

  // Calculate y coordinate (row)
  const y = row;

  // Calculate x coordinate (column)
  const x = column;

  return { x, y };
}
// Create all node objects, assigning them numbers and adding them to the graph
function buildGraph() {
    const nodeElements = document.getElementsByTagName("td")
	let curr = 0
    for (let element of nodeElements) {
        nodeElements.item(currentNumb-1).id=currentNumb
        if (currentNumb > 1352) {
            break
        }
        let nodeObject = {}
        nodeObject["value"] = currentNumb
        nodeObject["element"] = element
        nodeObject["adjList"] = []
        nodeObject["wall"] = false
        graph.push(nodeObject)
        numbToNodeObject[currentNumb] = nodeObject
        numbToElement[currentNumb] = element
        currentNumb += 1
		document.getElementsByTagName("td").item(curr).style.backgroundColor="#7886a0"
        curr+=1
    }
// Now we must build each node's adjList
    for (let node of graph) { 
        // If the node's value is > 0 and < 53 it will not have a top node
        if (!(node["value"] > 0 && node["value"] < 53)) {
            node["adjList"].push(numbToNodeObject[node["value"] - 52])
        }
        // If the node's value is 1143 > and < 1197 it will not have a bottom node
        if (!(node["value"] >= 1301 && node["value"] <= 1353)) {
            node["adjList"].push(numbToNodeObject[node["value"] + 52])
        }
        // If the node's value is 1 OR (value-1%52)==0 it will not have a left node
        if (!(node["value"] === 1 || (node["value"]-1)% 52 === 0)) {
            node["adjList"].push(numbToNodeObject[node["value"] - 1])
        }
        // If the node's value is %52==0 it will not have a right node
        if (!(node["value"] % 52 === 0)) {
            node["adjList"].push(numbToNodeObject[node["value"] + 1])
        }
    }
}
// onClick function to select nodes
let startNodeSelected=false
let startNode
let finding = false
function clearGraph(){
    startNodeSelected = false;
    finding = false;

    let curr = 0;
    for (let element of document.getElementsByTagName("td")) {
        document.getElementsByTagName("td").item(curr).style.backgroundColor = "#7886A0";
        curr += 1;
    }

    // Reset all node properties for each node
    for (let node of graph) {
        node.wall = false;
        node.prev = null;       // Reset previous node
        node.visited = false;    // Reset visited status
        node.cost = Infinity;    // Reset cost for pathfinding algorithms
    }
}
let tracking = false;
let mode="PathFind"
let kstr = '<span class="relative group ml-0"><i class="fa fa-info-circle text-blue-300 hover:text-blue-400"></i><!-- Tooltip --><span class="absolute hidden group-hover:block w-48 bg-gray-700 text-white text-xs rounded p-2 mt-1"><b>Time Complexity<br></b> A measure of the time an algorithm takes to execute as a function of the input size. We express this in <b>Big O notation</b>, which represents the upper bound of the operational growth rate.<br><br><b>Graph Theory Notation</b><br><b>V</b> = # of Vertices (nodes).<br><b>E</b> = # of Edges (connections).<br><b>b</b> =  The branching factor.<br><b>d</b> =  Depth of search.</span></span>';
function switchAlg(direction) {
    if (!finding) {
        const algorithms = ["conv_funnel","bfs", "dfs","dijkstra", "astar","bdbfs"];
        let currentIndex = algorithms.indexOf(traversal);

        if (direction === 'right') {
            currentIndex = (currentIndex + 1) % algorithms.length;  // Cycle forward
        } else if (direction === 'left') {
            currentIndex = (currentIndex - 1 + algorithms.length) % algorithms.length;  // Cycle backward
        }

        traversal = algorithms[currentIndex];

        // Update algorithm description based on the selected algorithm
        if (traversal === "bfs") {
            document.getElementById("alg_description").innerHTML = "<b>Breadth-First Search (BFS):</b><br> A fundamental algorithm used to traverse and search tree and graph structures by exploring all nodes at the current depth before moving to the next level. BFS uses a queue to track the nodes yet to be visited, ensuring level-by-level exploration and guaranteeing the shortest path in an unweighted graph. BFS has a worst-case time complexity <b>O(V + E)</b> " + kstr + ", and is commonly used in applications involving web crawlers and social network analysis.";
			document.getElementById('alg').innerHTML = "Switch Algorithm (2/6)";
        } else if (traversal === "dfs") {
            document.getElementById("alg_description").innerHTML = "<b>Depth-First Search (DFS):</b><br> A fundamental algorithm used to traverse and search tree and graph structures by exploring as far as possible along each branch before backtracking to previous nodes. DFS uses a stack (either explicit or via recursion) to track the nodes, focusing on deep exploration before visiting other branches. DFS has a worst-case time complexity <b>O(V + E)</b> " + kstr + ". While it does not guarantee the shortest path, it may be used in applications involving topological sorting and puzzle-solving.";
			document.getElementById('alg').innerHTML = "Switch Algorithm (3/6)";
        } else if (traversal === "dijkstra") {
            document.getElementById("alg_description").innerHTML = "<b>Dijkstra's Algorithm:</b><br> A greedy search algorithm used to find the shortest path from a source node to all other nodes in any graph with non-negative edge weights. A priority queue is utilized to explore the least costly paths first, ensuring that each node's shortest path is discovered with a worst-case time complexity <br><b>O((V + E) log V)</b> " + kstr + ". E.W. Dijkstra is widely known as the father of pathfinding, and his algorithm is common in in network routing, mapping services, along with many other applications involving pathfinding in weighted graphs.";
			document.getElementById('alg').innerHTML = "Switch Algorithm (4/6)";
        } else if (traversal === "astar") {
            document.getElementById("alg_description").innerHTML = "<b>A<sup>*</sup> Search:</b><br> An informed search algorithm extending Dijkstra's with a heuristic function, in this case estimating the Manhattan Distance from a node to the target. A priority queue is utilized, prioritizing nodes with the lowest estimated total cost. This algorithm has a worst-case time complexity <br><b>O(b<sup>d</sup>)</b> " + kstr + ". Despite its exponential complexity, A<sup>*</sup> is arguably the most significant search algorithm in modern times, as it often out-performs other algorithms due to their lack of heuristic guidance. It is widely used in applications involving pathfinding, game AI, and robotics.";
			document.getElementById('alg').innerHTML = "Switch Algorithm (5/6)";
        }
		else if (traversal == "conv_funnel") {
			  document.getElementById("alg_description").innerHTML = "<b>Bisective Funnel Search:</b><br> An algorithm that I co-developed with my good friend, Sean Grzenda. Our motivation was in designing a practical search algorithm that is bisective in nature, yet fully connected. The algorithm is essentially a mixture of Dijkstra's and A*. Each node's distance from the start node is considered while taking into account the estimated distance from the target node. This effectively bisects the search space into two regions, often resulting in the resemblance of a funnel situated around the optimal path. Given that the algorithm extends <b>A<sup>*</sup></b> with an additional constant-time heuristic from Dijkstra's, the worst-case time complexity is <b>O((V + E) log V)</b>" + kstr + "."
			document.getElementById('alg').innerHTML = "Switch Algorithm (1/6)";
		}
		else if (traversal == "bdbfs") {
			  document.getElementById("alg_description").innerHTML = "<b>Bidirectional BFS:</b><br> <b>(needs implementation)</b><br> A specialized algorithm that optimizes the traditional BFS by conducting two simultaneous searches: one from the start node and one from the target node. Both searches proceed in a breadth-first manner and meet in the middle, significantly reducing the number of nodes explored. The worst-case time complexity is <b>O(b<sup>d/2</sup>)</b> " + kstr + ". This algorithm is particularly effective for pathfinding in large unweighted graphs."
			document.getElementById('alg').innerHTML = "Switch Algorithm (6/6)";
		}
    }
}


function pathMode(){
    mode="PathFind"
    document.getElementById("mode").innerHTML="Path Find"
}
function buildMode(){
    if (startNodeSelected){startNode.element.style.backgroundColor="#5f6d86";startNodeSelected=false}
    mode="BuildMaze"
    document.getElementById("mode").innerHTML="BuildMaze"
}
async function generateMaze(){
    finding=false
    await sleep(1)
    clearGraph()
    for(let node of graph){
        if (Math.random()>.671){
            node["wall"]=true
            node.element.style.backgroundColor="#303843"
			if (Math.random()>.7855){
			await sleep(1)
			}
        }
    }
}

function tileClicked(HTMLelement){
    if(mode==="PathFind" && !finding && !tracking) {
        if (!finding&&!(numbToNodeObject[parseInt(HTMLelement.id)].wall)) {
            console.log(HTMLelement)
            HTMLelement.style.backgroundColor = "red"
            //If the first node is not selected, assign startNode and
            if (!startNodeSelected) {
                startNode = numbToNodeObject[parseInt(HTMLelement.id)]
                startNodeSelected = true
				for (let n of graph) {
					if (!n["wall"] && n['element']!=HTMLelement){
						n['element'].style.backgroundColor = "#7886A0";
					}
				}
            } else {
				if (startNode['value'] != HTMLelement.id){
                pathFind(startNode, numbToNodeObject[parseInt(HTMLelement.id)])
                startNodeSelected = false
				}
            }
        }
    }
    else if(mode==="BuildMaze"){
        //if it's already a wall, undo it.
        if (numbToNodeObject[parseInt(HTMLelement.id)]["wall"]){
            numbToNodeObject[parseInt(HTMLelement.id)].wall=false
            HTMLelement.style.backgroundColor="#5f6d86"
        }
        //if not, make it a wall.
        else{
            numbToNodeObject[parseInt(HTMLelement.id)]["wall"]=true
            HTMLelement.style.backgroundColor="#303843"
        }
    }
}


let speed = 20
function adjustSpeed(value){
    speed=140 -value
}


async function pathFind(start, target) {
    console.log(start, target);
    if (start === target) return [start];
    finding = true;

    // Function to reset node properties
    function resetNodeProperties() {
        graph.forEach(node => {
            node["cost"] = Infinity;
            node["prev"] = null;
            node["visited"] = false;
        });
        start["cost"] = 0;
        target["cost"] = 0;
    }

    // Function to backtrack and highlight the path
    async function backtrackPath(node) {
		tracking = true;
		function resetNonPathNodes() {
			graph.forEach(node => {
				if (!node["onFinalPath"] && node !== start && node !== target) {
					node.element.style.backgroundColor = "#79899f"; // Reset to neutral color
				}
			});
		}

        let path = [node];
        while (node["prev"] != null) {
            if (node !== target && node !== start) {
                node.element.style.backgroundColor = "#ff8080";
            }
            await sleep(speed * 0.825);
            path.unshift(node["prev"]);
            node = node["prev"];
        }
        node.element.style.backgroundColor = "#ff3434";
		tracking = false;
        return path;
    }

    // Function for BFS exploration
    async function bfsExplore(queue, visited, targetNode) {
        while (queue.length > 0 && finding) {
            let currentNode = queue.shift();
            if (currentNode !== start) {
                currentNode.element.style.backgroundColor = "#4e6c98";
            }
            await sleep(0.607 * speed);
            if (currentNode === targetNode) {
                finding = false;
                return backtrackPath(currentNode); // Backtrack immediately once the target is found
            }
            for (let neighbor of currentNode["adjList"]) {
                if (!neighbor["wall"] && !neighbor["visited"]) {
                    neighbor["prev"] = currentNode;
                    neighbor["visited"] = true;
                    queue.push(neighbor);
                    neighbor.element.style.backgroundColor = "#5778a9";
                    await sleep(0.1 * speed);
                }
            }
        }
        return null; // No path found
    }

    // Convergent funnel algorithm implementation:
    if (traversal === "conv_funnel") {
        resetNodeProperties();
        
        let openSet = new MinHeap();
        openSet.insert(start, 0);

        let gScore = new Map();
        let fScore = new Map();
		let explored = [];
        gScore.set(start, 0);
        gScore.set(target, 0);
        fScore.set(start, manhattanDistance(start, target));
        fScore.set(target, manhattanDistance(target, start));

        while (!openSet.isEmpty() && finding) {
            let current = openSet.extractMin();

            if (current !== start && current !== target) {
                current.element.style.backgroundColor = "#4e6c98"; // Visited nodes color
            }

            await sleep(0.334 * speed);

            if (current === target) {
                finding = false;
                // Highlight the start and target nodes in red
                start.element.style.backgroundColor = "#ff3434";
                target.element.style.backgroundColor = "#ff3434";
                // Backtrack to highlight the path
                return backtrackPath(current);
            }
			
            for (let neighbor of current.adjList) {
				if (!neighbor.wall && !neighbor.visited && neighbor!=start) {
					neighbor['visited'] = true;
                    let tentativeGScore = gScore.get(current) + 1;

                    if (tentativeGScore < (gScore.get(neighbor) || Infinity)) {
                        neighbor.prev = current;
                        gScore.set(neighbor, tentativeGScore);
                        let heuristic = manhattanDistance(neighbor, target);
                        let funnelCost = tentativeGScore + heuristic;

                        if (funnelCost < (fScore.get(neighbor) || Infinity)) {
                            fScore.set(neighbor, funnelCost);
                            openSet.insert(neighbor, funnelCost);
                        }
                        else if (neighbor !== target & neighbor!== start) {
                            neighbor.element.style.backgroundColor = "#5778a9"; // Node in the queue
                        }
						else if (neighbor == target) {
							finding = false;
							return backtrackPath(neighbor);
						}
                        await sleep(0.1 * speed);
                    }
                }
            }
        }

        // If no path is found, reset the graph colors
        start.element.style.backgroundColor = "#ff3434"; // Ensure start remains red
        target.element.style.backgroundColor = "#ff3434"; // Ensure target remains red
        graph.forEach(node => node.element.style.backgroundColor = "#79899f");
        finding = false;
        return null; // No path found
    }


    // Other algorithms: Dijkstra, A*, BFS, DFS
    else {
        resetNodeProperties();
        let toExplore = [];
        let visited = new Set();

        start["cost"] = 0;
        toExplore.push(start);
        visited.add(start);

        // Initialize priority queue for Dijkstra and A*
        let minHeap = null;
        if (traversal === "dijkstra" || traversal === "astar") {
            minHeap = new MinHeap();
            minHeap.insert(start, 0);
        }

        // Initialize minIndex only for BFS or DFS
        let minIndex = 0;

        while ((toExplore.length > 0 || (minHeap && !minHeap.isEmpty())) && finding) {
            let nodeToExplore;
            if (traversal === "dijkstra" || traversal === "astar") {
                nodeToExplore = minHeap.extractMin();
            } else {
                nodeToExplore = toExplore.splice(minIndex, 1)[0];
            }
            if (nodeToExplore !== start) {
                nodeToExplore.element.style.backgroundColor = "#4e6c98";
            }
            await sleep(0.607 * speed);

            for (let node of nodeToExplore["adjList"]) {
                if (!visited.has(node) && !node["wall"]) {
                    node["prev"] = nodeToExplore;

                    // If the target node is reached, backtrack to construct the path
                    if (node === target) {
                        finding = false;  // Stop exploration
                        return backtrackPath(node);  // Backtrack immediately after finding the path
                    }

                    let newCost = nodeToExplore["cost"] + (node["isSpecialNode"] ? 3 : 1);

                    if (traversal === "bfs") {
                        toExplore.push(node);
                    } else if (traversal === "dfs") {
                        toExplore.unshift(node);
                    } else if (traversal === "dijkstra") {
                        if (newCost < node["cost"]) {
                            node["cost"] = newCost;
                            minHeap.insert(node, newCost);
                        }
                    } else if (traversal === "astar") {
                        let heuristic = manhattanDistance(node, target);
                        let totalCost = newCost + heuristic;
                        if (totalCost < node["cost"]) {
                            node["cost"] = totalCost;
                            minHeap.insert(node, totalCost);
                        }
                    }

                    node.element.style.backgroundColor = "#79899f";
                    visited.add(node);
                }
            }

            // Get the minimum cost node for BFS/DFS only
            if (traversal === "bfs" || traversal === "dfs") {
                minIndex = toExplore.reduce((minIdx, node, idx) =>
                    node["cost"] < toExplore[minIdx]["cost"] ? idx : minIdx, 0);
            }
        }
        // Reset graph if no path is found
        start.element.style.backgroundColor = "#79899f";
        target.element.style.backgroundColor = "#79899f";
        if (finding) {
            for (let nodeObj of visited) {
                nodeObj.element.style.backgroundColor = "#79899f";
                await sleep(0.09 * speed);
            }
        }
        finding = false;
        return null; // No path found
    }
}



// Heuristic for A* (Manhattan Distance)
function manhattanDistance(node, target) {
    let nodeCoords = coords(node.value);
    let targetCoords = coords(target.value);
    return Math.abs(nodeCoords.x - targetCoords.x) + Math.abs(nodeCoords.y - targetCoords.y);
}


// Helper functions for Dijkstra's (Min-heap implementation)
function MinHeap() {
    this.heap = [];
}

MinHeap.prototype.insert = function(node, cost) {
    this.heap.push({ node: node, cost: cost });
    this.heapifyUp(this.heap.length - 1);
};

MinHeap.prototype.extractMin = function() {
    if (this.heap.length === 0) return null;

    let min = this.heap[0];
    this.heap[0] = this.heap[this.heap.length - 1]; // Swap min with last element
    this.heap.pop(); // Remove last element
    this.heapifyDown(0);
    return min.node;
};

MinHeap.prototype.isEmpty = function() {
    return this.heap.length === 0;
};

MinHeap.prototype.heapifyUp = function(index) {
    while (index > 0) {
        let parentIndex = Math.floor((index - 1) / 2);
        if (this.heap[index].cost < this.heap[parentIndex].cost) {
            [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]]; // Swap
            index = parentIndex;
        } else {
            break;
        }
    }
};

MinHeap.prototype.heapifyDown = function(index) {
    while (index < this.heap.length) {
        let leftChildIndex = 2 * index + 1;
        let rightChildIndex = 2 * index + 2;
        let smallestChildIndex = index;

        if (leftChildIndex < this.heap.length && this.heap[leftChildIndex].cost < this.heap[smallestChildIndex].cost) {
            smallestChildIndex = leftChildIndex;
        }
        if (rightChildIndex < this.heap.length && this.heap[rightChildIndex].cost < this.heap[smallestChildIndex].cost) {
            smallestChildIndex = rightChildIndex;
        }

        if (smallestChildIndex !== index) {
            [this.heap[index], this.heap[smallestChildIndex]] = [this.heap[smallestChildIndex], this.heap[index]];
            index = smallestChildIndex;
        } else {
            break;
        }
    }
};