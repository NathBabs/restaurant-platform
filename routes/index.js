//const express = require("express");
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
import express from "express";
const router = express.Router();

import * as fs from 'fs'
import path, { dirname, join } from 'path';
const __dirname = dirname(__filename);


const basename = path.basename(__filename);

fs.readdir(__dirname, (err, files) => {
    files.filter(file => {
        return (file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js")
    }).map(async file => {
        const module = await import(`./${file}`);
        //console.log(module);
        let routes = module.default;
        router.use(routes);
    })
});


export default router;
