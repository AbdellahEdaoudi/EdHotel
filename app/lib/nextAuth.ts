import { type AuthOptions } from "next-auth"
import GoogleProviders from "next-auth/providers/google"
export const authOptions:AuthOptions = {
    providers :[
        GoogleProviders({
            clientId:process.env.CLIENTID as string,
            clientSecret:process.env.CLIENTSECRET as string,
        })
    ] ,
    session :{
        strategy :"jwt",
        maxAge : 1 *24 *60 * 60 , // 1 day
    },
    jwt :{
        //jwt
    },
    callbacks:{
        // sign in
    },
    secret:process.env.NEXTAUTH_SECRET,
    pages :{
        signIn: "/Login"
    }
}