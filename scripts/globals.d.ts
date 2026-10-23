// Global type declarations for Node.js test execution scripts
declare const process: {
  exit(code?: number): never;
};

declare module 'fs' {
  const fs: any;
  export default fs;
}

declare module 'path' {
  const path: any;
  export default path;
}

declare module 'zlib' {
  const zlib: any;
  export default zlib;
}

declare const Buffer: any;
