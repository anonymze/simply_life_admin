import { ServerProps } from "payload";
import config from "@payload-config";
import payload from "payload";

import FormPage from "./form";


export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;

  const user = await payload.find({
    collection: "temporary-app-users",
    where: {
      id: {
        equals: id,
      },
    },
  })

  return <FormPage email={"coucou@coucou.com"} id={id} role={"coucou"} />
}

