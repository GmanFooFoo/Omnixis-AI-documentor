import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, TrendingUp, Clock, Activity } from "lucide-react";

interface AnalyticsFeature {
  priority: 1 | 2 | 3;
  title: string;
  description: string;
}

const analyticsFeatures: AnalyticsFeature[] = [
  {
    priority: 1,
    title: "Document Processing Metrics",
    description: "Track total documents processed, success rates, average processing times, and error analysis"
  },
  {
    priority: 1,
    title: "User Activity Dashboard",
    description: "Monitor user engagement, login frequency, document upload patterns, and feature usage statistics"
  },
  {
    priority: 1,
    title: "OCR Performance Analytics",
    description: "Analyze text extraction accuracy, processing speeds by file type, and quality metrics"
  },
  {
    priority: 2,
    title: "Cost Analysis & Budget Tracking",
    description: "Monitor API usage costs across different LLM providers, token consumption, and budget alerts"
  },
  {
    priority: 2,
    title: "Document Category Insights",
    description: "Breakdown of document types processed, category-specific performance, and classification accuracy"
  },
  {
    priority: 2,
    title: "Storage & Capacity Planning",
    description: "Track database growth, file storage usage, vector embedding storage, and capacity forecasting"
  },
  {
    priority: 2,
    title: "Processing Queue Analytics",
    description: "Monitor queue performance, peak usage times, bottlenecks, and resource optimization insights"
  },
  {
    priority: 3,
    title: "Search & Retrieval Analytics",
    description: "Analyze search patterns, most queried content, vector similarity performance, and user search behavior"
  },
  {
    priority: 3,
    title: "Error Tracking & Diagnostics",
    description: "Comprehensive error logging, failure pattern analysis, and automated issue detection"
  },
  {
    priority: 3,
    title: "Real-time Performance Monitoring",
    description: "Live system health metrics, API response times, database performance, and alerting system"
  },
  {
    priority: 3,
    title: "Export & Reporting Tools",
    description: "Customizable reports, data export capabilities, scheduled analytics summaries, and PDF generation"
  },
  {
    priority: 3,
    title: "Comparative LLM Performance",
    description: "Side-by-side model performance comparison, accuracy metrics, and cost-effectiveness analysis"
  }
];

const getPriorityColor = (priority: number) => {
  switch (priority) {
    case 1: return "bg-red-500 text-white";
    case 2: return "bg-yellow-500 text-white";
    case 3: return "bg-green-500 text-white";
    default: return "bg-gray-500 text-white";
  }
};

const getPriorityLabel = (priority: number) => {
  switch (priority) {
    case 1: return "High";
    case 2: return "Medium";
    case 3: return "Low";
    default: return "Unknown";
  }
};

export default function Analytics() {
  const highPriorityFeatures = analyticsFeatures.filter(f => f.priority === 1);
  const mediumPriorityFeatures = analyticsFeatures.filter(f => f.priority === 2);
  const lowPriorityFeatures = analyticsFeatures.filter(f => f.priority === 3);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-accent-blue/10 rounded-lg flex items-center justify-center">
              <BarChart className="h-6 w-6 text-accent-blue" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Comprehensive insights and performance metrics
              </p>
            </div>
          </div>
        </div>

        {/* Coming Soon Card */}
        <Card className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border mb-8">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-accent-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-10 w-10 text-accent-blue" />
            </div>
            <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white">
              Coming Soon
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              We're building comprehensive analytics to give you deep insights into your document processing workflows, 
              performance metrics, and usage patterns.
            </p>
            <div className="flex justify-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4" />
                <span>Real-time Monitoring</span>
              </div>
              <div className="flex items-center space-x-2">
                <BarChart className="h-4 w-4" />
                <span>Performance Metrics</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Usage Analytics</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Planned Features */}
        <Card className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
              Planned Analytics Features
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400">
              Here's what we're planning to build, organized by development priority
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* High Priority Features */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                  <Badge className={getPriorityColor(1)}>High Priority</Badge>
                  <span>Core Analytics ({highPriorityFeatures.length} features)</span>
                </h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Feature</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {highPriorityFeatures.map((feature, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{feature.title}</TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-400">
                          {feature.description}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Medium Priority Features */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                  <Badge className={getPriorityColor(2)}>Medium Priority</Badge>
                  <span>Advanced Analytics ({mediumPriorityFeatures.length} features)</span>
                </h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Feature</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mediumPriorityFeatures.map((feature, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{feature.title}</TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-400">
                          {feature.description}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Low Priority Features */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                  <Badge className={getPriorityColor(3)}>Low Priority</Badge>
                  <span>Enhanced Features ({lowPriorityFeatures.length} features)</span>
                </h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Feature</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lowPriorityFeatures.map((feature, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{feature.title}</TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-400">
                          {feature.description}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="mt-8 p-4 bg-gray-50 dark:bg-dark-bg rounded-lg">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Total planned features: <strong>{analyticsFeatures.length}</strong>
                </span>
                <div className="flex space-x-4">
                  <span className="text-red-600">
                    High: {highPriorityFeatures.length}
                  </span>
                  <span className="text-yellow-600">
                    Medium: {mediumPriorityFeatures.length}
                  </span>
                  <span className="text-green-600">
                    Low: {lowPriorityFeatures.length}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}