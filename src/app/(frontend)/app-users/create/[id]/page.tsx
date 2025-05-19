import { ServerProps } from "payload";


export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;

  return <div>oki</div>
}

