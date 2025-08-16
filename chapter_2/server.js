// The address of this server connected to the network is:
// URL -> http://localhost:8383
// IP -> 127.0.0.1
const express = require("express");
const app = express();
const PORT = 8383;

let data = [
  {
    name: "Henry",
    age: 30,
    occupation: "Developer",
  },
];

// middleware
app.use(express.json());

// HTTP VERBS (methods) && Routs (for paths)
// The method informs the nature of the request and the route is a further
// subdirectory (basically we direct the request to the body of code to request
// approprately, and these locations or rotes are called endpoints)

// Type 1 -> Website endpoints
// (these endpoints are for sending back html and they typically come when a user enters in a browser)
app.get("", (req, res) => {
  // this is endpoint number - 1
  res.send(`
    <body>
    <H1>Data</H1>
    <p>${JSON.stringify(data)}</p>
    <a href="/dashboard">Dashboard</a>
    </body>`);
});

app.get("/dashboard", (req, res) => {
  res.send(`
    <body>
    <H1>Dashboard</H1>
    <a href="/">Home</a>
    </body>`);
});

// Type 2 -> API endpoints
// (these endpoints are for sending back data, typically in JSON format)
app.get("/api/data", (req, res) => {
  res.status(599).json(data);
});

// CRUD - Create, Read, Update, Delete
//       Create - POST
//       Read - GET
//       Update - PUT
//       Delete - DELETE

app.post("/api/data", (req, res) => {
    // someone wants to create a user (for example when they hit the signup button)
    // the user clicks the signup button after entering their credentials, and their 
    // browser is wired up to send out a network request to the server to handle that action
  const newData = req.body;
  data.push(newData);
  res.json(data);
  res.status(201); // 201 Created
});

app.delete("/api/data/:id", (req, res) => {
  data.pop();
  res.sendStatus(203);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

