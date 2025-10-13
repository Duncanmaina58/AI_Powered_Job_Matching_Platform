// frontend/src/pages/JobseekerDashboard/Overview.jsx
const Overview = () => {
  const stats = [
    { title: "Active Applications", value: 3 },
    { title: "Jobs Matched", value: 7 },
    { title: "Messages", value: 1 },
    { title: "Profile Completion", value: "80%" },
  ];

  return (
    <div className="p-6">
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-all text-center"
          >
            <h3 className="text-gray-600">{stat.title}</h3>
            <p className="text-2xl font-bold text-blue-700 mt-2">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Overview;
