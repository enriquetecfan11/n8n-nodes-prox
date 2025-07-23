# Ejemplos de Uso - Nodo Proxmox para n8n

## 🔧 Configuración Inicial

### Paso 1: Configurar Credenciales

1. En n8n, ve a **Settings** > **Credentials**
2. Haz clic en **Add credential**
3. Busca y selecciona **Proxmox API**
4. Configura los siguientes campos:

#### Opción A: HTTP (Sin SSL) - MÁS SIMPLE
```
Proxmox Server URL: http://192.168.1.100:8006
Método de Autenticación: Username/Password
Username: root@pam
Password: tu_contraseña_proxmox
Ignorar errores SSL/TLS: true (por defecto)
```

#### Opción B: HTTPS (Con SSL)
```
Proxmox Server URL: https://192.168.1.100:8006
Método de Autenticación: Username/Password
Username: root@pam
Password: tu_contraseña_proxmox
Ignorar errores SSL/TLS: true (para certificados autofirmados)
```

### Paso 2: Verificar Conexión

El nodo automáticamente verificará la conexión cuando configures las credenciales.

## 📋 Ejemplos Prácticos

### 1. Listar todas las VMs de un nodo

**Configuración del nodo:**
- **Resource:** Virtual Machine (VM)
- **Operation:** List VMs
- **Node:** pve (o el nombre de tu nodo Proxmox)

**Resultado:** Lista de todas las máquinas virtuales con su ID, nombre, estado, etc.

### 2. Iniciar una VM específica

**Configuración del nodo:**
- **Resource:** Virtual Machine (VM)
- **Operation:** Start VM
- **Node:** pve
- **VM ID:** 101 (ID de tu VM)

**Resultado:** La VM se iniciará y recibirás confirmación del estado.

### 3. Crear una nueva VM

**Configuración del nodo:**
- **Resource:** Virtual Machine (VM)
- **Operation:** Create VM
- **Node:** pve
- **VM Name:** mi-nueva-vm
- **VM Cores:** 2
- **VM Memory (MB):** 2048
- **VM Disk Size (GB):** 20
- **VM Storage:** local-lvm

### 4. Obtener estado del cluster

**Configuración del nodo:**
- **Resource:** Cluster
- **Operation:** Get Cluster Status

**Resultado:** Información completa del estado del cluster Proxmox.

### 5. Crear backup de una VM

**Configuración del nodo:**
- **Resource:** Backup
- **Operation:** Create Backup
- **Node:** pve
- **VM ID:** 101
- **Storage ID:** local
- **Backup Type:** VM
- **Description:** Backup automático desde n8n

## 🔄 Flujos de Trabajo Comunes

### Flujo 1: Monitoreo Automático de VMs

```
1. [Schedule Trigger] - Cada 5 minutos
   ↓
2. [Proxmox] - List VMs
   ↓
3. [Function] - Filtrar VMs con estado "stopped"
   ↓
4. [Discord/Slack] - Enviar notificación si hay VMs paradas
```

### Flujo 2: Backup Automático

```
1. [Cron] - Todos los días a las 2:00 AM
   ↓
2. [Proxmox] - List VMs
   ↓
3. [Function] - Filtrar VMs críticas
   ↓
4. [Proxmox] - Create Backup para cada VM
   ↓
5. [Email] - Enviar reporte de backups
```

### Flujo 3: Provisión Automática de VMs

```
1. [Webhook] - Recibir solicitud de nueva VM
   ↓
2. [Function] - Procesar parámetros
   ↓
3. [Proxmox] - Create VM
   ↓
4. [Proxmox] - Start VM
   ↓
5. [HTTP Response] - Confirmar creación
```

## 🌐 Opciones de Conexión

### HTTP (Sin SSL) - RECOMENDADO PARA EMPEZAR
✅ **Ventajas:**
- Configuración muy simple
- Sin problemas de certificados
- Funciona inmediatamente
- Ideal para redes locales

