// Lets the game talk to the Windows app: the "Install updates quietly" setting, and AppBridge.call(op, {...}).
const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('__BRIDGE', { setQuiet: b => ipcRenderer.send('quiet:set', !!b) });
contextBridge.exposeInMainWorld('__QUIET', !!ipcRenderer.sendSync('quiet:get'));
contextBridge.exposeInMainWorld('AppBridge', { call: (op, p) => ipcRenderer.invoke('bridge', op, p || {}) });
