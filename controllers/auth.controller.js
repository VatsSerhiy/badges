const express = require('express');
const passport = require('passport');
const OIDCStrategy = require('passport-azure-ad').OIDCStrategy;

const {saveUserToDB, checkUser} = require("../helpers/auth.helper");

const {AZURE_AD_IDENTITY_METADATA, AZURE_AD_CLIENT_ID, AZURE_AD_CLIENT_SECRET,AZURE_AD_REDIRECT_URL} = require('../config');


// const azureADConfig = {
//     identityMetadata: AZURE_AD_IDENTITY_METADATA,
//     clientID: AZURE_AD_CLIENT_ID,
//     responseType: 'code',
//     responseMode: 'form_post',
//     redirectUrl: AZURE_AD_REDIRECT_URL,
//     allowHttpForRedirectUrl: true,
//     clientSecret: AZURE_AD_CLIENT_SECRET,
//     validateIssuer: false,
//     passReqToCallback: false,
//     scope: ['openid', 'profile'],
// };

exports.getRegistration = async (req, res, next) => {
    try {
        req.session.destroy();
        res.render('registration.ejs');
    } catch (error) {
        next(error);
    }
};

exports.registrationUser = async (req, res, next) => {
    try {
        const {login, fullname, password} = req.body;

        await saveUserToDB(fullname, login, password);

        res.redirect('/login');
    } catch (error) {
        next(error);
    }
};


exports.getLogin = async (req, res, next) => {
    try {
        req.session.destroy();

        const paramValue = req.query.loginError;

        paramValue !== undefined ? res.render('login.ejs', {item: true}) : res.render('login.ejs', {item: false});
    } catch (error) {
        next(error);
    }
};

exports.loginUser = async (req, res, next) => {
    try {
        const {login, password} = req.body;

        await checkUser(login, password, function (element) {
            if (element) {
                req.session.username = element.username;
                res.redirect('/');
            } else res.redirect('/login?loginError');
        });
    } catch (error) {
        next(error);
    }
};