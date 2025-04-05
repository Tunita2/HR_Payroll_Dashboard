import Sidebar from "../components/Sidebar_Payroll";
import Header from "../components/Header";
import "../styles/Layout.css"

const LayoutPayroll_Dashboard = ({children, style = {}}) => {
    
    return (
        <div className="dashboard-layout">
            <Sidebar></Sidebar>
            <div className="main-content">
                <Header></Header>
                <div className="content-body">
                    {children}
                </div>
            </div>
        </div>
    );
};
export default LayoutPayroll_Dashboard;