/*person.controller.ts*/
import { Router } from 'express';

export const router: Router = Router();
router.get('/', (req, res) => {   
    res.send([{ name: 'Danny' }, { name: 'Nabil' }]);
});


