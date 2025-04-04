import { 
    faUserCheck, 
    faUserClock, 
    faUserTimes
  } from "@fortawesome/free-solid-svg-icons";
  
  // Lấy icon và class CSS dựa vào trạng thái
  export const getStatusIcon = (status) => {
    switch(status) {
      case 'active':
        return { icon: faUserCheck, className: 'active' };
      case 'inactive':
        return { icon: faUserClock, className: 'inactive' };
      default:
        return { icon: faUserTimes, className: 'unknown' };
    }
  };