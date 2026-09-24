// user -> shop,view profileplace orders
// admin -> manage products, manage orders, manage users
//req -> jwt -> role -> admin, user-> allow / reject?
const roleMiddleware = (allowedRoles) => {
    //req res next
    return(req,res,next)=>{
        //whether user loginned or not 
        //whether user has the required role to access the resource
        if(!req.user){
            return res.status(401).json({message:"please login to access this resource"});
        }
        if(!allowedRoles.includes(req.user.role)){
            return res.status(403).json({message:"you are not authorized to access this resource"});
        }
        //user has permission to access the resource
        next();
    };
};
module.exports = roleMiddleware;