import pkg from 'express-validator';
const { validationResult } = pkg;

export function validateRules(req, res, next){
    const errors = validationResult(req);
    if(errors.isEmpty()){
        // Form data is valid
        next();
    }else{
        // Form data is invalid
        res.json({ result: false, errors });
    }
}