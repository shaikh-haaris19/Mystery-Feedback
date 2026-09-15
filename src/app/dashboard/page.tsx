"use client"
import { Button } from "@/components/ui/button"
import { signOut } from 'next-auth/react';

const Dashboard = () => {

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-100">
            <Button onClick={() => { signOut({ redirect: true, callbackUrl: "/sign-in" }) }}>Sign Out</Button>
        </div>
    )
}

export default Dashboard
