const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('ocOverlay', {
  sendRegion: (rect) => ipcRenderer.send('oc:capture-region', rect),
  cancel: () => ipcRenderer.send('oc:capture-cancel'),
});
