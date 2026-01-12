import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";


const initialData = [
{ day: "Mon", delay: 35 },
{ day: "Tue", delay: 48 },
{ day: "Wed", delay: 20 },
{ day: "Thu", delay: 56 },
{ day: "Fri", delay: 15 },
];


export default function Charts() {
const [data] = useState(initialData);


return (
<div className="bg-white dark:bg-gray-700 dark:text-white p-6 rounded-xl shadow-md">
<h2 className="text-lg font-semibold mb-4">Weekly Delay Trend</h2>


<LineChart width={600} height={300} data={data}>
<Line type="monotone" dataKey="delay" stroke="#2563eb" strokeWidth={3} />
<CartesianGrid stroke="#ccc" />
<XAxis dataKey="day" />
<YAxis />
<Tooltip />
</LineChart>
</div>
);
}