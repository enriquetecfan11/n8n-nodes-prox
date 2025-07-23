import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class Proxmox implements ICredentialType {
	name = 'proxmoxApi';
	displayName = 'Proxmox API';
	properties: INodeProperties[] = [
		{
			displayName: 'Proxmox Server URL',
			name: 'serverIp',
			type: 'string',
			default: '',
			placeholder: 'http://192.168.1.100:8006 o https://192.168.1.100:8006',
			description: 'La URL completa de tu servidor Proxmox VE (puede ser HTTP o HTTPS)',
			required: true,
		},
		{
			displayName: 'Método de Autenticación',
			name: 'authMethod',
			type: 'options',
			options: [
				{
					name: 'Username/Password',
					value: 'userPass',
					description: 'Usar username y password para obtener ticket'
				},
				{
					name: 'API Token',
					value: 'apiToken',
					description: 'Usar token de API de Proxmox'
				},
			],
			default: 'userPass',
			description: 'Método de autenticación a utilizar',
			required: true,
		},
		{
			displayName: 'API Token',
			name: 'apiToken',
			type: 'string',
			default: '',
			placeholder: 'user@pam!tokenid=apitokenvalue',
			description: 'Tu token de API de Proxmox en formato user@pam!tokenid=apitokenvalue',
			displayOptions: {
				show: {
					authMethod: ['apiToken'],
				},
			},
			required: true,
		},
		{
			displayName: 'Username',
			name: 'username',
			type: 'string',
			default: '',
			placeholder: 'root@pam',
			description: 'Tu usuario de Proxmox (ej: root@pam)',
			displayOptions: {
				show: {
					authMethod: ['userPass'],
				},
			},
			required: true,
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'Tu contraseña de Proxmox',
			displayOptions: {
				show: {
					authMethod: ['userPass'],
				},
			},
			required: true,
		},
		{
			displayName: 'Ignorar errores SSL/TLS',
			name: 'ignoreSsl',
			type: 'boolean',
			default: true,
			description: 'Ignorar errores de certificados SSL/TLS (recomendado para certificados autofirmados)',
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