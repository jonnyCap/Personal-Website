/**
 * Global declarations for browser runtime namespaces and cross-script modules.
 */

interface Window {
  Links?: any;
  browserStorage?: any;
  emailHandler?: any;
  MediaRes?: any;
  sizeAdapter?: any;
  ProjectsRenderer?: any;
  CvRenderer?: any;
  SPA?: any;
  SAP?: any;
  slider?: any;
  journyCanvas?: any;
  journeyCanvas?: any;
  sDButton?: any;
  algorithmPlayground?: {
    setStage?: (stage: number, immediate?: boolean) => void;
    setScrollProgress?: (progress: number) => void;
    getStage?: () => number;
  };
}
