export const componentConfig: {
  core: {
    [key: string]: {
      name: string;
      filePath: string;
      dependencies?: string[];
    };
  };
  examples: {
    [key: string]: {
      name: string;
      filePath: string;
    };
  };
} = {
  core: {},
  examples: {},
};
