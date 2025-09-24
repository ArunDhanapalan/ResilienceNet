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
  const [org, setOrg] = useState(""); // State for organization/department
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const payload = { username, email, password, role };
      if (role === 'govt') {
        payload.org = org;
      }
      
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/register`,
        payload
      );
      
      toast.success(res.data.message);
      setIsLogin(true); // Switch to login view after successful registration
    } catch (err) {
      console.error("Registration error:", err);
      if (err.response && err.response.status === 409) {
        toast.error("An account with this email or username already exists.");
      } else {
        toast.error(
          err.response?.data?.error || err.message || "Unexpected registration error"
        );
      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const payload = { email, password };
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
        payload
      );

      const token = res.data.token;
      localStorage.setItem("token", token);

      const userData = {
        _id: res.data.user.id,
        email: res.data.user.email,
        username: res.data.user.username,
        role: res.data.user.role,
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      toast.success("Logged in successfully!");
      
      // Navigate based on role
      if (userData.role === 'govt') {
        navigate("/govt-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error(
        err.response?.data?.error || err.message || "Invalid credentials"
      );
    }
  };

  return (
    <div className="flex md:flex-row flex-col min-h-screen w-full bg-gradient-to-br from-sky-600 to-purple-300">
      {/* Left Panel */}
      <div className="flex flex-col flex-1 justify-center items-center p-12 text-white">
        <p className="text-6xl mb-5 text-center">🛡️</p>
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
          ResilienceNet
        </h1>
        <p className="text-lg text-center text-amber-50">
          Centralize communication and coordination during natural disasters
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

            <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4">
              {!isLogin && (
                <>
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
                  {/* Conditionally render org field for govt users */}
                  {role === 'govt' && (
                    <div>
                      <Label htmlFor="org">Organization/Department</Label>
                      <Input
                        id="org"
                        placeholder="Enter your organization"
                        value={org}
                        onChange={(e) => setOrg(e.target.value)}
                        required
                      />
                    </div>
                  )}
                </>
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