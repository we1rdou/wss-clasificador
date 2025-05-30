# WSS Clasificador

## Descripción
Este proyecto es un clasificador basado en Node.js que utiliza la biblioteca Baileys para interactuar con WhatsApp. Permite recibir, clasificar y registrar mensajes en un historial, además de mostrar estadísticas y mensajes en un dashboard web.

## Estructura del proyecto
- `src/`: Contiene el código fuente.
  - `api/`: Rutas y controladores de la API.
  - `bot/`: Lógica relacionada con bots para interactuar con WhatsApp.
  - `config/`: Configuración global del proyecto.
  - `dashboard/`: Lógica y archivos del dashboard web.
  - `utils/`: Funciones auxiliares para soporte del proyecto.
- `tests/`: Pruebas unitarias e integración.
- `public/`: Archivos estáticos para el dashboard.
- `logs/`: Archivos de registro para depuración.
- `sesion/`: Archivos relacionados con la autenticación de WhatsApp.

## Instalación
1. Clona el repositorio:
   ```bash
   git clone <url-del-repositorio>
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```

## Uso
1. Inicia el servidor:
   ```bash
   npm start
   ```
2. Escanea el código QR que aparece en la terminal para conectar tu cuenta de WhatsApp.
3. Accede al dashboard en tu navegador en `http://localhost:<puerto>`.

## Funcionalidades
- **Clasificación de mensajes**: Identifica y clasifica mensajes de texto, imágenes, audios, videos, documentos, ubicaciones, contactos, encuestas y reacciones.
- **Historial de mensajes**: Registra los mensajes recibidos en el archivo `historial.json`.
- **Dashboard web**: Muestra estadísticas y mensajes registrados en una interfaz gráfica.
- **Soporte para mensajes enviados a uno mismo**: Detecta y maneja mensajes enviados a tu propio número.

## Configuración
El archivo de configuración se encuentra en `src/config/config.js`. Puedes ajustar el puerto del servidor y otras opciones según tus necesidades.

## Dependencias
- [Baileys](https://github.com/adiwajshing/Baileys): Biblioteca para interactuar con WhatsApp.
- [Express](https://expressjs.com/): Framework para crear el servidor web.
- [QRCode-Terminal](https://www.npmjs.com/package/qrcode-terminal): Generación de códigos QR en la terminal.

## Contribución
1. Crea un fork del repositorio.
2. Crea una rama para tu funcionalidad o corrección:
   ```bash
   git checkout -b mi-nueva-funcionalidad
   ```
3. Realiza tus cambios y haz un commit:
   ```bash
   git commit -m "Agregué una nueva funcionalidad"
   ```
4. Envía tus cambios:
   ```bash
   git push origin mi-nueva-funcionalidad
   ```
5. Abre un pull request en el repositorio original.

## Licencia
Este proyecto está bajo la licencia MIT. Consulta el archivo `LICENSE` para más detalles.
