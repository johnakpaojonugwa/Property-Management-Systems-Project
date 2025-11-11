"use client";

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const BASE_URL = "http://property.reworkstaging.name.ng/v1";
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  // Support all role tokens
  const [user, setUser] = useState(null);
  const [userToken, setUserToken] = useState("");

  const [agent, setAgent] = useState(null);
  const [agentToken, setAgentToken] = useState("");

  const [merchant, setMerchant] = useState(null);
  const [merchantToken, setMerchantToken] = useState("");

  // Load stored credentials on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const user = JSON.parse(localStorage.getItem("user") || "null");
    const userToken = localStorage.getItem("userToken") || "";

    const agent = JSON.parse(localStorage.getItem("agent") || "null");
    const agentToken = localStorage.getItem("agentToken") || "";

    const merchant = JSON.parse(localStorage.getItem("merchant") || "null");
    const merchantToken = localStorage.getItem("merchantToken") || "";

    if (user) setUser(user);
    if (userToken) setUserToken(userToken);

    if (agent) setAgent(agent);
    if (agentToken) setAgentToken(agentToken);

    if (merchant) setMerchant(merchant);
    if (merchantToken) setMerchantToken(merchantToken);
  }, []);

  // Unified API helper
  const apiFetch = async (endpoint, method = "GET", body = null, params = {}, token = "") => {
    try {
      const res = await axios({
        url: `${BASE_URL}${endpoint}`,
        method,
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
          "Content-Type": "application/json",
        },
        data: body,
        params,
      });

      return res.data?.data || res.data;
    } catch (error) {
      console.log("API Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.msg || "Something went wrong");
      throw error;
    }
  };

  // Login Function
  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await axios.post(`${BASE_URL}/auth/login`, { email, password });
      const data = res.data?.data;

      if (!data?.token) {
        toast.error("No token received");
        return false;
      }

      const role = data.role?.toUpperCase();
      const payload = {
        id: data.id || data._id,
        role,
        profile: data.user || data.agent || data.merchant || {},
      };

      switch (role) {
        case "AGENT":
          localStorage.setItem("agent", JSON.stringify(payload));
          localStorage.setItem("agentToken", data.token);
          setAgent(payload);
          setAgentToken(data.token);
          router.push("/dashboard/agent");
          break;

        case "MERCHANT":
          localStorage.setItem("merchant", JSON.stringify(payload));
          localStorage.setItem("merchantToken", data.token);
          setMerchant(payload);
          setMerchantToken(data.token);
          router.push("/dashboard/merchant");
          break;

        default:
          localStorage.setItem("user", JSON.stringify(payload));
          localStorage.setItem("userToken", data.token);
          setUser(payload);
          setUserToken(data.token);
          router.push("/dashboard/user");
          break;
      }

      toast.success("Login successful!");
      return true;
    } catch (error) {
      console.log("Login error:", error.response?.data || error.message);
      toast.error(error.response?.data?.msg || "Login failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout for any or all roles
  const logout = (role = "ALL") => {
    if (typeof window === "undefined") return;

    if (role === "ALL" || role === "USER") {
      localStorage.removeItem("user");
      localStorage.removeItem("userToken");
      setUser(null);
      setUserToken("");
    }
    if (role === "ALL" || role === "AGENT") {
      localStorage.removeItem("agent");
      localStorage.removeItem("agentToken");
      setAgent(null);
      setAgentToken("");
    }
    if (role === "ALL" || role === "MERCHANT") {
      localStorage.removeItem("merchant");
      localStorage.removeItem("merchantToken");
      setMerchant(null);
      setMerchantToken("");
    }

    toast.info("Logged out");
    router.push("/login");
  };

  // Helpers
  const isUser = !!user;
  const isAgent = !!agent;
  const isMerchant = !!merchant;

  const getToken = (role) => {
  switch (role?.toUpperCase()) {
    case "AGENT":
      return agentToken;
    case "MERCHANT":
      return merchantToken;
    case "USER":
    default:
      return userToken;
  }
};


  // Global Fallbacks
  const token = agentToken || userToken || merchantToken;
  const currentUser = agent || user || merchant;

  return (
    <AppContext.Provider
      value={{
        BASE_URL,
        loading,
        login,
        logout,
        apiFetch,
        user,
        userToken,
        getToken,
        agent,
        agentToken,
        merchant,
        merchantToken,
        isUser,
        isAgent,
        isMerchant,
        token,
        currentUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
