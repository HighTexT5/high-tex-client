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

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [otpSent, setOtpSent] = useState(false)

  const handleSubmitInfo = (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!username || !email || !password || !confirmPassword) {
      setError("Vui lòng nhập đầy đủ thông tin")
      return
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu không khớp")
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Email không hợp lệ")
      return
    }

    // Password strength validation
    if (password.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự")
      return
    }

    // Clear any previous errors
    setError("")

    // Move to OTP step
    setStep(2)
  }

  const handleSendOtp = () => {
    // In a real app, you would send an OTP to the user's email here
    // For demo purposes, we'll just set a flag
    setOtpSent(true)
  }

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!otp) {
      setError("Vui lòng nhập mã OTP")
      return
    }

    // In a real app, you would verify the OTP with a backend here
    // For demo purposes, we'll just accept any 6-digit code
    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      setError("Mã OTP không hợp lệ")
      return
    }

    // Registration successful, redirect to login
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="relative">
          {step === 1 ? (
            <Link href="/login" className="absolute left-0 top-0 p-4">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          ) : (
            <button className="absolute left-0 top-0 p-4" onClick={() => setStep(1)}>
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <CardTitle className="text-center pt-4">Đăng ký tài khoản</CardTitle>
          <CardDescription className="text-center">
            {step === 1 ? "Nhập thông tin để tạo tài khoản mới" : "Xác thực email của bạn"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && <div className="bg-red-100 text-red-600 p-3 rounded-md text-sm mb-4">{error}</div>}

          {step === 1 ? (
            <form onSubmit={handleSubmitInfo} className="space-y-4">
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
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Nhập email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Nhập lại mật khẩu</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Nhập lại mật khẩu"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full bg-accent text-black hover:bg-accent/90">
                Tiếp tục
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center mb-4">
                <p className="text-sm text-gray-600">Chúng tôi đã gửi mã xác thực đến email {email}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="otp">Mã OTP</Label>
                <Input
                  id="otp"
                  placeholder="Nhập mã OTP 6 số"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                />
              </div>

              <div className="flex gap-4">
                <Button type="button" variant="outline" className="flex-1" onClick={handleSendOtp} disabled={otpSent}>
                  {otpSent ? "Đã gửi OTP" : "Gửi lại OTP"}
                </Button>
                <Button type="submit" className="flex-1 bg-accent text-black hover:bg-accent/90">
                  Xác nhận
                </Button>
              </div>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          {step === 1 && (
            <div className="text-sm text-center">
              Đã có tài khoản?{" "}
              <Link href="/login" className="text-primary font-medium">
                Đăng nhập
              </Link>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

