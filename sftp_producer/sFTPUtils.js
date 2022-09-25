let Client = require("ssh2-sftp-client");

class SFTPUtils {
  constructor(config) {
    const requiredKeys = ["host", "port", "username", "password"];
    if (!requiredKeys.every((k) => k in config)) {
      throw "Config Error";
    }
    this.config = config;
    this.sftp = new Client();
  }
  async connect() {
    try {
      await this.sftp.connect(this.config);
    } catch (err) {
      throw `Error in Connecting ${this.config.username}@${this.config.host}:${this.config.port}: ${err}`;
    }
  }
  async close() {
    try {
      await this.sftp.end();
    } catch (err) {
      console.log(err);
    }
  }
  async getDirList(dir) {
    try {
      const list = await this.sftp.list(dir);
      return list;
    } catch (err) {
      throw `Error in fetching directory listing  ${this.config.username}@${this.config.host}:${this.config.port} ${dir}- ${err}`;
    }
  }
  getReadStream(remotePath) {
    try {
      return this.sftp.createReadStream(remotePath);
    } catch (err) {
      throw `Failed to create Read stream for file ${remotePath} : ${err}`;
    }
  }
  async deleteFile(remotePath) {
    try {
      return this.sftp.delete(remotePath);
    } catch (err) {
      throw `Failed to delete file ${remotePath} : ${err}`;
    }
  }
}

module.exports = SFTPUtils;
