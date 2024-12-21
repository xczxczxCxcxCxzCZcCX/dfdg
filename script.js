const citiesList = [];
const costList = [];
const coordinates = [];

function drawGraph() {
    const fromCity = document.getElementById('fromCity');
    const toCity = document.getElementById('toCity');
    const costBetweenCities = document.getElementById('costBetweenCities');
    const canvaToDrawGraph = document.getElementById('canvas');
    const contextOfCanva = canvaToDrawGraph.getContext('2d');

    function addCitiesToList(fromCity, toCity) {
        if (!(citiesList.includes(fromCity.value))) {
            citiesList.push(fromCity.value);
            drawCircle(fromCity.value);
        }
        if (!(citiesList.includes(toCity.value))) {
            citiesList.push(toCity.value);
            drawCircle(toCity.value);
        }
    }

    addCitiesToList(fromCity, toCity);

    function addCostToList(fromCity, toCity, costBetweenCities) {
        if (!(fromCity.value == toCity.value)) {
            const tempList = [fromCity.value, toCity.value, costBetweenCities.value];
            costList.push(tempList);
            drawLine(fromCity, toCity, costBetweenCities);
        }
    }

    addCostToList(fromCity, toCity, costBetweenCities);

    function genrateRandomPosition(a, radius) {
        return (Math.random() * (a - 2 * radius) + radius);
    }

    function drawCircle(content) {
        const radius = 25;
        const x = genrateRandomPosition(canvaToDrawGraph.width, radius);
        const y = genrateRandomPosition(canvaToDrawGraph.height, radius);
        const temp = [content, x, y];
        coordinates.push(temp);

        contextOfCanva.beginPath();
        contextOfCanva.arc(x, y, radius, 0, (Math.PI * 2));
        contextOfCanva.fillStyle = 'black';
        contextOfCanva.fill();
        contextOfCanva.closePath();

        contextOfCanva.fillStyle = 'white';
        contextOfCanva.font = '20px Arial';
        contextOfCanva.textAlign = 'center';
        contextOfCanva.textBaseline = 'middle';
        contextOfCanva.fillText(content, x, y);
    }

    function drawLine(fromCity, toCity, costBetweenCities) {
        let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
        contextOfCanva.strokeStyle = 'black';
        contextOfCanva.lineWidth = 1;
        contextOfCanva.beginPath();

        for (let i = 0; i < coordinates.length; i++) {
            if (fromCity.value == coordinates[i][0]) {
                x1 = coordinates[i][1];
                y1 = coordinates[i][2];
            } else if (toCity.value == coordinates[i][0]) {
                x2 = coordinates[i][1];
                y2 = coordinates[i][2];
            }
        }

        contextOfCanva.moveTo(x1, y1);
        contextOfCanva.lineTo(x2, y2);
        contextOfCanva.stroke();
        contextOfCanva.closePath();

        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;

        contextOfCanva.fillStyle = 'black';
        contextOfCanva.font = '15px Arial';
        contextOfCanva.fillText(costBetweenCities.value, midX, midY);
    }
}

function createAdjacencyList(costList) {
    let graph = {};
    for (let [city1, city2, cost] of costList) {
        if (!graph[city1]) graph[city1] = [];
        if (!graph[city2]) graph[city2] = [];
        graph[city1].push(city2);
        graph[city2].push(city1);
    }
    return graph;
}

function bfs(graph, startCity, destinationCity) {
    let queue = [];
    let visited = new Set();
    let parent = {};

    queue.push(startCity);
    visited.add(startCity);
    parent[startCity] = null;

    while (queue.length > 0) {
        let currentCity = queue.shift(); 
        if (currentCity === destinationCity) {
            let path = [];
            while (currentCity !== null) {
                path.unshift(currentCity); 
                currentCity = parent[currentCity];
            }
            return path;
        }

        for (let neighbor of graph[currentCity]) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor); 
                queue.push(neighbor); 
                parent[neighbor] = currentCity; 
            }
        }
    }
    return null; 
}


function BFS() {
    let startCity = document.getElementById("bfsStartCity").value.trim();
    let destinationCity = document.getElementById("bfsDestinationCity").value.trim();
    if (!startCity || !destinationCity) {
        alert("Please enter both start and destination cities.");
        return;
    }

    let graph = createAdjacencyList(costList);
    let path = bfs(graph, startCity, destinationCity);

    if (path) {
        alert("BFS Path: " + path.join(" -> "));
    } else {
        alert("No path found using BFS.");
    }
}

