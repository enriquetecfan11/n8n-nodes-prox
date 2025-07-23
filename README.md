![Banner image](https://user-images.githubusercontent.com/10284570/173569848-c624317f-42b1-45a6-ab09-f0ea3c247648.png)

# n8n-nodes-proxmox

Nodos personalizados para n8n que permiten interactuar con Proxmox VE mediante HTTP o HTTPS.

## Instalación

```bash
npm install n8n-nodes-proxmox
```

## Configuración de Credenciales

El nodo soporta conexiones HTTP y HTTPS con dos métodos de autenticación:

### 1. Username/Password (Recomendado)
Este método utiliza tickets de autenticación, similar al comando curl:

**Para HTTP (sin SSL):**
```bash
curl -d "username=root@pam&password=TU_PASSWORD" \
  http://TU_PROXMOX:8006/api2/json/access/ticket
```

**Para HTTPS (con SSL):**
```bash
curl -k -d "username=root@pam&password=TU_PASSWORD" \
  https://TU_PROXMOX:8006/api2/json/access/ticket
```

**Configuración:**
- **Proxmox Server URL**: `http://tu-proxmox:8006` o `https://tu-proxmox:8006`
- **Método de Autenticación**: `Username/Password`
- **Username**: `root@pam` (o tu usuario de Proxmox)
- **Password**: Tu contraseña de Proxmox
- **Ignorar errores SSL/TLS**: `true` (por defecto, recomendado)

### 2. API Token
**Configuración:**
- **Proxmox Server URL**: `http://tu-proxmox:8006` o `https://tu-proxmox:8006`
- **Método de Autenticación**: `API Token`
- **API Token**: `user@pam!tokenid=valor-del-token`
- **Ignorar errores SSL/TLS**: `true` (por defecto)

## Operaciones Soportadas

### Máquinas Virtuales (VM)
- Listar VMs
- Obtener configuración de VM
- Crear VM
- Iniciar/Parar/Reiniciar VM
- Clonar VM
- Migrar VM
- Eliminar VM

### Contenedores (LXC)
- Listar contenedores
- Crear contenedores
- Gestionar estado de contenedores
- Clonar y migrar contenedores

### Almacenamiento
- Gestionar pools de almacenamiento
- Subir ISOs
- Descargar templates
- Crear y eliminar volúmenes

### Cluster
- Estado del cluster
- Estadísticas de nodos
- Recursos del cluster

### Backups
- Crear backups
- Listar backups
- Restaurar desde backup
- Gestionar trabajos de backup

## Ejemplo de Uso

1. **Configura las credenciales** con la URL de tu servidor Proxmox (HTTP o HTTPS)
2. **Selecciona el recurso** (VM, Container, Storage, etc.)
3. **Elige la operación** a realizar
4. **Selecciona el nodo** de Proxmox donde ejecutar la operación
5. **Configura los parámetros** específicos de la operación

## Características

- ✅ Soporte para HTTP y HTTPS
- ✅ Autenticación con tickets (username/password)
- ✅ Autenticación con API tokens
- ✅ SSL/TLS opcional (ignorar certificados por defecto)
- ✅ Gestión completa de VMs y contenedores
- ✅ Operaciones de cluster y almacenamiento
- ✅ Sistema de backups integrado
- ✅ Interfaz en español

## Configuraciones de Conexión

### HTTP (Sin SSL) - Más Simple
```
URL: http://192.168.1.100:8006
Ignorar SSL: true (no aplica para HTTP)
```
**Ventajas:** Configuración más simple, sin problemas de certificados
**Desventajas:** Menos seguro para entornos de producción

### HTTPS (Con SSL)
```
URL: https://192.168.1.100:8006
Ignorar SSL: true (para certificados autofirmados)
```
**Ventajas:** Mayor seguridad
**Desventajas:** Requiere certificados válidos o ignorar SSL

## Seguridad

- Las contraseñas se almacenan de forma segura en las credenciales de n8n
- Soporte para HTTP y HTTPS
- SSL/TLS opcional para certificados autofirmados
- Tickets de autenticación con tiempo limitado para mayor seguridad

## Contribuir

¡Las contribuciones son bienvenidas! Por favor, abre un issue o pull request.

## Licencia

MIT
