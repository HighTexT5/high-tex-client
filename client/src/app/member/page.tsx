"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { LogOut, User, Clock, Gift, ShoppingBag, Store } from "lucide-react"



export default function MemberPage() {
  const router = useRouter()
  // Replace the formData state with individual state variables for each field
  const [username, setUsername] = useState<string | null>(null)
  const [token, setToken] = useState<string>("")
  const [activeTab, setActiveTab] = useState("home")
  const [showDistributorForm, setShowDistributorForm] = useState(false)
  const [showManagerNameInput, setShowManagerNameInput] = useState(false)

  // Individual form field states
  const [managerName, setManagerName] = useState("")
  const [description, setDescription] = useState("")
  const [shopName, setShopName] = useState("")
  const [shopWarehouseAddress, setShopWarehouseAddress] = useState("")
  const [shopPhone, setShopPhone] = useState("")
  const [shopEmail, setShopEmail] = useState("")
  const [shopTaxCode, setShopTaxCode] = useState("")

  const [fullName, setFullName] = useState("")
  const [gender, setGender] = useState("")
  const [birthday, setBirthday] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [email, setEmail] = useState("")
  const [address, setAddress] = useState("")

  // Add these state variables at the top with the other state declarations
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)


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

  // Sample order history data
  const orders = [
    {
      id: "ORD123456",
      date: "15/03/2023",
      status: "Đã giao hàng",
      total: 1250000,
      items: 2,
    },
    {
      id: "ORD123455",
      date: "02/02/2023",
      status: "Đã giao hàng",
      total: 3490000,
      items: 1,
    },
    {
      id: "ORD123454",
      date: "25/12/2022",
      status: "Đã hủy",
      total: 790000,
      items: 1,
    },
  ]

  // Update the useEffect that sets initial values
  useEffect(() => {
    // Check if user is logged in
    const data = localStorage.getItem("data")
    const storedUsername = localStorage.getItem("username")
    const storedToken = localStorage.getItem("token")

    if (!data || !storedUsername) {
      // Redirect to login if not logged in
      router.push("/login")
      return
    }

    setUsername(storedUsername)
    // Set the user code to the username
    setManagerName(storedUsername)
    setToken(storedToken ?? "")
  }, [router])

  // Add this useEffect after the existing useEffect
  useEffect(() => {
    // Only fetch user data when the account tab is active
    if (activeTab === "account") {
      fetchUserData()
    }
  }, [activeTab])

  // Add this function to fetch user data
  const fetchUserData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Replace with your actual API endpoint
      const response = await fetch("http://localhost:8080/api/au/user/data", {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch user data")
      }

      const userData = await response.json()
      console.log("Fetched user data:", userData) // Debug log to see what data is returned

      // Update form fields with fetched data if available
      if (userData) {
        setFullName(userData.data.fullName || "")
        setGender(userData.data.gender?.toString() || "")
        setBirthday(userData.data.birthday || "")
        setPhoneNumber(userData.data.phoneNumber || "")
        setEmail(userData.data.email || "")
        setAddress(userData.data.address || "")

        console.log("Form fields updated with:", {
          fullName: userData.fullName,
          gender: userData.gender,
          birthday: userData.birthday,
          phoneNumber: userData.phoneNumber,
          email: userData.email,
          address: userData.address,
        }) // Debug log to confirm state updates
      }
    } catch (err) {
      console.error("Error fetching user data:", err)
      setError("Không thể tải thông tin người dùng. Vui lòng thử lại sau.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    // Clear auth data
    localStorage.removeItem("data")
    localStorage.removeItem("username")
    localStorage.removeItem("token")
    localStorage.removeItem("userRole")

    // Redirect to home page
    router.push("/")
  }

  // Replace the handleInputChange function with this
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    // Update the appropriate state based on input name
    switch (name) {
      case "managerName":
        setManagerName(value)
        break
      case "description":
        setDescription(value)
        break
      case "shopName":
        setShopName(value)
        break
      case "shopWarehouseAddress":
        setShopWarehouseAddress(value)
        break
      case "shopPhone":
        setShopPhone(value)
        break
      case "shopEmail":
        setShopEmail(value)
        break
      case "shopTaxCode":
        setShopTaxCode(value)
        break
    }
  }

  // Update the handleSubmitForm function
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault()

    // Collect all form data
    const formData = {
      managerName,
      shopName,
      shopWarehouseAddress,
      shopPhone,
      shopEmail,
      shopTaxCode,
      description,
    }

    try {
      console.log("Attempting to send formData")

      // Use relative URL with proxy configuration
      const response = await fetch(" http://localhost:8080/api/request/user/create-be-a-distributor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify(
          formData),
      })

      console.log("API response status:", response.status)

      // Safely parse the JSON response
      const data = await safeParseJSON(response)

      if (!response.ok) {
        console.warn("API returned error:", data)
        throw new Error(data.message || "Gửi form yêu cầu thất bại")
      }

    // Here you would normally send the data to your API
    console.log("Form submitted:", formData)
    alert("Yêu cầu của bạn đã được gửi thành công!")
    setShowDistributorForm(false)
    setActiveTab("home")
    } catch (err) {
      console.error("Distributor request error:", err)
    }
  }

  return (
    <div className="min-h-screen bg-blue-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm">
        <nav className="p-4">
          <ul className="space-y-1">
            <li>
              <button
                className={`w-full text-left px-4 py-2 rounded-md ${activeTab === "home" ? "bg-primary text-white" : "hover:bg-gray-100"}`}
                onClick={() => {
                  setActiveTab("home")
                  setShowDistributorForm(false)
                }}
              >
                <div className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>Trang chủ</span>
                </div>
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left px-4 py-2 rounded-md ${activeTab === "history" ? "bg-primary text-white" : "hover:bg-gray-100"}`}
                onClick={() => {
                  setActiveTab("history")
                  setShowDistributorForm(false)
                }}
              >
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>Lịch sử mua hàng</span>
                </div>
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left px-4 py-2 rounded-md ${activeTab === "promotions" ? "bg-primary text-white" : "hover:bg-gray-100"}`}
                onClick={() => {
                  setActiveTab("promotions")
                  setShowDistributorForm(false)
                }}
              >
                <div className="flex items-center">
                  <Gift className="mr-2 h-4 w-4" />
                  <span>Chương trình ưu đãi</span>
                </div>
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left px-4 py-2 rounded-md ${activeTab === "account" ? "bg-primary text-white" : "hover:bg-gray-100"}`}
                onClick={() => {
                  setActiveTab("account")
                  setShowDistributorForm(false)
                }}
              >
                <div className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>Thông tin tài khoản</span>
                </div>
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left px-4 py-2 rounded-md ${showDistributorForm ? "bg-primary text-white" : "hover:bg-gray-100"}`}
                onClick={() => {
                  setShowDistributorForm(!showDistributorForm)
                  if (!showDistributorForm) {
                    setActiveTab("")
                  }
                }}
              >
                <div className="flex items-center">
                  <Store className="mr-2 h-4 w-4" />
                  <span>Yêu cầu mở tài khoản bán hàng</span>
                </div>
              </button>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 flex items-center"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Thoát tài khoản</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {showDistributorForm ? (
          <div>
            <h1 className="text-2xl font-semibold mb-6">Yêu cầu mở tài khoản bán hàng</h1>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p className="text-gray-600 mb-4">
                Vui lòng điền đầy đủ thông tin để đăng ký trở thành người bán trên HighTEx:
              </p>

              <form onSubmit={handleSubmitForm} className="space-y-4">
                {/* Update the form inputs to use individual state variables */}
                {/* Replace the form inputs section with this: */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên quản lý</label>
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={managerName || ""}
                        className="w-full p-2 border rounded"
                        readOnly={!showManagerNameInput}
                      />
                    </div>
                    <div className="flex items-center mt-2">
                      <input
                        type="checkbox"
                        id="enableManagerEdit"
                        checked={showManagerNameInput}
                        onChange={() => setShowManagerNameInput(!showManagerNameInput)}
                        className="mr-2"
                      />
                      <label htmlFor="enableManagerEdit" className="text-xs text-gray-500">
                        Chỉnh sửa tên quản lý
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên cửa hàng</label>
                    <input
                      type="text"
                      name="shopName"
                      value={shopName}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại cửa hàng</label>
                    <input
                      type="tel"
                      name="shopPhone"
                      value={shopPhone}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email cửa hàng</label>
                    <input
                      type="email"
                      name="shopEmail"
                      value={shopEmail}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mã số thuế</label>
                    <input
                      type="text"
                      name="shopTaxCode"
                      value={shopTaxCode}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ kho hàng</label>
                  <textarea
                    name="shopWarehouseAddress"
                    value={shopWarehouseAddress}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    rows={3}
                    required
                  ></textarea>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                  <textarea
                    name="description"
                    value={description}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    rows={3}
                  ></textarea>
                </div>

                <div className="flex space-x-4">
                  <button type="submit" className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90">
                    Gửi yêu cầu
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowDistributorForm(false)
                      setActiveTab("home")
                    }}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <>
            {activeTab === "home" && (
              <div>
                <h1 className="text-2xl font-semibold mb-6">Tài khoản của tôi</h1>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="mb-4">
                    <h2 className="text-lg font-medium mb-2">Xin chào, {username}</h2>
                    <p className="text-gray-600">Chào mừng bạn quay trở lại với HighTEx!</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2 flex items-center">
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Đơn hàng của tôi
                      </h3>
                      <p className="text-sm text-gray-600">Bạn chưa có đơn hàng nào.</p>
                      <Link href="/" className="text-primary text-sm mt-2 inline-block">
                        Mua sắm ngay
                      </Link>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2 flex items-center">
                        <Gift className="mr-2 h-4 w-4" />
                        Ưu đãi của tôi
                      </h3>
                      <p className="text-sm text-gray-600">Bạn chưa có ưu đãi nào.</p>
                      <Link href="/" className="text-primary text-sm mt-2 inline-block">
                        Khám phá ưu đãi
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "history" && (
              <div>
                <h1 className="text-2xl font-semibold mb-6">Lịch sử mua hàng</h1>

                {/* Welcome Box */}
                <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                  <div className="mb-4">
                    <h2 className="text-lg font-medium mb-2">Xin chào, {username}</h2>
                    <p className="text-gray-600">Chào mừng bạn quay trở lại với HighTEx!</p>
                  </div>
                </div>

                {/* Order History Box */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-lg font-medium mb-4">Lịch sử mua hàng</h2>

                  {orders.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Mã đơn hàng
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Ngày đặt
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Trạng thái
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Tổng tiền
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Số sản phẩm
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Chi tiết
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {orders.map((order) => (
                            <tr key={order.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {order.id}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    order.status === "Đã giao hàng"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {order.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {order.total.toLocaleString()}đ
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.items}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <button className="text-primary hover:underline">Xem chi tiết</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Bạn chưa có đơn hàng nào.</p>
                      <Link href="/" className="text-primary mt-2 inline-block">
                        Mua sắm ngay
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "promotions" && (
              <div>
                <h1 className="text-2xl font-semibold mb-6">Chương trình ưu đãi</h1>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <p className="text-gray-600">Hiện tại không có chương trình ưu đãi nào.</p>
                </div>
              </div>
            )}

            {activeTab === "account" && (
              <div>
                <h1 className="text-2xl font-semibold mb-6">Thông tin tài khoản</h1>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                {error && <div className="bg-red-100 text-red-600 p-3 rounded-md text-sm mb-4">{error}</div>}

                {isLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                <form
                    onSubmit={async (e) => {
                      e.preventDefault()
                      // Collect form data
                      const formData = {
                        fullName: fullName,
                        gender: Number.parseInt(gender),
                        birthday: birthday,
                        phoneNumber: phoneNumber,
                        email: email,
                        address: address,
                      }

                      // Here you would send the data to your API
                      try {
                        const response = await fetch('http://localhost:8080/api/au/user/update', {
                          method: 'PUT',
                          headers: {
                            'Content-Type': 'application/json',
                            // 'Authorization': 'Bearer your-token-here'
                            ...(token && { Authorization: `Bearer ${token}` })
                          },
                          body: JSON.stringify(formData),
                        });
                  
                        if (!response.ok) {
                          throw new Error('Network response was not ok');
                        }
                  
                        const data = await response.json();
                      console.log("Profile update submitted:", formData)
                      alert("Thông tin tài khoản đã được cập nhật!")
                    } catch (error) {
                      console.error('Error:', error);
                      // Handle error (e.g., show error message)
                    }
                    }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập</label>
                    <p className="p-2 bg-gray-50 rounded">{username}</p>
                  </div>
                  
                  <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full p-2 border rounded"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
                        <select
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                          className="w-full p-2 border rounded"
                          required
                        >
                          <option value="">Chọn giới tính</option>
                          <option value="0">Nam</option>
                          <option value="1">Nữ</option>
                          <option value="2">Khác</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
                        <input
                          type="text"
                          placeholder="DD/MM/YYYY"
                          value={birthday}
                          onChange={(e) => setBirthday(e.target.value)}
                          className="w-full p-2 border rounded"
                          required
                        />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                    <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="w-full p-2 border rounded"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full p-2 border rounded"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                      <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full p-2 border rounded"
                        rows={3}
                        required
                      ></textarea>
                    </div>

                    <div>
                      <button type="submit" className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90">
                        Cập nhật thông tin
                      </button>
                  </div>
                  </form>
                )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
