export type Notification = {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  user_id: string;
};

export const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "info",
    title: "Welcome to the platform",
    message: "Your account has been created successfully.",
    read: false,
    created_at: new Date().toISOString(),
    user_id: "user_1",
  },
  {
    id: "2",
    type: "success",
    title: "Profile updated",
    message: "Your profile information was updated.",
    read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    user_id: "user_1",
  },
  {
    id: "3",
    type: "warning",
    title: "Password expiring",
    message:
      "Your password will expire in 5 days. Please update it to avoid issues.",
    read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    user_id: "user_1",
  },
  // 5 extra notifications for other users
  {
    id: "4",
    type: "error",
    title: "Login failed",
    message: "There was a failed login attempt on your account.",
    read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    user_id: "user_2",
  },
  {
    id: "5",
    type: "info",
    title: "New message",
    message: "You have received a new message from support.",
    read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    user_id: "user_3",
  },
  {
    id: "6",
    type: "success",
    title: "Subscription renewed",
    message: "Your subscription has been renewed successfully.",
    read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    user_id: "user_4",
  },
  {
    id: "7",
    type: "warning",
    title: "Storage limit reached",
    message: "You have reached 90% of your storage limit.",
    read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    user_id: "user_5",
  },
  {
    id: "8",
    type: "info",
    title: "New feature available",
    message: "Check out the new dashboard analytics feature.",
    read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    user_id: "user_6",
  },
  {
    id: "9",
    type: "info",
    title: "Important Update: Scheduled Maintenance for the Upcoming Weekend – Please Read Carefully",
    message: `Dear user,

    We would like to inform you that our platform will undergo scheduled maintenance starting from Friday 10:00 PM until Saturday 6:00 AM. During this period, some features may be temporarily unavailable, including:

    - Account login and authentication
    - Access to analytics dashboards
    - Notifications and messaging features

    Please make sure to save your work and log out before the maintenance window to prevent any data loss. We apologize for any inconvenience and appreciate your understanding.

    Thank you for being a valued user!`,
      read: false,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      user_id: "user_7",
  }

];
