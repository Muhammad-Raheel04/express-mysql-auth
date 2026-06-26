const verifyEmailTemplate = (name, verificationUrl) => {
    return `
        <h2>Hello ${name}</h2>

        <p>
            Thank you for registering.
        </p>

        <p>
            Click the button below to verify your email.
        </p>

        <a href="${verificationUrl}">
            Verify Email
        </a>
    `;
};

export default verifyEmailTemplate;