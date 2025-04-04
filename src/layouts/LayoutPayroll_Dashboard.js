import Sidebar from "../components/Sidebar_Payroll";
import Header from "../components/Header";

const LayoutPayroll_Dashboard = () => {
    
    return (
        <div className="dashboard-layout">
            <Sidebar></Sidebar>
            <div className="main-content">
                <Header></Header>
                <div className="content-body">
                </div>
            </div>
        </div>
    );
};
export default LayoutPayroll_Dashboard;