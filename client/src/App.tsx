import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider, useTheme } from "@/components/theme-provider";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Documents from "@/pages/documents";
import DocumentDetail from "@/pages/DocumentDetail";
import Help from "@/pages/help";
import Storybook from "@/pages/storybook";
import Categories from "@/pages/categories";
import CategoryDetail from "@/pages/CategoryDetail";

function TopNavigation() {
  const { user, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!isAuthenticated) return null;

  const initials = user?.firstName && user?.lastName 
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : user?.email?.[0]?.toUpperCase() || "U";

  return (
    <nav className="bg-white dark:bg-dark-surface border-b border-gray-200 dark:border-dark-border px-4 sm:px-6 py-3 sm:py-4 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-accent-blue rounded-lg flex items-center justify-center">
            <i className="fas fa-brain text-white text-xs sm:text-sm"></i>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">DocuAI</h1>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
          <a href="/" className="text-gray-600 dark:text-gray-300 hover:text-accent-blue transition-colors text-sm xl:text-base">
            Dashboard
          </a>
          <a href="/documents" className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-accent-blue transition-colors text-sm xl:text-base">
            <i className="fas fa-file-alt"></i>
            <span>Documents</span>
          </a>
          <a href="/categories" className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-accent-blue transition-colors text-sm xl:text-base">
            <i className="fas fa-tags"></i>
            <span>Categories</span>
          </a>
          <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-accent-blue transition-colors text-sm xl:text-base">
            Analytics
          </a>
          <a href="/help" className="text-gray-600 dark:text-gray-300 hover:text-accent-blue transition-colors text-sm xl:text-base">
            Help
          </a>
          <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-accent-blue transition-colors text-sm xl:text-base">
            Settings
          </a>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-border transition-colors"
          >
            <i className={`fas ${theme === 'dark' ? 'fa-sun text-yellow-400' : 'fa-moon text-gray-600'} text-sm`}></i>
          </Button>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden p-1.5 sm:p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-gray-600 dark:text-gray-300`}></i>
          </Button>

          {/* User Profile - Desktop */}
          <div className="hidden sm:flex items-center space-x-2 lg:space-x-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-accent-blue rounded-full flex items-center justify-center">
              <span className="text-white text-xs sm:text-sm font-medium">{initials}</span>
            </div>
            <div className="hidden md:block">
              <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                {user?.firstName && user?.lastName 
                  ? `${user.firstName} ${user.lastName}`
                  : user?.email
                }
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">User</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.href = "/api/logout"}
              className="p-1 hover:bg-gray-100 dark:hover:bg-dark-border rounded transition-colors"
            >
              <i className="fas fa-sign-out-alt text-xs text-gray-500"></i>
            </Button>
          </div>

          {/* User Profile - Mobile (Avatar only) */}
          <div className="sm:hidden">
            <div className="w-7 h-7 bg-accent-blue rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-medium">{initials}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-4 pb-4 border-t border-gray-200 dark:border-dark-border">
          <div className="flex flex-col space-y-3 pt-4">
            <a 
              href="/" 
              className="text-gray-600 dark:text-gray-300 hover:text-accent-blue transition-colors py-2 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-bg"
              onClick={() => setMobileMenuOpen(false)}
            >
              <i className="fas fa-tachometer-alt mr-3 w-4"></i>Dashboard
            </a>
            <a 
              href="/documents" 
              className="text-gray-600 dark:text-gray-300 hover:text-accent-blue transition-colors py-2 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-bg flex items-center justify-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              <i className="fas fa-file-alt text-lg"></i>
            </a>
            <a 
              href="/categories" 
              className="text-gray-600 dark:text-gray-300 hover:text-accent-blue transition-colors py-2 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-bg flex items-center justify-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              <i className="fas fa-tags text-lg"></i>
            </a>
            <a 
              href="#" 
              className="text-gray-600 dark:text-gray-300 hover:text-accent-blue transition-colors py-2 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-bg"
              onClick={() => setMobileMenuOpen(false)}
            >
              <i className="fas fa-chart-bar mr-3 w-4"></i>Analytics
            </a>
            <a 
              href="/help" 
              className="text-gray-600 dark:text-gray-300 hover:text-accent-blue transition-colors py-2 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-bg"
              onClick={() => setMobileMenuOpen(false)}
            >
              <i className="fas fa-question-circle mr-3 w-4"></i>Help
            </a>
            <a 
              href="#" 
              className="text-gray-600 dark:text-gray-300 hover:text-accent-blue transition-colors py-2 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-bg"
              onClick={() => setMobileMenuOpen(false)}
            >
              <i className="fas fa-cog mr-3 w-4"></i>Settings
            </a>
            <hr className="border-gray-200 dark:border-dark-border my-2" />
            <div className="sm:hidden flex items-center justify-between py-2 px-2">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-accent-blue rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">{initials}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.firstName && user?.lastName 
                      ? `${user.firstName} ${user.lastName}`
                      : user?.email
                    }
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">User</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.location.href = "/api/logout"}
                className="p-2 hover:bg-gray-100 dark:hover:bg-dark-border rounded transition-colors"
              >
                <i className="fas fa-sign-out-alt text-gray-500"></i>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <>
      <TopNavigation />
      <Switch>
        {isLoading || !isAuthenticated ? (
          <Route path="/" component={Landing} />
        ) : (
          <>
            <Route path="/" component={Dashboard} />
            <Route path="/documents" component={Documents} />
            <Route path="/documents/:id" component={DocumentDetail} />
            <Route path="/categories" component={Categories} />
            <Route path="/categories/:id" component={CategoryDetail} />
            <Route path="/help" component={Help} />
            <Route path="/storybook" component={Storybook} />
          </>
        )}
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