❌ **Desventajas:**
- Menos seguro para internet
- Datos no encriptados

**URL de ejemplo:** `http://192.168.1.100:8006`

### HTTPS (Con SSL)
✅ **Ventajas:**
- Mayor seguridad
- Datos encriptados
- Mejor para acceso remoto

❌ **Desventajas:**
- Requiere certificados válidos
- Más complejo de configurar

**URL de ejemplo:** `https://192.168.1.100:8006`

## 🔐 Autenticación por Tickets vs API Tokens

### Username/Password (Tickets)
✅ **Ventajas:**
- Fácil de configurar
- Usa las credenciales existentes
- Tokens automáticos con expiración

❌ **Desventajas:**
- Requiere credenciales de usuario completas
- Menos granularidad de permisos

### API Tokens
✅ **Ventajas:**
- Mayor seguridad
- Permisos granulares
- No expone contraseñas de usuario

❌ **Desventajas:**
- Requiere configuración adicional en Proxmox
- Más complejo de configurar

## 📝 Comandos curl Equivalentes

Tu nodo de Proxmox ahora replica estos comportamientos:

### HTTP (Sin SSL)
```bash
# 1. Obtener ticket (lo hace automáticamente el nodo)
curl -d "username=root@pam&password=TU_PASSWORD" \
  http://TU_PROXMOX:8006/api2/json/access/ticket

# 2. Usar el ticket para hacer peticiones (manejado internamente)
curl -H "Cookie: PVEAuthCookie=TICKET" \
  -H "CSRFPreventionToken: TOKEN" \
  http://TU_PROXMOX:8006/api2/json/nodes
```

### HTTPS (Con SSL)
```bash
# 1. Obtener ticket (lo hace automáticamente el nodo)
curl -k -d "username=root@pam&password=TU_PASSWORD" \
  https://TU_PROXMOX:8006/api2/json/access/ticket

# 2. Usar el ticket para hacer peticiones (manejado internamente)
curl -k -H "Cookie: PVEAuthCookie=TICKET" \
  -H "CSRFPreventionToken: TOKEN" \
  https://TU_PROXMOX:8006/api2/json/nodes
```

## 🐛 Resolución de Problemas

### Error de conexión
- **HTTP:** Verifica que la URL sea `http://IP:8006`
- **HTTPS:** Verifica que la URL sea `https://IP:8006`
- Confirma que el puerto sea correcto (por defecto 8006)
- Asegúrate de que el servidor Proxmox esté accesible desde n8n

### Error de certificado SSL (Solo HTTPS)
Si ves errores de certificado SSL:
- Establece **Ignorar errores SSL/TLS** en `true`
- O usa HTTP en su lugar: `http://` en lugar de `https://`
- O configura certificados válidos en tu servidor Proxmox

### Error de autenticación
- Verifica que el username incluya el realm (`@pam`, `@pve`, etc.)
- Confirma que la contraseña sea correcta
- Asegúrate de que el usuario tenga permisos en Proxmox

### Problemas de red
- **Red local:** Usa HTTP para simplificar
- **Acceso remoto:** Usa HTTPS con SSL ignorado o configurado
- Verifica firewalls y reglas de red

## 💡 Recomendaciones

1. **Para empezar:** Usa HTTP con tu IP local
2. **Para producción:** Configura HTTPS con certificados válidos
3. **Para desarrollo:** HTTP es más que suficiente
4. **Para acceso remoto:** HTTPS con SSL ignorado funciona bien

## 📚 Recursos Adicionales

- [Documentación oficial de Proxmox API](https://pve.proxmox.com/pve-docs/api-viewer/)
- [Guía de configuración de usuarios en Proxmox](https://pve.proxmox.com/wiki/User_Management)
- [Configuración de certificados SSL en Proxmox](https://pve.proxmox.com/wiki/Certificate_Management)
- [Documentación de n8n](https://docs.n8n.io/) 