export const authMiddleware = async (c : any , next : Function) => {
    if(c.req.header("Authorization")){
        await next()
    }else{
        return c.text("You are not authorised")
    }
}