# workboard-backend

Small backend for Work Board. This README contains environment configuration and quick test steps for email/OTP functionality.

## Setup

1. Copy `.env.example` to `.env` in the project root:

```powershell
cp .env.example .env
# or on Windows PowerShell:
Copy-Item .env.example .env
```

2. Edit `.env` and fill in your values:
- `MONGO_URL` — your MongoDB connection string
- `MyNameIsMySecretKey` — JWT secret
- `EMAIL` and `EMAIL_PASSWORD` (or `EMAIL_USER` and `EMAIL_PASS`) — credentials for the mailer
- `BASE_URL` — API base URL
- Cloudinary credentials if you use uploads

### Gmail notes

- If your Gmail account has 2FA, create an App Password and use that value for `EMAIL_PASSWORD` or `EMAIL_PASS` (it is 16 characters, no spaces). Create an app password at Google Account > Security > App passwords.
- If you don't have 2FA, Google may still block sign-ins from less secure apps. Using an App Password or a transactional email provider (SendGrid/Mailgun) is recommended for production.

## Running the server

Start the server from project root:

```powershell
node .\index.js
# or
npm start
```

Watch the server console for these helpful messages added in the mailer code:

- `[MAILER] configured to use account: youraddress@example.com` — the account the app will use to send mail
- `Mailer is ready to send messages` — transporter verified and ready
- If credentials are missing you'll see explicit instructions printed and mail sends will fail with a clear error about missing credentials.

## Testing the OTP/email flow

- Register a new user via your frontend or call the registration endpoint — registration triggers a verification email.
- To test quickly without registering, use the password-reset endpoint which uses the same email path:

```powershell
Invoke-RestMethod -Method Post -Uri 'http://localhost:2000/user/request-password-reset' -ContentType 'application/json' -Body (@{ email = 'target@example.com' } | ConvertTo-Json)
```

Check server logs for `Verification email sent to ... MessageId: ...` or for explicit error messages.

## Troubleshooting

- If you see `Missing credentials for "PLAIN"` or `EAUTH` errors: verify you set `EMAIL`/`EMAIL_PASSWORD` (or `EMAIL_USER`/`EMAIL_PASS`) in `.env` and restart the server.
- If you see TLS errors like `self-signed certificate in certificate chain`, it's likely a local network/proxy issue — the mailer currently allows `tls.rejectUnauthorized = false` for local dev, but tighten this for production.
- If emails arrive in spam, add proper From headers and consider using a transactional email provider with domain authentication (SPF/DKIM).

## Next improvements (optional)

- Add a `/user/test-email` route for manual testing (I can add it if you want).
- Switch to a queue (Bull, RabbitMQ) for retries and durability in production.
