import React from 'react';

// --- Main Email Template Component ---
// This component generates the HTML for your email verification message.
// Props:
// - userName: The name of the user to greet.
// - verificationLink: The unique URL for the user to verify their email.
// - appName: The name of your application, "CodeDrill".

export const EmailVerificationTemplate = ({
  userName,
  verificationLink,
  appName = 'CodeDrill',
}: {
  userName: string;
  verificationLink: string;
  appName: string;
}) => {
  // --- Inline CSS Styles ---
  // Using inline styles is a best practice for HTML emails to ensure
  // maximum compatibility with different email clients.

  const main: React.CSSProperties = {
    backgroundColor: '#f6f9fc',
    fontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  };

  const container: React.CSSProperties = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    padding: '20px 0 48px',
    marginBottom: '64px',
    maxWidth: '580px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
  };

  const box: React.CSSProperties = {
    padding: '0 48px',
  };

  const h1: React.CSSProperties = {
    color: '#333',
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: '30px 0',
  };

  const p: React.CSSProperties = {
    color: '#555',
    fontSize: '16px',
    lineHeight: '26px',
  };

  const btnContainer: React.CSSProperties = {
    textAlign: 'center',
    marginTop: '30px',
    marginBottom: '30px',
  };

  const button: React.CSSProperties = {
    backgroundColor: '#007bff',
    borderRadius: '5px',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 'bold',
    textDecoration: 'none',
    textAlign: 'center',
    display: 'inline-block',
    padding: '12px 25px',
    border: '1px solid #007bff',
  };

  const hr: React.CSSProperties = {
    borderColor: '#e6ebf1',
    margin: '20px 0',
  };

  const link: React.CSSProperties = {
    color: '#007bff',
    textDecoration: 'underline',
  };

  const footer: React.CSSProperties = {
    color: '#8898aa',
    fontSize: '12px',
    lineHeight: '16px',
    textAlign: 'center',
  };

  // --- JSX Structure ---
  // The email is structured using tables for layout consistency.
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Verify Your Email for {appName}</title>
      </head>
      <body style={main}>
        <table width="100%" border={0} cellSpacing={0} cellPadding={0}>
          <tbody>
            <tr>
              <td>
                <div style={container}>
                  <div style={box}>
                    {/* You can add a logo here if you have one */}
                    {/* <img src="URL_TO_YOUR_LOGO" width="100" height="auto" alt={appName} /> */}
                    <h1 style={h1}>Welcome to {appName}!</h1>
                    <p style={p}>Hi {userName},</p>
                    <p
                      style={p}
                    >{`Thanks for signing up for ${appName}. We're excited to have`}</p>
                    <p style={p}>
                      Thanks for signing up for {appName}. We&apos;re excited to
                      have you on board. Please click the button below to verify
                      your email address and complete your registration.
                    </p>
                    <div style={btnContainer}>
                      <a
                        href={verificationLink}
                        style={button}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Verify Email Address
                      </a>
                    </div>
                    <p style={p}>
                      If the button above doesn&apos;t work, you can also copy
                      and paste this link into your browser:
                    </p>
                    <p>
                      <a
                        href={verificationLink}
                        style={link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {verificationLink}
                      </a>
                    </p>
                    <hr style={hr} />
                    <div style={footer}>
                      <p>
                        You received this email because you signed up for{' '}
                        {appName}.
                      </p>
                      <p>
                        If you didn&apos;t create an account, you can safely
                        ignore this email.
                      </p>
                      <p>
                        © {new Date().getFullYear()} {appName}. All rights
                        reserved.
                      </p>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  );
};
