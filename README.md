# React Reusable Tools

Este repositorio contiene hooks y funciones utilitarias que reutilizo en mis proyectos con React. El objetivo es tener un conjunto de herramientas reutilizables y fácilmente escalables.

## Contenido actual

### `useCounter.js`

Un hook personalizado para gestionar un contador simple con operaciones de incremento, decremento y reinicio.

```ts
import { useCounter } from './useCounter';

const { counter, decrement, increment, reset } = useCounter(20);
```

### `useFetch.js`

Hook personalizado para realizar operaciones CRUD con la API utilizando `fetch`. Soporta métodos `GET`, `POST`, `PUT`, `PATCH`, y `DELETE`.

#### Ejemplo de uso:

```ts
import { useFetch } from './useFetch';

const { data, isLoading, hasError, get, post } = useFetch('/api/endpoint', {
  autoFetch: true,
  headers: { Authorization: 'Bearer token' }
});
```

### `useForm.js`

Hook personalizado para gestionar formularios controlados en React. Permite manejo de estados, cambios de entrada, validación y reinicio del formulario.

#### Ejemplo de uso:

```ts
import { useForm } from './useForm';

const { formState, errors, onInputChange, onResetForm, isValid } = useForm(
  { name: '', email: '' },
  (formState) => {
    const errors = {};
    if (!formState.name) errors.name = 'Name is required';
    if (!formState.email) errors.email = 'Email is required';
    return errors;
  }
);
```

## ¿Cómo usar?

1. Copia el hook o función que necesites en tu proyecto.
2. O puedes instalarlo como paquete (futuro).

## Autor

Hecho por [KaguilarA](https://github.com/KaguilarA).
