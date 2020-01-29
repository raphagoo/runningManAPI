import jwt from 'jsonwebtoken';


module.exports = {
    verifyJwt
};

function verifyJwt(req, res, next){
    let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
    if (token.startsWith('Bearer ')) {
      // Remove Bearer from string
      token = token.slice(7, token.length);
    }
    jwt.verify(token, 'mySuperSecrett', function(err, decoded){
        if(err){
            res.sendStatus(404)
        }
        else{
            req.decoded = decoded
        }
    })
    next()
}