type FeedbackMessageProps = {
  message: string;
};

export default function FeedbackMessage({ message }: FeedbackMessageProps) {
  return (
    <p className='max-w-xs rounded-2xl bg-white/90 px-4 py-3 text-center text-sm font-bold text-gray-700 shadow'>
      {message}
    </p>
  );
}
