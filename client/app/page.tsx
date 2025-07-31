'use client';
import Image from "next/image";
import FileUpload from "./components/file-upload";
import ChatComponent from "./components/chat";
import { UserButton, useUser } from "@clerk/nextjs";

export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return null;
  }

  return (
    <>
      <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 flex items-center justify-between w-full">
        <span className="font-bold">PDF reader</span>
          <div className="flex items-center space-x-4">
          <UserButton />
          <div className="text-left">
            <p className="font-semibold">{user?.fullName}</p>
            <p className="text-sm">{user?.emailAddresses[0]?.emailAddress}</p>
          </div>
        </div>
      </nav>
      <div className="w-full h-full flex">
        <div className="flex-1 p-4 flex justify-center items-center">
          <FileUpload />
        </div>
        <div className="flex-2 border-l-1 p-l-2">
          <ChatComponent />
        </div>
      </div>
    </>
  );
}