function dfs(graph, startCity, destinationCity) {
    let stack = [startCity];
    let visited = new Set();
    let parent = {};

    visited.add(startCity);
    parent[startCity] = null;

    while (stack.length > 0) {
        let currentCity = stack.pop();
        if (currentCity === destinationCity) {
            let path = [];
            while (currentCity !== null) {
                path.unshift(currentCity);
                currentCity = parent[currentCity];
            }
            return path;
        }

        for (let neighbor of graph[currentCity]) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                stack.push(neighbor);
                parent[neighbor] = currentCity;
            }
        }
    }
    return null;
}

function DFS() {
    let startCity = document.getElementById("dfsStartCity").value.trim();
    let destinationCity = document.getElementById("dfsDestinationCity").value.trim();
    if (!startCity || !destinationCity) {
        alert("Please enter both start and destination cities.");
        return;
    }

    let graph = createAdjacencyList(costList);
    let path = dfs(graph, startCity, destinationCity);

    if (path) {
        alert("DFS Path: " + path.join(" -> "));
    } else {
        alert("No path found using DFS.");
    }
}

function createAdjacencyListWithCosts(costList) {
    let graph = {};
    for (let [city1, city2, cost] of costList) {
        if (!graph[city1]) graph[city1] = [];
        if (!graph[city2]) graph[city2] = [];
        graph[city1].push({ city: city2, cost: parseInt(cost) });
        graph[city2].push({ city: city1, cost: parseInt(cost) });
    }
    return graph;
}

function ucs(graph, startCity, destinationCity) {
    let frontier = new PriorityQueue();
    frontier.enqueue(startCity, 0); 

    let visited = new Set(); 
    let parent = {}; 
    let cost = {}; 

    cost[startCity] = 0;
    parent[startCity] = null;

    while (!frontier.isEmpty()) {
        let currentCity = frontier.dequeue().element;

        if (currentCity === destinationCity) {
            let path = [];
            while (currentCity !== null) {
                path.unshift(currentCity);
                currentCity = parent[currentCity];
            }
            return path;
        }

        if (visited.has(currentCity)) continue; 
        visited.add(currentCity);

        for (let neighbor of graph[currentCity]) {
            let newCost = cost[currentCity] + neighbor.cost; 

            if (!visited.has(neighbor.city) || newCost < cost[neighbor.city]) {
                cost[neighbor.city] = newCost;
                parent[neighbor.city] = currentCity;
                frontier.enqueue(neighbor.city, newCost); 
            }
        }
    }
    return null; 
}

class PriorityQueue {
    constructor() {
        this.items = [];
    }

    enqueue(element, priority) {
        let newNode = { element, priority };

        let added = false;
        for (let i = 0; i < this.items.length; i++) {
            if (priority < this.items[i].priority) {
                this.items.splice(i, 0, newNode);
                added = true;
                break;
            }
        }
        if (!added) {
            this.items.push(newNode);
        }
    }

    dequeue() {
        return this.items.shift(); 
    }

    isEmpty() {
        return this.items.length === 0;
    }
}

function UCS() {
    let startCity = document.getElementById("ucsStartCity").value.trim();
    let destinationCity = document.getElementById("ucsDestinationCity").value.trim();

    if (!startCity || !destinationCity) {
        alert("Please enter both start and destination cities.");
        return;
    }

    let graph = createAdjacencyListWithCosts(costList);

    if (!graph[startCity]) {
        alert("Start city not found in the graph.");
        return;
    }
    if (!graph[destinationCity]) {
        alert("Destination city not found in the graph.");
        return;
    }

    let path = ucs(graph, startCity, destinationCity);
    
    if (path) {
        let totalCost = 0;
        for (let i = 0; i < path.length - 1; i++) {
            let current = path[i];
            let next = path[i + 1];
            let edge = costList.find(edge => 
                (edge[0] === current && edge[1] === next) || 
                (edge[1] === current && edge[0] === next)
            );
            totalCost += parseInt(edge[2]); 
        }

        alert("UCS Path: " + path.join(" -> ") + "\nTotal Cost: " + totalCost);
    } else {
        alert("No path found.");
    }
}



