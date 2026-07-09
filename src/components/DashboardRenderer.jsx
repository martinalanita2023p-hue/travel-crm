import SectionCard from "./SectionCard";
import SplitMetricCard from "./SplitMetricCard";
import dashboardSections from "../config/agentDashboardConfig";

function DashboardRenderer({ report, handleChange }) {

  return (

    <div className="dashboard-grid">

      {dashboardSections.map((section, index) => {

        if (section.type === "section") {

          return (

            <SectionCard
              key={index}
              title={section.title}
              icon={section.icon}
              color={section.color}
              fields={section.fields}
              report={report}
              onChange={handleChange}
            />

          );

        }

        if (section.type === "split") {

          return (

            <SplitMetricCard
              key={index}
              title={section.title}
              icon={section.icon}
              color={section.color}
              leftLabel={section.leftLabel}
              leftName={section.leftName}
              rightLabel={section.rightLabel}
              rightName={section.rightName}
              report={report}
              onChange={handleChange}
            />

          );

        }

        return null;

      })}

    </div>

  );

}

export default DashboardRenderer;