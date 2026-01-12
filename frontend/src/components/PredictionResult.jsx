export default function PredictionResult({ data }) {
return (
<div className="p-6 bg-green-100 dark:bg-green-800 dark:text-white rounded-xl shadow-md">
<h2 className="text-xl font-bold mb-2">Prediction Result</h2>


<p className="text-lg">⏱ Expected Delay: <strong>{data.delay} minutes</strong></p>
<p className="text-lg">🔍 Confidence: <strong>{data.confidence}</strong></p>
</div>
);
}