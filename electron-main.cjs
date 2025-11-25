const { app, BrowserWindow } = require("electron");
const path = require("path");

// Fix 1: Disable GPU (Tails/VM compatible)
app.disableHardwareAcceleration();
app.commandLine.appendSwitch("disable-gpu");

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
    },
  });

  // Fix 2: Correct path resolution for AppImage
  const indexPath = path.join(__dirname, "dist", "index.html");

  console.log("Loading:", indexPath);

  win.loadFile(indexPath).catch(err => {
    console.error("LOAD FAILED:", err);
  });
}

app.whenReady().then(createWindow);
