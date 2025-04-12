## 🚀 Chatting Chat

Este es un proyecto full stack con estructura separada en client/ y server/.

Deployed en https://chattingchat.onrender.com/


## 🍊 Vista previa


https://github.com/user-attachments/assets/86ca21cf-8445-41ef-aa8f-da4325f7fcc8


### Explicación 

- Tiene temas claro y oscuro, dependiendo de tu dispositivo.
  
- Puedes iniciar sesión o registrarte (credenciales de inicio se de sesión de ejemplo son correo: 2araceliponce@gmail.com, y contraseña: 2)
  
- Lo importante son los mensajes en tiempo real, que a la vez se guardan en una base de datos.

- Como extra: scroll horizontal, el select para ordenar/filtrar los lobbies, y el agrupado de mensajes de una misma fecha (como hace WhatsApp y más aplicaciones posiblemente).

El video podría acabar alrededor del min 1:40

Igualmente…

- Al crear un lobby el nombre es requerido y el emoji es opcional.

- Cuando creas un lobby, te redirige a este inmediatamente y eres parte de su array de usuarios.

- También te vuelves parte del array de usuarios, una vez dejes un mensaje en cualquiera de los lobbies existentes.


## 🧩 Requisitos previos

  -  Node.js (versión recomendada: 18+)  

  -  Una cuenta en MongoDB Atlas o una instancia local de MongoDB (MongoDBCompass)  


## 🛠️ Pasos para ejecutar en local

1. Clona este repositorio
```
git clone https://github.com/araceliponce/chatting-chat-v1.git
```
```
cd chatting-chat-v1
```

2. Instala dependencias raíz
```
npm install
```

3. Instala dependencias del cliente
```
cd client
```
```
npm install
```

4. Instala dependencias del servidor
```
cd ../server
```
```
npm install
```

5. Regresa a la raíz y ejecuta ambos en paralelo (usando concurrently)
```
cd ..
```
```
npm run both
```

## ⚙️ Variables de entorno

Cada carpeta (client/ y server/) contiene un archivo .env.example.

  -  Duplica esos archivos y renómbralos a .env.

  -  En el archivo .env dentro de server/, coloca tu URI de conexión de MongoDB:

```
MONGODB_URI="mongodb+srv://<usuario>:<contraseña>@<cluster>.mongodb.net/<nombre-de-tu-bd>?retryWrites=true&w=majority"
```

⚠️ Importante: Necesitarás crear tu propia base de datos y colección en MongoDB para que el backend funcione correctamente.
