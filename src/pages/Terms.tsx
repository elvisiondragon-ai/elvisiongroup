import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function Terms() {
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
              Terms of Service
            </h1>
            <p className="text-muted-foreground">eL Vision Group</p>
          </div>
        </div>

        {/* Content */}
        <Card className="p-8 bg-gradient-secondary border-border">
          <div className="prose prose-lg max-w-none text-foreground">
            <div className="text-center mb-8">
              <p className="text-muted-foreground">
                For complete and up-to-date Terms of Service, please visit our main website:
              </p>
              <a
                href="https://elvisiongroup.com/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-gradient-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all duration-200 font-medium"
              >
                View Full Terms of Service
              </a>
            </div>

            <div className="border-t border-border pt-8">
              <h2 className="text-2xl font-semibold mb-4">Application-Specific Terms</h2>

              <h3 className="text-xl font-semibold mb-3">1. App Usage</h3>
              <p className="mb-4">
                By using the eL Vision Group application, you agree to comply with all terms
                and conditions outlined in our main Terms of Service.
              </p>

              <h3 className="text-xl font-semibold mb-3">2. Account Access</h3>
              <p className="mb-4">
                Your account provides access to spiritual transformation tools, meditation
                sessions, and community features within the eL Vision ecosystem.
              </p>

              <h3 className="text-xl font-semibold mb-3">3. Pro Features</h3>
              <p className="mb-4">
                Premium features require an active Pro subscription. Terms and conditions
                for Pro subscriptions are detailed in our main Terms of Service.
              </p>

              <h3 className="text-xl font-semibold mb-3">4. Community Guidelines</h3>
              <p className="mb-4">
                Users must maintain respectful conduct in community features including chat,
                testimonials, and shared spiritual practices.
              </p>

              <h3 className="text-xl font-semibold mb-3">5. Intellectual Property</h3>
              <p className="mb-4">
                All meditation content, spiritual verses, and proprietary methodologies
                remain the intellectual property of eL Vision Group.
              </p>

              <div className="mt-8 p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Last Updated:</strong> September 18, 2024<br />
                  <strong>Contact:</strong> For questions about these terms, please contact us through the main website.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}