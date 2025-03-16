"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!username || !password) {
      setError("Vui lòng nhập đầy đủ thông tin")
      return
    }

    // In a real app, you would authenticate with a backend here
    // For demo purposes, we'll just redirect to the home page
    router.push("/")
  }

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
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full bg-accent text-black hover:bg-accent/90">
              Đăng nhập
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

