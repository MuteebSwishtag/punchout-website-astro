# Book Demo Integration

## What changed

- Replaced the placeholder `/book-demo/` form with a two-step booking flow.
- Kept the existing lead/buyer-details step as Step 1.
- Added the Swishtag-style date and time picker as Step 2.
- Did not add Swishtag's middle "solution interest" step.
- Added `public/api/book-demo.php` for form delivery.
- Added `.env.example` with email and Zoom configuration switches.

## How submission works

The form posts JSON to:

```env
PUBLIC_BOOK_DEMO_ENDPOINT=/api/book-demo.php
```

This project is still configured as a static Astro build. The endpoint is a PHP file under `public/api/`, so it works on hosting that can execute PHP at that path. If you deploy somewhere without PHP, point `PUBLIC_BOOK_DEMO_ENDPOINT` to another backend endpoint that accepts the same payload.

On Hostinger, keep the endpoint public but keep credentials private:

- Public endpoint: `public_html/api/book-demo.php`
- Private config: `/home/YOUR_ACCOUNT/punchout-book-demo-config.php`

The endpoint automatically checks outside `public_html` using `dirname($_SERVER['DOCUMENT_ROOT']) . '/punchout-book-demo-config.php'`.

You can also set an explicit config path:

```env
BOOK_DEMO_CONFIG_PATH=/home/YOUR_ACCOUNT/punchout-book-demo-config.php
```

The frontend sends these main fields:

- `name`
- `email`
- `company`
- `website`
- `platform`
- `storePlatform`
- `message`
- `selectedDate`
- `selectedDateISO`
- `selectedTime`
- `selectedTimeLabel`
- `timezone`
- `page`

## Enable email delivery

Recommended Hostinger setup:

1. Copy `punchout-book-demo-config.example.php`.
2. Rename the copy to `punchout-book-demo-config.php`.
3. Place it one folder above `public_html`.
4. Set `'email_enabled' => true`.
5. Fill in the SMTP values in that private config file.

Example private config values:

```php
<?php
return [
    'email_enabled' => true,
    'host' => 'smtp.hostinger.com',
    'port' => '465',
    'encryption' => 'ssl',
    'username' => 'hello@punchoutcentral.com',
    'password' => 'your-smtp-password',
    'from_address' => 'hello@punchoutcentral.com',
    'from_name' => 'PunchOut Central',
    'to' => 'hello@punchoutcentral.com',
];
```

Environment variable setup is also supported:

Set these environment variables on the hosting server:

```env
BOOK_DEMO_EMAIL_ENABLED=true
BOOK_DEMO_TO=hello@punchoutcentral.com
MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_ENCRYPTION=tls
MAIL_USERNAME=your-smtp-user
MAIL_PASSWORD=your-smtp-password
MAIL_FROM_ADDRESS=hello@punchoutcentral.com
MAIL_FROM_NAME=PunchOut Central
```

`BOOK_DEMO_TO` can contain multiple comma-separated recipients.

## Enable Zoom meetings

Create a Zoom Server-to-Server OAuth app and add these values to the same private config:

```php
'zoom_enabled' => true,
'zoom_account_id' => 'your-account-id',
'zoom_client_id' => 'your-client-id',
'zoom_client_secret' => 'your-client-secret',
'zoom_user_id' => 'me',
'zoom_meeting_duration_minutes' => '30',
'zoom_registration_enabled' => true,
'zoom_invitee_emails' => 'hello@punchoutcentral.com',
'zoom_contact_name' => 'PunchOut Central',
'zoom_contact_email' => 'hello@punchoutcentral.com',
```

Environment variable setup is also supported:

```env
BOOK_DEMO_ZOOM_ENABLED=true
ZOOM_ACCOUNT_ID=your-account-id
ZOOM_CLIENT_ID=your-client-id
ZOOM_CLIENT_SECRET=your-client-secret
ZOOM_USER_ID=me
ZOOM_MEETING_DURATION_MINUTES=30
ZOOM_REGISTRATION_ENABLED=true
ZOOM_INVITEE_EMAILS=hello@punchoutcentral.com
ZOOM_CONTACT_NAME=PunchOut Central
ZOOM_CONTACT_EMAIL=hello@punchoutcentral.com
```

Required Zoom scopes:

- `meeting:write:admin`
- `meeting:read:admin`
- `user:read:admin`

If `ZOOM_REGISTRATION_ENABLED=true`, the endpoint also creates a registrant for the submitted work email and returns the registrant join link to the success state.

## Optional endpoint token

You can set a simple endpoint match token:

```env
PUBLIC_BOOK_DEMO_TOKEN=some-shared-value
BOOK_DEMO_ENDPOINT_TOKEN=some-shared-value
```

This is not a secret because the public value is visible in the browser. It only helps avoid accidental cross-site posts to the endpoint.

## Deployment notes

- Keep SMTP and Zoom credentials only in the hosting environment.
- Do not commit real `.env` files.
- Do not place the real `punchout-book-demo-config.php` inside `public_html`.
- PHP must have `curl` enabled for Zoom.
- PHP must allow outbound SMTP sockets for email.
- If email and Zoom are both disabled, the endpoint validates and returns success, but no external delivery happens.
