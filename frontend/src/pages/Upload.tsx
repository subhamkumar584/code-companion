import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { FileUploadBox } from "@/components/upload/FileUploadBox";
import { UploadProgress, UploadStep } from "@/components/upload/UploadProgress";
import { Button } from "@/components/ui/button";

export default function Upload() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [currentStep, setCurrentStep] = useState<UploadStep>("uploading");
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
  };

  const handleUpload = () => {
    if (!file) return;
    setIsUploading(true);
    setCurrentStep("uploading");
    setProgress(0);
  };

  // Simulate upload progress
  useEffect(() => {
    if (!isUploading) return;

    const steps: { step: UploadStep; duration: number }[] = [
      { step: "uploading", duration: 2000 },
      { step: "embedding", duration: 3000 },
      { step: "indexing", duration: 2000 },
      { step: "completed", duration: 500 },
    ];

    let currentStepIndex = 0;
    let progressInterval: number;

    const runStep = () => {
      if (currentStepIndex >= steps.length) {
        setIsComplete(true);
        return;
      }

      const { step, duration } = steps[currentStepIndex];
      setCurrentStep(step);
      setProgress(0);

      const increment = 100 / (duration / 50);
      progressInterval = window.setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            currentStepIndex++;
            setTimeout(runStep, 300);
            return 100;
          }
          return Math.min(prev + increment, 100);
        });
      }, 50);
    };

    runStep();

    return () => {
      clearInterval(progressInterval);
    };
  }, [isUploading]);

  return (
    <MainLayout>
      <div className="min-h-screen px-6 py-12 lg:py-20">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Upload Your Repository
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Drop your codebase and we'll analyze, embed, and index it for
              intelligent Q&A
            </p>
          </div>

          {isComplete ? (
            // Success State
            <div className="glass-card p-8 md:p-12 text-center animate-scale-in glow-primary">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Repository Indexed Successfully
              </h2>
              <p className="text-muted-foreground mb-8">
                Your codebase is ready. Start asking questions now!
              </p>
              <Button variant="hero" size="lg" onClick={() => navigate("/chat")}>
                Start Chatting
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          ) : isUploading ? (
            // Upload Progress
            <div className="animate-fade-in">
              <UploadProgress currentStep={currentStep} progress={progress} />
            </div>
          ) : (
            // Upload Form
            <div className="space-y-6 animate-fade-in">
              <FileUploadBox onFileSelect={handleFileSelect} />

              {file && (
                <div className="flex justify-center animate-fade-in">
                  <Button variant="hero" size="lg" onClick={handleUpload}>
                    Upload & Process
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Tips */}
          {!isUploading && !isComplete && (
            <div className="mt-12 glass-card p-6 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <h3 className="font-semibold text-foreground mb-4">Tips for best results</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  Include all source files and dependencies for complete analysis
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  Remove large binary files or assets to speed up processing
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  Maximum file size: 100MB compressed
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
