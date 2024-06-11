require("isomorphic-fetch")
const azure = require("@azure/identity")
const graph = require("@microsoft/microsoft-graph-client")
const authProviders = require("@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials/index.js")

//Agregar en un .env
const settings = {
    'clientId': 'a2a133fe-7b78-4ecd-a620-17c99013fba1',
    'clientSecret': 'YOUR_CLIENT_SECRET_HERE_IF_USING_APP_ONLY',
    'tenantId': 'YOUR_TENANT_ID_HERE_IF_USING_APP_ONLY',
    'authTenant': 'common',
    'graphUserScopes': [
        'user.read',
        'mail.read',
        'mail.send'
    ]
};

let _deviceCodeCredential = undefined;
let _userClient = undefined;

_deviceCodeCredential = new azure.DeviceCodeCredential({
    clientId: settings.clientId,
    tenantId: settings.authTenant,
})

const authProvider = new authProviders.TokenCredentialAuthenticationProvider(
    _deviceCodeCredential, {
    scopes: settings.graphUserScopes
})

_userClient = graph.Client.initWithMiddleware({
    authProvider: authProvider
});

const sendMailAsync = async (subject, body, recipient) => {
    // Create a new message
    const message = {
        subject: subject,
        body: {
            content: body,
            //Content is html by default. To send plain text, use:
            ContentType: "HTML"
        },
        toRecipients: [
            {
                emailAddress: {
                    address: recipient
                }
            }
        ]
    };

    try {
        return _userClient.api('me/sendMail')
            .post({
                message: message,
                saveToSentItems: "true"
            });
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    sendMailAsync
}