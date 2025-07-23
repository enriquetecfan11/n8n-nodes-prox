const { Proxmox } = require('./dist/nodes/Proxmox.node.js');
const { Proxmox } = require('./dist/credentials/Proxmox.credentials.js');

module.exports = {
	nodes: [Proxmox],
	credentials: [Proxmox],
};
