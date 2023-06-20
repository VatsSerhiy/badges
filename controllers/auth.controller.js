const msal = require('@azure/msal-node');

const {
    msalConfig,
    REDIRECT_URI,
    POST_LOGOUT_REDIRECT_URI
} = require('../config');

const msalInstance = new msal.ConfidentialClientApplication(msalConfig);
const cryptoProvider = new msal.CryptoProvider();

async function redirectToAuthCodeUrl(req, res, next, authCodeUrlRequestParams, authCodeRequestParams) {
    const {verifier, challenge} = await cryptoProvider.generatePkceCodes();

    req.session.pkceCodes = {
        challengeMethod: 'S256',
        verifier: verifier,
        challenge: challenge,
    };

    req.session.authCodeUrlRequest = {
        redirectUri: REDIRECT_URI,
        responseMode: 'form_post',
        codeChallenge: req.session.pkceCodes.challenge,
        codeChallengeMethod: req.session.pkceCodes.challengeMethod,
        ...authCodeUrlRequestParams,
    };

    req.session.authCodeRequest = {
        redirectUri: REDIRECT_URI,
        code: "",
        ...authCodeRequestParams,
    };

    try {
        const authCodeUrlResponse = await msalInstance.getAuthCodeUrl(req.session.authCodeUrlRequest);
        res.redirect(authCodeUrlResponse);
    } catch (error) {
        next(error);
    }
}

exports.signIn = async (req, res, next) => {
    try {
        req.session.csrfToken = cryptoProvider.createNewGuid();

        const state = cryptoProvider.base64Encode(
            JSON.stringify({
                csrfToken: req.session.csrfToken,
                redirectTo: '/'
            })
        );

        const authCodeUrlRequestParams = {state: state, scopes: []};

        const authCodeRequestParams = {scopes: []};

        return redirectToAuthCodeUrl(req, res, next, authCodeUrlRequestParams, authCodeRequestParams)
    } catch (error) {
        next(error);
    }
};

exports.redirect = async (req, res, next) => {
    if (req.body.state) {
        const state = JSON.parse(cryptoProvider.base64Decode(req.body.state));

        // check if csrfToken matches
        if (state.csrfToken === req.session.csrfToken) {
            req.session.authCodeRequest.code = req.body.code; // authZ code
            req.session.authCodeRequest.codeVerifier = req.session.pkceCodes.verifier

            try {
                const tokenResponse = await msalInstance.acquireTokenByCode(req.session.authCodeRequest);
                req.session.accessToken = tokenResponse.accessToken;
                req.session.idToken = tokenResponse.idToken;
                req.session.account = tokenResponse.account;
                req.session.isAuthenticated = true;

                res.redirect(state.redirectTo);
            } catch (error) {
                next(error);
            }
        } else {
            next(new Error('csrf token does not match'));
        }
    } else {
        next(new Error('state is missing'));
    }
};

exports.signOut = async (req, res) => {
    const logoutUri = `${msalConfig.auth.authority}/oauth2/v2.0/logout?post_logout_redirect_uri=${POST_LOGOUT_REDIRECT_URI}`;

    req.session.destroy();

    res.redirect(logoutUri);
};