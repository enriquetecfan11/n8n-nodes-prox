import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class Proxmox implements ICredentialType {
	name = 'proxmoxApi';
	displayName = 'Proxmox API';
	properties: INodeProperties[] = [
		{
			displayName: 'Proxmox Server IP/Hostname',
			name: 'serverIp',
			type: 'string',
			default: '',
			placeholder: 'https://192.168.1.100:8006',
			description: 'The IP address or hostname of your Proxmox VE server, including port (e.g., https://192.168.1.100:8006)',
			required: true,
		},
		{
			displayName: 'API Token',
			name: 'apiToken',
			type: 'string',
			default: '',
			placeholder: 'user@pam!tokenid=apitokenvalue',
			description: 'Your Proxmox API Token in the format user@pam!tokenid=apitokenvalue',
			required: true,
		},
	];

	authTestOptions = {
		url: '={{$credentials.serverIp}}/api2/json/version',
		method: 'GET',
		headers: {
			Authorization: 'PVEAPIToken={{$credentials.apiToken}}',
		},
	};
}


