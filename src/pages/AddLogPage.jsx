import Sidebar from "../components/Sidebar";

import Navbar from "../components/Navbar";

import AddLog from "../components/AddLog";

function AddLogPage({ user }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar user={user} />

      <div className="flex-1 p-4 md:p-8">
        <Navbar user={user} />

        {/* THIS IS THE FORM */}

        <AddLog user={user} />
      </div>
    </div>
  );
}

export default AddLogPage;
