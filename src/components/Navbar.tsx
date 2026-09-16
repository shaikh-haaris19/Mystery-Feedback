"use client"
import { Button } from "@/components/ui/button"
import { signOut, useSession } from 'next-auth/react';
import Link from "next/link";
import { useEffect } from "react";

const Navbar = () => {

    const { data: session } = useSession();

    useEffect(() => {
        console.log("Session Data:", session);
    }, [session]);

    return (
        <nav className="w-full flex items-center p-5 bg-gray-800 text-white">
            <div className="flex justify-between px-10 w-full">
                <a className="text-2xl font-bold" href="#">Mystery-Feedback</a>
                {
                    session ? (

                        <div className="flex items-center gap-6">
                            <Button className="bg-red-500 hover:bg-red-600 p-5 cursor-pointer text-lg" onClick={() => { signOut({ redirect: true, callbackUrl: "/sign-in" }) }}>Sign Out</Button>
                        </div>

                    ) : (

                        <Link href="/sign-in">
                            <Button className="bg-blue-500 hover:bg-blue-600 p-5 cursor-pointer text-lg">Sign In</Button>
                        </Link>

                    )
                }
            </div> 
        </nav>
    )

}

export default Navbar
