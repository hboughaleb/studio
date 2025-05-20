'use client';

import { useState } from 'react';
import { useCVData } from '@/contexts/CVDataContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle, CheckCircle, Lightbulb, ListChecks, ListX, Percent, BarChartBig } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { analyzeJobMatch, type AnalyzeJobMatchOutput, type AnalyzeJobMatchInput } from '@/ai/flows/analyze-job-match-flow';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

export default function JobAnalyzerPage() {
  const { cvData, isLoading: cvLoading, error: cvError } = useCVData();
  const [jobDescription, setJobDescription] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalyzeJobMatchOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleAnalyze = async () => {
    if (!cvData) {
      setError('CV data is not loaded. Please upload or create a CV first.');
      return;
    }
    if (!jobDescription.trim()) {
      setError('Please paste a job description.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      // Extract relevant parts of CVData for the flow
      const relevantCvData = {
        profile: cvData.profile,
        experience: cvData.experience.map(exp => ({
          title: exp.title,
          company: exp.company,
          description: exp.description,
        })),
        skills: cvData.skills,
        detectedLanguage: cvData.detectedLanguage,
      };

      const input: AnalyzeJobMatchInput = {
        cvData: relevantCvData,
        jobDescription: jobDescription,
        language: cvData.detectedLanguage || 'en', // Prefer CV language for output
      };
      const result = await analyzeJobMatch(input);
      setAnalysisResult(result);
    } catch (err) {
      console.error('Error analyzing job match:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Analysis failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (cvLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading CV data...</p>
      </div>
    );
  }

  if (cvError) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error Loading CV</AlertTitle>
        <AlertDescription>
          {cvError} Please <button onClick={() => router.push('/')} className="underline">go back to upload</button>.
        </AlertDescription>
      </Alert>
    );
  }
  
  if (!cvData && !cvLoading) {
     return (
      <Alert variant="destructive" className="max-w-2xl mx-auto">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No CV Data Found</AlertTitle>
        <AlertDescription>
          Please upload or create a CV first before using the analyzer.
          <Button onClick={() => router.push('/')} className="mt-2 block">Go to CV Upload</Button>
        </AlertDescription>
      </Alert>
    );
  }


  return (
    <div className="space-y-8">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-primary">Job Description Analyzer</CardTitle>
          <CardDescription className="text-center text-lg">
            Paste a job description below to analyze how well your current CV matches.
            <br /> Your active CV: <span className="font-semibold">{cvData?.fileName || "Untitled CV"}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Textarea
            placeholder="Paste the full job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="min-h-[200px] text-sm p-4 border-2 focus:border-primary transition-colors"
            rows={10}
          />
          <Button onClick={handleAnalyze} disabled={isLoading || !jobDescription.trim()} className="w-full text-lg py-3">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analyzing...
              </>
            ) : (
              <>
                <BarChartBig className="mr-2 h-5 w-5" /> Analyze Match
              </>
            )}
          </Button>
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {analysisResult && (
        <Card className="shadow-lg animate-in fade-in-50 duration-500">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">Analysis Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold flex items-center"><Percent className="mr-2 h-5 w-5 text-accent" /> Match Score</h3>
                <span className={`text-2xl font-bold ${analysisResult.matchScore >= 75 ? 'text-green-600' : analysisResult.matchScore >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                  {analysisResult.matchScore}%
                </span>
              </div>
              <Progress value={analysisResult.matchScore} className="h-3" />
            </div>

            <div className="prose prose-sm max-w-none">
                <h3 className="text-lg font-semibold flex items-center"><CheckCircle className="mr-2 h-5 w-5 text-green-500" /> Summary</h3>
                <p className="text-muted-foreground">{analysisResult.summary}</p>
            </div>


            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold flex items-center mb-2"><ListChecks className="mr-2 h-5 w-5 text-green-600" /> Matching Keywords</h3>
                {analysisResult.matchingKeywords.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.matchingKeywords.map(keyword => <Badge key={keyword} variant="secondary" className="bg-green-100 text-green-800">{keyword}</Badge>)}
                  </div>
                ) : <p className="text-sm text-muted-foreground">No strong keyword matches found.</p>}
              </div>
              <div>
                <h3 className="text-lg font-semibold flex items-center mb-2"><ListX className="mr-2 h-5 w-5 text-red-500" /> Missing Keywords</h3>
                {analysisResult.missingKeywords.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.missingKeywords.map(keyword => <Badge key={keyword} variant="destructive" className="bg-red-100 text-red-800">{keyword}</Badge>)}
                  </div>
                ) : <p className="text-sm text-muted-foreground">No critical missing keywords identified. Good job!</p>}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold flex items-center mb-2"><Lightbulb className="mr-2 h-5 w-5 text-yellow-500" /> Areas for Improvement</h3>
              {analysisResult.areasForImprovement.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                  {analysisResult.areasForImprovement.map((item, idx) => <li key={idx}>{item}</li>)}
                </ul>
              ) : <p className="text-sm text-muted-foreground">The CV aligns well, few direct improvements needed for keyword matching.</p>}
            </div>

             <div>
                <h3 className="text-lg font-semibold flex items-center mb-2"><CheckCircle className="mr-2 h-5 w-5 text-blue-500" /> Strengths</h3>
                {analysisResult.strengths.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    {analysisResult.strengths.map((item, idx) => <li key={idx}>{item}</li>)}
                    </ul>
                ): <p className="text-sm text-muted-foreground">No specific strengths highlighted by the AI for this job description.</p>}
            </div>

          </CardContent>
        </Card>
      )}
    </div>
  );
}
