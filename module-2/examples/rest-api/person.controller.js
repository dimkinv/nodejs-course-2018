"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*person.controller.ts*/
const express_1 = require("express");
exports.router = express_1.Router();
exports.router.get('/', (req, res) => {
    res.send([{ name: 'Danny' }, { name: 'Nabil' }]);
});
