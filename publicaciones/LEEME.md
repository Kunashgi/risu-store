# Cómo usar publicar.js

Abre una terminal en `F:\catalogo-ventas` y escribe:

```
node publicar.js
```

Se publica en 2 tandas al día:

| Mañana (~11:00–13:00) | Noche (~20:00–22:00) |
|---|---|
| Pelota Mikasa V200W ORIGINAL | Pelota Mikasa VNL |
| Cargador Xiaomi 120W | Cargador Xiaomi 67W |
| Vaso oso gorro verde | Vaso oso jockey rosa |
| Tiras nasales | Vaso Snoopy |
| Kit teclado + mouse | Mouse inalámbrico gamer |

- Antes de las 17:00 el script abre la tanda de la **mañana**; después, la de la **noche**.
- Para elegirla a mano: `node publicar.js --manana` o `node publicar.js --noche`.
- Si en la noche quedó algo pendiente de la mañana, te pregunta si quieres hacerlo primero.
- Las fotos quedan en `publicaciones/hoy/manana/` y `publicaciones/hoy/noche/`.
- Para cambiar qué producto va en cada tanda, edita `"tandas"` al inicio de `productos.json`.

Por cada producto:

1. Mira el precio y los grupos que debes marcar.
2. **Enter**: copia el título → pégalo en Facebook.
3. **Enter**: copia el precio → pégalo.
4. **Enter**: copia la descripción → pégala.
5. **Enter**: abre la carpeta → arrastra las fotos (la 1 es la portada).
6. **Enter**: lo marca como publicado y pasa al siguiente.

- `s` salta el producto y `q` sale. La próxima vez sigue donde quedaste.
- Al final te muestra qué productos del grupo B debes renovar.

Otros comandos:

- `node publicar.js --prueba`: para ver qué hace sin guardar nada (se puede combinar: `--manana --prueba`).
- `node publicar.js --validar`: revisa que estén bien los datos y las fotos.
- `node publicar.js --historial`: muestra lo publicado cada semana.
- `node publicar.js --nueva`: rehace las elecciones de esta semana.

Para cambiar textos, precios o grupos, edita `publicaciones/productos.json` y `grupos.json`.
Las fotos van en `imgenes-alter-facebook/<producto>/`.
