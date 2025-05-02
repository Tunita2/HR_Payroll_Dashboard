const chokidar = require('chokidar');
const path = require('path');
const fs = require('fs');

/**
 * FileWatcher class to monitor file changes in the project
 */
class FileWatcher {
  constructor(options = {}) {
    this.options = {
      // Default options
      ignored: /(^|[\/\\])\..|(node_modules)/,
      persistent: true,
      ignoreInitial: true,
      ...options
    };
    
    this.watcher = null;
    this.listeners = [];
  }

  /**
   * Start watching files in the specified directories
   * @param {Array|String} paths - Directories or files to watch
   * @returns {FileWatcher} - Returns this instance for chaining
   */
  watch(paths) {
    if (this.watcher) {
      this.stop();
    }

    console.log(`[FileWatcher] Starting to watch: ${Array.isArray(paths) ? paths.join(', ') : paths}`);
    
    this.watcher = chokidar.watch(paths, this.options);
    
    // Set up event listeners
    this.watcher
      .on('add', path => this._notifyListeners('add', path))
      .on('change', path => this._notifyListeners('change', path))
      .on('unlink', path => this._notifyListeners('unlink', path))
      .on('error', error => console.error(`[FileWatcher] Error: ${error}`));
    
    return this;
  }

  /**
   * Stop watching files
   */
  stop() {
    if (this.watcher) {
      this.watcher.close();
      this.watcher = null;
      console.log('[FileWatcher] Stopped watching files');
    }
    return this;
  }

  /**
   * Add a listener for file change events
   * @param {Function} listener - Callback function to be called when files change
   * @returns {FileWatcher} - Returns this instance for chaining
   */
  addListener(listener) {
    if (typeof listener === 'function') {
      this.listeners.push(listener);
    }
    return this;
  }

  /**
   * Remove a listener
   * @param {Function} listener - The listener to remove
   * @returns {FileWatcher} - Returns this instance for chaining
   */
  removeListener(listener) {
    const index = this.listeners.indexOf(listener);
    if (index !== -1) {
      this.listeners.splice(index, 1);
    }
    return this;
  }

  /**
   * Notify all listeners about a file change
   * @param {String} event - The event type ('add', 'change', 'unlink')
   * @param {String} filePath - Path to the changed file
   * @private
   */
  _notifyListeners(event, filePath) {
    const relativePath = path.relative(process.cwd(), filePath);
    console.log(`[FileWatcher] ${event}: ${relativePath}`);
    
    this.listeners.forEach(listener => {
      try {
        listener(event, filePath, relativePath);
      } catch (error) {
        console.error(`[FileWatcher] Error in listener: ${error}`);
      }
    });
  }

  /**
   * Get file information
   * @param {String} filePath - Path to the file
   * @returns {Object|null} - File information or null if file doesn't exist
   */
  static getFileInfo(filePath) {
    try {
      const stats = fs.statSync(filePath);
      return {
        path: filePath,
        size: stats.size,
        lastModified: stats.mtime,
        isDirectory: stats.isDirectory(),
      };
    } catch (error) {
      return null;
    }
  }
}

module.exports = FileWatcher;
