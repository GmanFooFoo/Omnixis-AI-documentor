import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Settings as SettingsIcon, Palette, User, Shield, Bell, Database } from "lucide-react";

export default function Settings() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
          <Link href="/" className="hover:text-accent-blue">Home</Link>
          <span>/</span>
          <span className="text-gray-600 dark:text-gray-300">Settings</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Settings</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Manage your account preferences and application settings.
          </p>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Design System */}
          <Card className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-accent-blue/10 rounded-lg flex items-center justify-center">
                  <Palette className="h-5 w-5 text-accent-blue" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Design System</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                View our comprehensive design system, UI components, and style guide.
              </p>
              <Link href="/settings/design-system">
                <Button variant="outline" className="w-full">
                  View Design System
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Account Settings */}
          <Card className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-accent-green/10 rounded-lg flex items-center justify-center">
                  <User className="h-5 w-5 text-accent-green" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Account</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage your profile, preferences, and account security.
              </p>
              <Button variant="outline" className="w-full" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Security</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Configure authentication, API keys, and security preferences.
              </p>
              <Button variant="outline" className="w-full" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-accent-orange/10 rounded-lg flex items-center justify-center">
                  <Bell className="h-5 w-5 text-accent-orange" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Control email notifications and processing alerts.
              </p>
              <Button variant="outline" className="w-full" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          {/* Database Settings */}
          <Card className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <Database className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Database</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                View database status, manage storage, and configure backups.
              </p>
              <Button variant="outline" className="w-full" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          {/* General Settings */}
          <Card className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-500/10 rounded-lg flex items-center justify-center">
                  <SettingsIcon className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">General</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Application preferences, themes, and general configurations.
              </p>
              <Button variant="outline" className="w-full" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}