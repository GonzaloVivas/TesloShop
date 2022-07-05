# Teslo Shop
Para ejecutar localmente esta aplicación se requiere una base de datos:
```
docker-compose up -d
```

* El flag -d corresponde a __detached__

* URL local de MongoDB:
```
mongodb://localhost:27017/teslodb
```

## Configurar las variables de entorno
Renombrar el archivo __.env.example__ a __.env__

## Instalar node modules y levantar Next
```
yarn install
yarn dev
```

## Llenar la base de datos con el seeder:
Realizar get a `http://localhost:3000/api/seed`