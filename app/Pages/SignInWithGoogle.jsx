"use client"
import { signIn } from "next-auth/react";

const  SignInWithGoogle = ()=>{
  const UrlImageGoogle="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx8SS7C08lGlVTCDpZrNbrgTJR0EBK0pgq9-0lfg3mG3ffN2InjG74ZnsPLRdJd-mUwKk&usqp=CAU"
  return (
    <div
      onClick={() => {
        signIn("google", {redirect:true, callbackUrl:"/HomePage"})
      }}
      className="flex  items-center gap-2 w-48 text-[14px] cursor-pointer bg-gray-100 p-2 rounded-md"
    >
      <img className="w-6 rounded-full " src={UrlImageGoogle} alt="" />
      Sign in with Google
    </div>
  );
}
export default SignInWithGoogle;