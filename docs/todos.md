# Tareas pendientes del checkout

Esta checklist acompaña al [documento conceptual del flujo de checkout](checkout.md). Los elementos marcados reflejan el código actual; los demás siguen pendientes.

1. **Estados y reglas para reutilizar una orden**

   - [x] Guardar `providerStatus` y `providerStatusDetail` como strings opcionales, conservando los valores originales de Mercado Pago.
   - [x] Interpretar los estados y decidir si corresponde continuar, consultar, mostrar un estado cerrado o iniciar otro intento mediante `order-state.ts`.
   - [x] Consultar siempre Mercado Pago antes de reutilizar una orden, incluso cuando Strapi ya tiene `checkoutUrl`; una URL guardada no confirma que el intento siga disponible.
   - [x] Para una orden pendiente y válida, permitir continuar con el intento existente sin crear otro cobro.
   - [x] Para una orden cancelada o expirada, exigir un nuevo intento explícito.
   - [x] Mostrar al menos los estados de pago pendiente, confirmado y cerrado según la decisión del proveedor.
   - [x] Cuando el conflicto de datos exige abandonar la clave, generar una nueva clave y hacer un único reintento; una orden cerrada que admite otra compra también requiere la acción explícita del comprador.
   - [ ] Al confirmar un pago, mostrar la compra y la entrega detalladas. La confirmación síncrona mediante `POST /api/checkout` está implementada; la reconciliación automática vía webhook sigue pendiente, y la compra y la entrega detalladas quedan pendientes en los puntos 3 y 4.

2. **Webhook y procesamiento sin duplicados**

   - [x] Validar la firma de cada notificación en la recepción, usando `x-signature`, `x-request-id` y el único `data.id` de la query.
   - [x] Validar la estructura JSON mínima: objeto raíz, `type` string y `data` objeto.
   - [x] Exigir que `body.data.id` sea string y compararlo con el ID de query después de normalizar espacios exteriores y mayúsculas/minúsculas.
   - [x] Responder con cuerpo vacío y registrar solo razones controladas, sin cuerpo, secreto ni firma.
   - [ ] Consultar la orden real en Mercado Pago antes de aplicar el evento.
   - [ ] Comprobar `external_reference`, importe y moneda contra la orden local.
   - [ ] Actualizar Strapi con el estado reconciliado.
   - [ ] Evitar duplicar la entrega y los correos ante eventos repetidos, desactualizados o concurrentes.
   - [ ] Tolerar que llegue un evento antes de guardar `providerOrderId`, relacionándolo mediante `external_reference`.

3. **Página de resultado conectada con la orden**

   - [ ] Sustituir la página estática `/checkout/success` por una consulta que identifique la compra de forma segura.
   - [ ] Mostrar confirmado, pendiente o fallido según el estado reconciliado.
   - [ ] Esperar el webhook y actualizar la vista cuando el estado cambie.
   - [ ] Tratar el retorno antes del webhook sin conceder acceso prematuramente.
   - [ ] Mantener claro que abrir la URL de retorno nunca confirma por sí solo el pago.

4. **Entrega digital y acceso a archivos**

   - [ ] Definir el almacenamiento de los archivos vendibles.
   - [ ] Definir el campo del producto que identifica el archivo vendible.
   - [ ] Conceder acceso autorizado solo después de un pago aprobado, con token y vencimiento.
   - [ ] Comprobar que la compra está pagada antes de entregar un archivo.
   - [ ] Definir cuándo `COMPLETED` representa la entrega efectivamente realizada.

5. **Correo de confirmación y recuperación de entregas fallidas**

   - [ ] Enviar al correo guardado un resumen de la compra y el acceso correspondiente.
   - [ ] Registrar cada envío y añadir reintentos sin duplicados.
   - [ ] Mantener aprobado el pago aunque falle el correo.
   - [ ] Dejar la entrega fallida en un estado recuperable.

6. **Reglas de productos y cantidades**

   - [x] Recibir IDs de productos y cantidades como parte del intento.
   - [x] Validar en el servidor que los IDs y cantidades sean enteros positivos seguros y que no haya IDs repetidos.
   - [x] Calcular precios e importes en el servidor a partir del catálogo, conservando los importes de la orden en céntimos.
   - [ ] Definir límites de compra para artículos y cantidades.
   - [ ] Definir las reglas de unidades para productos digitales.
   - [ ] Avisar si el precio vigente del servidor cambió respecto del carrito local antes de cobrar.
   - [ ] Decidir si se restringen los productos físicos o si se implementan dirección, envío y stock.

7. **Cerrar la experiencia del carrito**

   - [ ] Retirar únicamente los artículos comprados después de confirmar el pago.
   - [ ] Preservar los artículos añadidos o modificados mientras el pago estaba en curso.

Antes de producción:

- [ ] Usar el correo real de la orden en `payer.email`; el payload actual conserva un correo fijo de prueba.
- [ ] Revisar los permisos de acceso a órdenes en Strapi.
- [ ] Definir la recuperación de compras pendientes y de entregas fallidas mediante notificaciones o un proceso de recuperación.

Las pruebas automatizadas del flujo quedan aplazadas por indicación del usuario. Este documento describe el código actual y no acredita una compra completa ejecutada contra Mercado Pago.
