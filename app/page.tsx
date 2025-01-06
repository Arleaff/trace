import { getUserId, getUserLists, getUserMedia } from "@/db";
import Home from "./home";
import { list } from "postcss";


const id = await getUserId("raf")
const lists = await getUserLists(id)
const firstList = await getUserMedia(id, lists[0].Name)


export default async function Page() {

  // validate, possibly store in cookies?

  return (
    <>
      <Home></Home>
    </>
  );

}

