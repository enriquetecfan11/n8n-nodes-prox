import { INodeType, INodeTypeDescription, IExecuteFunctions, ILoadOptionsFunctions, IHttpRequestMethods } from 'n8n-workflow';


export class Proxmox implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Proxmox',
		name: 'proxmox',
		icon: 'file:proxmox.svg',
		group: ['transform'],
		version: 1,
		description: 'Interact with the Proxmox VE API to manage virtual machines, containers, storage, and cluster resources.',
		defaults: {
			name: 'Proxmox',
		},
		inputs: ["main" as any],
		outputs: ["main" as any],
		credentials: [
			{
				name: 'proxmoxApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				options: [
					{ name: 'Virtual Machine (VM)', value: 'vm', description: 'Manage virtual machines (QEMU/KVM).' },
					{ name: 'Container (LXC)', value: 'lxc', description: 'Manage Linux containers.' },
					{ name: 'Storage', value: 'storage', description: 'Manage storage resources and content.' },
					{ name: 'Cluster', value: 'cluster', description: 'Monitor and manage Proxmox cluster resources.' },
					{ name: 'Backup', value: 'backup', description: 'Perform backup and restore operations.' },
				],
				default: 'vm',
				description: 'The type of Proxmox resource to interact with.',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				options: [
					// VM Operations
					{ name: 'List VMs', value: 'listVms', description: 'Retrieve a list of all virtual machines on a node.' },
					{ name: 'Get VM', value: 'getVm', description: 'Get detailed configuration and status of a specific virtual machine.' },
					{ name: 'Create VM', value: 'createVm', description: 'Create a new virtual machine with specified parameters.' },
					{ name: 'Start VM', value: 'startVm', description: 'Start a virtual machine.' },
					{ name: 'Stop VM', value: 'stopVm', description: 'Stop a virtual machine gracefully.' },
					{ name: 'Restart VM', value: 'restartVm', description: 'Restart a virtual machine.' },
					{ name: 'Delete VM', value: 'deleteVm', description: 'Delete a virtual machine.' },
					{ name: 'Clone VM', value: 'cloneVm', description: 'Create a clone of an existing virtual machine.' },
					{ name: 'Migrate VM', value: 'migrateVm', description: 'Migrate a virtual machine to another node in the cluster.' },
					{ name: 'Configure VM', value: 'configureVm', description: 'Modify the configuration of a virtual machine.' },
					{ name: 'Get VM Status', value: 'getVmStatus', description: 'Get the current runtime status of a virtual machine.' },

					// LXC Operations
					{ name: 'List Containers', value: 'listContainers', description: 'Retrieve a list of all containers on a node.' },
					{ name: 'Get Container', value: 'getContainer', description: 'Get detailed configuration and status of a specific container.' },
					{ name: 'Create Container', value: 'createContainer', description: 'Create a new Linux container with specified parameters.' },
					{ name: 'Start Container', value: 'startContainer', description: 'Start a container.' },
					{ name: 'Stop Container', value: 'stopContainer', description: 'Stop a container gracefully.' },
					{ name: 'Restart Container', value: 'restartContainer', description: 'Restart a container.' },
					{ name: 'Delete Container', value: 'deleteContainer', description: 'Delete a container.' },
					{ name: 'Clone Container', value: 'cloneContainer', description: 'Create a clone of an existing container.' },
					{ name: 'Migrate Container', value: 'migrateContainer', description: 'Migrate a container to another node in the cluster.' },
					{ name: 'Configure Container', value: 'configureContainer', description: 'Modify the configuration of a container.' },

					// Storage Operations
					{ name: 'List Storage', value: 'listStorage', description: 'Retrieve a list of all storage pools.' },
					{ name: 'Get Storage', value: 'getStorage', description: 'Get detailed information about a specific storage pool.' },
					{ name: 'Create Volume', value: 'createVolume', description: 'Create a new volume (e.g., disk image, ISO) on a storage pool.' },
					{ name: 'Delete Volume', value: 'deleteVolume', description: 'Delete a volume from a storage pool.' },
					{ name: 'Upload ISO', value: 'uploadIso', description: 'Upload an ISO image to a storage pool.' },
					{ name: 'Download Template', value: 'downloadTemplate', description: 'Download a container template to a storage pool.' },
					{ name: 'Backup Storage', value: 'backupStorage', description: 'List backups stored on a specific storage pool.' },

					// Cluster Operations
					{ name: 'Get Cluster Status', value: 'getClusterStatus', description: 'Get the overall status of the Proxmox cluster.' },
					{ name: 'List Nodes', value: 'listNodes', description: 'Retrieve a list of all nodes in the cluster.' },
					{ name: 'Get Node', value: 'getNode', description: 'Get detailed status and information about a specific node.' },
					{ name: 'Node Statistics', value: 'nodeStatistics', description: 'Get performance and usage statistics for a node.' },
					{ name: 'Cluster Resources', value: 'clusterResources', description: 'List all resources (VMs, containers, storage) across the cluster.' },
					{ name: 'HA Status', value: 'haStatus', description: 'Get the High Availability (HA) status of the cluster.' },
					{ name: 'Cluster Tasks', value: 'clusterTasks', description: 'List all running and completed tasks across the cluster.' },

					// Backup Operations
					{ name: 'List Backups', value: 'listBackups', description: 'List all available backups for a given storage.' },
					{ name: 'Create Backup', value: 'createBackup', description: 'Create a new backup of a VM or container.' },
					{ name: 'Restore Backup', value: 'restoreBackup', description: 'Restore a VM or container from a backup.' },
					{ name: 'Delete Backup', value: 'deleteBackup', description: 'Delete a specific backup.' },
					{ name: 'Backup Jobs', value: 'backupJobs', description: 'List all configured backup jobs.' },
					{ name: 'Backup Configuration', value: 'backupConfiguration', description: 'Configure an existing backup job.' },
				],
				default: 'listVms',
				description: 'The specific operation to perform on the selected resource.',
			},
			// Dynamic Node Selection
			{
				displayName: 'Node',
				name: 'node',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getNodes',
				},
				default: '',
				description: 'The Proxmox node on which the operation will be performed.',
				// Show only for operations that require a node
				displayOptions: {
					show: {
						resource: ['vm', 'lxc', 'storage', 'cluster', 'backup'],
						operation: [
							'listVms', 'getVm', 'createVm', 'startVm', 'stopVm', 'restartVm', 'deleteVm', 'cloneVm', 'migrateVm', 'configureVm', 'getVmStatus',
							'listContainers', 'getContainer', 'createContainer', 'startContainer', 'stopContainer', 'restartContainer', 'deleteContainer', 'cloneContainer', 'migrateContainer', 'configureContainer',
							'listStorage', 'getStorage', 'createVolume', 'deleteVolume', 'uploadIso', 'downloadTemplate', 'backupStorage',
							'getNode', 'nodeStatistics',
							'listBackups', 'createBackup', 'restoreBackup', 'deleteBackup',
						],
					},
				},
			},
			// VM ID Selection (dynamic for VMs and Containers)
			{
				displayName: 'VM ID',
				name: 'vmid',
				type: 'number',
				default: 0,
				description: 'The unique identifier of the Virtual Machine or Container.',
				displayOptions: {
					show: {
						resource: ['vm', 'lxc'],
						operation: [
							'getVm', 'startVm', 'stopVm', 'restartVm', 'deleteVm', 'cloneVm', 'migrateVm', 'configureVm', 'getVmStatus',
							'getContainer', 'startContainer', 'stopContainer', 'restartContainer', 'deleteContainer', 'cloneContainer', 'migrateContainer', 'configureContainer',
						],
					},
				},
			},
			// Additional parameters for specific operations will go here
			{
				displayName: 'VM Name',
				name: 'vmName',
				type: 'string',
				default: '',
				description: 'The desired name for the new virtual machine.',
				displayOptions: {
					show: {
						resource: ['vm'],
						operation: ['createVm'],
					},
				},
			},
			{
				displayName: 'VM Cores',
				name: 'vmCores',
				type: 'number',
				default: 1,
				description: 'Number of CPU cores to allocate to the virtual machine.',
				displayOptions: {
					show: {
						resource: ['vm'],
						operation: ['createVm'],
					},
				},
			},
			{
				displayName: 'VM Memory (MB)',
				name: 'vmMemory',
				type: 'number',
				default: 512,
				description: 'Amount of RAM in megabytes to allocate to the virtual machine.',
				displayOptions: {
					show: {
						resource: ['vm'],
						operation: ['createVm'],
					},
				},
			},
			{
				displayName: 'VM Disk Size (GB)',
				name: 'vmDiskSize',
				type: 'number',
				default: 32,
				description: 'Size of the virtual disk in gigabytes for the virtual machine.',
				displayOptions: {
					show: {
						resource: ['vm'],
						operation: ['createVm'],
					},
				},
			},
			{
				displayName: 'VM Storage',
				name: 'vmStorage',
				type: 'string',
				default: 'local-lvm',
				description: 'The storage pool where the virtual machine disk will be created.',
				displayOptions: {
					show: {
						resource: ['vm'],
						operation: ['createVm'],
					},
				},
			},
			{
				displayName: 'Target Node',
				name: 'targetNode',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getNodes',
				},
				default: '',
				description: 'The destination Proxmox node for migration or cloning operations.',
				displayOptions: {
					show: {
						resource: ['vm', 'lxc'],
						operation: ['migrateVm', 'cloneVm', 'migrateContainer', 'cloneContainer'],
					},
				},
			},
			{
				displayName: 'Container Name',
				name: 'containerName',
				type: 'string',
				default: '',
				description: 'The desired name for the new container.',
				displayOptions: {
					show: {
						resource: ['lxc'],
						operation: ['createContainer'],
					},
				},
			},
			{
				displayName: 'Container Cores',
				name: 'containerCores',
				type: 'number',
				default: 1,
				description: 'Number of CPU cores to allocate to the container.',
				displayOptions: {
					show: {
						resource: ['lxc'],
						operation: ['createContainer'],
					},
				},
			},
			{
				displayName: 'Container Memory (MB)',
				name: 'containerMemory',
				type: 'number',
				default: 512,
				description: 'Amount of RAM in megabytes to allocate to the container.',
				displayOptions: {
					show: {
						resource: ['lxc'],
						operation: ['createContainer'],
					},
				},
			},
			{
				displayName: 'Container Disk Size (GB)',
				name: 'containerDiskSize',
				type: 'number',
				default: 8,
				description: 'Size of the root file system disk in gigabytes for the container.',
				displayOptions: {
					show: {
						resource: ['lxc'],
						operation: ['createContainer'],
					},
				},
			},
			{
				displayName: 'Container Storage',
				name: 'containerStorage',
				type: 'string',
				default: 'local-lvm',
				description: 'The storage pool where the container disk will be created.',
				displayOptions: {
					show: {
						resource: ['lxc'],
						operation: ['createContainer'],
					},
				},
			},
			{
				displayName: 'Container Template',
				name: 'containerTemplate',
				type: 'string',
				default: '',
				description: 'The template to use for creating the container (e.g., local:vztmpl/debian-11-standard_11.0-1_amd64.tar.gz).',
				displayOptions: {
					show: {
						resource: ['lxc'],
						operation: ['createContainer'],
					},
				},
			},
			{
				displayName: 'Storage ID',
				name: 'storageId',
				type: 'string',
				default: '',
				description: 'The unique identifier of the storage pool to operate on.',
				displayOptions: {
					show: {
						resource: ['storage', 'backup'],
						operation: ['getStorage', 'createVolume', 'deleteVolume', 'uploadIso', 'downloadTemplate', 'backupStorage', 'listBackups', 'deleteBackup'],
					},
				},
			},
			{
				displayName: 'Volume ID',
				name: 'volumeId',
				type: 'string',
				default: '',
				description: 'The unique identifier of the volume to operate on (e.g., local:100/vm-100-disk-0.qcow2).',
				displayOptions: {
					show: {
						resource: ['storage', 'backup'],
						operation: ['deleteVolume', 'deleteBackup'],
					},
				},
			},
			{
				displayName: 'Content Type',
				name: 'contentType',
				type: 'options',
				options: [
					{ name: 'ISO Image', value: 'iso', description: 'ISO CD/DVD image.' },
					{ name: 'Container Template', value: 'vztmpl', description: 'OpenVZ container template.' },
					{ name: 'Disk Image', value: 'images', description: 'Virtual disk image.' },
					{ name: 'Backup', value: 'backup', description: 'Backup file.' },
				],
				default: 'iso',
				description: 'The type of content to create or upload to storage.',
				displayOptions: {
					show: {
						resource: ['storage'],
						operation: ['createVolume', 'uploadIso'],
					},
				},
			},
			{
				displayName: 'File Name',
				name: 'fileName',
				type: 'string',
				default: '',
				description: 'The name of the file to upload or the target filename for a download.',
				displayOptions: {
					show: {
						resource: ['storage'],
						operation: ['uploadIso', 'downloadTemplate'],
					},
				},
			},
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				default: '',
				description: 'The URL from which to download the template.',
				displayOptions: {
					show: {
						resource: ['storage'],
						operation: ['downloadTemplate'],
					},
				},
			},
			{
				displayName: 'Backup ID',
				name: 'backupId',
				type: 'string',
				default: '',
				description: 'The unique identifier of the backup job to configure or a specific backup.',
				displayOptions: {
					show: {
						resource: ['backup'],
						operation: ['backupConfiguration'],
					},
				},
			},
			{
				displayName: 'Backup Type',
				name: 'backupType',
				type: 'options',
				options: [
					{ name: 'VM', value: 'vma', description: 'Backup a virtual machine.' },
					{ name: 'Container', value: 'lxc', description: 'Backup a Linux container.' },
				],
				default: 'vma',
				description: 'The type of resource to backup.',
				displayOptions: {
					show: {
						resource: ['backup'],
						operation: ['createBackup'],
					},
				},
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'A descriptive note for the backup.',
				displayOptions: {
					show: {
						resource: ['backup'],
						operation: ['createBackup'],
					},
				},
			},
		],
	};

	methods = {
		loadOptions: {
			// Method to dynamically load Proxmox nodes
			getNodes: async function(this: ILoadOptionsFunctions) {
				const credentials = await this.getCredentials('proxmoxApi');
				const serverIp = (credentials as any).serverIp;
				const apiToken = (credentials as any).apiToken;

				const options = {
					method: 'GET' as IHttpRequestMethods,
					uri: `${serverIp}/api2/json/nodes`,
					headers: {
						Authorization: `PVEAPIToken=${apiToken}`,
					},
					json: true,
				};

				const response = await this.helpers.request(options);

				const nodes = response.data.map((node: any) => ({
					name: node.node,
					value: node.node,
				}));

				return nodes;
			},
		},
	};

	async execute(this: IExecuteFunctions) {
		const items = this.getInputData();
		const returnData: any[] = [];

		const credentials = await this.getCredentials("proxmoxApi");
		const serverIp = (credentials as any).serverIp;
		const apiToken = (credentials as any).apiToken;

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;
		const node = this.getNodeParameter('node', 0) as string;
		const vmid = this.getNodeParameter('vmid', 0) as number;

		let options: any;
		let responseData: any;

		// Helper function to make API requests
		const proxmoxRequest = async (method: IHttpRequestMethods, path: string, body?: object) => {
			options = {
				method,
				uri: `${serverIp}/api2/json${path}`,
				headers: {
					Authorization: `PVEAPIToken=${apiToken}`,
				},
				json: true,
				body: body || undefined,
			};
			return this.helpers.request(options);
		};

		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'vm') {
					switch (operation) {
						case 'listVms':
							responseData = await proxmoxRequest('GET', `/nodes/${node}/qemu`);
							break;
						case 'getVm':
							responseData = await proxmoxRequest('GET', `/nodes/${node}/qemu/${vmid}/config`);
							break;
						case 'createVm':
							const vmName = this.getNodeParameter('vmName', i) as string;
							const vmCores = this.getNodeParameter('vmCores', i) as number;
							const vmMemory = this.getNodeParameter('vmMemory', i) as number;
							const vmDiskSize = this.getNodeParameter('vmDiskSize', i) as number;
							const vmStorage = this.getNodeParameter('vmStorage', i) as string;
							responseData = await proxmoxRequest('POST', `/nodes/${node}/qemu`, {
								name: vmName,
								cores: vmCores,
								memory: vmMemory,
								sata0: `${vmStorage}:${vmDiskSize}`,
							});
							break;
						case 'startVm':
							responseData = await proxmoxRequest('POST', `/nodes/${node}/qemu/${vmid}/status/start`);
							break;
						case 'stopVm':
							responseData = await proxmoxRequest('POST', `/nodes/${node}/qemu/${vmid}/status/stop`);
							break;
						case 'restartVm':
							responseData = await proxmoxRequest('POST', `/nodes/${node}/qemu/${vmid}/status/reboot`);
							break;
						case 'deleteVm':
							responseData = await proxmoxRequest('DELETE', `/nodes/${node}/qemu/${vmid}`);
							break;
						case 'cloneVm':
							const targetNodeClone = this.getNodeParameter('targetNode', i) as string;
							responseData = await proxmoxRequest('POST', `/nodes/${node}/qemu/${vmid}/clone`, { target: targetNodeClone });
							break;
						case 'migrateVm':
							const targetNodeMigrate = this.getNodeParameter('targetNode', i) as string;
							responseData = await proxmoxRequest('POST', `/nodes/${node}/qemu/${vmid}/migrate`, { target: targetNodeMigrate });
							break;
						case 'configureVm':
							const vmConfig = this.getNodeParameter('vmConfig', i) as object; // Needs to be defined in properties
							responseData = await proxmoxRequest('PUT', `/nodes/${node}/qemu/${vmid}/config`, vmConfig);
							break;
						case 'getVmStatus':
							responseData = await proxmoxRequest('GET', `/nodes/${node}/qemu/${vmid}/status/current`);
							break;
					}
				} else if (resource === 'lxc') {
					switch (operation) {
						case 'listContainers':
							responseData = await proxmoxRequest('GET', `/nodes/${node}/lxc`);
							break;
						case 'getContainer':
							responseData = await proxmoxRequest('GET', `/nodes/${node}/lxc/${vmid}/config`);
							break;
						case 'createContainer':
							const containerName = this.getNodeParameter('containerName', i) as string;
							const containerCores = this.getNodeParameter('containerCores', i) as number;
							const containerMemory = this.getNodeParameter('containerMemory', i) as number;
							const containerDiskSize = this.getNodeParameter('containerDiskSize', i) as number;
							const containerStorage = this.getNodeParameter('containerStorage', i) as string;
							const containerTemplate = this.getNodeParameter('containerTemplate', i) as string;
							responseData = await proxmoxRequest('POST', `/nodes/${node}/lxc`, {
								name: containerName,
								cores: containerCores,
								memory: containerMemory,
								rootfs: `${containerStorage}:${containerDiskSize}`,
								template: containerTemplate,
							});
							break;
						case 'startContainer':
							responseData = await proxmoxRequest('POST', `/nodes/${node}/lxc/${vmid}/status/start`);
							break;
						case 'stopContainer':
							responseData = await proxmoxRequest('POST', `/nodes/${node}/lxc/${vmid}/status/stop`);
							break;
						case 'restartContainer':
							responseData = await proxmoxRequest('POST', `/nodes/${node}/lxc/${vmid}/status/reboot`);
							break;
						case 'deleteContainer':
							responseData = await proxmoxRequest('DELETE', `/nodes/${node}/lxc/${vmid}`);
							break;
						case 'cloneContainer':
							const targetNodeClone = this.getNodeParameter('targetNode', i) as string;
							responseData = await proxmoxRequest('POST', `/nodes/${node}/lxc/${vmid}/clone`, { target: targetNodeClone });
							break;
						case 'migrateContainer':
							const targetNodeMigrate = this.getNodeParameter('targetNode', i) as string;
							responseData = await proxmoxRequest('POST', `/nodes/${node}/lxc/${vmid}/migrate`, { target: targetNodeMigrate });
							break;
						case 'configureContainer':
							const containerConfig = this.getNodeParameter('containerConfig', i) as object; // Needs to be defined in properties
							responseData = await proxmoxRequest('PUT', `/nodes/${node}/lxc/${vmid}/config`, containerConfig);
							break;
					}
				} else if (resource === 'storage') {
					const storageId = this.getNodeParameter('storageId', i) as string;
					const volumeId = this.getNodeParameter('volumeId', i) as string;
					const contentType = this.getNodeParameter('contentType', i) as string;
					const fileName = this.getNodeParameter('fileName', i) as string;
					const url = this.getNodeParameter('url', i) as string;

					switch (operation) {
						case 'listStorage':
							responseData = await proxmoxRequest('GET', `/nodes/${node}/storage`);
							break;
						case 'getStorage':
							responseData = await proxmoxRequest('GET', `/nodes/${node}/storage/${storageId}`);
							break;
						case 'createVolume':
							responseData = await proxmoxRequest('POST', `/nodes/${node}/storage/${storageId}/content`, {
								filename: fileName,
								content: contentType,
							});
							break;
						case 'deleteVolume':
							responseData = await proxmoxRequest('DELETE', `/nodes/${node}/storage/${storageId}/content/${volumeId}`);
							break;
						case 'uploadIso':
							responseData = await proxmoxRequest('POST', `/nodes/${node}/storage/${storageId}/upload`, {
								filename: fileName,
								content: 'iso',
							});
							break;
						case 'downloadTemplate':
							responseData = await proxmoxRequest('POST', `/nodes/${node}/storage/${storageId}/template`, {
								url: url,
								filename: fileName,
							});
							break;
						case 'backupStorage':
							responseData = await proxmoxRequest('GET', `/nodes/${node}/storage/${storageId}/content`);
							break;
					}
				} else if (resource === 'cluster') {
					switch (operation) {
						case 'getClusterStatus':
							responseData = await proxmoxRequest('GET', `/cluster/status`);
							break;
						case 'listNodes':
							responseData = await proxmoxRequest('GET', `/nodes`);
							break;
						case 'getNode':
							responseData = await proxmoxRequest('GET', `/nodes/${node}/status`);
							break;
						case 'nodeStatistics':
							responseData = await proxmoxRequest('GET', `/nodes/${node}`);
							break;
						case 'clusterResources':
							responseData = await proxmoxRequest('GET', `/cluster/resources`);
							break;
						case 'haStatus':
							responseData = await proxmoxRequest('GET', `/cluster/ha/status`);
							break;
						case 'clusterTasks':
							responseData = await proxmoxRequest('GET', `/cluster/tasks`);
							break;
					}
				} else if (resource === 'backup') {
					const storageId = this.getNodeParameter('storageId', i) as string;
					const backupType = this.getNodeParameter('backupType', i) as string;
					const description = this.getNodeParameter('description', i) as string;
					const backupId = this.getNodeParameter('backupId', i) as string;
					const volumeId = this.getNodeParameter('volumeId', i) as string;

					switch (operation) {
						case 'listBackups':
							responseData = await proxmoxRequest('GET', `/nodes/${node}/storage/${storageId}/content?content=backup`);
							break;
						case 'createBackup':
							responseData = await proxmoxRequest('POST', `/nodes/${node}/vzdump`, {
								storage: storageId,
								mode: 'snapshot',
								description: description,
								type: backupType,
								vmid: vmid,
							});
							break;
						case 'restoreBackup':
							// Restore backup requires more specific parameters depending on VM/LXC and backup type
							// For simplicity, assuming a generic restore to a new VMID/Container ID
							responseData = await proxmoxRequest('POST', `/nodes/${node}/lxc`, { // This path is for LXC restore, needs to be dynamic for VM
								// Add parameters for restore
							});
							break;
						case 'deleteBackup':
							responseData = await proxmoxRequest('DELETE', `/nodes/${node}/storage/${storageId}/content/${volumeId}`);
							break;
						case 'backupJobs':
							responseData = await proxmoxRequest('GET', `/cluster/backup`);
							break;
						case 'backupConfiguration':
							// This operation would require more dynamic parameters based on what the user wants to configure.
							const backupConfig = this.getNodeParameter('backupConfig', i) as object; // Needs to be defined in properties
							responseData = await proxmoxRequest('PUT', `/cluster/backup/${backupId}`, backupConfig);
							break;
					}
				}

				if (responseData) {
					if (Array.isArray(responseData.data)) {
						// If the response is a list, convert to an array of items for n8n
						returnData.push(...responseData.data.map((data: any) => ({ json: data })));
					} else {
						returnData.push({ json: responseData.data });
					}
				} else {
					returnData.push({ json: responseData });
				}
			} catch (error) {
				// Implement try/catch and error handling
				if (this.continueOnFail()) {
					returnData.push({ json: { error: error.message } });
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}




