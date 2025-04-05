import Sidebar from "../components/Sidebar_Admin";
import Header from "../components/Header";
import "../styles/Layout.css"

const LayoutAdmin_Dashboard = ({children}) => {
    
    return (
        <div className="dashboard-layout">
            <Sidebar></Sidebar>
            <div className="main-content">
                <Header></Header>
                <div className="content-body">
                    Đưa table vào chỗ trống này trên màn hình sử dụng biến children này(có thể tham khảo Payroll-pages)
                    {children}
                </div>
            </div>
        </div>
    );
};
export default LayoutAdmin_Dashboard;