const escapeHtml = (value = '') =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

const appName = 'Festivio';
const appTagline = 'Plan. Coordinate. Deliver.';

const brandMark = `
  <div style="display:inline-flex;align-items:center;gap:12px">
    <div style="width:44px;height:44px;border-radius:16px;background:linear-gradient(135deg,#6f6cf6 0%,#3b82f6 100%);box-shadow:0 18px 45px rgba(80,91,230,.32);display:inline-flex;align-items:center;justify-content:center;color:#ffffff;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-weight:900;font-size:18px;letter-spacing:-.04em">F</div>
    <div style="text-align:left">
      <div style="font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-weight:850;font-size:22px;line-height:1;color:#111317;letter-spacing:-.04em">Festivio</div>
      <div style="font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-weight:650;font-size:11px;line-height:1.4;color:#7b8190;letter-spacing:.08em;text-transform:uppercase;margin-top:5px">${appTagline}</div>
    </div>
  </div>`;

const baseText = ({ greeting, intro, ctaLabel, ctaUrl, note, securityNote }) => [
  greeting,
  '',
  intro,
  '',
  `${ctaLabel}: ${ctaUrl}`,
  '',
  note,
  '',
  securityNote,
  '',
  `${appName} — ${appTagline}`,
].join('\n');

const renderEmail = ({
  preheader,
  eyebrow,
  title,
  greeting,
  intro,
  ctaLabel,
  ctaUrl,
  note,
  securityNote,
}) => {
  const safe = {
    preheader: escapeHtml(preheader),
    eyebrow: escapeHtml(eyebrow),
    title: escapeHtml(title),
    greeting: escapeHtml(greeting),
    intro: escapeHtml(intro),
    ctaLabel: escapeHtml(ctaLabel),
    ctaUrl: escapeHtml(ctaUrl),
    note: escapeHtml(note),
    securityNote: escapeHtml(securityNote),
  };

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>${safe.title}</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f2;color:#111317;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;-webkit-font-smoothing:antialiased">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${safe.preheader}</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:radial-gradient(circle at top left,rgba(111,108,246,.18),transparent 32%),radial-gradient(circle at top right,rgba(59,130,246,.16),transparent 30%),#f5f5f2;padding:32px 16px">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;margin:0 auto">
          <tr>
            <td style="padding:10px 0 24px;text-align:center">${brandMark}</td>
          </tr>
          <tr>
            <td style="border:1px solid rgba(255,255,255,.78);border-radius:30px;background:linear-gradient(145deg,rgba(255,255,255,.86),rgba(255,255,255,.58));box-shadow:0 32px 90px rgba(17,24,39,.10);overflow:hidden">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding:40px 40px 22px">
                    <div style="display:inline-block;padding:7px 11px;border-radius:999px;background:rgba(111,108,246,.10);border:1px solid rgba(111,108,246,.18);color:#5652e8;font-weight:800;font-size:11px;letter-spacing:.08em;text-transform:uppercase">${safe.eyebrow}</div>
                    <h1 style="margin:18px 0 0;font-size:34px;line-height:1.08;letter-spacing:-.05em;color:#111317;font-weight:850">${safe.title}</h1>
                    <p style="margin:22px 0 0;font-size:16px;line-height:1.7;color:#4b5563">${safe.greeting}</p>
                    <p style="margin:12px 0 0;font-size:16px;line-height:1.7;color:#4b5563">${safe.intro}</p>
                    <table role="presentation" cellspacing="0" cellpadding="0" style="margin:30px 0 0">
                      <tr>
                        <td style="border-radius:14px;background:#111317;box-shadow:0 16px 34px rgba(17,19,23,.20)">
                          <a href="${safe.ctaUrl}" style="display:inline-block;padding:15px 22px;border-radius:14px;color:#ffffff;text-decoration:none;font-size:14px;font-weight:800;letter-spacing:-.01em">${safe.ctaLabel}</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 40px 38px">
                    <div style="padding:18px 20px;border-radius:18px;background:rgba(248,248,246,.78);border:1px solid rgba(17,19,23,.08)">
                      <p style="margin:0;font-size:14px;line-height:1.65;color:#5f6675">${safe.note}</p>
                    </div>
                    <p style="margin:20px 0 0;font-size:13px;line-height:1.7;color:#8a91a0">${safe.securityNote}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 8px 0;text-align:center;color:#8a91a0;font-size:12px;line-height:1.7">
              <div style="font-weight:750;color:#6b7280">Festivio</div>
              <div>Event operations, participant coordination and task execution from one workspace.</div>
              <div style="margin-top:8px">This is an automated transactional email. Please do not reply directly.</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

const buildVerificationEmail = ({ firstName, verificationLink }) => {
  const greeting = `Hi ${firstName || 'there'},`;
  const intro = 'Welcome to Festivio. Confirm your email address to activate your account and access your event workspace securely.';
  const ctaLabel = 'Verify email address';
  const note = 'This verification link is valid for 24 hours. After verification, you can sign in and continue setting up your event operations workspace.';
  const securityNote = 'If you did not create a Festivio account, you can safely ignore this email.';

  return {
    html: renderEmail({
      preheader: 'Confirm your Festivio email address to activate your account.',
      eyebrow: 'Account verification',
      title: 'Confirm your email address',
      greeting,
      intro,
      ctaLabel,
      ctaUrl: verificationLink,
      note,
      securityNote,
    }),
    text: baseText({
      greeting,
      intro,
      ctaLabel,
      ctaUrl: verificationLink,
      note,
      securityNote,
    }),
  };
};

const buildPasswordResetEmail = ({ firstName, resetLink }) => {
  const greeting = `Hi ${firstName || 'there'},`;
  const intro = 'We received a request to reset the password for your Festivio account. Use the secure link below to choose a new password.';
  const ctaLabel = 'Reset password';
  const note = 'This reset link expires in one hour. For your security, the link can only be used for this password reset flow.';
  const securityNote = 'If you did not request a password reset, you can ignore this email. Your current password will stay unchanged.';

  return {
    html: renderEmail({
      preheader: 'Reset your Festivio password securely.',
      eyebrow: 'Password recovery',
      title: 'Reset your password',
      greeting,
      intro,
      ctaLabel,
      ctaUrl: resetLink,
      note,
      securityNote,
    }),
    text: baseText({
      greeting,
      intro,
      ctaLabel,
      ctaUrl: resetLink,
      note,
      securityNote,
    }),
  };
};

module.exports = {
  buildPasswordResetEmail,
  buildVerificationEmail,
};
