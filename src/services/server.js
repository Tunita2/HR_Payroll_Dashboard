const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const FileWatcher = require("./utils/fileWatcher");
const CodebaseIndexer = require("./utils/codebaseIndexer");

const AdminAPI = require("./Routes/admin-API");
const PayrollAPI = require("./Routes/payroll-API");
const EmployeeAPI = require("./Routes/employee-API");
const { router: AuthAPI } = require("./Auth/auth-API");
const PORT = 3001;

// Middlewarew
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/admin", AdminAPI);
app.use("/api/payroll", PayrollAPI);
app.use("/api/employee", EmployeeAPI);
app.use("/api/auth", AuthAPI);

// Initialize file watcher
const projectRoot = path.resolve(__dirname, "../..");
const watcher = new FileWatcher({
  ignored: [
    /(^|[\/\\])\../, // Ignore dotfiles
    /node_modules/,  // Ignore node_modules
    /build/,         // Ignore build directory
    /\.git/          // Ignore git directory
  ],
  persistent: true,
  ignoreInitial: true
});

// Start watching files
watcher.watch([
  path.join(projectRoot, "src"),
])
.addListener((event, filePath, relativePath) => {
  console.log(`[Server] File ${event}: ${relativePath}`);

  // You can add specific actions based on file types here
  if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
    console.log(`[Server] JavaScript file changed: ${relativePath}`);
    // You could trigger specific actions here if needed
  }
});

// Initialize codebase indexer
const indexer = new CodebaseIndexer();
let codebaseIndex = null;

// Index the codebase on startup
console.log('[Server] Indexing codebase...');
codebaseIndex = indexer.indexCodebase(projectRoot);

// Re-index when files change
watcher.addListener((event) => {
  if (event === 'add' || event === 'unlink') {
    console.log('[Server] Re-indexing codebase due to file changes...');
    codebaseIndex = indexer.indexCodebase(projectRoot);
  }
});

// Add routes for codebase information
app.get("/api/status/watching", (_, res) => {
  res.json({
    watching: watcher.watcher !== null,
    timestamp: new Date().toISOString()
  });
});

app.get("/api/codebase/stats", (_, res) => {
  res.json(indexer.getStats());
});

app.get("/api/codebase/files", (req, res) => {
  const { name, extension, path } = req.query;
  const searchResults = indexer.searchFiles({ name, extension, path });
  res.json(searchResults);
});

app.get("/api/codebase/structure", (_, res) => {
  res.json({
    tree: indexer.getDirectoryTree(),
    lastIndexed: codebaseIndex.lastIndexed
  });
});

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
  console.log(`File watching is active. Changes to files will be logged.`);
  console.log(`Codebase indexing is active. ${codebaseIndex.stats.totalFiles} files indexed.`);
});
