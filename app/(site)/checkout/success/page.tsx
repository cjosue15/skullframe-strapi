export default async function CheckoutSuccess() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-paper px-4 text-center'>
      <h1 className='mb-4 text-3xl font-bold text-ink'>¡Gracias por tu compra!</h1>
      <p className='text-lg text-ink'>
        Hemos recibido tu pedido y te enviaremos un correo electrónico con los detalles de la transacción.
      </p>
    </div>
  );
}
