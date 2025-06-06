"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  const router = useRouter()
  const pathname = usePathname()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Helper function to safely parse JSON responses
  const safeParseJSON = async (response: Response) => {
    const text = await response.text()
    try {
      return JSON.parse(text)
    } catch (e) {
      console.error("Failed to parse response as JSON:", text.substring(0, 100) + "...")
      throw new Error("Server returned an invalid response")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!username || !password) {
      setError("Vui lòng nhập đầy đủ thông tin")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Create timestamp for the request
      const timestamp = new Date().toISOString()

      // Call the actual API endpoint for user login
      const response = await fetch("http://localhost:8080/api/user/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          timestamp,
        }),
      })

      // Safely parse the JSON response
      const d = await safeParseJSON(response)

      if (!response.ok) {
        throw new Error(d.message || "Đăng nhập thất bại")
      }

      // Store auth token if provided
      if (d.data) {
        localStorage.setItem("data", d.data)
        console.log('token, user and role retrived')
        // Store username for display in header
        localStorage.setItem("username", d.data.username)
        localStorage.setItem("token", d.data.token)
        localStorage.setItem("userRole", d.data.role) 
        console.log(username)
      } else {
        //for logging-only purpose
        console.log('token, user and role not retrieved')
      }

      // Dispatch a storage event to notify other components
      window.dispatchEvent(new Event("storage"))

      // Redirect based on role
      const userRole = localStorage.getItem("userRole")
      if (userRole === "ROLE_ADMIN") {
        router.push("/admin")
      } else {
        router.push("/")
      }
    } catch (err) {
      console.error("Login error:", err)
      setError(err instanceof Error ? err.message : "Đăng nhập thất bại, vui lòng thử lại")
    } finally {
      setIsLoading(false)
    }
  }

  // Add this useEffect after the existing useEffect
  useEffect(() => {
    // Check if we're on the admin page
    if (pathname && pathname.startsWith("/admin")) {
      const userRole = localStorage.getItem("userRole")

      // If user doesn't have admin role, redirect to home
      if (userRole !== "ROLE_ADMIN") {
        router.push("/")
        // Show notification after redirect
        setTimeout(() => {
          alert("Bạn không có quyền truy cập vào trang này.")
        }, 100)
      }
    }
  }, [pathname, router])

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="relative">
          <Link href="/" className="absolute left-0 top-0 p-4">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <CardTitle className="text-center pt-4">Đăng nhập</CardTitle>
          <CardDescription className="text-center">Đăng nhập để tiếp tục mua sắm</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="bg-red-100 text-red-600 p-3 rounded-md text-sm">{error}</div>}

            <div className="space-y-2">
              <Label htmlFor="username">Tên đăng nhập</Label>
              <Input
                id="username"
                placeholder="Nhập tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full bg-accent text-black hover:bg-accent/90" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Đăng nhập"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center">
            Chưa có tài khoản?{" "}
            <Link href="/register" className="text-primary font-medium">
              Đăng ký ngay
            </Link>
          </div>
          <div className="text-sm text-center">
            <Link href="#" className="text-gray-500">
              Quên mật khẩu?
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

