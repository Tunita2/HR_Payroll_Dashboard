import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "../styles/Payroll.css";
import ContentDashboard from "../components/ContentDashboard";

const PayrollDashboard = () => {
  return (
    <div className="payroll">
      {/* <Sidebar /> */}
      <div className="main-content">
        {/* <Header /> */}
        <div className="content">
          <ContentDashboard />
        </div>
      </div>
    </div>
  );
};

export default PayrollDashboard;
