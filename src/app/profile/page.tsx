"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { profileApi } from "@/api/api";
import { Profile, UpdateProfileRequest } from "@/api/types";
import { User, Mail, Lock, Camera, Save, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Password change states
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("authToken") || "";
      const response = await profileApi.getProfile(token);
      const profileData = response.data.profile;

      setProfile(profileData);
      setName(profileData.name);
      setEmail(profileData.email);
      setProfileImage(profileData.profile_image);
    } catch (err: unknown) {
      setError("Failed to load profile");
      console.error("Profile error:", err);
      if (err && typeof err === "object" && "response" in err) {
        const errorResponse = err as { response?: { status?: number } };
        if (errorResponse.response?.status === 401) {
          router.push("/login");
        }
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  async function handleUpdateProfile() {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    setUpdating(true);
    try {
      const token = localStorage.getItem("authToken") || "";
      const updateData: UpdateProfileRequest = {
        name: name.trim(),
        profile_image: profileImage,
      };

      await profileApi.updateProfile(updateData, token);
      toast.success("Profile updated successfully");
      loadProfile(); // Reload profile data
    } catch (err: unknown) {
      console.error("Update profile error:", err);
      if (err && typeof err === "object" && "response" in err) {
        const errorResponse = err as {
          response?: { data?: { message?: string } };
        };
        toast.error(
          errorResponse.response?.data?.message || "Failed to update profile"
        );
      } else {
        toast.error("Failed to update profile");
      }
    } finally {
      setUpdating(false);
    }
  }

  async function handleChangePassword() {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All password fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    setUpdating(true);
    try {
      const token = localStorage.getItem("authToken") || "";
      await profileApi.changePassword(
        {
          current_password: currentPassword,
          new_password: newPassword,
        },
        token
      );

      toast.success("Password changed successfully");
      setShowPasswordForm(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      console.error("Change password error:", err);
      if (err && typeof err === "object" && "response" in err) {
        const errorResponse = err as {
          response?: { data?: { message?: string } };
        };
        toast.error(
          errorResponse.response?.data?.message || "Failed to change password"
        );
      } else {
        toast.error("Failed to change password");
      }
    } finally {
      setUpdating(false);
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you would upload the file to a server and get back a URL
      // For now, we'll create a local URL for preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfileImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center">
          <button
            onClick={() => router.back()}
            className="mr-4 flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back
          </button>
          <h2 className="text-4xl font-bold text-gray-800">Profile</h2>
        </div>
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="animate-pulse space-y-6">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 rounded w-48"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="flex items-center">
          <button
            onClick={() => router.back()}
            className="mr-4 flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back
          </button>
          <h2 className="text-4xl font-bold text-gray-800">Profile</h2>
        </div>
        <div className="bg-white rounded-xl shadow-md p-8">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadProfile}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="space-y-8">
        <div className="flex items-center">
          <button
            onClick={() => router.back()}
            className="mr-4 flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back
          </button>
          <h2 className="text-4xl font-bold text-gray-800">Profile</h2>
        </div>
        <div className="bg-white rounded-xl shadow-md p-8">
          <p className="text-gray-600">No profile data available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <button
          onClick={() => router.back()}
          className="mr-4 flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back
        </button>
        <h2 className="text-4xl font-bold text-gray-800">Profile</h2>
      </div>

      {/* Profile Information */}
      <div className="bg-white rounded-xl shadow-md p-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">
          Profile Information
        </h3>

        <div className="space-y-6">
          {/* Profile Image */}
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {profileImage ? (
                  <Image
                    src={profileImage}
                    alt="Profile"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 text-gray-400" />
                )}
              </div>
              <label
                htmlFor="profile-image"
                className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700"
              >
                <Camera className="w-4 h-4" />
              </label>
              <input
                id="profile-image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            <div>
              <h4 className="text-xl font-medium text-gray-800">
                {profile.name}
              </h4>
              <p className="text-gray-600">{profile.email}</p>
            </div>
          </div>

          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className="block text-base font-medium text-gray-700 mb-2"
            >
              <User className="inline w-5 h-5 mr-2" />
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base text-gray-900 placeholder-gray-500"
              placeholder="Enter your full name"
            />
          </div>

          {/* Email Field (Read-only) */}
          <div>
            <label
              htmlFor="email"
              className="block text-base font-medium text-gray-700 mb-2"
            >
              <Mail className="inline w-5 h-5 mr-2" />
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-base cursor-not-allowed"
            />
            <p className="text-sm text-gray-500 mt-1">
              Email cannot be changed
            </p>
          </div>

          {/* Update Profile Button */}
          <div className="flex justify-end">
            <button
              onClick={handleUpdateProfile}
              disabled={updating}
              className="flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-base"
            >
              <Save className="w-5 h-5 mr-2" />
              {updating ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </div>
      </div>

      {/* Password Change Section */}
      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold text-gray-800">
            Change Password
          </h3>
          {!showPasswordForm && (
            <button
              onClick={() => setShowPasswordForm(true)}
              className="flex items-center px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 text-base"
            >
              <Lock className="w-5 h-5 mr-2" />
              Change Password
            </button>
          )}
        </div>

        {showPasswordForm && (
          <div className="space-y-6">
            <div>
              <label
                htmlFor="current-password"
                className="block text-base font-medium text-gray-700 mb-2"
              >
                Current Password
              </label>
              <input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base text-gray-900 placeholder-gray-500"
                placeholder="Enter your current password"
              />
            </div>

            <div>
              <label
                htmlFor="new-password"
                className="block text-base font-medium text-gray-700 mb-2"
              >
                New Password
              </label>
              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base text-gray-900 placeholder-gray-500"
                placeholder="Enter your new password"
              />
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="block text-base font-medium text-gray-700 mb-2"
              >
                Confirm New Password
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base text-gray-900 placeholder-gray-500"
                placeholder="Confirm your new password"
              />
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleChangePassword}
                disabled={updating}
                className="flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-base"
              >
                <Lock className="w-5 h-5 mr-2" />
                {updating ? "Updating..." : "Change Password"}
              </button>
              <button
                onClick={() => {
                  setShowPasswordForm(false);
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                }}
                className="px-6 py-3 bg-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-400 text-base"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
