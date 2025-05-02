const fs = require('fs');
const path = require('path');

/**
 * CodebaseIndexer class to index and provide information about the codebase
 */
class CodebaseIndexer {
  constructor(options = {}) {
    this.options = {
      // Default options
      ignoreDirs: ['.git', 'node_modules', 'build', 'coverage'],
      ignoreFiles: ['.DS_Store', '.env'],
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.css', '.scss', '.json', '.html'],
      ...options
    };
    
    this.index = {
      files: [],
      directories: [],
      stats: {
        totalFiles: 0,
        totalDirectories: 0,
        filesByExtension: {},
      },
      lastIndexed: null
    };
  }

  /**
   * Index the codebase starting from the given root directory
   * @param {String} rootDir - The root directory to start indexing from
   * @returns {Object} - The index object
   */
  indexCodebase(rootDir) {
    console.log(`[CodebaseIndexer] Starting to index codebase from: ${rootDir}`);
    
    this.index = {
      files: [],
      directories: [],
      stats: {
        totalFiles: 0,
        totalDirectories: 0,
        filesByExtension: {},
      },
      lastIndexed: new Date()
    };
    
    this._indexDirectory(rootDir);
    
    console.log(`[CodebaseIndexer] Indexing complete. Found ${this.index.stats.totalFiles} files and ${this.index.stats.totalDirectories} directories.`);
    
    return this.index;
  }

  /**
   * Recursively index a directory
   * @param {String} dirPath - The directory path to index
   * @param {String} relativePath - The relative path from the root directory
   * @private
   */
  _indexDirectory(dirPath, relativePath = '') {
    try {
      const entries = fs.readdirSync(dirPath);
      
      // Add this directory to the index
      const dirInfo = {
        path: dirPath,
        relativePath: relativePath || '/',
        name: path.basename(dirPath),
        children: []
      };
      
      this.index.directories.push(dirInfo);
      this.index.stats.totalDirectories++;
      
      // Process each entry in the directory
      for (const entry of entries) {
        const entryPath = path.join(dirPath, entry);
        const entryRelativePath = path.join(relativePath, entry);
        
        try {
          const stats = fs.statSync(entryPath);
          
          if (stats.isDirectory()) {
            // Skip ignored directories
            if (this.options.ignoreDirs.includes(entry)) {
              continue;
            }
            
            // Recursively index subdirectory
            this._indexDirectory(entryPath, entryRelativePath);
            dirInfo.children.push({ type: 'directory', name: entry });
          } else if (stats.isFile()) {
            // Skip ignored files
            if (this.options.ignoreFiles.includes(entry)) {
              continue;
            }
            
            const ext = path.extname(entry).toLowerCase();
            
            // Skip files with extensions not in the allowed list (if extensions are specified)
            if (this.options.extensions.length > 0 && !this.options.extensions.includes(ext)) {
              continue;
            }
            
            // Add file to the index
            const fileInfo = {
              path: entryPath,
              relativePath: entryRelativePath,
              name: entry,
              extension: ext,
              size: stats.size,
              lastModified: stats.mtime
            };
            
            this.index.files.push(fileInfo);
            this.index.stats.totalFiles++;
            
            // Update extension stats
            if (!this.index.stats.filesByExtension[ext]) {
              this.index.stats.filesByExtension[ext] = 0;
            }
            this.index.stats.filesByExtension[ext]++;
            
            dirInfo.children.push({ type: 'file', name: entry });
          }
        } catch (error) {
          console.error(`[CodebaseIndexer] Error processing entry ${entryPath}: ${error.message}`);
        }
      }
    } catch (error) {
      console.error(`[CodebaseIndexer] Error reading directory ${dirPath}: ${error.message}`);
    }
  }

  /**
   * Search for files in the index
   * @param {Object} options - Search options
   * @param {String} options.name - File name to search for
   * @param {String} options.extension - File extension to filter by
   * @param {String} options.path - Path pattern to match
   * @returns {Array} - Array of matching files
   */
  searchFiles(options = {}) {
    return this.index.files.filter(file => {
      if (options.name && !file.name.includes(options.name)) {
        return false;
      }
      
      if (options.extension && file.extension !== options.extension) {
        return false;
      }
      
      if (options.path && !file.relativePath.includes(options.path)) {
        return false;
      }
      
      return true;
    });
  }

  /**
   * Get statistics about the indexed codebase
   * @returns {Object} - Statistics object
   */
  getStats() {
    return {
      ...this.index.stats,
      lastIndexed: this.index.lastIndexed
    };
  }

  /**
   * Get the directory tree structure
   * @returns {Array} - Array of directory objects with their children
   */
  getDirectoryTree() {
    // Find the root directory (the one with relativePath = '/')
    const rootDir = this.index.directories.find(dir => dir.relativePath === '/');
    
    if (!rootDir) {
      return [];
    }
    
    // Build the tree recursively
    return this._buildDirectoryTree(rootDir);
  }

  /**
   * Build a directory tree recursively
   * @param {Object} dir - Directory object
   * @returns {Object} - Directory tree
   * @private
   */
  _buildDirectoryTree(dir) {
    const children = dir.children.map(child => {
      if (child.type === 'directory') {
        const childDir = this.index.directories.find(d => 
          d.relativePath === path.join(dir.relativePath, child.name)
        );
        
        if (childDir) {
          return {
            name: child.name,
            type: 'directory',
            children: this._buildDirectoryTree(childDir)
          };
        }
      }
      
      return child;
    });
    
    return children;
  }
}

module.exports = CodebaseIndexer;
