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
					{ name: 'Container (LXC)', value: 'lxc', description: 'Manage Linux containers (LXC).' },
				],
				default: 'vm',
				description: 'The type of Proxmox resource to interact with.',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				options: [
					{ name: 'List VMs', value: 'listVms', description: 'Retrieve a list of all virtual machines on a node.' },
					{ name: 'Get VM', value: 'getVm', description: 'Get detailed configuration and status of a specific virtual machine.' },
					{ name: 'Create VM', value: 'createVm', description: 'Create a new virtual machine with specified parameters.' },
					{ name: 'Start VM', value: 'startVm', description: 'Start a virtual machine.' },
					{ name: 'Stop VM', value: 'stopVm', description: 'Stop a virtual machine gracefully.' },
					{ name: 'Restart VM', value: 'restartVm', description: 'Restart a virtual machine.' },
					{ name: 'Delete VM', value: 'deleteVm', description: 'Delete a virtual machine.' },
					{ name: 'Clone VM', value: 'cloneVm', description: 'Create a clone of an existing virtual machine.' },
					{ name: 'Migrate VM', value: 'migrateVm', description: 'Migrate a virtual machine to another node in the cluster.' },
					{ name: 'Get VM Status', value: 'getVmStatus', description: 'Get the current runtime status of a virtual machine.' },
					{ name: 'List Containers', value: 'listContainers', description: 'List all LXC containers on a node.' },
					{ name: 'Get Container', value: 'getContainer', description: 'Get detailed configuration of a specific LXC container.' },
					{ name: 'Create Container', value: 'createContainer', description: 'Create a new LXC container with specified parameters.' },
					{ name: 'Start Container', value: 'startContainer', description: 'Start an LXC container.' },
					{ name: 'Stop Container', value: 'stopContainer', description: 'Stop an LXC container gracefully.' },
					{ name: 'Restart Container', value: 'restartContainer', description: 'Restart an LXC container.' },
					{ name: 'Delete Container', value: 'deleteContainer', description: 'Delete an LXC container.' },
					{ name: 'Get Container Status', value: 'getContainerStatus', description: 'Get the current runtime status of an LXC container.' },
					{ name: 'Get Container Agent Status', value: 'getContainerAgentStatus', description: 'Get the agent status of an LXC container.' },
					{ name: 'Get Container RRD Data', value: 'getContainerRrdData', description: 'Get RRD data for an LXC container.' },
					{ name: 'Configure Container', value: 'configureContainer', description: 'Update the configuration of an LXC container.' }
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
						resource: ['vm', 'lxc'],
						operation: [
							'listVms', 'getVm', 'createVm', 'startVm', 'stopVm', 'restartVm', 'deleteVm', 'cloneVm', 'migrateVm', 'getVmStatus',
							'listContainers', 'getContainer', 'createContainer', 'startContainer', 'stopContainer', 'restartContainer', 'deleteContainer', 'getContainerStatus', 'getContainerAgentStatus', 'getContainerRrdData', 'configureContainer',
						],
					},
				},
			},
			// VM/Container ID Selection
			{
				displayName: 'VM/Container ID',
				name: 'vmid',
				type: 'number',
				default: 0,
				description: 'The unique identifier of the Virtual Machine or Container.',
				displayOptions: {
					show: {
						resource: ['vm', 'lxc'],
						operation: [
							'getVm', 'startVm', 'stopVm', 'restartVm', 'deleteVm', 'cloneVm', 'migrateVm', 'getVmStatus',
							'getContainer', 'startContainer', 'stopContainer', 'restartContainer', 'deleteContainer', 'getContainerStatus', 'getContainerAgentStatus', 'getContainerRrdData', 'configureContainer',
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
						resource: ['vm'],
						operation: ['migrateVm', 'cloneVm'],
					},
				},
			},
			// Container creation parameters
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
				displayName: 'Container Configuration',
				name: 'containerConfig',
				type: 'json',
				default: '{}',
				description: 'JSON object with container configuration parameters.',
				displayOptions: {
					show: {
						resource: ['lxc'],
						operation: ['configureContainer'],
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
			const authMethod = (credentials as any).authMethod;
			const ignoreSsl = (credentials as any).ignoreSsl !== false; // Por defecto ignorar SSL

			let authHeaders: any = {};

			if (authMethod === 'userPass') {
				// Obtener ticket de autenticación
				const username = (credentials as any).username;
				const password = (credentials as any).password;
				
				const ticketOptions = {
					method: 'POST' as IHttpRequestMethods,
					uri: `${serverIp}/api2/json/access/ticket`,
					form: {
						username: username,
						password: password,
					},
					json: true,
					rejectUnauthorized: !ignoreSsl,
				};

				const ticketResponse = await this.helpers.request(ticketOptions);
				const ticket = ticketResponse.data.ticket;
				const csrfToken = ticketResponse.data.CSRFPreventionToken;
				
				authHeaders = {
					Cookie: `PVEAuthCookie=${ticket}`,
					CSRFPreventionToken: csrfToken,
				};
			} else {
				// Usar API Token
				const apiToken = (credentials as any).apiToken;
				authHeaders = {
					Authorization: `PVEAPIToken=${apiToken}`,
				};
			}

			const options = {
				method: 'GET' as IHttpRequestMethods,
				uri: `${serverIp}/api2/json/nodes`,
				headers: authHeaders,
				json: true,
				rejectUnauthorized: !ignoreSsl,
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
		const authMethod = (credentials as any).authMethod;
		const ignoreSsl = (credentials as any).ignoreSsl !== false;

		let authHeaders: any = {};

		const getAuthTicket = async () => {
			if (authMethod === 'userPass') {
				const username = (credentials as any).username;
				const password = (credentials as any).password;
				const ticketOptions = {
					method: 'POST' as IHttpRequestMethods,
					uri: `${serverIp}/api2/json/access/ticket`,
					form: { username, password },
					json: true,
					rejectUnauthorized: !ignoreSsl,
				};
				const ticketResponse = await this.helpers.request(ticketOptions);
				const ticket = ticketResponse.data.ticket;
				const csrfToken = ticketResponse.data.CSRFPreventionToken;
				authHeaders = {
					Cookie: `PVEAuthCookie=${ticket}`,
					CSRFPreventionToken: csrfToken,
				};
			} else {
				const apiToken = (credentials as any).apiToken;
				authHeaders = {
					Authorization: `PVEAPIToken=${apiToken}`,
				};
			}
		};

		await getAuthTicket();

		const proxmoxRequest = async (method: IHttpRequestMethods, path: string, body?: object) => {
			const options = {
				method,
				uri: `${serverIp}/api2/json${path}`,
				headers: authHeaders,
				json: true,
				body: body || undefined,
				rejectUnauthorized: !ignoreSsl,
			};
			return this.helpers.request(options);
		};

		for (let i = 0; i < items.length; i++) {
			const resource = this.getNodeParameter('resource', i) as string;
			const operation = this.getNodeParameter('operation', i) as string;
			let responseData: any;

			try {
				if (resource === 'vm') {
					const node = this.getNodeParameter('node', i) as string;
					let vmid: number;

					switch (operation) {
						case 'listVms':
							responseData = await proxmoxRequest('GET', `/nodes/${node}/qemu`);
							break;
						case 'getVm':
							vmid = this.getNodeParameter('vmid', i) as number;
							responseData = await proxmoxRequest('GET', `/nodes/${node}/qemu/${vmid}/config`);
							break;
						case 'createVm':
							const vmName = this.getNodeParameter('vmName', i) as string;
							const vmCores = this.getNodeParameter('vmCores', i) as number;
							const vmMemory = this.getNodeParameter('vmMemory', i) as number;
							const vmDiskSize = this.getNodeParameter('vmDiskSize', i) as number;
							const vmStorage = this.getNodeParameter('vmStorage', i) as string;
							responseData = await proxmoxRequest('POST', `/nodes/${node}/qemu`, { name: vmName, cores: vmCores, memory: vmMemory, sata0: `${vmStorage}:${vmDiskSize}` });
							break;
						case 'startVm':
							vmid = this.getNodeParameter('vmid', i) as number;
							responseData = await proxmoxRequest('POST', `/nodes/${node}/qemu/${vmid}/status/start`);
							break;
						case 'stopVm':
							vmid = this.getNodeParameter('vmid', i) as number;
							responseData = await proxmoxRequest('POST', `/nodes/${node}/qemu/${vmid}/status/stop`);
							break;
						case 'restartVm':
							vmid = this.getNodeParameter('vmid', i) as number;
							responseData = await proxmoxRequest('POST', `/nodes/${node}/qemu/${vmid}/status/reboot`);
							break;
						case 'deleteVm':
							vmid = this.getNodeParameter('vmid', i) as number;
							responseData = await proxmoxRequest('DELETE', `/nodes/${node}/qemu/${vmid}`);
							break;
						case 'cloneVm':
							vmid = this.getNodeParameter('vmid', i) as number;
							const targetNodeClone = this.getNodeParameter('targetNode', i) as string;
							responseData = await proxmoxRequest('POST', `/nodes/${node}/qemu/${vmid}/clone`, { target: targetNodeClone });
							break;
						case 'migrateVm':
							vmid = this.getNodeParameter('vmid', i) as number;
							const targetNodeMigrate = this.getNodeParameter('targetNode', i) as string;
							responseData = await proxmoxRequest('POST', `/nodes/${node}/qemu/${vmid}/migrate`, { target: targetNodeMigrate });
							break;

						case 'getVmStatus':
							vmid = this.getNodeParameter('vmid', i) as number;
							responseData = await proxmoxRequest('GET', `/nodes/${node}/qemu/${vmid}/status/current`);
							break;
					}
				} else if (resource === 'lxc') {
					const node = this.getNodeParameter('node', i) as string;
					let vmid: number;

					switch (operation) {
						case 'listContainers':
							responseData = await proxmoxRequest('GET', `/nodes/${node}/lxc`);
							break;
						case 'getContainer':
							vmid = this.getNodeParameter('vmid', i) as number;
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
								template: containerTemplate 
							});
							break;
						case 'startContainer':
							vmid = this.getNodeParameter('vmid', i) as number;
							responseData = await proxmoxRequest('POST', `/nodes/${node}/lxc/${vmid}/status/start`);
							break;
						case 'stopContainer':
							vmid = this.getNodeParameter('vmid', i) as number;
							responseData = await proxmoxRequest('POST', `/nodes/${node}/lxc/${vmid}/status/stop`);
							break;
						case 'restartContainer':
							vmid = this.getNodeParameter('vmid', i) as number;
							responseData = await proxmoxRequest('POST', `/nodes/${node}/lxc/${vmid}/status/reboot`);
							break;
						case 'deleteContainer':
							vmid = this.getNodeParameter('vmid', i) as number;
							responseData = await proxmoxRequest('DELETE', `/nodes/${node}/lxc/${vmid}`);
							break;
						case 'getContainerStatus':
							vmid = this.getNodeParameter('vmid', i) as number;
							responseData = await proxmoxRequest('GET', `/nodes/${node}/lxc/${vmid}/status/current`);
							break;
						case 'getContainerAgentStatus':
							vmid = this.getNodeParameter('vmid', i) as number;
							responseData = await proxmoxRequest('GET', `/nodes/${node}/lxc/${vmid}/agent/status`);
							break;
						case 'getContainerRrdData':
							vmid = this.getNodeParameter('vmid', i) as number;
							responseData = await proxmoxRequest('GET', `/nodes/${node}/lxc/${vmid}/rrddata`);
							break;
						case 'configureContainer':
							vmid = this.getNodeParameter('vmid', i) as number;
							const containerConfig = this.getNodeParameter('containerConfig', i) as object;
							responseData = await proxmoxRequest('PUT', `/nodes/${node}/lxc/${vmid}/config`, containerConfig);
							break;
					}
				}

				if (responseData) {
					const executionData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray(responseData.data || responseData),
						{ itemData: { item: i } },
					);
					returnData.push(...executionData);
				}

			} catch (error) {
				if (this.continueOnFail()) {
					const executionErrorData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray({ error: error.message }),
						{ itemData: { item: i } },
					);
					returnData.push(...executionErrorData);
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}




