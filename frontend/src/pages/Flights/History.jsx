const sampleHistory = [
    { id: 1, origin: "CMB", dest: "DXB", delay: 32, date: "2025-02-15" },
    { id: 2, origin: "CMB", dest: "SIN", delay: 12, date: "2025-02-14" },
    { id: 3, origin: "CMB", dest: "MAA", delay: 45, date: "2025-02-14" },
];


export default function History() {
    return (
        <div className="p-6 bg-gray-100 dark:bg-gray-800 min-h-screen dark:text-white">
            <h2 className="text-2xl font-bold mb-4">Prediction History</h2>


            <table className="w-full bg-white dark:bg-gray-700 rounded-xl shadow-md">
                <thead>
                    <tr className="bg-gray-200 dark:bg-gray-600">
                        <th className="p-3">Origin</th>
                        <th className="p-3">Destination</th>
                        <th className="p-3">Delay (min)</th>
                        <th className="p-3">Date</th>
                    </tr>
                </thead>


                <tbody>
                    {sampleHistory.map((row) => (
                        <tr key={row.id} className="border-t border-gray-300 dark:border-gray-600">
                            <td className="p-3">{row.origin}</td>
                            <td className="p-3">{row.dest}</td>
                            <td className="p-3">{row.delay}</td>
                            <td className="p-3">{row.date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}