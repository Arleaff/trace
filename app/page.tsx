import Home from "./home";
import { list } from "postcss";
import { getCurrentSession } from "@/auth/session";
import { redirect } from "next/navigation";
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { Provider } from "react-redux";
import { store } from '@/app/store'
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

