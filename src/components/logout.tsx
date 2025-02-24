import { LogOutIcon } from "lucide-react";
import Link from "next/link";


export default function Logo() {
	return (
		<Link href="/admin/logout">
			<LogOutIcon size={25} />
		</Link>
	);
}
