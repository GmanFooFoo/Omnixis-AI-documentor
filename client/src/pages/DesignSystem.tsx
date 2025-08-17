import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Link } from "wouter";

export default function DesignSystem() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumb 
          items={[
            { label: 'Home', href: '/', icon: 'fas fa-home' },
            { label: 'Settings', href: '/settings', icon: 'fas fa-cog' },
            { label: 'Design System', icon: 'fas fa-palette' }
          ]}
          showBackToTop={true}
        />

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Design System</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            A comprehensive guide to our UI components, design patterns, and visual language.
          </p>
          
          {/* Page Navigation */}
          <div className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Quick Navigation</h3>
            <div className="flex flex-wrap gap-2">
              <a href="#colors" className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md hover:bg-accent-blue hover:text-white transition-colors">
                <i className="fas fa-palette icon-xs mr-1"></i>Colors
              </a>
              <a href="#typography" className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md hover:bg-accent-blue hover:text-white transition-colors">
                <i className="fas fa-font icon-xs mr-1"></i>Typography
              </a>
              <a href="#buttons" className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md hover:bg-accent-blue hover:text-white transition-colors">
                <i className="fas fa-mouse-pointer icon-xs mr-1"></i>Buttons
              </a>
              <a href="#forms" className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md hover:bg-accent-blue hover:text-white transition-colors">
                <i className="fas fa-edit icon-xs mr-1"></i>Form Components
              </a>
              <a href="#badges" className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md hover:bg-accent-blue hover:text-white transition-colors">
                <i className="fas fa-tag icon-xs mr-1"></i>Badges & Status
              </a>
              <a href="#cards" className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md hover:bg-accent-blue hover:text-white transition-colors">
                <i className="fas fa-square icon-xs mr-1"></i>Cards
              </a>
              <a href="#icons" className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md hover:bg-accent-blue hover:text-white transition-colors">
                <i className="fas fa-star icon-xs mr-1"></i>Icon System
              </a>
              <a href="#breadcrumbs" className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md hover:bg-accent-blue hover:text-white transition-colors">
                <i className="fas fa-sitemap icon-xs mr-1"></i>Breadcrumbs
              </a>
              <a href="#principles" className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md hover:bg-accent-blue hover:text-white transition-colors">
                <i className="fas fa-lightbulb icon-xs mr-1"></i>Design Principles
              </a>
              <a href="#spacing" className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md hover:bg-accent-blue hover:text-white transition-colors">
                <i className="fas fa-ruler icon-xs mr-1"></i>Spacing & Layout
              </a>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Color Palette */}
          <Card id="colors" className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border">
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
          <Card id="typography" className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border">
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
          <Card id="buttons" className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border">
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
          <Card id="forms" className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border">
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
          <Card id="badges" className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border">
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
          <Card id="cards" className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border">
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
          <Card id="principles" className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border">
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

          {/* Icon System */}
          <Card id="icons" className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Icon System</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Size Scale</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center">
                    <i className="fas fa-star icon-xs text-accent-blue mb-2 block"></i>
                    <p className="text-xs text-gray-500 dark:text-gray-400">icon-xs (12px)</p>
                  </div>
                  <div className="text-center">
                    <i className="fas fa-star icon-sm text-accent-blue mb-2 block"></i>
                    <p className="text-xs text-gray-500 dark:text-gray-400">icon-sm (14px)</p>
                  </div>
                  <div className="text-center">
                    <i className="fas fa-star icon-base text-accent-blue mb-2 block"></i>
                    <p className="text-xs text-gray-500 dark:text-gray-400">icon-base (16px)</p>
                  </div>
                  <div className="text-center">
                    <i className="fas fa-star icon-lg text-accent-blue mb-2 block"></i>
                    <p className="text-xs text-gray-500 dark:text-gray-400">icon-lg (18px)</p>
                  </div>
                  <div className="text-center">
                    <i className="fas fa-star icon-xl text-accent-blue mb-2 block"></i>
                    <p className="text-xs text-gray-500 dark:text-gray-400">icon-xl (20px)</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                  <div className="text-center">
                    <i className="fas fa-star icon-2xl text-accent-blue mb-2 block"></i>
                    <p className="text-xs text-gray-500 dark:text-gray-400">icon-2xl (24px)</p>
                  </div>
                  <div className="text-center">
                    <i className="fas fa-star icon-3xl text-accent-blue mb-2 block"></i>
                    <p className="text-xs text-gray-500 dark:text-gray-400">icon-3xl (30px)</p>
                  </div>
                  <div className="text-center">
                    <i className="fas fa-star icon-4xl text-accent-blue mb-2 block"></i>
                    <p className="text-xs text-gray-500 dark:text-gray-400">icon-4xl (36px)</p>
                  </div>
                  <div className="text-center">
                    <i className="fas fa-star icon-5xl text-accent-blue mb-2 block"></i>
                    <p className="text-xs text-gray-500 dark:text-gray-400">icon-5xl (48px)</p>
                  </div>
                  <div className="text-center">
                    <i className="fas fa-star icon-6xl text-accent-blue mb-2 block"></i>
                    <p className="text-xs text-gray-500 dark:text-gray-400">icon-6xl (60px)</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">File Type Icons</h3>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                  <div className="text-center">
                    <i className="fas fa-file-pdf icon-pdf icon-2xl mb-2 block"></i>
                    <p className="text-xs text-gray-500 dark:text-gray-400">PDF Files</p>
                  </div>
                  <div className="text-center">
                    <i className="fas fa-file-word icon-word icon-2xl mb-2 block"></i>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Word Docs</p>
                  </div>
                  <div className="text-center">
                    <i className="fas fa-file-excel icon-excel icon-2xl mb-2 block"></i>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Excel Files</p>
                  </div>
                  <div className="text-center">
                    <i className="fas fa-file-powerpoint icon-powerpoint icon-2xl mb-2 block"></i>
                    <p className="text-xs text-gray-500 dark:text-gray-400">PowerPoint</p>
                  </div>
                  <div className="text-center">
                    <i className="fas fa-file-image icon-image icon-2xl mb-2 block"></i>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Images</p>
                  </div>
                  <div className="text-center">
                    <i className="fas fa-file-alt icon-text icon-2xl mb-2 block"></i>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Text Files</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Context-Specific Icons</h3>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-6 items-center">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Button Icons:</span>
                    <Button size="sm"><i className="fas fa-plus btn-icon-sm mr-1"></i>Small</Button>
                    <Button><i className="fas fa-save btn-icon-md mr-2"></i>Medium</Button>
                    <Button size="lg"><i className="fas fa-download btn-icon-lg mr-2"></i>Large</Button>
                  </div>
                  <div className="flex flex-wrap gap-6 items-center">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Navigation:</span>
                    <div className="flex items-center space-x-2">
                      <i className="fas fa-home nav-icon text-accent-blue"></i>
                      <span className="text-sm">Home</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className="fas fa-file-text nav-icon text-accent-blue"></i>
                      <span className="text-sm">Documents</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className="fas fa-cog nav-icon text-accent-blue"></i>
                      <span className="text-sm">Settings</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-6 items-center">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Status Icons:</span>
                    <div className="flex items-center space-x-1">
                      <i className="fas fa-check-circle status-icon text-green-500"></i>
                      <span className="text-sm">Success</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <i className="fas fa-exclamation-triangle status-icon text-yellow-500"></i>
                      <span className="text-sm">Warning</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <i className="fas fa-times-circle status-icon text-red-500"></i>
                      <span className="text-sm">Error</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <i className="fas fa-spinner loading-icon status-icon text-accent-blue"></i>
                      <span className="text-sm">Loading</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Usage Guidelines</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-md font-medium text-green-600 dark:text-green-400 mb-2">✓ Do</h4>
                    <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <li>Use consistent sizing within components</li>
                      <li>Apply color coding for file types</li>
                      <li>Include proper spacing between icons and text</li>
                      <li>Test accessibility and color contrast</li>
                      <li>Use semantic icon choices</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-md font-medium text-red-600 dark:text-red-400 mb-2">✗ Don't</h4>
                    <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <li>Mix different icon styles</li>
                      <li>Use icons without accessibility attributes</li>
                      <li>Rely solely on color to convey information</li>
                      <li>Use oversized icons in small spaces</li>
                      <li>Forget mobile touch targets (44px min)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Breadcrumb Navigation Component */}
          <Card id="breadcrumbs" className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Breadcrumb Navigation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Basic Breadcrumb</h3>
                <Breadcrumb 
                  items={[
                    { label: 'Home', href: '/', icon: 'fas fa-home' },
                    { label: 'Documents', href: '/documents', icon: 'fas fa-file-text' },
                    { label: 'Project Files', icon: 'fas fa-folder' }
                  ]}
                  showBackToTop={false}
                  className="mb-4"
                />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Breadcrumbs help users understand their current location within the application hierarchy and provide quick navigation back to parent pages.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Features</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center">
                    <i className="fas fa-check text-green-500 mr-2"></i>
                    Automatic back-to-top button when scrolling
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check text-green-500 mr-2"></i>
                    Icon support for visual hierarchy
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check text-green-500 mr-2"></i>
                    Responsive design with mobile optimization
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check text-green-500 mr-2"></i>
                    WCAG-compliant accessibility features
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check text-green-500 mr-2"></i>
                    Smart truncation for long navigation paths
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Spacing & Layout */}
          <Card id="spacing" className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border">
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