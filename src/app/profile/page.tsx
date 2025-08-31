"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { profileApi } from "@/api/api";
import { Profile, UpdateProfileRequest } from "@/api/types";
import { User, Mail, Lock, Camera, Save, X } from "lucide-react";
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

  // Image URL modal states
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

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

  const handleImageUpload = () => {
    setImageUrl(profileImage || "");
    setShowImageModal(true);
  };

  const handleImageUrlSubmit = async () => {
    // URL validation if imageUrl is provided
    if (imageUrl.trim()) {
      try {
        new URL(imageUrl.trim());
      } catch {
        toast.error("Please enter a valid URL");
        return;
      }
    }

    setUpdating(true);
    try {
      const token = localStorage.getItem("authToken") || "";
      const updateData: UpdateProfileRequest = {
        name: name.trim(),
        profile_image: imageUrl.trim() || null,
      };

      await profileApi.updateProfile(updateData, token);

      // Update local state
      setProfileImage(imageUrl.trim() || null);
      setShowImageModal(false);
      setImageUrl("");

      if (imageUrl.trim()) {
        toast.success("Profile image updated successfully");
      } else {
        toast.success("Profile image removed successfully");
      }

      // Reload profile data to sync with server
      loadProfile();
    } catch (err: unknown) {
      console.error("Update profile image error:", err);
      if (err && typeof err === "object" && "response" in err) {
        const errorResponse = err as {
          response?: { data?: { message?: string } };
        };
        toast.error(
          errorResponse.response?.data?.message ||
            "Failed to update profile image"
        );
      } else {
        toast.error("Failed to update profile image");
      }
    } finally {
      setUpdating(false);
    }
  };

  const handleImageUrlCancel = () => {
    setShowImageModal(false);
    setImageUrl("");
  };

  if (loading) {
    return (
      <div className="space-y-6 lg:space-y-8">
        <div className="bg-white rounded-xl shadow-md p-4 lg:p-8">
          <div className="animate-pulse space-y-6">
            <div className="flex flex-col sm:flex-row items-center sm:space-x-6 space-y-4 sm:space-y-0">
              <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gray-200 rounded-full flex-shrink-0"></div>
              <div className="space-y-2 text-center sm:text-left">
                <div className="h-5 lg:h-6 bg-gray-200 rounded w-32 lg:w-48 mx-auto sm:mx-0"></div>
                <div className="h-4 bg-gray-200 rounded w-24 lg:w-32 mx-auto sm:mx-0"></div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-20 lg:w-24"></div>
              <div className="h-8 lg:h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 lg:space-y-8">
        <div className="bg-white rounded-xl shadow-md p-4 lg:p-8">
          <p className="text-red-600 mb-4 text-sm lg:text-base">{error}</p>
          <button
            onClick={loadProfile}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm lg:text-base"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="space-y-6 lg:space-y-8">
        <div className="bg-white rounded-xl shadow-md p-4 lg:p-8">
          <p className="text-gray-600 text-sm lg:text-base">
            No profile data available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Profile Information */}
      <div className="bg-white rounded-xl shadow-md p-4 lg:p-8">
        <h3 className="text-xl lg:text-2xl font-semibold text-gray-800 mb-4 lg:mb-6">
          Profile Information
        </h3>

        <div className="space-y-6">
          {/* Profile Image */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {profileImage ? (
                  <Image
                    src={profileImage}
                    alt="Profile"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 lg:w-10 lg:h-10 text-gray-400" />
                )}
              </div>
              <button
                onClick={handleImageUpload}
                className="absolute bottom-0 right-0 bg-indigo-600 text-white p-1.5 lg:p-2 rounded-full cursor-pointer hover:bg-indigo-700 transition-colors"
                title="Change profile image"
              >
                <Camera className="w-3 h-3 lg:w-4 lg:h-4" />
              </button>
            </div>
            <div className="text-center sm:text-left">
              <h4 className="text-lg lg:text-xl font-medium text-gray-800">
                {profile.name}
              </h4>
              <p className="text-gray-600 text-sm lg:text-base">
                {profile.email}
              </p>
            </div>
          </div>

          {/* Name and Email Fields */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm lg:text-base font-medium text-gray-700 mb-2"
              >
                <User className="inline w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm lg:text-base text-gray-900 placeholder-gray-500"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email Field (Read-only) */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm lg:text-base font-medium text-gray-700 mb-2"
              >
                <Mail className="inline w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                readOnly
                className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm lg:text-base cursor-not-allowed"
              />
              <p className="text-xs lg:text-sm text-gray-500 mt-1">
                Email cannot be changed
              </p>
            </div>
          </div>

          {/* Update Profile Button */}
          <div className="flex justify-center sm:justify-end">
            <button
              onClick={handleUpdateProfile}
              disabled={updating}
              className="w-full sm:w-auto flex items-center justify-center px-4 lg:px-6 py-2 lg:py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm lg:text-base"
            >
              <Save className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
              {updating ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </div>
      </div>

      {/* Password Change Section */}
      <div className="bg-white rounded-xl shadow-md p-4 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <h3 className="text-xl lg:text-2xl font-semibold text-gray-800">
            Change Password
          </h3>
          {!showPasswordForm && (
            <button
              onClick={() => setShowPasswordForm(true)}
              className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 text-sm lg:text-base"
            >
              <Lock className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
              Change Password
            </button>
          )}
        </div>

        {showPasswordForm && (
          <div className="space-y-4 lg:space-y-6">
            <div>
              <label
                htmlFor="current-password"
                className="block text-sm lg:text-base font-medium text-gray-700 mb-2"
              >
                Current Password
              </label>
              <input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm lg:text-base text-gray-900 placeholder-gray-500"
                placeholder="Enter your current password"
              />
            </div>

            <div>
              <label
                htmlFor="new-password"
                className="block text-sm lg:text-base font-medium text-gray-700 mb-2"
              >
                New Password
              </label>
              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm lg:text-base text-gray-900 placeholder-gray-500"
                placeholder="Enter your new password"
              />
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm lg:text-base font-medium text-gray-700 mb-2"
              >
                Confirm New Password
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm lg:text-base text-gray-900 placeholder-gray-500"
                placeholder="Confirm your new password"
              />
            </div>

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={handleChangePassword}
                disabled={updating}
                className="w-full sm:w-auto flex items-center justify-center px-4 lg:px-6 py-2 lg:py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm lg:text-base"
              >
                <Lock className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                {updating ? "Updating..." : "Change Password"}
              </button>
              <button
                onClick={() => {
                  setShowPasswordForm(false);
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                }}
                className="w-full sm:w-auto px-4 lg:px-6 py-2 lg:py-3 bg-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-400 text-sm lg:text-base"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Image URL Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-4 lg:p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg lg:text-xl font-semibold text-gray-800">
                Update Profile Image
              </h3>
              <button
                onClick={handleImageUrlCancel}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5 lg:w-6 lg:h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="image-url"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Image URL
                </label>
                <input
                  id="image-url"
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-900 placeholder-gray-600"
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter a valid image URL or leave empty to remove current image
                </p>
              </div>

              {/* Preview */}
              {imageUrl && (
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Preview:</p>
                  <div className="w-16 h-16 lg:w-20 lg:h-20 mx-auto rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt="Preview"
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://ui-avatars.com/api/?name=Preview&background=cccccc&color=555555";
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-2">
                <button
                  onClick={handleImageUrlSubmit}
                  disabled={updating}
                  className="w-full sm:flex-1 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  {updating ? "Updating..." : "Update Image"}
                </button>
                <button
                  onClick={handleImageUrlCancel}
                  disabled={updating}
                  className="w-full sm:flex-1 px-4 py-2 bg-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
