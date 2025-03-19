const { app, BrowserWindow, ipcMain } = require("electron");

app.setAppUserModelId("com.fabra.T3Chat");
if (require("electron-squirrel-startup")) app.quit();

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    frame: false,
    icon: "images/logo.png",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webviewTag: true,
      webSecurity: true,
      partition: "persist:t3chat",
      userDataDir: app.getPath("userData"),
    },
  });

  mainWindow.loadFile("index.html");

  mainWindow.on("maximize", () => {
    mainWindow.webContents.send("window-state-change", true);
  });

  mainWindow.on("unmaximize", () => {
    mainWindow.webContents.send("window-state-change", false);
  });

  ipcMain.on("window-control", (event, command) => {
    switch (command) {
      case "minimize":
        mainWindow.minimize();
        break;
      case "maximize":
        if (mainWindow.isMaximized()) {
          mainWindow.unmaximize();
        } else {
          mainWindow.maximize();
        }
        break;
      case "close":
        mainWindow.close();
        break;
    }
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url !== mainWindow.webContents.getURL()) {
      require("electron").shell.openExternal(url);
    }
    return { action: "deny" };
  });
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
