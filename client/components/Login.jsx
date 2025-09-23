import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import toast from "react-hot-toast";

const Login = ({ setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState("citizen");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const payload = { email, password, role };
      if (!isLogin) payload.username = username;
      console.log(import.meta.env.VITE_BACKEND_URL)
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}${endpoint}`,
        payload
      );

      console.log(res);

      const token = res.data.token;
      localStorage.setItem("token", token);

      // Hydrate user manually from response
      const userData = {
        _id: res.data.user.id,
        email: res.data.user.email,
        username: res.data.user.username || username,
        role: res.data.user.role,
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      toast.success(
        isLogin ? "Logged in successfully!" : "Registered successfully!"
      );

      // No need to navigate, the Dashboard component will handle the view based on user role
      toast.loading("Logging in...", {duration: 1200})
      console.log(res);
    } catch (err) {
      console.error("Login/Register error:", err);
      // More specific error handling
      if (err.response && err.response.status === 409) {
        toast.error("An account with this email or username already exists.");
      } else {
        toast.error(
          err.response?.data?.error || err.message || "Unexpected error"
        );
      }
    }
  };

  return (
    <div className="flex md:flex-row flex-col min-h-screen w-full bg-gradient-to-br from-orange-500 to-amber-700">
      {/* Left Panel */}
      <div className="flex flex-col flex-1 justify-center items-center p-12 text-white">
        <p className="text-6xl mb-5 text-center">🛣️</p>
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
          ResilienceNet
        </h1>
        <p className="text-lg text-center text-amber-50">
          Report, track, and monitor civic and government infrastructure issues
          with transparency and accountability.
        </p>
      </div>

      {/* Right Panel */}
      <div className="flex flex-1 justify-center items-center p-6">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">
              {isLogin ? "Login" : "Register"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Role Selector */}
            <Tabs value={role} onValueChange={setRole} className="w-full mb-6">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="citizen">Citizen</TabsTrigger>
                <TabsTrigger value="govt">Government</TabsTrigger>
              </TabsList>
            </Tabs>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              )}

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                {isLogin ? "Sign In" : "Register"}
              </Button>
            </form>

            {/* Switch login/register */}
            <div className="mt-4 text-center">
              <Button variant="link" onClick={() => setIsLogin(!isLogin)}>
                {isLogin
                  ? "Need an account? Register"
                  : "Already have an account? Login"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;