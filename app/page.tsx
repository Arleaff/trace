import { getUserId, getUserLists, getUserMedia } from "@/db";
import Home from "./home";
import { list } from "postcss";
import { createSession, generateSessionToken, getCurrentSession } from "@/auth/session";
import { redirect } from "next/navigation";
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";


//TODO: signout

export default async function Page() {

  
  const { user } = await getCurrentSession();
  
  
  if (user === null) {
    return redirect("/login");
  }

  return (
    <>
    <Theme>
        <Home username={user.name} ></Home>
    </Theme>
    </>
  );

}

