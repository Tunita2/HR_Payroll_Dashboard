import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Content from "../components/Content";
import "../styles/Payroll.css";

const Payroll = () => {
  return (
    <div className="payroll">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="content">
          <Content />
        </div>
      </div>
    </div>
  );
};

export default Payroll;
