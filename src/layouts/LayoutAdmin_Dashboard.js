import Sidebar from "../components/Sidebar_Admin";
import Header from "../components/Header";

const LayoutAdmin_Dashboard = () => {
    
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
export default LayoutAdmin_Dashboard;