import { authOptions } from "@/app/api/(user)/auth/[...nextauth]/options";
import ApiResponseMessage from "@/app/types/apiResponseMessage";
import { getServerSession, User } from "next-auth";

export default async function getUserFromRequest(){
    const session = await getServerSession(authOptions);

    const _user: User = session?.user;

    return _user;
}