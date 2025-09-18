import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.history.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold font-orbitron bg-gradient-primary bg-clip-text text-transparent">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground">eL Vision Group</p>
          </div>
        </div>

        {/* Content */}
        <Card className="p-8 bg-gradient-secondary border-border">
          <div className="prose prose-lg max-w-none text-foreground">
            <div className="text-center mb-8">
              <p className="text-muted-foreground">
                For complete and up-to-date Privacy Policy, please visit our main website:
              </p>
              <a
                href="https://elvisiongroup.com/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-gradient-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all duration-200 font-medium"
              >
                View Full Privacy Policy
              </a>
            </div>

            <div className="border-t border-border pt-8">
              <h2 className="text-2xl font-semibold mb-4">Application Privacy Summary</h2>

              <h3 className="text-xl font-semibold mb-3">1. Information We Collect</h3>
              <p className="mb-4">
                The eL Vision Group app collects information necessary to provide spiritual
                transformation services, including account details, usage patterns, and
                meditation progress data.
              </p>

              <h3 className="text-xl font-semibold mb-3">2. Data Usage</h3>
              <p className="mb-4">
                Your data is used to personalize your spiritual journey, track progress,
                provide community features, and deliver premium content for Pro users.
              </p>

              <h3 className="text-xl font-semibold mb-3">3. Third-Party Services</h3>
              <p className="mb-4">
                We use Supabase for secure authentication and data storage. Your data
                is protected according to industry-standard security practices.
              </p>

              <h3 className="text-xl font-semibold mb-3">4. Data Security</h3>
              <p className="mb-4">
                All personal information is encrypted and stored securely. We implement
                robust security measures to protect your spiritual journey data.
              </p>

              <h3 className="text-xl font-semibold mb-3">5. Your Rights</h3>
              <p className="mb-4">
                You have the right to access, modify, or delete your personal data.
                Contact us through the main website for data-related requests.
              </p>

              <h3 className="text-xl font-semibold mb-3">6. Cookies and Analytics</h3>
              <p className="mb-4">
                The app uses minimal cookies for authentication and user experience
                optimization. No personal data is shared with third parties without consent.
              </p>

              <div className="mt-8 p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Last Updated:</strong> September 18, 2024<br />
                  <strong>Contact:</strong> For privacy concerns, please contact us through the main website.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}