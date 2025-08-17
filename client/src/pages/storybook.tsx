import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function Storybook() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg pt-16">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 mb-6">
          <Button
            variant="ghost"
            onClick={() => setLocation('/help')}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-0"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Help
          </Button>
          <span className="text-gray-400 dark:text-gray-500">/</span>
          <span className="text-gray-600 dark:text-gray-300">Design System</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Storybook - Design System</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            A comprehensive guide to our UI components, design patterns, and visual language.
          </p>
        </div>

        <div className="space-y-8">
          {/* Color Palette */}
          <Card className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Color Palette</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Primary Colors</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="w-full h-16 bg-accent-blue rounded-lg mb-2"></div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Accent Blue</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">#3B82F6</p>
                  </div>
                  <div className="text-center">
                    <div className="w-full h-16 bg-accent-green rounded-lg mb-2"></div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Accent Green</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">#10B981</p>
                  </div>
                  <div className="text-center">
                    <div className="w-full h-16 bg-red-500 rounded-lg mb-2"></div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Error Red</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">#EF4444</p>
                  </div>
                  <div className="text-center">
                    <div className="w-full h-16 bg-yellow-500 rounded-lg mb-2"></div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Warning Yellow</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">#F59E0B</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Neutral Colors</h3>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                  <div className="text-center">
                    <div className="w-full h-12 bg-white border border-gray-200 rounded-lg mb-2"></div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">White</p>
                  </div>
                  <div className="text-center">
                    <div className="w-full h-12 bg-gray-50 rounded-lg mb-2"></div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Gray 50</p>
                  </div>
                  <div className="text-center">
                    <div className="w-full h-12 bg-gray-200 rounded-lg mb-2"></div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Gray 200</p>
                  </div>
                  <div className="text-center">
                    <div className="w-full h-12 bg-gray-500 rounded-lg mb-2"></div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Gray 500</p>
                  </div>
                  <div className="text-center">
                    <div className="w-full h-12 bg-gray-800 rounded-lg mb-2"></div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Gray 800</p>
                  </div>
                  <div className="text-center">
                    <div className="w-full h-12 bg-gray-900 rounded-lg mb-2"></div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Gray 900</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Typography */}
          <Card className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Typography</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Heading 1 - 4xl Bold</h1>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Heading 2 - 3xl Bold</h2>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Heading 3 - 2xl Semibold</h3>
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white">Heading 4 - xl Semibold</h4>
                <h5 className="text-lg font-medium text-gray-900 dark:text-white">Heading 5 - lg Medium</h5>
                <h6 className="text-base font-medium text-gray-900 dark:text-white">Heading 6 - base Medium</h6>
              </div>
              <div className="border-t pt-4 space-y-2">
                <p className="text-base text-gray-900 dark:text-white">Body text - Regular 16px</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Small text - Regular 14px</p>
                <p className="text-xs text-gray-500 dark:text-gray-500">Caption text - Regular 12px</p>
              </div>
            </CardContent>
          </Card>

          {/* Buttons */}
          <Card className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Buttons</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Button Variants</h3>
                <div className="flex flex-wrap gap-4">
                  <Button variant="default">Primary Button</Button>
                  <Button variant="secondary">Secondary Button</Button>
                  <Button variant="outline">Outline Button</Button>
                  <Button variant="ghost">Ghost Button</Button>
                  <Button variant="destructive">Destructive Button</Button>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Button Sizes</h3>
                <div className="flex flex-wrap items-center gap-4">
                  <Button size="sm">Small</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large</Button>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Button States</h3>
                <div className="flex flex-wrap gap-4">
                  <Button>Normal</Button>
                  <Button disabled>Disabled</Button>
                  <Button className="opacity-75">Loading State</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form Components */}
          <Card className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Form Components</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="input-example">Text Input</Label>
                    <Input id="input-example" placeholder="Enter text here..." />
                  </div>
                  <div>
                    <Label htmlFor="textarea-example">Textarea</Label>
                    <Textarea id="textarea-example" placeholder="Enter longer text here..." />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="switch-example" />
                    <Label htmlFor="switch-example">Toggle Switch</Label>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label>Input States</Label>
                    <div className="space-y-2">
                      <Input placeholder="Normal state" />
                      <Input placeholder="Error state" className="border-red-500" />
                      <Input disabled placeholder="Disabled state" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Badges and Status */}
          <Card className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Badges & Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Badge Variants</h3>
                <div className="flex flex-wrap gap-4">
                  <Badge variant="default">Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Status Indicators</h3>
                <div className="flex flex-wrap gap-4">
                  <Badge variant="outline" className="border-green-500 text-green-600">Active</Badge>
                  <Badge variant="outline" className="border-red-500 text-red-600">Inactive</Badge>
                  <Badge variant="outline" className="border-yellow-500 text-yellow-600">Processing</Badge>
                  <Badge variant="outline" className="border-blue-500 text-blue-600">Completed</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cards */}
          <Card className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Cards</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border">
                  <CardHeader>
                    <CardTitle className="text-lg">Basic Card</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400">
                      This is a basic card component with header and content.
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800">
                  <CardHeader>
                    <CardTitle className="text-lg text-blue-900 dark:text-blue-100">Accent Card</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-blue-700 dark:text-blue-200">
                      This is an accent card with colored background.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Design Principles */}
          <Card className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Design Principles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Consistency</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Maintain visual and functional consistency across all components and pages.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Accessibility</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Design with accessibility in mind, ensuring proper contrast and keyboard navigation.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Clarity</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Use clear visual hierarchy and intuitive interactions to guide users.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Efficiency</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Optimize for user efficiency with minimal cognitive load and quick task completion.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Spacing & Layout */}
          <Card className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Spacing & Layout</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Spacing Scale</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-6 bg-accent-blue"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">2px - xs</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-4 h-6 bg-accent-blue"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">4px - sm</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-6 h-6 bg-accent-blue"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">6px - md</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-6 bg-accent-blue"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">8px - lg</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-6 bg-accent-blue"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">12px - xl</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-6 bg-accent-blue"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">16px - 2xl</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}