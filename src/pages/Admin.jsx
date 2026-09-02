import Layout from "../components/Layout";
import TeamManagement from "../components/TeamManagement";

import "../styles/teamManagement.css";


export default function Admin() {

  return (

    <Layout title="Admin">

      <div className="admin-page">

        {/* =====================================
            ADMIN HEADER
        ===================================== */}

        <div className="admin-header">

          <div>

            <h2>
              Admin Management
            </h2>

            <p>
              Manage agent teams and assignments.
            </p>

          </div>

        </div>


        {/* =====================================
            TEAM MANAGEMENT
        ===================================== */}

        <TeamManagement />

      </div>

    </Layout>

  );

}