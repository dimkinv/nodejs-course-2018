"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* rest-api.ts */
const express = require("express");
const person_controller_1 = require("./person.controller");
const app = express();
app.use('/api/person', person_controller_1.router);
app.listen(3000, () => {
    console.log('listening on port 3000');
});
