# Proyecto de prueba NestJS y MongoDB

## Integrantes

- [Julián Reales](https://github.com/jrealesdelaossa)
- [Andres Castillo](https://github.com/AndresDevCastillo)
- [Oscar Durango](https://)
- [Luis Salgado](https://github.com/Luis-devs)

## Objetivo o proposito

Practicar el tema de las entidades para el proyecto del complementario _Diseño y Desarrollo de Sistemas_.

## Estandares

Al crear un dto los datos se deben declarar de tipo `readonly`.

```ts
export class Sede_Dto {
  @IsNotEmpty()
  @IsString()
  readonly nombre: string;
```

Para el nombre de las propiedades y de los métodos se usa el estilo _camelCase_ por ejemplo:

```ts
nombreSede

MiVariable_Nombre // incorrecta
miVariableNombre  // correcta

crear_sede()  // incorrecta
crearSede()   // correcta
```

Se dejan espacios entre cada contexto para que pueda ser mas legible al trabajar en equipo.

Estos estandares estan definidos de forma colectiva para tener un buen flujo de trabajo y no se eligieron de forma individual, su seguimiento garantiza un programa funcional y eficiente ademas que garantiza un buen trabajo en equipo.
