# KZG Quest Hub - Landing Page

Landing page "Coming Soon" para el proyecto KZG Quest Hub en Bitcoin Cash.

## 🚀 Estructura de Archivos

```
kzg-quest-hub/
├── index.html      # Página principal
├── styles.css      # Estilos (diseño responsive)
├── script.js       # Lógica de idioma y formulario
└── README.md       # Este archivo
```

## 📋 Instrucciones de Deploy

### Paso 1: Subir a GitHub

1. Ve a https://github.com/new
2. Nombre del repositorio: `kzg-quest-hub`
3. Selecciona "Public" (o Private si prefieres)
4. NO marques "Add a README" (ya lo tenemos)
5. Click "Create repository"

6. En tu computadora, crea una carpeta y mete los 4 archivos (index.html, styles.css, script.js, README.md)

7. Abre terminal en esa carpeta y ejecuta:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/kzg-quest-hub.git
git push -u origin main
```

(O si prefieres arrastrar y soltar: en GitHub haz click en "uploading an existing file" y sube los 4 archivos)

### Paso 2: Conectar a Vercel

1. Ve a https://vercel.com/new
2. Login con tu cuenta de GitHub
3. Selecciona el repositorio `kzg-quest-hub`
4. Click "Deploy"
5. ¡Listo! Tu sitio estará en `https://kzg-quest-hub.vercel.app`

### Paso 3: Configurar Google Sheets (Para recibir emails)

1. Crea una nueva hoja de Google Sheets: https://sheets.new
2. Nombre: "KZG Waitlist"
3. En la primera fila pon estos headers:
   - A1: Email
   - B1: Timestamp
   - C1: Language
   - D1: Source

4. Ve a Extensions → Apps Script
5. Borra el código default y pega este:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    data.email,
    data.timestamp,
    data.lang,
    data.source
  ]);

  return ContentService.createTextOutput(JSON.stringify({result: "success"}))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return ContentService.createTextOutput("KZG Quest Hub API");
}
```

6. Guarda (Ctrl+S) y pon nombre "KZG Waitlist API"
7. Click en "Deploy" → "New deployment"
8. Tipo: Web app
9. Execute as: Me
10. Who has access: Anyone
11. Click "Deploy" y copia la URL que te dan

12. Ve a tu archivo `script.js` y reemplaza:
```javascript
const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_URL_HERE';
```
con la URL que copiaste.

13. Guarda, sube cambios a GitHub:
```bash
git add script.js
git commit -m "Add Google Sheets integration"
git push
```

14. Vercel se actualizará automáticamente.

## 🎨 Personalización

### Cambiar colores
Edita `:root` en `styles.css`:
- `--primary`: Color principal (púrpura actual)
- `--gold`: Color del logo (amarillo/dorado)
- `--accent`: Color de acento (cyan)

### Cambiar texto
Busca atributos `data-en` y `data-es` en `index.html` para modificar traducciones.

### Agregar Discord/Telegram
Busca la sección `<!-- Social Links -->` en index.html y añade:
```html
<a href="TU_LINK" target="_blank" class="social-link">
    [icono SVG]
    Nombre
</a>
```

## 📧 Notificaciones

Para recibir email cada vez que alguien se registra:

1. En Google Sheets: Extensions → Apps Script
2. Añade esta función:

```javascript
function sendNotification(e) {
  var email = e.values[0];
  var timestamp = e.values[1];

  MailApp.sendEmail({
    to: "kevinzambrano1308@gmail.com",
    subject: "Nuevo registro en KZG Waitlist",
    body: "Email: " + email + "\nFecha: " + timestamp
  });
}
```

3. En el editor de Apps Script, click en el reloj (Triggers) → Add Trigger
4. Choose function: sendNotification
5. Select event source: From spreadsheet
6. Select event type: On form submit

## 🌐 Dominio personalizado (Opcional)

Si compras un dominio (ej: kzgquest.com):

1. En Vercel: Project Settings → Domains
2. Add your domain
3. Sigue las instrucciones de DNS
4. Costo: ~$10-15/año en Namecheap o Cloudflare

## 🆘 Solución de problemas

**El formulario no envía:**
- Verifica que reemplazaste `YOUR_GOOGLE_SCRIPT_URL_HERE` en script.js
- Abre DevTools (F12) → Console para ver errores
- Asegúrate que el Google Script está deployado como "Anyone"

**Cambios no se ven:**
- Vercel tarda 30-60 segundos en redeployar
- Haz hard refresh: Ctrl+Shift+R (Windows) o Cmd+Shift+R (Mac)

**No llegan emails a Sheets:**
- Verifica que los headers en la hoja coincidan exactamente
- Revisa el quota de Apps Script (100 ejecuciones/día en plan gratis)

## 📱 Vista previa

La página es 100% responsive y se ve bien en:
- Desktop (1920px, 1440px, 1280px)
- Tablet (768px)
- Mobile (375px, 414px)

## 🔒 Seguridad

- El formulario valida emails básicos
- Google Sheets tiene autenticación implícita
- Considera añadir CAPTCHA si recibes spam
- No almacenes datos sensibles (la app solo guarda email)

---

¿Preguntas? Revisa la documentación de:
- [Vercel](https://vercel.com/docs)
- [Google Apps Script](https://developers.google.com/apps-script)
- [GitHub Pages](https://pages.github.com/) (alternativa a Vercel)

**KZG Quest Hub - Play Trivia, Earn Tokens! 🚀