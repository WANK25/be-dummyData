const WebSocket = require("ws");

const PORT = 10062; // port for WebSocket server
const wss = new WebSocket.Server({ port: PORT });

console.log(`WebSocket server running on port ${PORT}`);

//function to generate random data for each client
function generateRandomData(id) {
  return {
    id,
    latitude: (Math.random() * 180 - 90).toFixed(6),
    longitude: (Math.random() * 360 - 180).toFixed(6),
    bearing: `${Math.floor(Math.random() * 360)}°`,
    range: `${Math.floor(Math.random() * 500)}m`,
    altitude: `${Math.floor(Math.random() * 1000)}m`,
    speed: `${Math.floor(Math.random() * 120)}km/h`,
    course: `${Math.floor(Math.random() * 360)}°`,
    vertical: `${Math.floor(Math.random() * 10)}m/s`,
  };
}

// for storing connected clients
const clients = new Set();
let globalId = 1001; // starting ID for data generation

// Handle incoming WebSocket connections

wss.on("connection", (ws) => {
  console.log("Client connected");
  clients.add(ws);

  // send initial data to the client
  const initialData = Array.from({ length: 1 }, (_, i) =>
    generateRandomData(i + 1)
  );
  ws.send(JSON.stringify(initialData));

  // send updates every second
  const interval = setInterval(() => {
    const updateData = Array.from({ length: 1 }, () =>
      generateRandomData(globalId++)
    );
    ws.send(JSON.stringify({ type: "update", data: updateData }));
  }, 1000);

  // Handle client disconnection

  ws.on("close", () => {
    console.log("Client disconnected");
    clients.delete(ws);
    clearInterval(interval);
  });

  // Handle errors

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});
