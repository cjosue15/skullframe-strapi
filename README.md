This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Importes del checkout

Los precios de productos en Strapi (`producto.price`) se ingresan en soles, con hasta dos decimales: por ejemplo, `19.90`.

El servidor convierte los precios a céntimos antes de calcular y guardar una orden. Los campos `unitPrice`, `totalPrice`, `subtotalAmount`, `discountAmount` y `totalAmount` de las nuevas órdenes contienen enteros en céntimos. Por ejemplo, tres unidades de S/ 19.90 se guardan con `unitPrice: 1990` y `totalAmount: 5970`.

Al crear la orden de Mercado Pago, estos importes se convierten a textos en soles con dos decimales (`"19.90"` y `"59.70"`). Los precios con fracciones menores a un céntimo se rechazan; no se redondean silenciosamente.

Las pruebas de importes y del recorrido desde la creación en Strapi hasta la petición a Mercado Pago se ejecutan con `pnpm test`, usando servicios simulados.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
