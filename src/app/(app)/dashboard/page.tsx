"use client"
import { Button } from "@/components/ui/button"
import { signOut, useSession } from 'next-auth/react';
import { useEffect } from "react";
import { User } from "next-auth"

const Dashboard = () => {

    const { data: session } = useSession();

    const user = session?.user;

    useEffect(() => {

        console.log("User Data:", session);
        console.log("User:", user);

    }, [user, session]);

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-100">
            <Button onClick={() => { signOut({ redirect: true, callbackUrl: "/sign-in" }) }}>Sign Out</Button>
        </div>
    )
}

export default Dashboard
