import React, { useState, useEffect } from 'react';
import { Card, Table, Tabs, Input, Select, Button, Tree, Spin, Alert, Badge } from 'antd';
import { FileOutlined, FolderOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import axios from 'axios';
import './CodebaseInfo.css';

const { TabPane } = Tabs;
const { Search } = Input;
const { Option } = Select;

const CodebaseInfo = () => {
  const [stats, setStats] = useState(null);
  const [files, setFiles] = useState([]);
  const [structure, setStructure] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [fileExtension, setFileExtension] = useState('');
  const [watchingStatus, setWatchingStatus] = useState(null);
  const [activeTab, setActiveTab] = useState('1');

  // Fetch codebase information
  const fetchCodebaseInfo = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch stats
      const statsResponse = await axios.get('http://localhost:3001/api/codebase/stats');
      setStats(statsResponse.data);
      
      // Fetch files (with search parameters if provided)
      let filesUrl = 'http://localhost:3001/api/codebase/files';
      const params = {};
      
      if (searchTerm) {
        params.name = searchTerm;
      }
      
      if (fileExtension) {
        params.extension = fileExtension;
      }
      
      const filesResponse = await axios.get(filesUrl, { params });
      setFiles(filesResponse.data);
      
      // Fetch structure
      const structureResponse = await axios.get('http://localhost:3001/api/codebase/structure');
      setStructure(structureResponse.data);
      
      // Fetch watching status
      const watchingResponse = await axios.get('http://localhost:3001/api/status/watching');
      setWatchingStatus(watchingResponse.data);
    } catch (err) {
      console.error('Error fetching codebase info:', err);
      setError('Failed to fetch codebase information. Make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchCodebaseInfo();
    
    // Set up polling for watching status
    const interval = setInterval(async () => {
      try {
        const watchingResponse = await axios.get('http://localhost:3001/api/status/watching');
        setWatchingStatus(watchingResponse.data);
      } catch (err) {
        console.error('Error fetching watching status:', err);
      }
    }, 10000); // Poll every 10 seconds
    
    return () => clearInterval(interval);
  }, []);

  // Fetch files when search parameters change
  useEffect(() => {
    if (activeTab === '2') { // Only fetch when on the Files tab
      const fetchFiles = async () => {
        setLoading(true);
        
        try {
          const params = {};
          
          if (searchTerm) {
            params.name = searchTerm;
          }
          
          if (fileExtension) {
            params.extension = fileExtension;
          }
          
          const response = await axios.get('http://localhost:3001/api/codebase/files', { params });
          setFiles(response.data);
        } catch (err) {
          console.error('Error searching files:', err);
          setError('Failed to search files.');
        } finally {
          setLoading(false);
        }
      };
      
      fetchFiles();
    }
  }, [searchTerm, fileExtension, activeTab]);

  // Convert file tree data to Ant Design Tree format
  const convertToTreeData = (tree) => {
    if (!tree) return [];
    
    return tree.map((item, index) => {
      if (item.type === 'directory') {
        return {
          key: `dir-${index}`,
          title: item.name,
          icon: <FolderOutlined />,
          children: convertToTreeData(item.children || [])
        };
      } else {
        return {
          key: `file-${index}`,
          title: item.name,
          icon: <FileOutlined />,
          isLeaf: true
        };
      }
    });
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  // File table columns
  const fileColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <span>
          <FileOutlined style={{ marginRight: 8 }} />
          {text}
        </span>
      )
    },
    {
      title: 'Path',
      dataIndex: 'relativePath',
      key: 'relativePath'
    },
    {
      title: 'Extension',
      dataIndex: 'extension',
      key: 'extension'
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
      render: (size) => formatFileSize(size)
    },
    {
      title: 'Last Modified',
      dataIndex: 'lastModified',
      key: 'lastModified',
      render: (date) => formatDate(date)
    }
  ];

  // Extension options for select
  const extensionOptions = stats ? 
    Object.keys(stats.filesByExtension).map(ext => (
      <Option key={ext} value={ext}>{ext}</Option>
    )) : [];

  return (
    <div className="codebase-info-container">
      <Card 
        title="Codebase Information" 
        extra={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Badge 
              status={watchingStatus?.watching ? "processing" : "default"} 
              text={watchingStatus?.watching ? "Watching Files" : "Not Watching"} 
              style={{ marginRight: 16 }}
            />
            <Button 
              icon={<ReloadOutlined />} 
              onClick={fetchCodebaseInfo}
              loading={loading}
            >
              Refresh
            </Button>
          </div>
        }
      >
        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}
        
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Overview" key="1">
            {loading ? (
              <div className="loading-container">
                <Spin size="large" />
                <p>Loading codebase information...</p>
              </div>
            ) : stats ? (
              <div className="stats-container">
                <div className="stat-card">
                  <h3>Total Files</h3>
                  <p className="stat-value">{stats.totalFiles}</p>
                </div>
                
                <div className="stat-card">
                  <h3>Total Directories</h3>
                  <p className="stat-value">{stats.totalDirectories}</p>
                </div>
                
                <div className="stat-card wide">
                  <h3>Files by Extension</h3>
                  <div className="extension-list">
                    {Object.entries(stats.filesByExtension || {}).map(([ext, count]) => (
                      <div key={ext} className="extension-item">
                        <span className="extension-name">{ext || 'no extension'}</span>
                        <span className="extension-count">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="stat-card wide">
                  <h3>Last Indexed</h3>
                  <p>{formatDate(stats.lastIndexed)}</p>
                </div>
              </div>
            ) : (
              <p>No statistics available</p>
            )}
          </TabPane>
          
          <TabPane tab="Files" key="2">
            <div className="search-container">
              <Search
                placeholder="Search files by name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: 300, marginRight: 16 }}
                allowClear
              />
              
              <Select
                placeholder="Filter by extension"
                value={fileExtension}
                onChange={setFileExtension}
                style={{ width: 200 }}
                allowClear
              >
                {extensionOptions}
              </Select>
            </div>
            
            {loading ? (
              <div className="loading-container">
                <Spin size="large" />
                <p>Loading files...</p>
              </div>
            ) : (
              <Table
                dataSource={files}
                columns={fileColumns}
                rowKey="relativePath"
                pagination={{ pageSize: 10 }}
                locale={{ emptyText: 'No files found' }}
              />
            )}
          </TabPane>
          
          <TabPane tab="Structure" key="3">
            {loading ? (
              <div className="loading-container">
                <Spin size="large" />
                <p>Loading directory structure...</p>
              </div>
            ) : structure ? (
              <div className="structure-container">
                <Tree
                  showIcon
                  defaultExpandAll={false}
                  treeData={convertToTreeData(structure.tree)}
                />
                <p className="last-indexed">
                  Last indexed: {formatDate(structure.lastIndexed)}
                </p>
              </div>
            ) : (
              <p>No structure information available</p>
            )}
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default CodebaseInfo;
