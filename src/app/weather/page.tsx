import WeatherDisplay from '@/components/weather-display';

export const metadata = {
  title: 'আবহাওয়া পূর্বাভাস - আমার ফসল',
  description: 'আপনার এলাকার ৫-দিনের আবহাওয়া এবং কৃষি পরামর্শ',
};

export default function WeatherPage() {
  return <WeatherDisplay />;
}
