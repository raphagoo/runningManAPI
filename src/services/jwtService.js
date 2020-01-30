import jwt from 'jsonwebtoken';


module.exports = {
    verifyJwt
};

/**
 * Verify the JSON Web Token put in the request
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function verifyJwt(req, res, next){
    let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
    if(token !== undefined) {
        if (token.startsWith('Bearer ')) {
            // Remove Bearer from string
            token = token.slice(7, token.length);
        }
        jwt.verify(token, 'mySuperSecrett', function (err, decoded) {
            if (err) {
                res.status(401).send('Veuillez vous reconnecter')
            } else {
                req.decoded = decoded
            }
        })
    }
    next()
}