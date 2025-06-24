"use client"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"

export default function LogoutButton() {
  const { signOut } = useAuth()
  return <Button variant="outline" onClick={signOut}>Logout</Button>
}
