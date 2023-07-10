# Next Ecommerce Dashboard

## Stacks

- Next.js
- TypeScript
- Tailwind CSS
- Clerk
- Cloudinary
- Prisma
- PostgreSQL

## Environment Variables

```bash
DATABASE_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=

# stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

FRONTEND_STORE_URL=http://localhost:3333
```

## Note

1. Stripe Webhook 관련

- Stripe Webhook은 Stripe에서 이벤트가 발생할 때마다 지정된 URL로 POST 요청을 보내는 기능입니다.
- Stripe Webhook을 사용하면 Stripe에서 발생하는 이벤트를 실시간으로 받아서 처리할 수 있습니다.
- Stripe Webhook을 사용하려면 Stripe Dashboard에서 Webhook URL을 등록해야 합니다.
- [링크](https://dashboard.stripe.com/test/webhooks/create?endpoint_location=local)
