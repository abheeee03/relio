import axios from "axios";
import { redirect } from "next/navigation";

const API_BASE = "/api";

export const handelLogin = async (
  username: string | null,
  password: string | null
) => {
  if (!username || !password) {
    return null;
  }

  const res = await axios.post(`${API_BASE}/user/signin`, {
    username,
    password,
  });

  if (!res || !res.data) {
    return null;
  }

  const jwt = res.data.token;
  sessionStorage.setItem("relio-jwt", jwt);
  return true;
};

export const getToken = async () => {
  return sessionStorage.getItem("relio-jwt");
};

export const getUserData = async () => {
  const token = await getToken();
  if (!token) {
    redirect("/login");
  }
  const { data: websites } = await axios.get(`${API_BASE}/user/me`, {
    headers: {
      Authorization: token,
    },
  });

  console.log("returnning thr websites: ", websites);

  return websites;
};

export type ProfileUpdateInput = {
  name?: string;
  email?: string;
  image?: string | null;
  username?: string | null;
};

export const updateUserProfile = async (payload: ProfileUpdateInput) => {
  const token = await getToken();
  if (!token) {
    redirect("/login");
  }

  try {
    const res = await axios.patch(`${API_BASE}/user/me`, payload, {
      headers: { Authorization: token },
    });
    if (res.data?.error) {
      return { success: false as const, error: res.data.error as string };
    }
    return { success: true as const, data: res.data?.data };
  } catch (error: unknown) {
    const message =
      axios.isAxiosError(error) && error.response?.data?.error
        ? String(error.response.data.error)
        : "Failed to update profile";
    return { success: false as const, error: message };
  }
};

export const changeUserPassword = async (
  currentPassword: string,
  newPassword: string
) => {
  const token = await getToken();
  if (!token) {
    redirect("/login");
  }

  try {
    const res = await axios.post(
      `${API_BASE}/user/change-password`,
      { currentPassword, newPassword },
      { headers: { Authorization: token } }
    );
    if (res.data?.error) {
      return { success: false as const, error: res.data.error as string };
    }
    return { success: true as const };
  } catch (error: unknown) {
    const message =
      axios.isAxiosError(error) && error.response?.data?.error
        ? String(error.response.data.error)
        : "Failed to change password";
    return { success: false as const, error: message };
  }
};

export const normalizeWebsiteUrl = (raw: string) => {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};

export const addWebsite = async (url: string | null) => {
  if (!url) {
    return { success: false as const, error: "URL is required" };
  }

  const normalizedUrl = normalizeWebsiteUrl(url);
  try {
    // Basic URL validation
    new URL(normalizedUrl);
  } catch {
    return { success: false as const, error: "Enter a valid URL" };
  }

  const token = await getToken();
  if (!token) {
    redirect("/login");
  }

  try {
    const res = await axios.post(
      `${API_BASE}/website/create`,
      { url: normalizedUrl },
      {
        headers: {
          Authorization: token,
        },
      }
    );

    if (res.data?.error) {
      return { success: false as const, error: res.data.error as string };
    }

    return { success: true as const, data: res.data?.data };
  } catch (error) {
    console.error("Failed to add website:", error);
    return { success: false as const, error: "Failed to add website" };
  }
};

export const logout = () => {
  sessionStorage.removeItem("relio-jwt");
  redirect("/login");
};

export const getWebsiteData = async (websiteID: string) => {
  const token = sessionStorage.getItem("relio-jwt");
  const res = await axios.get(`${API_BASE}/website/ticks/${websiteID}`, {
    headers: {
      Authorization: token,
    },
  });
  if (!res.data) {
    redirect("/404");
  }

  return res.data.data;
};

export const getAllTicks = async (limit: number = 15, offset: number = 0) => {
  const token = sessionStorage.getItem("relio-jwt");
  if (!token) {
    redirect("/login");
  }

  try {
    const res = await axios.get(`${API_BASE}/website/all-ticks`, {
      headers: {
        Authorization: token,
      },
      params: {
        limit,
        offset,
      },
    });

    return res.data;
  } catch (error) {
    console.error("Failed to fetch ticks:", error);
    return { data: [], total: 0, hasMore: false };
  }
};

export const deleteWebsite = async (websiteID: string) => {
  const token = sessionStorage.getItem("relio-jwt");
  if (!token) {
    redirect("/login");
  }

  try {
    const res = await axios.post(
      `${API_BASE}/website/delete/${websiteID}`,
      {},
      {
        headers: {
          Authorization: token,
        },
      }
    );
    console.log(res);
    if (!res) {
      return { success: false };
    }
    return { success: true, data: res.data };
  } catch (error) {
    console.error("Failed to delete website:", error);
    return { success: false, error };
  }
};
