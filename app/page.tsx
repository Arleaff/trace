
import Home from "./home";
import { getCurrentSession } from "@/auth/session";
import { redirect } from "next/navigation";
import { Theme } from "@radix-ui/themes";
import { Providers } from "@/providers";


//TODO: signout

export default async function Page() {

  
  const { user } = await getCurrentSession();
  
  
  if (user === null) {
    return redirect("/login");
  }

  return (
    <>
    <Theme>
      <Providers>
        <Home username={user.name} ></Home>
      </Providers>
    </Theme>
    </>
  );

}

