import LayoutPayroll from "../../layouts/LayoutPayroll_Dashboard";
import AttendanceTable from "../../layouts/Admin_Dashboard/attendance/AttendanceTable"

const AttendancePage = () => {
    return(
        <div>
            <LayoutPayroll>
                <AttendanceTable/>  
            </LayoutPayroll>
        </div>
    );
}

export default AttendancePage;