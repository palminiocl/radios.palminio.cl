# Backend de Radios.palminio.cl

Este directorio alberga los servicios backend de la aplicación Radios.palminio.cl, incluyendo una base de datos PostgreSQL y una interfaz Adminer para la gestión de la base de datos.

## Comandos útiles

- Inicializar la base de datos con Prisma:

    ```bash
    pnpm exec prisma db push
    ```

- Generar el cliente de Prisma:

    ```bash
    pnpm exec prisma generate
    ```

- Iniciar el servidor de desarrollo:

    ```bash
    pnpm dev
    ```

- Ejecutar migraciones (si aplica):

    ```bash
    pnpm exec prisma migrate deploy
    ```

