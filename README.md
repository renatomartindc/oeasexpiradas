# Cadena update state

## Requisitos

a)	Instalar NodeJs 

        
	-Para Ubuntu : https://www.digitalocean.com/community/tutorials/como-instalar-node-js-en-ubuntu-18-04-es
	-Para Windows 7: https://www.ecodeup.com/como-instalar-node-js-y-su-gestor-de-paquetes-npm-en-windows/
        

b)      Clonar el script de Actualizacion de OEAs caducadas (JavaScript) ejecutando el siguiente comando:
 	
	
	git clone https://github.com/renatomartindc/oeasexpiradas.git
        
	
c)      Crear la carpera libreriaupdate y copiar los archivos descargados en el punto b.

d)	Ubicar todos los archivos descargados, en un mismo directorio de trabajo creado en el Nodo de la aplicación y el cual deber contar con todos los permisos.

e)	El script se ejecutará por defecto con el Usuario Administrador por lo que este deberá aparte del ROL Administrador, tener los siguientes roles:

        
	Registrador de Certificados
	
	Autorizador de Certificados
        

## Seteo


a) Abrir el archivo constants.ts ubicado en /libreriaupdate/src 

  1) Actualizar la variable “url” con el dominio backend correspondiente de cada Aduana como por ejemplo:
  
	https://cadenaco-backend.kaytrust.id
	
  2) En caso el password del usuario admin@gmail, haya sido modificado es necesario actualizarlo como sigue a continuación:  

         ```bash
         export const username = 'admin@gmail.com';
         export const password = 'Peru123456789@';
	 ```
	
## Compilación

Instalar las dependencias:
```bash
$ npm install
```

Compilar el código:
```bash
$ npm run build
```

ckecklist
You must view last version library in file "package.json"
```json
    {
    "name": "cadena-update-state",
    "version": "1.0.0",
    "description": "",
    "main": "dist/index.js",
    "scripts": {
        "start": "node dist/index.js",
        "build": "node node_modules/typescript/bin/tsc",
        "postinstall": "npm run build"
    }
```

## Cron configuracion

  - Crear el archivo "script.sh" dentro de la carpeta libreriaupdate con todos los permisos.
  - Abrir el archivo "script.sh" y editar lo siguiente:
  
  ```bash
    #!/bin/bash
	cd /home/{usuario_linux}/libreriaupdate
	echo "Inicio de ejecución"
	node dist/index.js
	echo "Fin de ejecución"
  ```

   - Regresar a linea de comandos y dentro de la carpeta libreriaupdate ejecutar el comando "crontab -e" y editar lo siguiente :

```bash
     0 22 * * * ~/libreriaupdate/script.sh
```

    Donde el primer y segundo valor indica la frecuencia (0=diaria) y hora de ejecucion, en nuestro caso el script se ejecutara todos los dias a las 22 horas. Queda
    libre a cada aduana actualizar la frecuencia y hora de ejecucion segun su preferencia, mas información en: https://www.pantz.org/software/cron/croninfo.html.





