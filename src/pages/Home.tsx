// Home.tsx

import { useEffect, useState } from 'react';
import { VolunteerFormData } from '../components/VolunteerFormData';
import { Survey } from '@/components/SurveyList';
import { NavBar } from '@/components/NavBar';
import { SurveyForm } from '@/components/SurveyForm';
import { fetchSurveys } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

const Home = () => {

  const [volunteer, setVolunteer] = useState<any>(null);
  const [surveys, setSurveys] = useState<any[]>([]);
  const [showSurveyForm, setShowSurveyForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSurveysAsync = async (volunteerId: number) => {
    setIsLoading(true);
    try {
      const fetchedSurveys = await fetchSurveys(volunteerId);
      setSurveys(fetchedSurveys);
    } catch (error) {
      console.error('Error fetching surveys:', error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    const volunteerData = localStorage.getItem('volunteer');
    if (volunteerData) {
      const parsedVolunteer = JSON.parse(volunteerData);
      setVolunteer(parsedVolunteer);
    }
  }, []);

  useEffect(() => {
    if (volunteer) {
      fetchSurveysAsync(volunteer.id);
    }
  }, [volunteer]);
  return (
    <div className='w-full max-w-2xl'>
      <NavBar volunteer={volunteer} setShowSurveyForm={setShowSurveyForm} />

      <div className="mx-4 md:mx-0">

        {volunteer && !showSurveyForm && (
          <div>
            <Card className='mt-8'>
              <CardHeader>
                <CardTitle>Recent Collated Data</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-8">
                {isLoading ? (
                  <div className="flex justify-center items-center">
                    <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                ) : (
                  <>
                    {Array.isArray(surveys) && surveys.length > 0 && surveys.map((survey) => (
                      <Survey key={survey.id} survey={survey} />
                    ))}
                    {Array.isArray(surveys) && surveys.length === 0 && (
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertTitle>No uploads yet!</AlertTitle>
                        <AlertDescription>
                          Once you upload a survey, it will appear here
                        </AlertDescription>
                      </Alert>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        )}
        {
          !volunteer && (
            <VolunteerFormData setVolunteer={setVolunteer} />
          )
        }
        {volunteer && showSurveyForm && <SurveyForm volunteer={volunteer} setSurvey={setSurveys} setShowSurveyForm={setShowSurveyForm} surveys={surveys} />}
      </div>
    </div>
  );
};

export default Home;
