import { Book, CheckCircle } from "lucide-react";

export default function InstallationGuide() {
  const steps = [
    {
      title: "Copy the embed code",
      description: "Choose your preferred installation method above and copy the code"
    },
    {
      title: "Add to your website",
      description: "Paste the code just before the closing </body> tag in your HTML, or in your Next.js layout/page component"
    },
    {
      title: "Configure your tour",
      description: "Replace 'tf_live_xxxxxxxxxxxx' with your actual API key from Settings, and update the tourId to match your tour"
    },
    {
      title: "Customize appearance",
      description: "Adjust theme ('dark' or 'light') and position ('bottom-right', 'bottom-left', 'top-right', 'top-left') as needed"
    },
    {
      title: "Deploy and test",
      description: "Save your changes, deploy your website, and test the tour to ensure it works correctly"
    },
  ];

  return (
    <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
      <div className="flex items-center gap-2 mb-4">
        <Book className="w-5 h-5 text-purple-400" />
        <h2 className="text-xl font-semibold text-white">Quick Start Guide</h2>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={index} className="flex items-start gap-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 text-sm font-medium flex-shrink-0 mt-0.5">
              {index + 1}
            </div>
            <div className="flex-1">
              <h3 className="text-white font-medium mb-1">{step.title}</h3>
              <p className="text-slate-400 text-sm">{step.description}</p>
            </div>
            <CheckCircle className="w-5 h-5 text-slate-600 flex-shrink-0 mt-1" />
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-slate-800">
        <p className="text-slate-400 text-sm">
          💡 <strong className="text-white">Pro Tip:</strong> Use the &apos;Start Preview&apos; button above to test how the widget will look and behave before embedding it on your site.
        </p>
      </div>
    </div>
  );
}