<?php
return [
    'app_name' => 'PunchOut Central',

    // Optional endpoint match token. Keep the same value in PUBLIC_BOOK_DEMO_TOKEN.
    'endpoint_token' => '',

    // Admin dashboard Basic Auth.
    'admin_username' => '',
    'admin_password' => '',

    // MySQL storage. The endpoint creates this table if it does not exist.
    'db_enabled' => false,
    'db_table' => 'book_demo_submissions',
    'db_host' => '127.0.0.1',
    'db_port' => '3306',
    'db_socket' => '',
    'db_database' => '',
    'db_username' => '',
    'db_password' => '',
    'db_charset' => 'utf8mb4',

    // Email delivery.
    'email_enabled' => false,
    'mailer' => 'smtp',
    'host' => 'smtp.hostinger.com',
    'port' => '465',
    'encryption' => 'ssl',
    'username' => 'hello@punchoutcentral.com',
    'password' => 'your-smtp-password',
    'from_address' => 'hello@punchoutcentral.com',
    'from_name' => 'PunchOut Central',
    'to' => 'hello@punchoutcentral.com',

    // Zoom Server-to-Server OAuth.
    'zoom_enabled' => false,
    'zoom_account_id' => '',
    'zoom_client_id' => '',
    'zoom_client_secret' => '',
    'zoom_user_id' => 'me',
    'zoom_meeting_duration_minutes' => '30',
    'zoom_registration_enabled' => true,
    'zoom_invitee_emails' => 'hello@punchoutcentral.com',
    'zoom_contact_name' => 'PunchOut Central',
    'zoom_contact_email' => 'hello@punchoutcentral.com',
    'zoom_meeting_topic_template' => 'PunchOut Central demo with ${company}',
    'zoom_meeting_agenda_template' => 'Demo requested by ${name} from ${company}. Buyer platform: ${platform}.',
];
