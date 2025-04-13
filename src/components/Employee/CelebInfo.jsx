import React, { useState, useEffect } from 'react';
import '../../styles/EmployeeStyles/CelebInfo.css';

// Mock data for upcoming birthdays
const mockBirthdays = [
    { id: 1, name: 'Nguyễn Văn A', department: 'Kế toán', date: '15/06/2023', image: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { id: 2, name: 'Trần Thị B', department: 'Nhân sự', date: '18/06/2023', image: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { id: 3, name: 'Lê Văn C', department: 'IT', date: '22/06/2023', image: 'https://randomuser.me/api/portraits/men/68.jpg' },
    { id: 4, name: 'Phạm Thị D', department: 'Marketing', date: '25/06/2023', image: 'https://randomuser.me/api/portraits/women/17.jpg' }
];

// Mock data for work anniversaries
const mockAnniversaries = [
    { id: 1, name: 'Hoàng Văn E', department: 'Kinh doanh', years: 5, date: '16/06/2023', image: 'https://randomuser.me/api/portraits/men/42.jpg' },
    { id: 2, name: 'Ngô Thị F', department: 'Kế toán', years: 3, date: '20/06/2023', image: 'https://randomuser.me/api/portraits/women/26.jpg' },
    { id: 3, name: 'Đặng Văn G', department: 'IT', years: 10, date: '28/06/2023', image: 'https://randomuser.me/api/portraits/men/22.jpg' }
];

const CelebInfo = () => {
    const [activeTab, setActiveTab] = useState('birthdays');
    const [birthdays, setBirthdays] = useState([]);
    const [anniversaries, setAnniversaries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate API call to fetch celebration data
        const fetchData = async () => {
            setLoading(true);
            // In a real app, this would be an API call
            setTimeout(() => {
                setBirthdays(mockBirthdays);
                setAnniversaries(mockAnniversaries);
                setLoading(false);
            }, 600);
        };

        fetchData();
    }, []);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    // Get days until the celebration
    const getDaysUntil = (dateString) => {
        const [day, month, year] = dateString.split('/').map(Number);
        const celebDate = new Date(year, month - 1, day);
        const today = new Date();

        // Set time to beginning of day for both dates
        celebDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        const diffTime = celebDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Hôm nay';
        if (diffDays === 1) return 'Ngày mai';
        return `${diffDays} ngày nữa`;
    };

    if (loading) {
        return (
            <div className="celeb-loading">
                <div className="celeb-loading-spinner"></div>
                <p>Đang tải dữ liệu...</p>
            </div>
        );
    }

    return (
        <div className="celeb-container">
            <div className="celeb-header">
                <h2 className="celeb-title">Sự kiện sắp tới</h2>
                <div className="celeb-tabs">
                    <button
                        className={`celeb-tab-btn ${activeTab === 'birthdays' ? 'active' : ''}`}
                        onClick={() => handleTabChange('birthdays')}
                    >
                        <span className="tab-icon">🎂</span>
                        <span className="tab-text">Sinh nhật</span>
                    </button>
                    <button
                        className={`celeb-tab-btn ${activeTab === 'anniversaries' ? 'active' : ''}`}
                        onClick={() => handleTabChange('anniversaries')}
                    >
                        <span className="tab-icon">🏆</span>
                        <span className="tab-text">Kỷ niệm công tác</span>
                    </button>
                </div>
            </div>

            <div className="celeb-content">
                {activeTab === 'birthdays' ? (
                    birthdays.length > 0 ? (
                        <div className="celeb-list">
                            {birthdays.map(person => (
                                <div key={person.id} className="celeb-card">
                                    <div className="celeb-avatar">
                                        <img src={person.image} alt={person.name} />
                                        <div className="celeb-icon">🎂</div>
                                    </div>
                                    <div className="celeb-info">
                                        <h3 className="celeb-name">{person.name}</h3>
                                        <p className="celeb-department">{person.department}</p>
                                        <div className="celeb-date-info">
                                            <span className="celeb-date">{person.date}</span>
                                            <span className="celeb-countdown">{getDaysUntil(person.date)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="celeb-empty">
                            <div className="empty-icon">🎂</div>
                            <p>Không có sinh nhật nào trong thời gian tới</p>
                        </div>
                    )
                ) : (
                    anniversaries.length > 0 ? (
                        <div className="celeb-list">
                            {anniversaries.map(person => (
                                <div key={person.id} className="celeb-card">
                                    <div className="celeb-avatar">
                                        <img src={person.image} alt={person.name} />
                                        <div className="celeb-icon">🏆</div>
                                    </div>
                                    <div className="celeb-info">
                                        <h3 className="celeb-name">{person.name}</h3>
                                        <p className="celeb-department">{person.department}</p>
                                        <div className="celeb-date-info">
                                            <span className="celeb-years">{person.years} năm</span>
                                            <span className="celeb-date">{person.date}</span>
                                            <span className="celeb-countdown">{getDaysUntil(person.date)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="celeb-empty">
                            <div className="empty-icon">🏆</div>
                            <p>Không có kỷ niệm công tác nào trong thời gian tới</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default CelebInfo;