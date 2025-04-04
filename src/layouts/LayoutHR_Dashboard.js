import Sidebar from "../components/Sidebar_HR";
import Header from "../components/Header";

const LayoutHR_Dashboard = () => {
    
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
export default LayoutHR_Dashboard;