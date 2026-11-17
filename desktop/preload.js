const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('oneCompanyDesktop', {
  openDataDir: () => ipcRenderer.invoke('oc:open-data-dir'),
  getDataDir: () => ipcRenderer.invoke('oc:get-data-dir'),
  captureScreen: () => ipcRenderer.invoke('oc:capture-screen'),
  pickFiles: (kind = 'file') => ipcRenderer.invoke('oc:pick-files', kind),
});
