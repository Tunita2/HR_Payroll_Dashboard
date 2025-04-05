import LayoutPayroll from "../../layouts/LayoutPayroll_Dashboard";
import AttendanceTable from "../../layouts/Admin_Dashboard/attendance/AttendanceTable"
import Table from "../../layouts/Payroll_Dashboard/PayrollList/PayrollTable"

const AttendancePage = () => {
    return(
        <div>
            <LayoutPayroll>
                <Table/>  
            </LayoutPayroll>
        </div>
    );
}

export default AttendancePage;