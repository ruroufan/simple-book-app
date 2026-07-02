import { FeedbackForm } from '../components/FeedbackForm';
import { useLanguage } from '../context/LanguageContext';

type FeedbackPageProps = {
  onBack: () => void;
};

export function FeedbackPage({ onBack }: FeedbackPageProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between gap-3">
        <button className="rounded-full px-3 py-2 text-sm font-semibold text-gray-500" type="button" onClick={onBack}>
          {t.detail.back}
        </button>
        <h1 className="text-xl font-bold text-gray-950">{t.feedback.title}</h1>
        <span className="w-12" />
      </header>

      <FeedbackForm />
    </div>
  );
}
