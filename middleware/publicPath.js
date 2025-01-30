const { fileExists } = require('../helper/file');
const express = require('express');
const path = require('path');
const getPublicPath = async (req, res, next) => {
    const folderPublic = express.static(path.join(__dirname, '../public'));

    if(req.session){
        if (!req.session.userId || !req.session.user || req.session.user.rol === 'user') {
            return folderPublic(req, res, next);
        }
    
        if (req.session.user.rol === 'admin') {
            const publicPath = path.join(__dirname, '../public', req.url);
            const adminPath = path.join(__dirname, '../publicAdmin', req.url);
            const folderAdmin = express.static(path.join(__dirname, '../publicAdmin'));
    
            if (fileExists(publicPath)) return folderPublic(req, res, next);
            else if (fileExists(adminPath)) return folderAdmin(req, res, next);
        }
    }else{
        return folderPublic(req, res, next);
    }

    return next();
}

module.exports = {getPublicPath}