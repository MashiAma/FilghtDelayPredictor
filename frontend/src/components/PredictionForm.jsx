import { useState } from "react";
const [form, setForm] = useState({
origin: "CMB",
dest: "DXB",
distance: 3300,
weather: "Clear",
});


function handleSubmit(e) {
e.preventDefault();


// Simulated prediction result
const sampleResult = {
delay: Math.floor(Math.random() * 60),
confidence: `${70 + Math.floor(Math.random() * 20)}%`,
};


setPrediction(sampleResult);
}


return (
<form
onSubmit={handleSubmit}
className="bg-white dark:bg-gray-700 dark:text-white p-6 rounded-xl shadow-md space-y-4"
>
<h2 className="text-lg font-semibold mb-2">Enter Flight Details</h2>


<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
<input
type="text"
placeholder="Origin Airport"
className="p-3 rounded-md border dark:bg-gray-800"
value={form.origin}
onChange={(e) => setForm({ ...form, origin: e.target.value })}
/>


<input
type="text"
placeholder="Destination Airport"
className="p-3 rounded-md border dark:bg-gray-800"
value={form.dest}
onChange={(e) => setForm({ ...form, dest: e.target.value })}
/>


<input
type="number"
placeholder="Distance (km)"
className="p-3 rounded-md border dark:bg-gray-800"
value={form.distance}
onChange={(e) => setForm({ ...form, distance: e.target.value })}
/>


<select
className="p-3 rounded-md border dark:bg-gray-800"
value={form.weather}
onChange={(e) => setForm({ ...form, weather: e.target.value })}
>
<option>Clear</option>
<option>Rain</option>
<option>Storm</option>
<option>Fog</option>
</select>
</div>


<button
type="submit"
className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-lg"
>
Predict Delay
</button>
</form>
);