COMANDOS DE GIT

Para eliminar datos de una branch sin borrarlos de local
 git rm -r --cached "register" "register copy" 

Para actualizar carpetas especificas de otras branches
git checkout source_branch -- path/to/specific_folder
git add path/to/specific_folder
git commit -m "Merge specific folder from source_branch"
git push...


GUARMDE
Sitio web cuyo objetivo es registrar pacientes y generar un código QR que estará vinculado con información de un contacto de emergencia. Una vez escaneado el código QR, se enviará una alerta a través de WhatsApp/email, la cual incluirá una ubicación de Google Maps.

Website whose purpose is to register patients and generate a QR code linked to emergency contact information. Once the QR code is scanned, an alert will be sent via WhatsApp/email, including a Google Maps location.