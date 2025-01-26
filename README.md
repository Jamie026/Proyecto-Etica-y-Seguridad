<body>
    <div>
        <h1>📊 Sistema de Análisis de Churn y Administración de Empleados</h1>
        <p>
            Este proyecto es una <strong>aplicación web</strong> diseñada para
            ayudar a los empleados de un banco a
            <strong>analizar el churn</strong> (tasa de abandono de clientes) y
            prevenir la salida de usuarios mediante estrategias predictivas.
            Además, proporciona un módulo de
            <strong>gestión de empleados</strong>, asegurando que solo personal
            autorizado tenga acceso a información confidencial.
        </p>
        <h2>🚀 Funcionalidades Principales</h2>
        <ul>
            <li>
                ✔️ Monitoreo proactivo del comportamiento de los usuarios con el
                fin de predecir y prevenir su deserción.
            </li>
            <li>
                🔒 Control detallado sobre las funciones y niveles de acceso que
                cada empleado tiene dentro del sistema.
            </li>
            <li>
                👥 Solo los administradores tienen la facultad de gestionar
                cuentas de otros empleados y sus permisos.
            </li>
            <li>
                ⚠️ Acceso limitado a datos de clientes y personal, garantizando
                que solo quienes lo necesitan puedan ver esta información.
            </li>
            <li>
                🔐 Validación de roles y permisos en cada acción crítica,
                garantizando un entorno seguro y regulado.
            </li>
            <li>
                📧 Mayor protección en los inicios de sesión, exigiendo la
                verificación mediante códigos enviados al correo del usuario.
            </li>
            <li>
                🌐 Todo el tráfico se maneja bajo HTTPS, asegurando la
                confidencialidad de la información y evitando accesos no
                autorizados.
            </li>
        </ul>
        <h2>🛠️ Tecnologías Utilizadas</h2>
        <div class="tech-icons">
            <img
                src="https://img.icons8.com/color/48/000000/nodejs.png"
                alt="Node.js"
            />
            <img
                src="https://img.icons8.com/color/48/000000/mysql-logo.png"
                alt="MySQL"
            />
            <img
                src="https://img.icons8.com/color/48/000000/bootstrap.png"
                alt="Bootstrap"
            />
            <img
                src="https://cdn.iconscout.com/icon/free/png-256/free-handlebars-logo-icon-download-in-svg-png-gif-file-formats--company-brand-world-logos-vol-9-pack-icons-282936.png"
                alt="Handlebars"
                style="width: 30px; height: 30px"
            />
            <img
                src="https://img.icons8.com/color/48/000000/css3.png"
                alt="CSS3"
            />
            <img
                src="https://img.icons8.com/color/48/000000/javascript--v1.png"
                alt="JavaScript"
            />
        </div>
        <h2>🔒 Seguridad</h2>
        <ul>
            <li>
                Implementación de un middleware que verifica los roles de
                usuario, asegurando que cada persona tenga el nivel de acceso
                adecuado.
            </li>
            <li>
                Proceso de inicio de sesión que incluye una verificación
                adicional mediante códigos enviados por correo electrónico,
                añadiendo una capa extra de seguridad.
            </li>
            <li>
                Implementación de certificados SSL que garantizan la seguridad
                en la transmisión de información a través de la red, manteniendo
                la confidencialidad.
            </li>
            <li>
                Todos los datos sensibles, como las contraseñas de los empleados
                o la información de las tarjetas de los clientes, se cifran
                utilizando AES directamente en la base de datos o se envían ya
                cifrados desde el servidor mediante una librería especializada.
                Aunque un empleado tenga acceso a la lista de clientes, no podrá
                ver sus datos confidenciales a menos que cuente con la clave de
                descifrado adecuada.
            </li>
            <li>
                Se llevan a cabo validaciones exhaustivas en todos los
                formularios para mitigar el riesgo de ataques de inyección SQL,
                asegurando la integridad de la base de datos.
            </li>
            <li>
                La cookie de sesión se encripta con una llave específica, que
                también se utiliza para desencriptarla en cada solicitud,
                asegurando así la identidad del usuario en cada interacción.
            </li>
            <li>
                Los logs de las acciones realizadas en la base de datos no se
                registran en el log general de MySQL, sino en una tabla de logs
                propia. Triggers personalizados registran cada acción relevante,
                asegurando un historial de auditoría preciso y centralizado.
            </li>
        </ul>
        <h2>🛡️ Privacidad</h2>
        <ul>
            <li>
                Al registrar a un empleado, se le enviará un correo detallando
                la información guardada en nuestra base de datos, el uso
                previsto de dichos datos y sus credenciales de acceso.
            </li>
            <li>
                El correo incluirá dos enlaces: uno para acceder a las políticas
                de privacidad, donde se notificará al empleado sobre cualquier
                cambio, y otro enlace para eliminar sus datos fácilmente si lo
                desea.
            </li>
            <li>
                El empleado podrá eliminar su cuenta desde la sección "Mi
                Perfil" una vez que tenga acceso. Para ello, deberá tener
                permisos de un administrador.
            </li>
            <li>
                El empleado podrá ingresar sus credenciales, pero no tendrá
                acceso a las funcionalidades del sistema hasta que un
                administrador le otorgue los permisos correspondientes. Estos
                permisos pueden solicitarse desde la sección de "Soporte".
            </li>
            <li>
                En "Mi Perfil", el empleado podrá visualizar, descargar en un
                formato legible, corregir o eliminar permanentemente sus datos
                de la base de datos.
            </li>
            <li>
                El empleado tendrá la opción de restringir la visibilidad de su
                nombre de usuario, decidiendo si los administradores pueden
                verlo o no.
            </li>
            <li>
                Las contraseñas serán cifradas tanto al momento del registro
                como cuando se actualicen, garantizando su seguridad.
            </li>
            <li>
                Se implementará autenticación de múltiples factores (MFA)
                mediante el envío de códigos a través de correo electrónico para
                cada inicio de sesión.
            </li>
        </ul>
        <h2>🔍 Anonimización</h2>
        <ul>
            <li>
                Para proteger la privacidad de los datos sensibles, se aplican
                diferentes técnicas de anonimización:
            </li>
            <ul>
                <li>
                    Hashing: Se utiliza en columnas donde los datos deben
                    mantenerse privados pero identificables en una forma cifrada
                    y única.
                </li>
                <li>
                    Binning: Categorización de datos en rangos para reducir la
                    especificidad, lo cual es útil en análisis no precisos.
                </li>
                <li>
                    Privacidad Diferencial: En columnas como balance y salario,
                    se calcula un promedio general con un óptimo valor de
                    epsilon mediante gráficos estadísticos. Esto permite el
                    análisis sin exponer detalles específicos.
                </li>
                <li>
                    Ocultación parcial: En columnas como el ID del cliente y la
                    tarjeta de crédito, solo se muestran los últimos cuatro
                    caracteres. Para el email, se muestran los primeros dos
                    caracteres, seguido de asteriscos hasta el dominio.
                </li>
            </ul>
        </ul>
        <h2>📂 Estructura del Proyecto</h2>
        <pre>
      /src
      ├── /config         # Configuraciones de la aplicación
      ├── /controllers    # Lógica de negocio
      ├── /node_modules   # Dependencias instaladas
      ├── /public         # Archivos estáticos (CSS, JS)
      ├── /routes         # Rutas Express
      ├── /SQL            # Scripts SQL para la base de datos
      ├── /SSL            # Certificados SSL
      ├── /views          # Plantillas Handlebars
      └── .env            # Variables de entorno
      index.js            # Archivo principal del servidor
      package.json        # Dependencias y configuración del proyecto
      package-lock.json   # Versión fija de dependencias
      .gitignore          # Archivos ignorados por Git
      </pre
        >
        <h2>📖 Instalación y Uso</h2>
        <ol>
            <li>
                Clonar el repositorio:
                <pre><code>git clone https://github.com/Jamie026/proyectoEyS.git</code></pre>
            </li>
            <li>
                Instalar las dependencias:
                <pre><code>npm install</code></pre>
            </li>
            <li>
                Crear llave y certificado para servidor HTTPS. Instrucciones:
                <a 
                    href="https://medium.com/@nitinpatel_20236/how-to-create-an-https-server-on-localhost-using-express-366435d61f28"
                    >How To Create an HTTPS Server on Localhost using Express</a
                >.
            </li>
            <li>
                Configurar las variables de entorno en un archivo
                <code>.env</code>.
            </li>
            <li>
                Generar la data de clientes en
                <a
                    href="https://colab.research.google.com/drive/1LVam6HqrbkRnl0gQY7cwTCZfaGofqmUO?usp=sharing"
                    >Google Colab</a
                >.
            </li>
            <li>
                Iniciar el servidor:
                <pre><code>node index.js</code></pre>
            </li>
            <li>
                Acceder a la aplicación en
                <a href="https://localhost:3000">https://localhost:3000</a>.
            </li>
        </ol>
    </div>
</body>
